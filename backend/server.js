import { fileURLToPath } from "node:url";
import { createServer } from "./app.js";
import { isLoopbackHost, loadConfig } from "./config.js";

// Load <project>/.env if it exists (Node 20.12+). Variables already set in the real
// environment, such as a PORT provided by a cloud IDE, take precedence over the file.
try {
  process.loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error(`Could not read .env: ${err.message}`);
    process.exit(1);
  }
}

let config;
try {
  config = loadConfig();
} catch (err) {
  console.error(`Configuration error: ${err.message}`);
  process.exit(1);
}

const server = createServer(config);

server.on("error", (err) => {
  console.error(`Cannot listen on ${config.host}:${config.port}: ${err.message}`);
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  const { address, port } = server.address();
  console.log(`${config.appName} running on http://${address.includes(":") ? `[${address}]` : address}:${port} (${config.nodeEnv})`);
  if (!isLoopbackHost(config.host)) {
    console.warn(`WARNING: HOST=${config.host} exposes this server beyond this machine. Use it only inside a cloud/container dev environment.`);
  }
});
