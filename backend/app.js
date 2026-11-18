import http from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Absolute path of the only directory that static files may be served from.
const DEFAULT_STATIC_ROOT = resolve(fileURLToPath(new URL("../frontend/", import.meta.url)));

// True when `target` is `root` itself or lies inside it. Both must be absolute.
function isInside(root, target) {
  const rel = relative(root, target);
  return !(rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel));
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { ...JSON_HEADERS, ...headers });
  res.end(JSON.stringify(body));
}

// Stable error shape for every non-2xx response: { error: { code, message } }.
// `code` is machine-readable and must not change once released; `message` is for humans.
function sendError(res, status, code, message, headers = {}) {
  sendJson(res, status, { error: { code, message } }, headers);
}

async function handle(req, res, config, staticRoot) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET and HEAD are supported.", { allow: "GET, HEAD" });
  }

  // Parse the request target ourselves rather than trusting the Host header,
  // and reject anything that is not an origin-form path.
  let pathname;
  try {
    if (typeof req.url !== "string" || !req.url.startsWith("/")) throw new Error("not origin-form");
    pathname = new URL(`http://localhost${req.url}`).pathname;
  } catch {
    return sendError(res, 400, "INVALID_REQUEST_TARGET", "The request target is not a valid path.");
  }

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    if (pathname === "/api/health") {
      return sendJson(res, 200, {
        status: "ok",
        application: config.appName,
        mode: config.nodeEnv,
        trading_execution: false,
        timestamp: new Date().toISOString()
      });
    }
    return sendError(res, 404, "API_ROUTE_NOT_FOUND", "API route not implemented yet.");
  }

  // Static files. Decoding can throw on malformed percent-encoding: that is a client error.
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return sendError(res, 400, "INVALID_URL_ENCODING", "The URL contains invalid percent-encoding.");
  }
  if (decoded.includes("\0")) {
    return sendError(res, 400, "INVALID_PATH", "The URL path contains a null byte.");
  }

  const requested = decoded === "/" ? "index.html" : decoded.slice(1);
  const fullPath = resolve(staticRoot, requested);
  // First check: the path as written must stay inside the root (catches ../ and absolute paths).
  if (!isInside(staticRoot, fullPath)) {
    return sendError(res, 403, "PATH_OUTSIDE_ROOT", "The requested path is outside the public directory.");
  }

  try {
    // Second check: resolve symbolic links on both sides and require the REAL file
    // to be inside the REAL root. A symlink inside the root that points outside is refused.
    const [realRoot, realFile] = await Promise.all([realpath(staticRoot), realpath(fullPath)]);
    if (!isInside(realRoot, realFile)) {
      return sendError(res, 403, "PATH_OUTSIDE_ROOT", "The requested path is outside the public directory.");
    }
    // Serve the resolved path that was just checked, not the original one.
    const body = await readFile(realFile);
    res.writeHead(200, { "content-type": mimeTypes[extname(realFile).toLowerCase()] || "application/octet-stream" });
    res.end(body);
  } catch (err) {
    if (["ENOENT", "EISDIR", "ENOTDIR", "ENAMETOOLONG", "ELOOP"].includes(err.code)) {
      return sendError(res, 404, "NOT_FOUND", "Resource not found.");
    }
    throw err; // unexpected: reported as 500 by the wrapper below
  }
}

// `staticRoot` is overridable for tests only; the app always serves ../frontend/.
export function createServer(config, { staticRoot = DEFAULT_STATIC_ROOT } = {}) {
  const root = resolve(staticRoot);
  return http.createServer((req, res) => {
    handle(req, res, config, root).catch((err) => {
      console.error("Unhandled request error:", err.code || err.message);
      if (!res.headersSent) {
        sendError(res, 500, "INTERNAL_ERROR", "Unexpected server error.");
      } else {
        res.destroy();
      }
    });
  });
}
