# USD/JPY Workstation

A research, chart-analysis, journaling and paper-trade workstation for USD/JPY.

**Initial scope:** no broker connection, no live order execution, and no automated trading.
All market/fundamental values are placeholders until a source and data contract are approved.

## Current milestone
Milestone 0 — Project foundation.

## Technology
- Node.js backend (ES modules)
- Plain HTML, CSS and JavaScript frontend
- MySQL planned for persistence; database integration is deliberately deferred until its schema is approved
- REST API
- TradingView chart integration is a later milestone

## Requirements
- Node.js 20.12 or newer (needed for built-in `.env` loading)
- npm
- Git
- A code editor/browser IDE that provides a terminal and Node.js runtime

## Run locally
1. Install Node.js 20.12+ and Git.
2. Extract this project.
3. Open the project folder in your editor.
4. In the terminal, run `npm install` (there are no dependencies yet, so this is a no-op for now).
5. Copy `.env.example` to `.env` (optional: the defaults work without it).
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

The starter server serves the frontend and exposes `GET /api/health`.

## Configuration
Settings come from environment variables. The server loads `<project>/.env` if it exists; variables already set in the real environment (for example a `PORT` provided by a cloud IDE) take precedence over the file. Invalid values stop the server at startup with a clear message.

| Variable | Default | Purpose |
|---|---|---|
| `HOST` | `127.0.0.1` | Interface to listen on. Loopback only by default. |
| `PORT` | `3000` | Port to listen on (integer 0–65535). |
| `NODE_ENV` | `development` | Reported by `/api/health` as `mode`. |
| `APP_NAME` | `USDJPY Workstation` | Reported by `/api/health` as `application`. |

### Local vs cloud IDE
- **Local machine:** leave `HOST` unset. The app is reachable only from your own computer.
- **Cloud/browser IDE or container:** the preview proxy usually cannot reach a loopback-only server. Set `HOST=0.0.0.0` in `.env` (or in the IDE's environment) and use the IDE's port preview. If the IDE assigns the port, it normally provides `PORT` itself.
- `HOST=0.0.0.0` makes the server reachable by anything that can route to that machine, and the app has **no authentication yet**. The server prints a warning when started this way. Do not use it on shared or public networks.
- `npm run dev` restarts on code changes but not on `.env` changes: restart it after editing `.env`.

## Tests
`npm test` runs the Node built-in test runner: configuration checks plus real HTTP tests (health endpoint, malformed URLs, path traversal, error format, stability after invalid requests). The tests start their own server on a random free port, so they do not need the app to be running. They ignore your `.env` settings.

## API errors
Every non-2xx response is JSON in a stable shape: `{ "error": { "code": "MACHINE_READABLE_CODE", "message": "Human-readable text" } }`. Codes are part of the contract; messages may change.

| HTTP | Code | When |
|---|---|---|
| 400 | `INVALID_URL_ENCODING` | Malformed percent-encoding in the path |
| 400 | `INVALID_PATH` | Null byte in the path |
| 400 | `INVALID_REQUEST_TARGET` | Request target is not a normal `/path` |
| 403 | `PATH_OUTSIDE_ROOT` | Path, or the target of a symbolic link, resolves outside `frontend/` |
| 404 | `API_ROUTE_NOT_FOUND` | Unknown `/api/...` route |
| 404 | `NOT_FOUND` | Unknown static file |
| 405 | `METHOD_NOT_ALLOWED` | Method other than GET/HEAD |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

## Browser development note
A browser editor must provide a Node.js runtime/terminal and port preview to run this project. A source editor that only edits GitHub files is not enough. If your chosen browser IDE runs in a cloud container, the app is local to that development container and exposed through its preview URL; it is not running on your personal computer.

## Project rules
1. Do not put secrets or API keys in frontend files or commit `.env`.
2. Do not invent or hardcode live market data.
3. Every data observation must eventually carry its source and timestamps.
4. Missing, stale, neutral and mixed are different states.
5. AI may explain and classify evidence; deterministic code owns numeric calculations.
6. Historical snapshots must preserve what was known at the time.
7. Paper/research workflow only in the initial product.

## Documents
See `docs/` for the product baseline, architecture, roadmap, task board and Claude handoff.
