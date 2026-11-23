import { h } from "../dom.js";
import { SAMPLE_DATA as D, FEED_CATEGORIES } from "../sample-data.js";
import { card } from "../components/card.js";
import { sampleBadge, sampleBanner } from "../components/sample-label.js";
import { badge, importanceBadge } from "../components/badge.js";
import { emptyState } from "../components/states.js";
import { searchField, segmented, selectField } from "../components/filters.js";
import { filterFeed } from "../logic/filters.js";
import { formatDateTime } from "../time.js";

const categoryLabel = (id) => FEED_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function render(ctx) {
  const tz = ctx.store.get().tz;
  const filters = { category: "all", importance: "all", query: "" };
  const results = h("div", { class: "stack" });
  const count = h("p", { class: "muted small", "aria-live": "polite" });

  function paint() {
    const items = filterFeed(D.feed, filters);
    count.textContent = `Showing ${items.length} of ${D.feed.length} sample items`;
    results.replaceChildren(...(items.length
      ? items.map((f) => h("article", { class: "feed-item", "data-sample": "true" },
          h("div", { class: "badge-row" }, sampleBadge(), badge(categoryLabel(f.category), { tone: "info" }), badge(f.evidenceType), importanceBadge(f.importance)),
          h("h3", {}, f.title), h("p", { class: "muted" }, f.summary),
          h("div", { class: "muted small" }, `Published ${formatDateTime(f.at, tz)} (sample timestamp) · Source reference placeholder`)))
      : [emptyState({ title: "No items match these filters", message: "Clear a filter or change the search text." })]));
  }

  const controls = h("div", { class: "filters" },
    segmented({ label: "Category", options: [{ value: "all", label: "All" }, ...FEED_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))], value: "all", onChange: (v) => { filters.category = v; paint(); } }),
    h("div", { class: "filters-row" },
      selectField({ label: "Importance", value: "all", options: [{ value: "all", label: "All" }, { value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }], onChange: (v) => { filters.importance = v; paint(); } }),
      searchField({ label: "Search", placeholder: "Search sample items", onInput: (v) => { filters.query = v; paint(); } })));
  paint();

  const calendar = card({ title: "Economic calendar", eyebrow: "Sample events", sample: true },
    h("ul", { class: "list" }, ...D.events.map((e) => h("li", { class: "row" },
      h("div", {}, h("div", { class: "row-title" }, e.title), h("div", { class: "muted small" }, formatDateTime(e.at, tz))),
      h("div", { class: "row-end" }, badge(e.currency), importanceBadge(e.importance))))),
    h("p", { class: "muted small" }, "A real calendar source and SAST conversion are planned for M3."));

  return h("div", { class: "page" },
    sampleBanner("Dates are fictional and every entry is a placeholder."),
    h("div", { class: "grid grid-feed" },
      h("div", { class: "stack" }, card({ title: "Research feed", eyebrow: "Intelligence" }, controls, count, results)),
      calendar));
}
