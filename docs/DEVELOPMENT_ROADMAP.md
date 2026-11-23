# Development Roadmap

## M0 — Project foundation
- [x] Create repository skeleton and documentation baseline.
- [x] Add minimal Node.js server and health endpoint.
- [x] Add frontend scaffold.
- [ ] Select browser IDE/runtime.
- [ ] Create Git repository and first commit.
- [ ] Run locally and verify health endpoint.
- [x] Review docs and approve baseline. (Approved by product owner, 2026-11-18.)

## M1 — Workstation interface (implemented; awaiting product-owner review and acceptance)
- [x] Collapsible sidebar, header (clock, session, status) and hash navigation for eight sections.
- [x] Overview, Market, Fundamentals, Intelligence, Strategy, Journal, Research and Settings pages.
- [x] Reusable components: cards, badges, status chips, meters, tables, filters, empty/loading/error states, sample labels.
- [x] Responsive layout (desktop, tablet, mobile drawer).
- [x] All demonstration content labelled as sample; no live data, scores, strategy rules or trading.
- [x] Frontend tests added; M0 tests unchanged.
- [ ] Product-owner acceptance (see `docs/MANUAL_TEST_CHECKLIST_M1.md`).

## M2 — Persistence and identity
- Approve database schema and migrations.
- Authentication and session security.
- Strategy, readiness and journal persistence.
- Audit history.

## M3 — Market and calendar integration
- Select market data provider and document latency/licensing.
- TradingView embed.
- Economic calendar source and SAST conversion.
- Data health indicators.

## M4 — Deterministic fundamental engine
- Source adapters for approved official series.
- USD and JPY independent strength model.
- Driver-level score, confidence and freshness.
- Missing/mixed/stale state handling.
- Unit tests and scoring versioning.

## M5 — AI intelligence
- Source-grounded news/event ingestion.
- Event classification and impact narrative.
- Citation/source traceability.
- Contradiction detection.
- Human review and evaluation set.

## M6 — Strategy and readiness
- Versioned trading constitution.
- Readiness questionnaire and transparent state rules.
- Override audit trail.
- Paper-only risk controls.

## M7 — Semi-automated journal
- Manual trade capture.
- Immutable context snapshots.
- Screenshot attachments.
- Trade review and lessons.

## M8 — Analytics
- Win rate, average R, expectancy, drawdown and profit factor.
- Rule adherence and setup/session breakdown.
- Sample-size warnings.

## M9 — Validation and deployment
- Integration, security and data-quality testing.
- Backup/restore rehearsal.
- User acceptance testing.
- Deployment decision.

## Definition of done for each milestone
A milestone is complete only when its acceptance criteria are documented, implemented, tested, reviewed, and approved by the product owner. A visual mock-up alone does not count as a functioning integration.
