import { h } from "../dom.js";
import { SAMPLE_DATA as D } from "../sample-data.js";
import { card } from "../components/card.js";
import { sampleBanner } from "../components/sample-label.js";
import { badge, driverStateBadge } from "../components/badge.js";
import { driverMeter, strengthMeter } from "../components/gauge.js";
import { notice } from "../components/states.js";
import { classifyDriver, confidenceLabel, DRIVER_STATES, driverStrengthText } from "../logic/driver-state.js";
import { formatDateTime } from "../time.js";

const FRESHNESS = { fresh: "Fresh", stale: "Stale", unknown: "Unknown" };

function row(label, ...value) {
  return [h("dt", {}, label), h("dd", {}, ...value)];
}

function driverCard(d, tz) {
  const key = classifyDriver(d);
  const meta = DRIVER_STATES[key];
  const direction = key === "unavailable" ? "—" : key === "stale" ? `Last known: ${DRIVER_STATES[d.direction].label}` : meta.label;
  const updated = d.freshness.updatedAt ? `${formatDateTime(d.freshness.updatedAt, tz)} (sample timestamp)` : "Not recorded";
  const confidence = d.confidence == null
    ? "No data"
    : [strengthMeter({ step: d.confidence, max: 3, name: "Confidence", text: confidenceLabel(d.confidence) }), " ", confidenceLabel(d.confidence)];

  return card({ title: d.name, eyebrow: d.scope, sample: true, className: "driver-card", id: `driver-${d.id}`, actions: driverStateBadge(key) },
    h("dl", { class: "kv" },
      ...row("Direction", direction),
      ...row("Strength", driverMeter(d, key, meta.tone), " ", driverStrengthText(d, key)),
      ...row("Confidence", ...[].concat(confidence)),
      ...row("Freshness", FRESHNESS[d.freshness.state] ?? "Unknown"),
      ...row("Last updated", updated)),
    h("p", { class: "muted" }, meta.description),
    h("p", {}, d.explanation),
    h("div", { class: "sources" }, badge("Placeholder"), " Source reference placeholder. Clickable sources arrive with data integration."));
}

export function render(ctx) {
  const tz = ctx.store.get().tz;
  const legend = card({ title: "How states are shown", eyebrow: "Legend" },
    h("ul", { class: "list" }, ...Object.keys(DRIVER_STATES).map((k) => h("li", { class: "row" },
      driverStateBadge(k), h("span", { class: "muted" }, DRIVER_STATES[k].description)))),
    h("p", { class: "muted small" }, "Neutral, Mixed, No impact, Unavailable and Stale are distinct states. Missing information is never treated as neutral."));

  return h("div", { class: "page" },
    sampleBanner(),
    notice({ tone: "info", title: "No numerical scores.", text: "Strength is shown as a category. The deterministic scoring model is planned for M4." }),
    legend,
    h("div", { class: "grid grid-2" }, ...D.drivers.map((d) => driverCard(d, tz))));
}
