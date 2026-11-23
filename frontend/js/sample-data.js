// ALL DEMONSTRATION DATA LIVES HERE. Every record is flagged `sample: true` and rendered with a visible label.
// Dates use the fictional year 2000 on purpose, so nothing can be mistaken for current information.
// Nothing in this file is market data, a real release, a real headline or a trade signal.
const S = (record) => Object.freeze({ ...record, sample: true });

export const SAMPLE_NOTICE = "Sample data · illustrative only · not live market information";

export const SAMPLE_DATA = Object.freeze({
  bias: S({ direction: "usd-supportive", strength: 2, confidence: 1, note: "Illustrative fundamental lean only. It is not a trade signal and says nothing about technical structure." }),
  strength: S({ usd: 3, jpy: 2 }),
  pressure: S({ step: 1 }),

  drivers: Object.freeze([
    S({ id: "monetary-policy", name: "Monetary policy", scope: "Federal Reserve and Bank of Japan", direction: "usd-supportive", strength: 3, confidence: 2,
      freshness: { state: "fresh", updatedAt: "2000-01-03T07:00:00Z" },
      explanation: "Sample explanation: shows how a driver would summarise the relative stance of the two central banks. No real policy data is used." }),
    S({ id: "economic-performance", name: "Economic performance", scope: "Inflation, employment, wages and growth", direction: "mixed", strength: 2, confidence: 1,
      freshness: { state: "fresh", updatedAt: "2000-01-03T07:00:00Z" },
      explanation: "Sample explanation: components point in different directions, so the result is Mixed rather than Neutral." }),
    S({ id: "bond-markets", name: "Bond markets", scope: "US Treasury and Japanese government bond yields", direction: "jpy-supportive", strength: 2, confidence: 2,
      freshness: { state: "stale", updatedAt: "1999-12-20T07:00:00Z" },
      explanation: "Sample explanation: the last known reading is older than the freshness threshold, so the driver is shown as Stale instead of current." }),
    S({ id: "risk-sentiment", name: "Risk sentiment", scope: "Global risk appetite and safe-haven demand", direction: "neutral", strength: null, confidence: 2,
      freshness: { state: "fresh", updatedAt: "2000-01-03T07:00:00Z" },
      explanation: "Sample explanation: evidence was assessed and is balanced. Neutral is a result, not a missing value." }),
    S({ id: "currency-developments", name: "Currency-specific developments", scope: "Intervention risk and currency-specific events", direction: "no-impact", strength: null, confidence: 2,
      freshness: { state: "fresh", updatedAt: "2000-01-03T07:00:00Z" },
      explanation: "Sample explanation: reviewed and found not relevant to USD/JPY. This differs from Neutral and from Unavailable." }),
    S({ id: "geopolitical", name: "Geopolitical intelligence", scope: "Global geopolitical and economic developments", direction: "unavailable", strength: null, confidence: null,
      freshness: { state: "unknown", updatedAt: null },
      explanation: "Sample explanation: no reliable input exists. Missing information is never treated as neutral." })
  ]),

  events: Object.freeze([
    S({ id: "ev1", title: "Sample event A — US inflation data", currency: "USD", importance: "high", at: "2000-01-03T13:30:00Z" }),
    S({ id: "ev2", title: "Sample event B — Japan central bank policy statement", currency: "JPY", importance: "high", at: "2000-01-04T03:00:00Z" }),
    S({ id: "ev3", title: "Sample event C — US employment data", currency: "USD", importance: "medium", at: "2000-01-05T13:30:00Z" }),
    S({ id: "ev4", title: "Sample event D — Japan wage data", currency: "JPY", importance: "medium", at: "2000-01-06T00:30:00Z" }),
    S({ id: "ev5", title: "Sample event E — US central bank meeting minutes", currency: "USD", importance: "low", at: "2000-01-07T19:00:00Z" })
  ]),

  feed: Object.freeze([
    S({ id: "f1", category: "central-bank", importance: "high", evidenceType: "Central bank communication", at: "2000-01-03T06:00:00Z", title: "Sample item: central bank policy communication", summary: "Placeholder summary showing where a sourced central bank development would appear." }),
    S({ id: "f2", category: "central-bank", importance: "medium", evidenceType: "Market expectations", at: "2000-01-03T05:00:00Z", title: "Sample item: market expectations for a policy decision", summary: "Placeholder summary distinguishing market expectations from official communication." }),
    S({ id: "f3", category: "economic", importance: "high", evidenceType: "Official data", at: "2000-01-03T04:30:00Z", title: "Sample item: official economic data release", summary: "Placeholder summary for an official data release, kept separate from interpretation." }),
    S({ id: "f4", category: "economic", importance: "low", evidenceType: "Analyst interpretation", at: "2000-01-03T03:00:00Z", title: "Sample item: analyst interpretation of recent data", summary: "Placeholder summary. Analyst interpretation is labelled as such and is not treated as fact." }),
    S({ id: "f5", category: "geopolitical", importance: "medium", evidenceType: "Political statement", at: "2000-01-02T16:00:00Z", title: "Sample item: political statement on a global issue", summary: "Placeholder summary for a political statement, distinct from confirmed events." }),
    S({ id: "f6", category: "geopolitical", importance: "low", evidenceType: "Unconfirmed report", at: "2000-01-02T14:00:00Z", title: "Sample item: unconfirmed report", summary: "Placeholder summary. Unconfirmed reports are flagged and carry low confidence." }),
    S({ id: "f7", category: "us-china", importance: "medium", evidenceType: "Political statement", at: "2000-01-02T10:00:00Z", title: "Sample item: US–China relations development", summary: "Placeholder summary for a development in US–China relations." }),
    S({ id: "f8", category: "us-china", importance: "low", evidenceType: "Analyst interpretation", at: "2000-01-01T18:00:00Z", title: "Sample item: analysis of US–China trade positions", summary: "Placeholder summary for analyst commentary." }),
    S({ id: "f9", category: "middle-east", importance: "high", evidenceType: "Unconfirmed report", at: "2000-01-02T09:00:00Z", title: "Sample item: Middle East development (unconfirmed)", summary: "Placeholder summary for a developing regional report awaiting confirmation." }),
    S({ id: "f10", category: "middle-east", importance: "medium", evidenceType: "Political statement", at: "2000-01-01T12:00:00Z", title: "Sample item: regional diplomatic statement", summary: "Placeholder summary for a diplomatic statement." }),
    S({ id: "f11", category: "trade-energy", importance: "medium", evidenceType: "Official data", at: "2000-01-02T08:00:00Z", title: "Sample item: energy market official statistics", summary: "Placeholder summary for official energy or trade statistics." }),
    S({ id: "f12", category: "trade-energy", importance: "low", evidenceType: "Market expectations", at: "2000-01-01T09:00:00Z", title: "Sample item: trade policy market expectations", summary: "Placeholder summary for market expectations around trade policy." })
  ]),

  journal: Object.freeze([
    S({ id: "j1", at: "2000-01-03T12:00:00Z", session: "Demo session", instrument: "USD/JPY", direction: "Long", entry: "100.000", exit: "100.500", rr: "1 : 2", result: "+1.0R", outcome: "Win", notes: "Demonstration record only. Not a real trade." }),
    S({ id: "j2", at: "2000-01-04T12:00:00Z", session: "Demo session", instrument: "USD/JPY", direction: "Short", entry: "100.000", exit: "100.250", rr: "1 : 2", result: "−1.0R", outcome: "Loss", notes: "Demonstration record only. Not a real trade." })
  ]),

  research: Object.freeze([
    S({ id: "r1", type: "Historical observation", at: "2000-01-01T09:00:00Z", title: "Sample observation: behaviour around a past policy shift", summary: "Placeholder for a recorded historical market observation." }),
    S({ id: "r2", type: "Historical observation", at: "2000-01-01T08:00:00Z", title: "Sample observation: session behaviour notes", summary: "Placeholder for session-level research notes." }),
    S({ id: "r3", type: "Economic event research", at: "2000-01-01T07:00:00Z", title: "Sample research: event reaction study", summary: "Placeholder for research into how markets reacted to a type of economic event." }),
    S({ id: "r4", type: "Previous briefing", at: "1999-12-30T07:00:00Z", title: "Sample briefing: weekly fundamental briefing", summary: "Placeholder for an archived fundamental briefing, preserved as it was at the time." }),
    S({ id: "r5", type: "Previous briefing", at: "1999-12-23T07:00:00Z", title: "Sample briefing: pre-holiday briefing", summary: "Placeholder for a second archived briefing." }),
    S({ id: "r6", type: "Historical comparison", at: "1999-12-20T07:00:00Z", title: "Sample comparison: two policy cycles side by side", summary: "Placeholder for a historical comparison between two periods." })
  ])
});

export const FEED_CATEGORIES = Object.freeze([
  { id: "central-bank", label: "Central banks" },
  { id: "economic", label: "Economic news" },
  { id: "geopolitical", label: "Geopolitical" },
  { id: "us-china", label: "US–China" },
  { id: "middle-east", label: "Middle East" },
  { id: "trade-energy", label: "Trade & energy" }
]);
export const RESEARCH_TYPES = Object.freeze(["Historical observation", "Economic event research", "Previous briefing", "Historical comparison"]);
