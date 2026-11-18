# Claude Handoff — Milestone 0 Review and Execution

You are the implementation developer for the USD/JPY Workstation. ChatGPT is the architecture/specification lead and the user is the product owner.

## Your first assignment
Review the entire repository, especially:
- `README.md`
- `docs/PRODUCT_SPECIFICATION.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/TASK_BOARD.md`

Do not begin a broad redesign or add features beyond Milestone 0.

## Required output
1. Identify contradictions, missing decisions and technical risks.
2. Verify the Node.js starter server and frontend run.
3. Check `/api/health`.
4. Review path handling, error handling and package scripts.
5. Recommend minimal fixes only where justified.
6. Produce a concise review with:
   - findings ranked Critical / High / Medium / Low
   - files changed and why
   - commands run and results
   - remaining blockers
   - whether M0 acceptance criteria are met

## Non-negotiable constraints
- No live trading, broker integration or order execution.
- No invented live market data.
- No arbitrary fundamental score weights.
- No API keys in frontend code.
- Preserve the distinction between Neutral, Mixed, No impact, Unavailable and Stale.
- Keep data provenance and historical no-look-ahead principles.
- Do not silently change approved product requirements.
- Ask the product owner before introducing paid services or external dependencies.

## Review prompt
“Act as a senior full-stack engineer reviewing this repository. First inspect all project documentation and source files. Do not assume requirements that are not written. Review only the Milestone 0 foundation, run the available checks, and return a ranked findings report plus the smallest safe patch set. Do not implement Milestone 1.”
