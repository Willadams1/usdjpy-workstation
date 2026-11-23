import { h } from "../dom.js";
import { SAMPLE_DATA as D, RESEARCH_TYPES } from "../sample-data.js";
import { card } from "../components/card.js";
import { sampleBadge, sampleBanner } from "../components/sample-label.js";
import { badge, plannedButton } from "../components/badge.js";
import { emptyState } from "../components/states.js";
import { searchField, selectField } from "../components/filters.js";
import { filterResearch } from "../logic/filters.js";
import { formatDateTime } from "../time.js";

export function render(ctx) {
  const tz = ctx.store.get().tz;
  const filters = { type: "all", query: "" };
  const results = h("div", { class: "stack" });
  const count = h("p", { class: "muted small", "aria-live": "polite" });

  function paint() {
    const items = filterResearch(D.research, filters);
    count.textContent = `Showing ${items.length} of ${D.research.length} sample entries`;
    results.replaceChildren(...(items.length
      ? items.map((r) => h("article", { class: "feed-item", "data-sample": "true" },
          h("div", { class: "badge-row" }, sampleBadge(), badge(r.type, { tone: "info" })),
          h("h3", {}, r.title), h("p", { class: "muted" }, r.summary),
          h("div", { class: "muted small" }, `Recorded ${formatDateTime(r.at, tz)} (sample timestamp)`)))
      : [emptyState({ title: "No entries match", message: "Clear the filter or change the search text." })]));
  }

  const library = card({ title: "Research library", eyebrow: "Historical research" },
    h("div", { class: "filters-row" },
      selectField({ label: "Type", value: "all", options: [{ value: "all", label: "All types" }, ...RESEARCH_TYPES.map((t) => ({ value: t, label: t }))], onChange: (v) => { filters.type = v; paint(); } }),
      searchField({ label: "Search", placeholder: "Search sample entries", onInput: (v) => { filters.query = v; paint(); } })),
    count, results);
  paint();

  const comparison = card({ title: "Historical comparison", eyebrow: "Placeholder" },
    h("p", { class: "muted" }, "Compare two periods side by side. Historical data retrieval is not available in this milestone."),
    h("fieldset", { class: "form-grid", disabled: true },
      h("legend", { class: "visually-hidden" }, "Historical comparison (disabled)"),
      selectField({ label: "Period A", value: "", options: [{ value: "", label: "Not available" }], disabled: true }),
      selectField({ label: "Period B", value: "", options: [{ value: "", label: "Not available" }], disabled: true })),
    plannedButton("Compare", "later milestone"));

  return h("div", { class: "page" }, sampleBanner("Dates are fictional and no historical data is retrieved."), h("div", { class: "grid grid-feed" }, library, comparison));
}
