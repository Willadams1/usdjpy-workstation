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

## 2026-11-18 — Milestone 0 approved; Milestone 1 implemented
- Product owner approved M0 as the baseline and closed M0-09. Browser IDE choice, Git repository and local run (M0-04 to M0-07) remain the owner's actions.
- Product owner approved the M1 plan with defaults D1–D8:
  - D1: Calendar sits in Intelligence (and an Overview preview); Driver analysis in Fundamentals; Risk rules in Strategy; Performance analytics placeholder in Journal.
  - D2: Strength shown as categories, never numerical scores (scoring is M4).
  - D3: Header clock is the device clock converted to SAST, labelled as such. Sessions use approximate fixed UTC windows, labelled informational. The 13:00–16:00 SAST window appears only as an unconfirmed historical note.
  - D4: Sample content is generic, uses fictional 1999/2000 dates, and journal records are marked Demo.
  - D5: Chart is a placeholder with a timeframe selector; the TradingView embed remains M3.
  - D6: Working settings are display timezone (SAST/UTC), density, sidebar state and reset; data sources are disabled placeholders with no key fields.
  - D7: Strategy fields all read "Not defined"; readiness reads "Not assessed".
  - D8: Delivered as a single drop.
- Visual identity follows the M0 stylesheet: navy base, blue-grey panels, gold accent, sidebar navigation.
- No backend, configuration or security changes were made for M1.
- Status: implementation complete; awaiting product-owner review and acceptance. M1 is not accepted until the owner says so.

