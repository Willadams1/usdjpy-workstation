# Product Specification — Baseline

## Purpose
A USD/JPY workstation for macroeconomic research, technical chart analysis, journaling, and paper-trade recording. The product is intended to support disciplined analysis, not to make decisions or execute trades on the user's behalf.

## Confirmed product decisions
- Instrument: USD/JPY.
- Timezone: South African Standard Time (Africa/Johannesburg).
- Layout: overview dashboard plus dedicated tabs.
- Journal: semi-automated; manual trade details plus automatically captured market/fundamental context.
- Readiness gatekeeper: conditional states — Ready, Caution, Observe-only.
- Analysis: hybrid; deterministic calculations for numerical scoring and AI for evidence interpretation and narrative.
- Research depth: comprehensive global macroeconomic and geopolitical context.
- Initial use: research and paper-trade recording only.
- TradingView chart integration desired.
- Driver gauges must show direction, strength, confidence, freshness and explanation.
- Each relevant observation should expose source, publication time and retrieval time.
- Distinguish Neutral, Mixed, No impact, Unavailable and Stale. Missing data must never be silently treated as neutral.
- Trade snapshots should preserve the information available at the time of the trade and must not be rewritten by later data revisions.

## Fundamental driver groups
1. Monetary policy: Federal Reserve and Bank of Japan.
2. Economic performance: inflation, employment, wages, GDP and business activity.
3. Bond markets: US Treasury and Japanese government bond yields and their spread.
4. Risk sentiment: volatility, equities and safe-haven demand.
5. Currency-specific developments: broad USD/JPY context, intervention risk and reliable positioning data.
6. Geopolitical intelligence: trade tensions, conflict-related developments, energy and supply disruptions, and relevant political events.

## Scoring principles
- Score USD and JPY independently before calculating relative USD/JPY pressure.
- A provisional relative measure may be expressed as (USD strength - JPY strength) / 2, once both component scores use the same documented scale.
- Do not assign arbitrary driver weights. Weights require documented rationale, testing and versioning.
- Distinguish observed facts, official statements, market expectations, unconfirmed reports and analyst interpretation.
- Compare releases with consensus and prior values where reliable consensus data exists.
- Detect contradictions instead of forcing a single narrative.
- Show confidence and data freshness separately from directional strength.
- Record scoring algorithm version and input observation IDs.

## Trading workflow
- Strategy constitution: editable, versioned and attached to each trade.
- Readiness: mood/focus/fatigue/pressure/discipline self-check with Ready, Caution and Observe-only outcomes. This is a trading discipline aid, not a diagnosis. Avoid simplistic hard locks; record overrides.
- Journal: manual setup and execution details plus automatic context snapshot.
- Risk tools: educational/paper-trade calculators and configurable limits; no real-money execution.
- Analytics: expectancy, win rate, average R, drawdown, profit factor, setup/session analysis and rule adherence, with sample-size cautions.

## Open decisions
- Exact strategy entry confirmation sequence.
- Numeric definition of an oversized POI candle.
- Risk and loss limits.
- News blackout window.
- Driver weights and calibration.
- Market-price data provider and latency.
- AI provider, costs and evaluation process.
- Screenshot storage and retention.
- Hosting and deployment target.
