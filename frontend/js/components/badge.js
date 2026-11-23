import { h } from "../dom.js";
import { icon } from "../icons.js";
import { DRIVER_STATES } from "../logic/driver-state.js";

export function badge(label, { tone = "neutral", iconName, title } = {}) {
  return h("span", { class: `badge tone-${tone}`, title }, iconName && icon(iconName, { size: 12 }), label);
}

// Status chip used in the header: "label value" with a tone.
export function statusChip({ label, value, tone = "neutral", iconName, title }) {
  return h("span", { class: `chip tone-${tone}`, title },
    iconName && icon(iconName, { size: 14 }),
    h("span", { class: "chip-label" }, label),
    value && h("span", { class: "chip-value" }, value));
}

// Icon + text, so a state is never conveyed by colour alone.
export function driverStateBadge(stateKey) {
  const s = DRIVER_STATES[stateKey] ?? DRIVER_STATES.unavailable;
  return badge(s.label, { tone: s.tone, iconName: s.icon });
}

const IMPORTANCE = { high: ["High", "neg"], medium: ["Medium", "caution"], low: ["Low", "neutral"] };
export function importanceBadge(level) {
  const [label, tone] = IMPORTANCE[level] ?? ["Unknown", "neutral"];
  return badge(`${label} importance`, { tone });
}

// A control for a feature that does not exist yet: disabled, with the planned milestone shown beside it.
export function plannedButton(label, milestone) {
  return h("span", { class: "planned" },
    h("button", { class: "btn", type: "button", disabled: true, "aria-disabled": "true", title: `Planned for ${milestone}` }, label),
    h("span", { class: "badge tone-neutral" }, `Planned · ${milestone}`));
}

export function linkButton(label, href, { primary = false } = {}) {
  return h("a", { class: `btn${primary ? " btn-primary" : ""}`, href }, label);
}
