// Pure filter helpers shared by the Intelligence, Journal and Research pages.
const norm = (v) => String(v ?? "").toLowerCase();

export function matchesQuery(item, query, fields) {
  const q = norm(query).trim();
  if (!q) return true;
  return fields.some((f) => norm(item[f]).includes(q));
}

const is = (value, wanted) => wanted === "all" || wanted === "" || wanted == null || value === wanted;

export function filterFeed(items, { category = "all", importance = "all", query = "" } = {}) {
  return items.filter((i) => is(i.category, category) && is(i.importance, importance) && matchesQuery(i, query, ["title", "summary", "evidenceType"]));
}

export function filterJournal(rows, { outcome = "all", direction = "all" } = {}) {
  return rows.filter((r) => is(r.outcome, outcome) && is(r.direction, direction));
}

export function filterResearch(items, { type = "all", query = "" } = {}) {
  return items.filter((i) => is(i.type, type) && matchesQuery(i, query, ["title", "summary"]));
}
