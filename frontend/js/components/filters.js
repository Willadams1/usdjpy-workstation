import { h } from "../dom.js";

let uid = 0;
const nextId = (p) => `${p}-${++uid}`;

// Button group where exactly one option is pressed.
export function segmented({ label, options, value, onChange }) {
  const buttons = options.map((o) => h("button", {
    type: "button", class: "seg-btn", "data-value": o.value, "aria-pressed": o.value === value,
    onClick: () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === o.value)));
      onChange(o.value);
    }
  }, o.label));
  return h("div", { class: "segmented", role: "group", "aria-label": label }, ...buttons);
}

export function selectField({ label, options, value, onChange, disabled = false, focusKey }) {
  const id = nextId("sel");
  const select = h("select", { id, class: "input", disabled, "data-focus-key": focusKey, onChange: (e) => onChange?.(e.target.value) },
    ...options.map((o) => h("option", { value: o.value, selected: o.value === value }, o.label)));
  return h("div", { class: "field" }, h("label", { for: id }, label), select);
}

export function searchField({ label, value = "", placeholder = "Search", onInput }) {
  const id = nextId("search");
  return h("div", { class: "field" }, h("label", { for: id }, label),
    h("input", { id, class: "input", type: "search", value, placeholder, autocomplete: "off", onInput: (e) => onInput(e.target.value) }));
}
