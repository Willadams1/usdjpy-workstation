import test from "node:test";
import assert from "node:assert/strict";
import { ROUTES, matchRoute, hrefFor, DEFAULT_ROUTE } from "../frontend/js/logic/routes.js";
import { classifyDriver, DRIVER_STATES, bandLabel, confidenceLabel, pressureLabel, driverStrengthText } from "../frontend/js/logic/driver-state.js";
import { filterFeed, filterJournal, filterResearch } from "../frontend/js/logic/filters.js";
import { sanitizePrefs, effectiveCollapsed, PREF_DEFAULTS } from "../frontend/js/logic/prefs.js";
import { formatClock, formatDateTime, activeSessions, utcHourInTz, SESSIONS } from "../frontend/js/time.js";
import { checkHealth } from "../frontend/js/health.js";
import { SAMPLE_DATA, SAMPLE_NOTICE } from "../frontend/js/sample-data.js";
import { ICON_NAMES } from "../frontend/js/icons.js";

test("routes: exactly the eight approved sections, in order", () => {
  assert.deepEqual(ROUTES.map((r) => r.title), ["Overview", "Market", "Fundamentals", "Intelligence", "Strategy", "Journal", "Research", "Settings"]);
  assert.equal(DEFAULT_ROUTE, "overview");
  assert.equal(hrefFor("market"), "#/market");
});

test("routes: hash matching", () => {
  assert.equal(matchRoute("#/market").route.id, "market");
  assert.equal(matchRoute("#market").route.id, "market"); // legacy M0 anchors
  assert.equal(matchRoute("#/Market/").route.id, "market");
  assert.equal(matchRoute("").status, "default");
  assert.equal(matchRoute("#/").status, "default");
  assert.equal(matchRoute(undefined).status, "default");
  for (const bad of ["#/nope", "#/market/extra", "#/__proto__", "#/constructor"]) assert.equal(matchRoute(bad).status, "not-found", bad);
});

test("driver state: Unavailable is never classified as Neutral", () => {
  for (const driver of [null, undefined, {}, { direction: null }, { direction: undefined }, { direction: "unavailable" }, { direction: "" }, { direction: "bullish" }, { direction: 0 }]) {
    assert.equal(classifyDriver(driver), "unavailable", JSON.stringify(driver));
  }
  assert.equal(classifyDriver({ direction: "neutral" }), "neutral");
});

test("driver state: every state is distinct and Stale takes precedence over a stored direction", () => {
  assert.equal(classifyDriver({ direction: "usd-supportive", freshness: { state: "stale" } }), "stale");
  assert.equal(classifyDriver({ direction: "usd-supportive", freshness: { state: "fresh" } }), "usd-supportive");
  assert.equal(classifyDriver({ direction: "mixed" }), "mixed");
  assert.equal(classifyDriver({ direction: "no-impact" }), "no-impact");
  const labels = Object.values(DRIVER_STATES).map((s) => s.label);
  assert.equal(new Set(labels).size, labels.length);
  for (const k of ["neutral", "mixed", "no-impact", "unavailable", "stale"]) assert.ok(DRIVER_STATES[k], k);
  // Neutral, No impact and Unavailable must not share both icon and tone.
  const sig = ["neutral", "no-impact", "unavailable"].map((k) => `${DRIVER_STATES[k].icon}|${DRIVER_STATES[k].tone}`);
  assert.equal(new Set(sig).size, 3);
});

test("driver state: strength text differs for Neutral, No impact and Unavailable", () => {
  const texts = ["neutral", "no-impact", "unavailable"].map((k) => driverStrengthText({}, k));
  assert.deepEqual(texts, ["Balanced", "None", "No data"]);
  assert.equal(driverStrengthText({ strength: 2 }, "stale"), "Last known: Low");
});

test("every icon referenced by routes and driver states exists", () => {
  for (const name of [...ROUTES.map((r) => r.icon), ...Object.values(DRIVER_STATES).map((s) => s.icon)]) assert.ok(ICON_NAMES.includes(name), name);
});

test("labels: bands, confidence and pressure", () => {
  assert.equal(bandLabel(3), "Moderate");
  for (const bad of [0, 6, 1.5, null, undefined, "3"]) assert.equal(bandLabel(bad), "—");
  assert.equal(confidenceLabel(2), "Medium");
  assert.equal(confidenceLabel(4), "—");
  assert.equal(pressureLabel(1), "Slightly USD-favoured");
  assert.equal(pressureLabel(9), "—");
});

test("filters", () => {
  assert.equal(filterFeed(SAMPLE_DATA.feed).length, 12);
  assert.equal(filterFeed(SAMPLE_DATA.feed, { category: "us-china" }).length, 2);
  assert.equal(filterFeed(SAMPLE_DATA.feed, { importance: "high" }).length, 3);
  assert.equal(filterFeed(SAMPLE_DATA.feed, { category: "middle-east", importance: "high" }).length, 1);
  assert.equal(filterFeed(SAMPLE_DATA.feed, { query: "  UNCONFIRMED " }).length, 2);
  assert.equal(filterFeed(SAMPLE_DATA.feed, { query: "zzzz" }).length, 0);
  assert.equal(filterJournal(SAMPLE_DATA.journal, { outcome: "Loss" }).length, 1);
  assert.equal(filterJournal(SAMPLE_DATA.journal, { outcome: "Loss", direction: "Long" }).length, 0);
  assert.equal(filterResearch(SAMPLE_DATA.research, { type: "Previous briefing" }).length, 2);
  assert.equal(filterResearch(SAMPLE_DATA.research, { query: "pre-holiday" }).length, 1);
});

