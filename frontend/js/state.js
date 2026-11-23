// Tiny observable store. Interface preferences persist in localStorage (interface settings only).
import { PREF_DEFAULTS, sanitizePrefs } from "./logic/prefs.js";

const STORAGE_KEY = "usdjpy.ui.prefs";

function loadPrefs() {
  try {
    return sanitizePrefs(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return sanitizePrefs(null); // storage unavailable or corrupt: fall back to defaults
  }
}

function savePrefs(state) {
  try {
    const { sidebarCollapsed, tz, density } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sidebarCollapsed, tz, density }));
  } catch {
    /* storage unavailable: preferences simply will not persist */
  }
}

export function createStore() {
  let state = {
    ...loadPrefs(),
    timeframe: "4H",
    drawerOpen: false,
    health: { status: "loading", data: null, error: null, checkedAt: null }
  };
  const listeners = new Set();

  return {
    get: () => state,
    set(patch) {
      const prev = state;
      state = { ...state, ...patch };
      if (["sidebarCollapsed", "tz", "density"].some((k) => prev[k] !== state[k])) savePrefs(state);
      listeners.forEach((fn) => fn(state, prev));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    resetPrefs() {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      this.set({ ...PREF_DEFAULTS });
    }
  };
}
