import { h } from "../dom.js";
import { icon } from "../icons.js";

export function emptyState({ title, message, action } = {}) {
  return h("div", { class: "state state-empty" }, icon("info", { size: 22 }), h("strong", {}, title), message && h("p", {}, message), action);
}

export function loadingState(message = "Loading…") {
  return h("div", { class: "state state-loading", role: "status" }, h("span", { class: "spinner", "aria-hidden": "true" }), h("span", {}, message));
}

export function errorState({ title = "Something went wrong", message, onRetry } = {}) {
  return h("div", { class: "state state-error", role: "alert" },
    icon("alert", { size: 22 }), h("strong", {}, title), message && h("p", {}, message),
    onRetry && h("button", { class: "btn", type: "button", onClick: onRetry }, "Try again"));
}

export function notice({ tone = "info", title, text, iconName = "info" } = {}) {
  return h("div", { class: `notice tone-${tone}`, role: "note" }, icon(iconName, { size: 18 }), h("div", {}, title && h("strong", {}, `${title} `), text));
}
