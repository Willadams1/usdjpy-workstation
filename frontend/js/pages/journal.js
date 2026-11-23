import { h } from "../dom.js";
import { SAMPLE_DATA as D } from "../sample-data.js";
import { card } from "../components/card.js";
import { sampleBanner } from "../components/sample-label.js";
import { badge, plannedButton } from "../components/badge.js";
import { dataTable } from "../components/table.js";
import { emptyState, notice } from "../components/states.js";
import { selectField } from "../components/filters.js";
import { filterJournal } from "../logic/filters.js";
import { formatDateTime } from "../time.js";

const ANALYTICS = ["Win rate", "Average R", "Expectancy", "Drawdown", "Profit factor", "Strategy compliance", "Fundamental and technical alignment"];

export function render(ctx) {
  const tz = ctx.store.get().tz;
  const filters = { outcome: "all", direction: "all" };
  const host = h("div");

  const columns = [
    { key: "at", label: "Date and session", render: (r) => h("div", {}, badge("Demo", { tone: "caution" }), h("div", {}, formatDateTime(r.at, tz)), h("div", { class: "muted small" }, r.session)) },
    { key: "instrument", label: "Instrument" },
    { key: "direction", label: "Direction" },
    { key: "entry", label: "Entry" },
    { key: "exit", label: "Exit" },
    { key: "rr", label: "Planned R:R" },
    { key: "result", label: "Result" },
    { key: "outcome", label: "Outcome", render: (r) => badge(r.outcome, { tone: r.outcome === "Win" ? "pos" : "neg" }) },
    { key: "notes", label: "Notes" },
    { key: "snapshot", label: "Fundamental context", render: () => badge("Snapshot placeholder") }
  ];

  function paint() {
    const rows = filterJournal(D.journal, filters);
    host.replaceChildren(rows.length
      ? dataTable({ caption: "Trade history (demonstration records)", columns, rows })
      : emptyState({ title: "No trades match these filters", message: "Change or clear a filter." }));
  }
  paint();

  const history = card({ title: "Trade history", eyebrow: "Journal", sample: true },
    h("div", { class: "filters-row" },
      selectField({ label: "Outcome", value: "all", options: [{ value: "all", label: "All" }, { value: "Win", label: "Win" }, { value: "Loss", label: "Loss" }], onChange: (v) => { filters.outcome = v; paint(); } }),
      selectField({ label: "Direction", value: "all", options: [{ value: "all", label: "All" }, { value: "Long", label: "Long" }, { value: "Short", label: "Short" }], onChange: (v) => { filters.direction = v; paint(); } })),
    host,
    h("p", { class: "muted small" }, "Demonstration records only. Prices and results are fictional."));

  const field = (label, control) => h("label", { class: "field" }, h("span", {}, label), control);
  const form = card({ title: "New entry", eyebrow: "Trade capture" },
    notice({ tone: "info", text: "Trade capture and storage are planned for M7. These fields are disabled and nothing is saved." }),
    h("fieldset", { class: "form-grid", disabled: true },
      h("legend", { class: "visually-hidden" }, "New trade entry (disabled)"),
      field("Direction", h("select", { class: "input" }, h("option", {}, "Long"), h("option", {}, "Short"))),
      field("Entry price", h("input", { class: "input", type: "text" })),
      field("Exit price", h("input", { class: "input", type: "text" })),
      field("Stop", h("input", { class: "input", type: "text" })),
      field("Target", h("input", { class: "input", type: "text" })),
      field("Notes", h("textarea", { class: "input", rows: "2" }))),
    plannedButton("Save entry", "M7"));

  const analytics = card({ title: "Performance analytics", eyebrow: "Planned" },
    h("p", { class: "muted" }, "Metrics need recorded trades and a sample-size warning. They are not calculated from the demonstration records."),
    dataTable({ caption: "Planned analytics metrics", columns: [{ key: "m", label: "Metric" }, { key: "v", label: "Value", render: () => badge("Not calculated") }, { key: "p", label: "Status", render: () => badge("Planned · M8") }], rows: ANALYTICS.map((m) => ({ m })) }));

  return h("div", { class: "page" }, sampleBanner("Demo records are fictional."), history, h("div", { class: "grid grid-2" }, form, analytics));
}
