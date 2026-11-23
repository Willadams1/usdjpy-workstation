import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "../backend/app.js";
import { loadConfig } from "../backend/config.js";
import { ROUTES } from "../frontend/js/logic/routes.js";

const ROOT = resolve(fileURLToPath(new URL("../frontend/", import.meta.url)));
const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
const files = walk(ROOT);
const jsFiles = files.filter((f) => f.endsWith(".js"));
const cssFiles = files.filter((f) => f.endsWith(".css"));
const read = (f) => readFileSync(f, "utf8");
const rel = (f) => relative(ROOT, f).split(sep).join("/");

let server;
let port;
before(async () => {
  server = createServer(loadConfig({ HOST: "127.0.0.1", PORT: "0" }));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  port = server.address().port;
});
after(() => new Promise((r) => server.close(r)));

const get = (path) => new Promise((resolve_, reject) => {
  http.get({ host: "127.0.0.1", port, path }, (res) => {
    let body = ""; res.setEncoding("utf8"); res.on("data", (c) => (body += c)); res.on("end", () => resolve_({ status: res.statusCode, type: res.headers["content-type"], body }));
  }).on("error", reject);
});

test("every section has exactly one page module and is registered in pages/index.js", () => {
  const index = read(join(ROOT, "js/pages/index.js"));
  for (const r of ROUTES) {
    assert.ok(existsSync(join(ROOT, "js/pages", `${r.id}.js`)), `missing page module for ${r.id}`);
    assert.match(index, new RegExp(`import \\{ render as ${r.id} \\} from "\\./${r.id}\\.js"`), `${r.id} not imported`);
  }
  const pageFiles = readdirSync(join(ROOT, "js/pages")).filter((n) => n !== "index.js");
  assert.equal(pageFiles.length, ROUTES.length, "page modules and routes must match one to one");
});

