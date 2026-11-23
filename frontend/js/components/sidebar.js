import { h } from "../dom.js";
import { icon } from "../icons.js";
import { hrefFor } from "../logic/routes.js";

export function buildSidebar({ routes, onToggle, onClose }) {
  const toggle = h("button", { class: "icon-btn sidebar-toggle", type: "button", "aria-controls": "sidebar", onClick: onToggle });
  const close = h("button", { class: "icon-btn drawer-close", type: "button", "aria-label": "Close navigation", onClick: onClose }, icon("close"));

  const links = routes.map((r) => h("a", { class: "nav-item", href: hrefFor(r.id), "data-route": r.id, title: r.title },
    icon(r.icon, { size: 20 }), h("span", { class: "nav-label" }, r.title)));

  const element = h("aside", { id: "sidebar", class: "sidebar" },
    h("div", { class: "sidebar-head" },
      h("div", { class: "brand" },
        h("span", { class: "brand-mark", "aria-hidden": "true" }, "UJ"),
        h("div", { class: "brand-text nav-label" }, h("strong", {}, "USD/JPY"), h("small", {}, "WORKSTATION"))),
      close),
    h("div", { class: "nav-heading nav-label", "aria-hidden": "true" }, "WORKSPACE"),
    h("nav", { class: "nav", "aria-label": "Primary" }, h("ul", {}, ...links.map((l) => h("li", {}, l)))),
    h("div", { class: "sidebar-foot" }, toggle, h("span", { class: "sidebar-note nav-label" }, h("span", { class: "status-dot", "aria-hidden": "true" }), "Research mode · Sample data")));

  function update({ collapsed, activeId }) {
    links.forEach((l) => (l.dataset.route === activeId ? l.setAttribute("aria-current", "page") : l.removeAttribute("aria-current")));
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    toggle.replaceChildren(icon(collapsed ? "chevron-right" : "chevron-left"), h("span", { class: "nav-label" }, "Collapse"));
  }

  return { element, update, firstLink: links[0], closeButton: close };
}
