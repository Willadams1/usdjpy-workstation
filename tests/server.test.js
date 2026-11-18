import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "../backend/app.js";
import { loadConfig } from "../backend/config.js";

const config = loadConfig({ HOST: "127.0.0.1", PORT: "0", NODE_ENV: "test", APP_NAME: "Test App" });
let server;
let port;

before(async () => {
  server = createServer(config);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = server.address().port;
});

after(() => new Promise((resolve) => server.close(resolve)));

// Raw request: sends the path exactly as given (fetch/URL would normalise it).
function raw(path, { method = "GET" } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.setTimeout(3000, () => req.destroy(new Error(`request timed out: ${path}`)));
    req.on("error", reject);
    req.end();
  });
}

const json = (r) => JSON.parse(r.body);

async function assertStillHealthy() {
  const r = await raw("/api/health");
  assert.equal(r.status, 200, "server must still answer /api/health");
  assert.equal(json(r).status, "ok");
}

function assertErrorShape(r, status, code) {
  assert.equal(r.status, status);
  assert.match(r.headers["content-type"], /^application\/json/);
  const { error } = json(r);
  assert.equal(error.code, code);
  assert.equal(typeof error.message, "string");
  assert.deepEqual(Object.keys(json(r)), ["error"]);
}

test("GET /api/health returns ok, paper-only and configured values", async () => {
  const r = await raw("/api/health");
  assert.equal(r.status, 200);
  assert.match(r.headers["content-type"], /^application\/json/);
  const body = json(r);
  assert.equal(body.status, "ok");
  assert.equal(body.application, "Test App");
  assert.equal(body.mode, "test");
  assert.equal(body.trading_execution, false);
  assert.ok(!Number.isNaN(Date.parse(body.timestamp)));
});

test("serves the frontend", async () => {
  const home = await raw("/");
  assert.equal(home.status, 200);
  assert.match(home.headers["content-type"], /^text\/html/);
  assert.match(home.body, /USD\/JPY Workstation/);
  assert.equal((await raw("/styles.css")).status, 200);
  assert.equal((await raw("/app.js")).status, 200);
});

test("unknown API route and unknown file use the stable error format", async () => {
  assertErrorShape(await raw("/api/nope"), 404, "API_ROUTE_NOT_FOUND");
  assertErrorShape(await raw("/api"), 404, "API_ROUTE_NOT_FOUND");
  assertErrorShape(await raw("/missing.html"), 404, "NOT_FOUND");
  assertErrorShape(await raw("/some-directory/"), 404, "NOT_FOUND");
  await assertStillHealthy();
});

test("non-GET methods are rejected with 405", async () => {
  for (const method of ["POST", "PUT", "DELETE"]) {
    const r = await raw("/api/health", { method });
    assertErrorShape(r, 405, "METHOD_NOT_ALLOWED");
    assert.equal(r.headers.allow, "GET, HEAD");
  }
  assert.equal((await raw("/", { method: "HEAD" })).status, 200);
  await assertStillHealthy();
});

test("malformed URL encoding returns 400 and does not crash the server", async () => {
  for (const path of ["/%E0%A4%A", "/%", "/%zz", "/%C0%AF%", "/styles.css%"]) {
    assertErrorShape(await raw(path), 400, "INVALID_URL_ENCODING");
    await assertStillHealthy();
  }
});

test("null bytes are rejected with 400", async () => {
  assertErrorShape(await raw("/%00"), 400, "INVALID_PATH");
  assertErrorShape(await raw("/index.html%00.png"), 400, "INVALID_PATH");
  await assertStillHealthy();
});

test("non-origin-form request targets return 400", async () => {
  assertErrorShape(await raw("*", { method: "GET" }), 400, "INVALID_REQUEST_TARGET");
  assertErrorShape(await raw("http://evil.example/index.html"), 400, "INVALID_REQUEST_TARGET");
  await assertStillHealthy();
});

test("path traversal attempts never leak files outside frontend/", async () => {
  const attempts = [
    "/..%2fbackend%2fserver.js",
    "/..%2f..%2fpackage.json",
    "/%2e%2e%2f%2e%2e%2f.env.example",
    "/%2e%2e/backend/server.js",
    "/../backend/server.js",
    "/..%252fbackend%252fserver.js",
    "//etc/passwd",
    "/%2fetc%2fpasswd",
    "/..%5cbackend%5cserver.js"
  ];
  for (const path of attempts) {
    const r = await raw(path);
    assert.notEqual(r.status, 200, `${path} must not be served`);
    assert.ok(![/createServer/, /APP_NAME/, /"name": "usdjpy-workstation"/, /root:/].some((re) => re.test(r.body)), `${path} leaked content`);
  }
  // These decode to a path outside the root, so they are explicitly forbidden.
  assertErrorShape(await raw("/..%2fbackend%2fserver.js"), 403, "PATH_OUTSIDE_ROOT");
  assertErrorShape(await raw("//etc/passwd"), 403, "PATH_OUTSIDE_ROOT");
  await assertStillHealthy();
});

test("server stays up after a burst of invalid requests", async () => {
  const bad = ["/%", "/%E0%A4%A", "/%00", "/..%2f..%2f", "//x", "/api/%", "/nope"];
  await Promise.all(Array.from({ length: 40 }, (_, i) => raw(bad[i % bad.length])));
  await assertStillHealthy();
});

test("process exits with a clear error on invalid PORT (no listening)", async () => {
  const entry = fileURLToPath(new URL("../backend/server.js", import.meta.url));
  const child = spawn(process.execPath, [entry], { env: { ...process.env, PORT: "not-a-port" } });
  let stderr = "";
  child.stderr.on("data", (d) => (stderr += d));
  const code = await new Promise((resolve) => child.on("close", resolve));
  assert.equal(code, 1);
  assert.match(stderr, /Invalid PORT/);
});
