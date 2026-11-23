// Validation of stored interface preferences. Pure: no storage access.
export const TIMEZONE_KEYS = Object.freeze(["SAST", "UTC"]);
export const DENSITIES = Object.freeze(["comfortable", "compact"]);

export const PREF_DEFAULTS = Object.freeze({ sidebarCollapsed: null, tz: "SAST", density: "comfortable" });

export function sanitizePrefs(raw) {
  const r = raw && typeof raw === "object" ? raw : {};
  return {
    sidebarCollapsed: typeof r.sidebarCollapsed === "boolean" ? r.sidebarCollapsed : PREF_DEFAULTS.sidebarCollapsed,
    tz: TIMEZONE_KEYS.includes(r.tz) ? r.tz : PREF_DEFAULTS.tz,
    density: DENSITIES.includes(r.density) ? r.density : PREF_DEFAULTS.density
  };
}

// Sidebar: a stored choice wins; otherwise collapse on narrower (tablet) widths.
export function effectiveCollapsed(pref, width) {
  return typeof pref === "boolean" ? pref : width < 1024;
}
