# Task Board

## Now — Milestone 0
| ID | Task | Owner | Status | Acceptance |
|---|---|---|---|---|
| M0-01 | Create project skeleton | ChatGPT | Done | Files and folders present |
| M0-02 | Document product baseline | ChatGPT | Draft | Product owner approves |
| M0-03 | Document architecture | ChatGPT | Draft | No unresolved architecture contradiction |
| M0-04 | Choose browser IDE with Node runtime and preview | User + ChatGPT | Open | Can open terminal and run Node |
| M0-05 | Initialize Git repository | User | Open | First commit exists |
| M0-06 | Install dependencies and run server | User + Claude | Open | Homepage loads locally |
| M0-07 | Verify health endpoint | User + Claude | Open | `/api/health` returns status `ok` |
| M0-08 | Claude independent architecture review | Claude | Done | Written review and issues list |
| M0-09 | Approve M0 baseline | User | Open | All blockers resolved or explicitly deferred |

## Next — Milestone 1
- Build navigation and page shells for all approved modules.
- Establish design tokens and responsive components.
- Add clear empty states and data-status labels.
- Use fixtures only, visibly labelled as demonstration data.
- Add frontend smoke tests.

## Change control
Any change to a confirmed requirement must be recorded in `CHANGELOG_DECISIONS.md` before implementation.
