import { h } from "../dom.js";
import { icon } from "../icons.js";
import { statusChip } from "./badge.js";
import { activeSessions, formatClock, tzLabel } from "../time.js";

export function buildHeader({ onMenu }) {
  const menu = h("button", { class: "icon-btn menu-btn", type: "button", "aria-controls": "sidebar", "aria-expanded": "false", "aria-label": "Open navigation", onClick: onMenu }, icon("menu"));
  const title = h("h1", { class: "page-title", id: "page-title", tabindex: "-1" }, "");
  const chips = h("div", { class: "chips", role: "group", "aria-label": "Clock and system status" });
  const element = h("header", { class: "topbar" },
    h("div", { class: "topbar-left" }, menu,
      h("div", {}, h("div", { class: "eyebrow" }, "USD/JPY Workstation", h("span", { class: "instrument" }, "USD/JPY")), title)),
    chips);

  function healthChip(health) {
    if (health.status === "ok") return statusChip({ label: "Backend", value: "Connected", tone: "pos", iconName: "check", title: "Backend /api/health responded OK" });
    if (health.status === "error") return statusChip({ label: "Backend", value: "Unreachable", tone: "neg", iconName: "alert", title: health.error ?? "Health check failed" });
    return statusChip({ label: "Backend", value: "Checking…", tone: "neutral", iconName: "refresh" });
  }

  function update({ title: pageTitle, tz, now, health, drawerOpen }) {
    title.textContent = pageTitle;
    menu.setAttribute("aria-expanded", String(Boolean(drawerOpen)));
    const sessions = activeSessions(now).map((s) => s.name).join(" + ") || "None";
    chips.replaceChildren(
      statusChip({ label: `${formatClock(now, tz)} ${tzLabel(tz)}`, value: "device clock", tone: "neutral", iconName: "clock", title: "Your device's clock converted to the selected timezone. Not a market feed." }),
      statusChip({ label: "Session", value: `${sessions} (approx.)`, tone: "neutral", title: "Approximate reference windows, informational only." }),
      healthChip(health),
      statusChip({ label: "Market data", value: "Not connected", tone: "caution", iconName: "ban", title: "No market data source is connected in this milestone." }),
      statusChip({ label: "Sample data", value: "Paper only", tone: "caution", iconName: "flask", title: "All values shown are demonstration data. No trading is possible." }));
  }

  return { element, update, menuButton: menu, titleElement: title };
}
