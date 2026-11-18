# Development Roadmap

## M0 — Project foundation
- [x] Create repository skeleton and documentation baseline.
- [x] Add minimal Node.js server and health endpoint.
- [x] Add frontend scaffold.
- [ ] Select browser IDE/runtime.
- [ ] Create Git repository and first commit.
- [ ] Run locally and verify health endpoint.
- [ ] Review docs and approve baseline.

## M1 — Workstation interface
- Overview dashboard and navigation.
- Responsive layout and reusable components.
- Dedicated module shells.
- No fabricated live data; use clearly labelled fixtures.

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
