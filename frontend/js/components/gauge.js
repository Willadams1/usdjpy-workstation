import { h } from "../dom.js";
import { bandLabel, pressureLabel } from "../logic/driver-state.js";

// Segmented meter. `step` null/undefined renders an empty hatched meter (no data), never a "neutral" one.
export function strengthMeter({ step, max = 5, tone = "info", text, dim = false, name = "Strength" } = {}) {
  const hasValue = Number.isInteger(step);
  const segments = Array.from({ length: max }, (_, i) => h("i", { class: hasValue && i < step ? "on" : "" }));
  const summary = text ?? (hasValue ? bandLabel(step) : "No data");
  return h("span", {
    class: `meter tone-${tone}${dim ? " is-dim" : ""}${hasValue ? "" : " is-empty"}`,
    role: "img",
    "aria-label": `${name}: ${summary}${hasValue ? ` (${step} of ${max})` : ""}`
  }, ...segments);
}

// Five-cell bar from "JPY-favoured" to "USD-favoured". step is -2..+2.
export function pressureBar(step) {
  const marker = Number.isInteger(step) ? step + 2 : -1;
  const tone = step > 0 ? "usd" : step < 0 ? "jpy" : "neutral";
  const cells = Array.from({ length: 5 }, (_, i) => h("i", { class: i === marker ? `on tone-${tone}` : "" }));
  return h("div", { class: "pressure-wrap" },
    h("div", { class: "pressure", role: "img", "aria-label": `Relative pressure: ${pressureLabel(step)}` }, ...cells),
    h("div", { class: "pressure-scale", "aria-hidden": "true" }, h("span", {}, "JPY-favoured"), h("span", {}, "Balanced"), h("span", {}, "USD-favoured")));
}

// Meter with correct semantics per driver state (so Neutral, No impact and Unavailable never look alike).
export function driverMeter(driver, stateKey, tone) {
  switch (stateKey) {
    case "usd-supportive":
    case "jpy-supportive":
    case "mixed":
      return strengthMeter({ step: driver.strength, tone });
    case "stale":
      return strengthMeter({ step: driver.strength, tone, dim: true, name: "Last known strength", text: `Last known: ${bandLabel(driver.strength)}` });
    case "neutral":
      return strengthMeter({ step: 0, tone: "neutral", text: "Balanced" });
    case "no-impact":
      return strengthMeter({ step: 0, tone: "neutral", text: "None" });
    default:
      return strengthMeter({ step: null });
  }
}
