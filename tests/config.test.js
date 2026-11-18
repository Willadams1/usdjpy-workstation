import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, isLoopbackHost, DEFAULTS } from "../backend/config.js";

test("defaults: loopback host, port 3000", () => {
  const c = loadConfig({});
  assert.equal(c.host, "127.0.0.1");
  assert.equal(c.port, 3000);
  assert.equal(c.nodeEnv, DEFAULTS.nodeEnv);
  assert.equal(c.appName, DEFAULTS.appName);
});

test("environment overrides are applied", () => {
  const c = loadConfig({ HOST: "0.0.0.0", PORT: "8080", NODE_ENV: "production", APP_NAME: "X" });
  assert.deepEqual(c, { host: "0.0.0.0", port: 8080, nodeEnv: "production", appName: "X" });
});

test("blank values (e.g. `HOST=` in .env) fall back to defaults", () => {
  const c = loadConfig({ HOST: "  ", PORT: "", APP_NAME: "" });
  assert.equal(c.host, "127.0.0.1");
  assert.equal(c.port, 3000);
});

test("invalid PORT is rejected", () => {
  for (const bad of ["abc", "-1", "3000.5", "70000", "80 80"]) {
    assert.throws(() => loadConfig({ PORT: bad }), /Invalid PORT/, bad);
  }
});

test("loopback detection", () => {
  assert.equal(isLoopbackHost("127.0.0.1"), true);
  assert.equal(isLoopbackHost("localhost"), true);
  assert.equal(isLoopbackHost("0.0.0.0"), false);
});
