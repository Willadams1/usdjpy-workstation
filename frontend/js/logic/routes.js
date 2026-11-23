// Single source of truth for the eight sections. Pure: no DOM access.
export const ROUTES = Object.freeze([
  { id: "overview", title: "Overview", icon: "overview" },
  { id: "market", title: "Market", icon: "market" },
  { id: "fundamentals", title: "Fundamentals", icon: "fundamentals" },
  { id: "intelligence", title: "Intelligence", icon: "intelligence" },
  { id: "strategy", title: "Strategy", icon: "strategy" },
  { id: "journal", title: "Journal", icon: "journal" },
  { id: "research", title: "Research", icon: "research" },
  { id: "settings", title: "Settings", icon: "settings" }
]);

export const DEFAULT_ROUTE = "overview";

export const hrefFor = (id) => `#/${id}`;

// Accepts "#/market", "#market" (old M0 anchors) and "" (default).
export function matchRoute(hash) {
  const raw = String(hash ?? "")
    .replace(/^#\/?/, "")
    .split(/[?#]/)[0]
    .replace(/\/+$/, "")
    .toLowerCase();
  if (raw === "") return { status: "default", route: ROUTES[0] };
  const route = ROUTES.find((r) => r.id === raw);
  return route ? { status: "ok", route } : { status: "not-found", route: null };
}
