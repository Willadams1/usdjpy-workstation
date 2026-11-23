# Frontend Guide (M1)

## Principles
- Plain HTML, CSS and native ES modules. No framework, no build step, no dependencies.
- Everything shown in M1 is sample or placeholder content and must be labelled as such.
- No live-data wording, numerical fundamental scores, strategy rule values, broker code or trading controls.
- The only network call is `GET /api/health` (`js/health.js`). Browser storage is used only by `js/state.js`, for interface preferences.

## Layout of `frontend/`
| Path | Purpose |
|---|---|
| `index.html`, `app.js`, `styles.css` | Entry points (kept from M0). `styles.css` imports `css/*.css`. |
| `css/tokens.css` | Colours, spacing, tones. Change the look here first. |
| `css/base.css`, `layout.css`, `components.css`, `pages.css` | Reset and typography, app shell and responsive rules, shared components, page-specific rules. |
| `js/main.js` | Builds the shell (sidebar, header, outlet), wires state and routing. |
| `js/router.js` | Hash router with error handling and focus management. |
| `js/state.js` | Small observable store; persists sidebar, timezone and density only. |
| `js/sample-data.js` | **All demonstration data.** Every record has `sample: true`. |
| `js/logic/` | Pure functions (no DOM): routes, driver states, filters, preferences. Unit-tested. |
| `js/time.js`, `js/health.js` | SAST/UTC formatting and session windows; backend health check. |
| `js/components/` | Reusable pieces: sidebar, header, card, badge, gauge, table, filters, states, sample-label. |
| `js/pages/` | One module per section, plus `index.js`. |

## Rules for adding or changing content
1. Create DOM with `h()` from `js/dom.js`. Never build HTML strings.
2. New demonstration values go in `sample-data.js` with `sample: true`, and are shown inside `card({ sample: true })` or a sample banner.
3. Use fictional dates (1999/2000) so sample items can never look current.
4. A feature that is not built is a disabled control with `plannedButton()` or a visible "Not defined / Not available / Planned" label. Do not add controls that look active and do nothing.
5. Missing data is "Unavailable" or "No data". Never show it as Neutral.
6. State is never shown by colour alone: use an icon and a text label.

## Adding a section
1. Add it to `ROUTES` in `js/logic/routes.js`.
2. Create `js/pages/<id>.js` exporting `render(ctx)`.
3. Register it in `js/pages/index.js`.
4. Add an icon to `js/icons.js` if needed. `npm test` checks that routes, pages and icons agree.

## Tests
`tests/frontend-logic.test.js` covers the pure logic and sample data. `tests/frontend-structure.test.js` serves the frontend through the real server and checks imports (including file-name case), content types, external URLs, unsafe APIs, storage use, and wording that could imply live data.
