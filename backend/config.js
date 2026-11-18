// Server configuration. Reads from an environment object (process.env by default)
// so it can be unit-tested without touching the real environment.

export const DEFAULTS = Object.freeze({
  host: "127.0.0.1", // loopback only: safe default for local development
  port: 3000,
  nodeEnv: "development",
  appName: "USDJPY Workstation"
});

// An unset or blank variable (e.g. `HOST=` in .env) falls back to the default.
const text = (value, fallback) => (value ?? "").trim() || fallback;

export function loadConfig(env = process.env) {
  const rawPort = text(env.PORT, String(DEFAULTS.port));
  const port = Number(rawPort);
  if (!/^\d+$/.test(rawPort) || port > 65535) {
    throw new Error(`Invalid PORT "${rawPort}": expected an integer from 0 to 65535.`);
  }

  return {
    host: text(env.HOST, DEFAULTS.host),
    port,
    nodeEnv: text(env.NODE_ENV, DEFAULTS.nodeEnv),
    appName: text(env.APP_NAME, DEFAULTS.appName)
  };
}

export function isLoopbackHost(host) {
  return host === "localhost" || host === "::1" || host === "127.0.0.1" || host.startsWith("127.");
}