test("prefs: sanitising rejects bad stored values", () => {
  assert.deepEqual(sanitizePrefs(null), PREF_DEFAULTS);
  assert.deepEqual(sanitizePrefs("x"), PREF_DEFAULTS);
  assert.deepEqual(sanitizePrefs({ sidebarCollapsed: "yes", tz: "PST", density: "huge" }), PREF_DEFAULTS);
  assert.deepEqual(sanitizePrefs({ sidebarCollapsed: true, tz: "UTC", density: "compact" }), { sidebarCollapsed: true, tz: "UTC", density: "compact" });
  assert.equal(PREF_DEFAULTS.tz, "SAST");
});

test("prefs: sidebar default depends on width only when no stored choice exists", () => {
  assert.equal(effectiveCollapsed(null, 900), true);
  assert.equal(effectiveCollapsed(null, 1400), false);
  assert.equal(effectiveCollapsed(false, 900), false);
  assert.equal(effectiveCollapsed(true, 1400), true);
});

test("time: SAST conversion of fixed instants (UTC+2, no DST)", () => {
  assert.equal(formatDateTime("2000-01-03T07:00:00Z", "SAST"), "2000-01-03 09:00 SAST");
  assert.equal(formatDateTime("2000-07-03T07:00:00Z", "SAST"), "2000-07-03 09:00 SAST");
  assert.equal(formatDateTime("2000-01-03T07:00:00Z", "UTC"), "2000-01-03 07:00 UTC");
  assert.equal(formatDateTime("2000-01-03T22:30:00Z", "SAST"), "2000-01-04 00:30 SAST"); // crosses midnight, never "24:30"
  assert.equal(formatClock(new Date("2000-01-03T11:05:00Z"), "SAST"), "13:05");
  assert.equal(formatDateTime("not a date"), "—");
  assert.equal(formatDateTime(null), "—");
  assert.equal(formatDateTime("2000-01-03T07:00:00Z", "BOGUS"), "2000-01-03 09:00 SAST");
});

test("time: approximate session windows, including wrap past midnight", () => {
  const at = (h) => activeSessions(new Date(Date.UTC(2000, 0, 3, h))).map((s) => s.id);
  assert.deepEqual(at(14), ["london", "new-york"]);
  assert.deepEqual(at(23), ["sydney"]);
  assert.deepEqual(at(3), ["sydney", "tokyo"]);
  assert.deepEqual(at(7), ["tokyo"]);
  assert.deepEqual(at(8), ["tokyo", "london"]);
  for (let h = 0; h < 24; h++) assert.ok(at(h).length >= 1, `hour ${h}`);
  assert.equal(SESSIONS.length, 4);
  assert.equal(utcHourInTz(8, "SAST"), "10:00");
  assert.equal(utcHourInTz(22, "SAST"), "00:00");
});

test("health: success, bad status, bad body, network error and timeout", async () => {
  const json = (body, ok = true, status = 200) => async () => ({ ok, status, json: async () => body });
  assert.equal((await checkHealth({ fetchImpl: json({ status: "ok", mode: "x" }) })).status, "ok");
  assert.equal((await checkHealth({ fetchImpl: json({}, false, 500) })).error, "HTTP 500");
  assert.equal((await checkHealth({ fetchImpl: json({ status: "degraded" }) })).error, "Unexpected response");
  assert.equal((await checkHealth({ fetchImpl: async () => { throw new TypeError("boom"); } })).error, "Network error");
  const hang = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(Object.assign(new Error("a"), { name: "AbortError" }))));
  assert.equal((await checkHealth({ fetchImpl: hang, timeoutMs: 20 })).error, "Timed out");
});

test("sample data: every record is flagged sample and the six drivers cover every state", () => {
  for (const [key, value] of Object.entries(SAMPLE_DATA)) {
    const records = Array.isArray(value) ? value : [value];
    assert.ok(records.length > 0, key);
    for (const r of records) assert.equal(r.sample, true, `${key} record not flagged sample`);
  }
  assert.match(SAMPLE_NOTICE, /sample/i);
  assert.equal(SAMPLE_DATA.drivers.length, 6);
  const states = new Set(SAMPLE_DATA.drivers.map(classifyDriver));
  for (const s of ["neutral", "mixed", "no-impact", "unavailable", "stale"]) assert.ok(states.has(s), `no sample driver in state ${s}`);
  assert.ok(states.has("usd-supportive") || states.has("jpy-supportive"));
  assert.equal(new Set(SAMPLE_DATA.feed.map((f) => f.category)).size, 6);
});

test("sample data: all dates are fictional (1999/2000) so nothing looks current", () => {
  const stamps = [...SAMPLE_DATA.events, ...SAMPLE_DATA.feed, ...SAMPLE_DATA.journal, ...SAMPLE_DATA.research].map((r) => r.at);
  stamps.push(...SAMPLE_DATA.drivers.map((d) => d.freshness.updatedAt).filter(Boolean));
  for (const s of stamps) assert.match(s, /^(1999|2000)-/, s);
});
