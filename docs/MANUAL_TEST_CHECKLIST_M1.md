# M1 Manual Test Checklist (Windows)

Run `npm test` and `npm run dev`, then open `http://localhost:3000` in Chrome or Edge. Keep DevTools open (F12 → Console).

**Automated tests**
- [ ] `npm test` reports 0 failed. Note the skipped count: **8 skipped is expected if Windows does not allow symlinks**, and means those tests did not run (they are not passes).

**Navigation and layout**
- [ ] 1. The page loads at `#/overview` and the Console shows no errors or warnings.
- [ ] 2. Click each of the eight sidebar items. The title, the highlighted item and the content all change without a page reload.
- [ ] 3. Collapse the sidebar with the button at its bottom: icons stay, labels hide. Reload: it stays collapsed. Expand again.
- [ ] 4. Narrow the window below 768px (or press F12, then Ctrl+Shift+M for device mode). A menu button appears; it opens a drawer; Escape, tapping outside, or choosing a section closes it.
- [ ] 5. At about 1024px and 390px wide, no page scrolls sideways (wide tables scroll inside their own box).

**Honesty of content**
- [ ] 6. Every page with sample values shows a "Sample data" banner and a SAMPLE badge on each card. Journal rows say "Demo". Dates are all in 1999/2000.
- [ ] 7. The header shows "device clock", "Market data: Not connected" and "Sample data · Paper only". Nothing suggests live prices. No candles or prices are drawn on Market.
- [ ] 8. Fundamentals shows Neutral, Mixed, No impact, Unavailable and Stale as visibly different states. Unavailable never reads "Neutral". No numerical scores appear anywhere.
- [ ] 9. Strategy shows only "Not defined" fields and "Not assessed" readiness. No rule values appear.

**Controls**
- [ ] 10. Intelligence: category, importance and search filters change the list; a no-match search shows an empty state.
- [ ] 11. Journal: Outcome and Direction filters work; Loss + Long shows an empty state. The "New entry" fields and every "Planned" button are disabled.
- [ ] 12. Market: the timeframe buttons (15m, 1H, 4H, 1D) change the selection text.
- [ ] 13. Settings: switch the timezone to UTC (header clock and times change), change density, press "Reset interface preferences", press "Recheck backend". "Trading execution" reads Disabled. No field asks for an API key.

**M0 unchanged**
- [ ] 14. `http://localhost:3000/api/health` still returns `"status":"ok"` and `"trading_execution":false`.
- [ ] 15. `http://localhost:3000/#/nope` shows "Section not found" with a link back to Overview.
