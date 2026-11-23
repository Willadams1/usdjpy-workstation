import { h } from "../dom.js";
import { card } from "../components/card.js";
import { badge, plannedButton } from "../components/badge.js";
import { notice } from "../components/states.js";
import { segmented, selectField } from "../components/filters.js";
import { effectiveCollapsed, DENSITIES, TIMEZONE_KEYS } from "../logic/prefs.js";
import { TIMEZONES, formatDateTime } from "../time.js";

const DATA_SOURCES = [
  { name: "Market data provider", milestone: "M3" },
  { name: "Economic calendar provider", milestone: "M3" },
  { name: "Official economic data sources", milestone: "M4" },
  { name: "News and intelligence sources", milestone: "M5" },
  { name: "AI analysis provider", milestone: "M5" }
];

const kv = (rows) => h("dl", { class: "kv" }, ...rows.flatMap(([k, v]) => [h("dt", {}, k), h("dd", {}, v)]));

export function render(ctx) {
  const { store } = ctx;
  const s = store.get();

  const preferences = card({ title: "Application preferences", eyebrow: "Interface" },
    h("div", { class: "field" }, h("span", { class: "field-label" }, "Sidebar"),
      segmented({ label: "Sidebar", value: effectiveCollapsed(s.sidebarCollapsed, window.innerWidth) ? "collapsed" : "expanded",
        options: [{ value: "expanded", label: "Expanded" }, { value: "collapsed", label: "Collapsed" }],
        onChange: (v) => store.set({ sidebarCollapsed: v === "collapsed" }) })),
    h("button", { class: "btn", type: "button", "data-focus-key": "reset", onClick: () => store.resetPrefs() }, "Reset interface preferences"),
    h("p", { class: "muted small" }, "Preferences are stored only in this browser."));

  const timezone = card({ title: "Timezone", eyebrow: "Display" },
    selectField({ label: "Display timezone", value: s.tz, focusKey: "tz", options: TIMEZONE_KEYS.map((k) => ({ value: k, label: `${TIMEZONES[k].label} (${TIMEZONES[k].iana})${k === "SAST" ? " — default" : ""}` })), onChange: (v) => store.set({ tz: v }) }),
    h("p", { class: "muted small" }, "Timestamps are held in UTC internally and displayed in the selected timezone."));

  const sources = card({ title: "Data sources", eyebrow: "Configuration placeholders" },
    notice({ tone: "info", text: "No data sources are connected. API keys are not requested or stored in this milestone." }),
    h("ul", { class: "list" }, ...DATA_SOURCES.map((d) => h("li", { class: "row" },
      h("div", {}, h("div", { class: "row-title" }, d.name), badge("Not configured")), plannedButton("Configure", d.milestone)))));

  const display = card({ title: "Display preferences", eyebrow: "Display" },
    selectField({ label: "Density", value: s.density, focusKey: "density", options: DENSITIES.map((d) => ({ value: d, label: d[0].toUpperCase() + d.slice(1) })), onChange: (v) => store.set({ density: v }) }));

  const infoHost = h("div");
  function paintInfo() {
    const { health, tz } = store.get();
    const d = health.data;
    infoHost.replaceChildren(
      kv([
        ["Interface milestone", "M1 — Workstation interface (sample data)"],
        ["Backend status", health.status === "ok" ? badge("Connected", { tone: "pos" }) : health.status === "error" ? badge(`Unreachable (${health.error})`, { tone: "neg" }) : badge("Checking…")],
        ["Application", d?.application ?? "—"],
        ["Server mode", d?.mode ?? "—"],
        ["Trading execution", d ? (d.trading_execution === false ? "Disabled (research and paper trading only)" : "Unexpected value: check the backend") : "—"],
        ["Server time at last check", d ? formatDateTime(d.timestamp, tz) : "—"],
        ["Market data", "Not connected"]
      ]),
      h("button", { class: "btn", type: "button", onClick: () => ctx.recheckHealth() }, "Recheck backend"));
  }
  paintInfo();
  ctx.subscribe((cur, prev) => { if (cur.health !== prev.health || cur.tz !== prev.tz) paintInfo(); });

  const system = card({ title: "System information", eyebrow: "Status" }, infoHost);

  return h("div", { class: "page" }, h("div", { class: "grid grid-2" }, preferences, timezone, sources, display, system));
}
