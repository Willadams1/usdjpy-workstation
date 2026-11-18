import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtemp, mkdir, writeFile, symlink, rm, realpath } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "../backend/app.js";
import { loadConfig } from "../backend/config.js";

// Regression tests: a symbolic link INSIDE the served directory must not expose files outside it.
// A throwaway directory is used as the static root, so the real frontend/ is never touched.

const REPO_BACKEND_FILE = fileURLToPath(new URL("../backend/server.js", import.meta.url));
const SECRET = "TOP-SECRET-OUTSIDE-ROOT";

let tmp, site, outsideDir, server, port, symlinksSupported = true;

before(async () => {
  tmp = await mkdtemp(join(tmpdir(), "usdjpy-symlink-"));
  site = join(tmp, "site");
  outsideDir = join(tmp, "outside");
  await mkdir(site);
  await mkdir(outsideDir);
  await writeFile(join(site, "index.html"), "<h1>public</h1>");
  await writeFile(join(site, "real.txt"), "inside-content");
  await writeFile(join(outsideDir, "secret.txt"), SECRET);
  await writeFile(join(tmp, "secret-file.txt"), SECRET);

  try {
    await symlink(REPO_BACKEND_FILE, join(site, "link-to-backend.js"));              // the reported scenario
    await symlink(join(tmp, "secret-file.txt"), join(site, "link-to-secret.txt"));   // file outside root
    await symlink(outsideDir, join(site, "link-to-outside-dir"), "dir");             // directory outside root
    await symlink(join(site, "link-to-secret.txt"), join(site, "chain-a.txt"));      // chain: a -> link -> outside
    await symlink(join(site, "no-such-target"), join(site, "dangling.txt"));         // target missing
    await symlink(join(site, "loop-b"), join(site, "loop-a"));                       // loop: a -> b -> a
    await symlink(join(site, "loop-a"), join(site, "loop-b"));
    await symlink(join(site, "real.txt"), join(site, "internal-link.txt"));          // legitimate: stays inside
    await symlink(site, join(tmp, "site-alias"), "dir");                             // the ROOT itself reached via a symlink
  } catch (err) {
    if (err.code === "EPERM" || err.code === "EACCES") symlinksSupported = false; // e.g. Windows without privilege
    else throw err;
  }

  server = createServer(loadConfig({ PORT: "0" }), { staticRoot: site });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = server.address().port;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(tmp, { recursive: true, force: true });
});

function get(path, srv = server) {
  const p = srv.address().port;
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port: p, path }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.setTimeout(3000, () => req.destroy(new Error(`request timed out: ${path}`)));
    req.on("error", reject);
    req.end();
  });
}

function assertRefused(r, status, code) {
  assert.equal(r.status, status);
  assert.equal(JSON.parse(r.body).error.code, code);
  assert.ok(!r.body.includes(SECRET), "secret content leaked");
  assert.ok(!/createServer|loadConfig/.test(r.body), "backend source leaked");
}

test("REGRESSION: symlink inside frontend root pointing to backend/server.js is refused", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  const r = await get("/link-to-backend.js");
  assertRefused(r, 403, "PATH_OUTSIDE_ROOT");
});

test("symlink to a file outside the root is refused", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  assertRefused(await get("/link-to-secret.txt"), 403, "PATH_OUTSIDE_ROOT");
});

test("file reached through a symlinked directory that points outside is refused", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  assertRefused(await get("/link-to-outside-dir/secret.txt"), 403, "PATH_OUTSIDE_ROOT");
});

test("chained symlinks that end outside the root are refused", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  assertRefused(await get("/chain-a.txt"), 403, "PATH_OUTSIDE_ROOT");
});

test("dangling and looping symlinks return 404 and do not crash the server", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  assertRefused(await get("/dangling.txt"), 404, "NOT_FOUND");
  assertRefused(await get("/loop-a"), 404, "NOT_FOUND");
  assert.equal((await get("/real.txt")).status, 200);
});

test("symlink that stays inside the root still works (no false positive)", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  const r = await get("/internal-link.txt");
  assert.equal(r.status, 200);
  assert.equal(r.body, "inside-content");
});

test("a root that is itself reached via a symlink still serves its own files", async (t) => {
  if (!symlinksSupported) return t.skip("symlinks not permitted on this system");
  const aliased = createServer(loadConfig({ PORT: "0" }), { staticRoot: join(tmp, "site-alias") });
  await new Promise((resolve) => aliased.listen(0, "127.0.0.1", resolve));
  try {
    assert.equal((await get("/real.txt", aliased)).status, 200);
    assert.equal((await get("/", aliased)).status, 200);
    assertRefused(await get("/link-to-secret.txt", aliased), 403, "PATH_OUTSIDE_ROOT");
  } finally {
    await new Promise((resolve) => aliased.close(resolve));
  }
});

test("setup sanity: the fixture root resolves where expected", async () => {
  assert.equal(await realpath(site), await realpath(join(tmp, "site-alias")));
});
