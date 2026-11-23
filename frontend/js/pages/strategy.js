import { h } from "../dom.js";
import { card } from "../components/card.js";
import { badge, plannedButton } from "../components/badge.js";
import { notice } from "../components/states.js";

// Structure only. No rule values are defined here: every field is "Not defined" until the owner confirms rules (M6).
const SECTIONS = [
  { title: "Strategy constitution", text: "Versioned, reviewable trading rules will be recorded here.", fields: ["Rule set version", "Last review date", "Approval status"] },
  { title: "Higher-timeframe directional bias", text: "How directional bias is established and invalidated.", fields: ["Timeframes used", "Bias criteria", "Invalidation criteria"] },
  { title: "Daily and 4H analysis", text: "Where higher-timeframe structure is described.", fields: ["Daily structure", "4H structure", "Key levels"] },
  { title: "15-minute execution framework", text: "How execution-timeframe setups are defined.", fields: ["Execution timeframe", "Entry confirmation", "Stop and target placement"] },
  { title: "Liquidity and fair value gaps", text: "Definitions and qualification of these concepts.", fields: ["Liquidity definition", "Fair value gap definition", "Qualification criteria"] },
  { title: "Point of interest (POI) assessment", text: "How points of interest are identified and graded.", fields: ["POI definition", "Quality criteria", "Invalid POI conditions"] },
  { title: "News awareness", text: "How scheduled events affect trading decisions.", fields: ["High-impact event handling", "Blackout window", "Event data source"] },
  { title: "Risk rules", text: "Paper-trading risk limits.", fields: ["Risk per trade", "Daily loss limit", "Maximum trades per day"] }
];

const READINESS = [
  { label: "Ready", tone: "pos", iconName: "check" },
  { label: "Caution", tone: "caution", iconName: "alert" },
  { label: "Observe-only", tone: "neg", iconName: "ban" }
];

export function render() {
  const sections = SECTIONS.map((s) => card({ title: s.title, eyebrow: "Framework placeholder" },
    h("p", { class: "muted" }, s.text),
    h("dl", { class: "kv" }, ...s.fields.flatMap((f) => [h("dt", {}, f), h("dd", {}, badge("Not defined"))]))));

  const readiness = card({ title: "Readiness assessment", eyebrow: "Pre-session" },
    h("div", { class: "row-end" }, badge("Not assessed")),
    h("p", { class: "muted" }, "Possible outcomes. The questions and the rules that decide them are not defined yet."),
    h("div", { class: "badge-row" }, ...READINESS.map((r) => badge(r.label, r))),
    plannedButton("Start assessment", "M6"));

  return h("div", { class: "page" },
    notice({ tone: "caution", iconName: "alert", title: "No rules are defined.", text: "Nothing on this page is an active trading rule. Rules will be created, reviewed and version-controlled in M6." }),
    h("div", { class: "grid grid-2" }, ...sections, readiness));
}