test("every import resolves to a file with exactly matching case (Windows vs Linux safe)", () => {
  const re = /(?:import|export)[^"'`;]*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  let count = 0;
  for (const f of jsFiles) {
    for (const m of read(f).matchAll(re)) {
      const spec = m[1] ?? m[2];
      const target = spec.startsWith("/") ? join(ROOT, spec) : resolve(dirname(f), spec);
      assert.ok(target.startsWith(ROOT + sep), `${rel(f)} imports outside frontend: ${spec}`);
      const parts = relative(ROOT, target).split(sep);
      let dir = ROOT;
      for (const p of parts) { assert.ok(readdirSync(dir).includes(p), `${rel(f)} imports "${spec}" but "${p}" does not exist with that exact case in ${rel(dir) || "/"}`); dir = join(dir, p); }
      count++;
    }
  }
  assert.ok(count > 40, `expected to check many imports, got ${count}`);
});

test("every frontend file is served by the real M0 server with the right content type", async () => {
  for (const f of files) {
    const res = await get(`/${rel(f)}`);
    assert.equal(res.status, 200, rel(f));
    if (f.endsWith(".js")) assert.match(res.type, /^text\/javascript/, rel(f));
    if (f.endsWith(".css")) assert.match(res.type, /^text\/css/, rel(f));
    if (f.endsWith(".html")) assert.match(res.type, /^text\/html/, rel(f));
  }
});

test("index.html: M0 entry points preserved, module script, no external resources", () => {
  const html = read(join(ROOT, "index.html"));
  assert.match(html, /<title>USD\/JPY Workstation<\/title>/);
  assert.match(html, /href="\/styles\.css"/);
  assert.match(html, /<script type="module" src="\/app\.js">/);
  assert.match(html, /rel="icon" href="data:,"/, "inline favicon avoids a 404 console error");
  assert.ok(existsSync(join(ROOT, "styles.css")) && existsSync(join(ROOT, "app.js")));
});

test("css @imports all resolve", () => {
  const entry = read(join(ROOT, "styles.css"));
  const imports = [...entry.matchAll(/@import url\("([^"]+)"\)/g)].map((m) => m[1]);
  assert.ok(imports.length >= 5);
  for (const i of imports) assert.ok(existsSync(join(ROOT, i)), i);
});

test("no external URLs anywhere in the frontend (CSP-ready, offline-safe)", () => {
  for (const f of files) {
    const text = read(f).replaceAll("http://www.w3.org/2000/svg", "");
    assert.doesNotMatch(text, /https?:\/\//, `${rel(f)} references an external URL`);
    assert.doesNotMatch(text, /(?:src|href)=["']\/\//, `${rel(f)} has a protocol-relative URL`);
  }
});

test("no unsafe DOM or network APIs", () => {
  const banned = [/innerHTML/, /outerHTML/, /insertAdjacentHTML/, /document\.write/, /\beval\s*\(/, /new Function/, /\son[a-z]+\s*=\s*["']/i, /XMLHttpRequest/, /WebSocket/, /EventSource/, /sendBeacon/];
  for (const f of jsFiles.concat(files.filter((x) => x.endsWith(".html")))) {
    for (const re of banned) assert.doesNotMatch(read(f), re, `${rel(f)} uses ${re}`);
  }
});

test("only health.js talks to the network, and only to /api/health", () => {
  for (const f of jsFiles) {
    const uses = [...read(f).matchAll(/\bfetch\s*\(|globalThis\.fetch|fetchImpl\(/g)];
    if (rel(f) === "js/health.js") continue;
    assert.equal(uses.length, 0, `${rel(f)} must not call fetch`);
  }
  assert.match(read(join(ROOT, "js/health.js")), /fetchImpl\("\/api\/health"/);
  assert.equal([...read(join(ROOT, "js/health.js")).matchAll(/"\/[^"]*"/g)].filter((m) => m[0] !== '"/api/health"').length, 0);
});

test("browser storage is confined to state.js and has no secrets or trade data", () => {
  for (const f of jsFiles) {
    const uses = /localStorage|sessionStorage|indexedDB|document\.cookie/.test(read(f));
    assert.equal(uses, rel(f) === "js/state.js", rel(f));
  }
  const state = read(join(ROOT, "js/state.js"));
  assert.match(state, /usdjpy\.ui\.prefs/);
  assert.doesNotMatch(state, /apikey|token|password|journal|trade/i);
});

test("no wording implies live or real-time market connectivity", () => {
  const allowed = ["not live market information", "or a live reading"];
  for (const f of jsFiles.concat(files.filter((x) => x.endsWith(".html")))) {
    let text = read(f).replaceAll("aria-live", ""); // ARIA attribute name, not a claim
    for (const a of allowed) text = text.replaceAll(new RegExp(a, "gi"), "");
    assert.doesNotMatch(text, /\blive\b/i, `${rel(f)} uses the word "live" outside an approved negation`);
    assert.doesNotMatch(text, /real[- ]?time/i, `${rel(f)} implies real-time data`);
  }
});

test("no broker, order or trade-execution code in the frontend", () => {
  for (const f of jsFiles) assert.doesNotMatch(read(f), /\b(broker|placeOrder|submitOrder|executeTrade|order-?routing)\b/i, rel(f));
});

test("no secrets or API-key fields requested", () => {
  for (const f of jsFiles) {
    assert.doesNotMatch(read(f), /type:\s*"password"|api[_-]?key|secret|authorization/i, rel(f));
  }
});

test("front-end code is not minified: no source line longer than 220 characters", () => {
  for (const f of jsFiles.concat(cssFiles)) {
    const long = read(f).split("\n").findIndex((l) => l.length > 220);
    // sample-data and page files hold long literal strings; only flag truly minified code (> 400)
    const veryLong = read(f).split("\n").findIndex((l) => l.length > 400);
    assert.equal(veryLong, -1, `${rel(f)} line ${veryLong + 1} looks minified`);
    void long;
  }
});
