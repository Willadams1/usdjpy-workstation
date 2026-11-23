import { h } from "../dom.js";
import { sampleBadge } from "./sample-label.js";

export function card({ title, eyebrow, sample = false, actions, className = "", id } = {}, ...body) {
  const head = h("div", { class: "card-head" },
    h("div", {},
      eyebrow && h("div", { class: "eyebrow" }, eyebrow),
      title && h("h2", { class: "card-title" }, title)),
    h("div", { class: "card-actions" }, sample && sampleBadge(), actions));
  return h("section", { class: `card ${className}`.trim(), "data-sample": sample ? "true" : null, id }, head, h("div", { class: "card-body" }, ...body));
}
