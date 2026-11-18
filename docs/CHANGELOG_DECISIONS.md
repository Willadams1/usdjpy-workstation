# Decision Log

Record product and architecture decisions here. Newer approved decisions supersede older ones; retain history.

## 2026-11-16 — Initial development baseline
- Browser-based development environment selected.
- Initial runtime requested to be local.
- Claude assigned implementation; ChatGPT assigned architecture/specification and review.
- Node.js backend, plain HTML/CSS/JS frontend and MySQL planned.
- Initial application is research and paper-trade only; no live execution.
- Browser IDE must provide a Node runtime, terminal and port preview if used to run the app.

## 2026-11-16 — M0 review patch (implementation complete; awaiting product-owner review and acceptance)
- Server host is configurable via `HOST`; default `127.0.0.1`; `0.0.0.0` allowed for cloud IDEs, with a startup warning.
- `.env` is loaded by the server itself with `process.loadEnvFile` (real environment variables take precedence). Minimum Node.js raised from 20 to 20.12 accordingly.
- Malformed URL encoding returns HTTP 400; static paths are resolved to absolute paths and must stay inside `frontend/` (403 otherwise).
- All error responses use `{ "error": { "code", "message" } }`, including static 404s.
- Methods other than GET/HEAD return 405.
- Server code split into `config.js`, `app.js` (testable factory) and `server.js` (entry point).
- Real HTTP tests replace the placeholder test.
- Symlink hardening (found in product-owner review): after the lexical path check, both the requested file and the frontend root are resolved with `realpath`, and the real file must stay inside the real root (403 `PATH_OUTSIDE_ROOT` otherwise). The resolved path is what gets served. Dangling or looping symlinks return 404. Regression tests in `tests/symlink.test.js`.
- Status: M0 baseline is NOT yet accepted; M0-09 remains open pending product-owner review.

