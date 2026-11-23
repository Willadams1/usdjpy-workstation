import { h } from "./dom.js";
import { errorState, emptyState } from "./components/states.js";
import { linkButton } from "./components/badge.js";
import { hrefFor, matchRoute, DEFAULT_ROUTE } from "./logic/routes.js";

// Hash router: navigation swaps the page content without reloading the app or touching the server.
export function createRouter({ outlet, pages, store, recheckHealth, onNavigate, announce }) {
  let cleanups = [];
  let started = false;

  const ctx = {
    store,
    recheckHealth,
    refresh: () => render({ keepFocus: true }),
    onCleanup: (fn) => cleanups.push(fn),
    subscribe: (fn) => cleanups.push(store.subscribe(fn))
  };

  function render({ keepFocus = false, userNavigated = false } = {}) {
    const focusKey = keepFocus ? document.activeElement?.dataset?.focusKey : null;
    cleanups.splice(0).forEach((fn) => { try { fn(); } catch { /* ignore cleanup errors */ } });

    const match = matchRoute(location.hash);
    if (match.status === "default") history.replaceState(null, "", hrefFor(DEFAULT_ROUTE));

    if (!match.route) {
      outlet.replaceChildren(emptyState({ title: "Section not found", message: "That address does not match any section.", action: linkButton("Go to Overview", hrefFor(DEFAULT_ROUTE), { primary: true }) }));
      onNavigate({ route: null, title: "Not found" });
    } else {
      try {
        outlet.replaceChildren(pages[match.route.id](ctx));
      } catch (err) {
        console.error(`Failed to render "${match.route.id}":`, err);
        outlet.replaceChildren(errorState({ title: "This section failed to load", message: "An unexpected error occurred while building the page.", onRetry: () => render({ userNavigated: true }) }));
      }
      onNavigate({ route: match.route, title: match.route.title });
    }

    if (focusKey) outlet.querySelector(`[data-focus-key="${focusKey}"]`)?.focus();
    if (userNavigated) {
      window.scrollTo(0, 0);
      announce(`${match.route?.title ?? "Section not found"} page loaded`);
      document.getElementById("page-title")?.focus();
    }
  }

  return {
    start() {
      if (started) return;
      started = true;
      window.addEventListener("hashchange", () => render({ userNavigated: true }));
      render();
    },
    refresh: ctx.refresh
  };
}
