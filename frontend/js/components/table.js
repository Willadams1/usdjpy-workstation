import { h } from "../dom.js";

// columns: [{ key, label, render?(row) }]. Wide tables scroll inside their own region.
export function dataTable({ caption, columns, rows }) {
  const head = h("tr", {}, ...columns.map((c) => h("th", { scope: "col" }, c.label)));
  const body = rows.map((row) => h("tr", {}, ...columns.map((c) => h("td", {}, c.render ? c.render(row) : row[c.key] ?? "—"))));
  return h("div", { class: "table-wrap", role: "region", "aria-label": caption, tabindex: "0" },
    h("table", { class: "table" }, h("caption", { class: "visually-hidden" }, caption), h("thead", {}, head), h("tbody", {}, ...body)));
}
