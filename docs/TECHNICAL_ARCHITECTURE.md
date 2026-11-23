# Technical Architecture — Initial Proposal

## Logical architecture
Browser UI -> Node.js REST API -> domain services -> MySQL (planned).
Scheduled collectors will retrieve official/elected data sources. A deterministic calculation service will produce numerical scores. An AI interpretation service will summarize and classify sourced evidence without inventing numeric values.

## Frontend (M1)
Native ES modules and plain CSS, no framework or build step. Hash routing (`#/section`) means the static server needs no fallback route. Pure logic (routes, driver-state classification, filters, preferences, time, health) is separated from DOM code so it can be tested in Node. All text is inserted with `textContent`; there is no `innerHTML`. The frontend talks to the backend only through `GET /api/health`. See `docs/FRONTEND_GUIDE.md`.

## Initial implementation decisions
- Node.js 20+ with ES modules.
- Plain HTML/CSS/JavaScript for the first UI iteration to keep the learning and deployment surface small.
- One backend service; avoid splitting into multiple services prematurely.
- MySQL as the intended relational database.
- Environment variables for server-side configuration.
- REST API with JSON responses.
- All application timestamps stored in UTC and displayed in SAST.
- No secrets in the browser bundle.
- No broker credentials or order-routing code.

## Data provenance contract
Every external observation should eventually record:
- source identifier and canonical URL
- source type and reliability class
- observation/event identifier
- published_at (if provided)
- retrieved_at
- effective_at / reference period
- raw value and normalized value
- unit and currency
- revision/vintage identifier where applicable
- validation status
- freshness status

## Historical integrity
Snapshots must be immutable. A later revision creates a new observation/vintage, not a silent overwrite. Historical analysis must avoid look-ahead bias and use only information available at the evaluated timestamp.

## API conventions
- `/api/health`: process health.
- `/api/v1/...`: future versioned application endpoints.
- JSON errors should have stable machine-readable codes.
- Validate all inputs on the server.
- Add authentication and authorization before exposing personal journal data.

## Security baseline
- Keep `.env` out of version control.
- Validate and limit incoming payloads.
- Use secure password hashing when authentication is introduced.
- Apply least-privilege database credentials.
- Add rate limits to public-facing endpoints.
- Log security-relevant events without logging secrets.
- Back up and test restoration before production use.
