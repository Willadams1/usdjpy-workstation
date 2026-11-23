import { h } from "./dom.js";
import { createStore } from "./state.js";
import { createRouter } from "./router.js";
import { PAGES } from "./pages/index.js";
import { ROUTES } from "./logic/routes.js";
import { effectiveCollapsed } from "./logic/prefs.js";
import { buildSidebar } from "./components/sidebar.js";
import { buildHeader } from "./components/header.js";
import { checkHealth } from "./health.js";

const DESKTOP_MIN = 768; // below this width the sidebar becomes an off-canvas drawer

export function start(root) {
  const store = createStore();
  let activeId = null;
  let pageTitle = "";

  const isMobile = () => window.innerWidth < DESKTOP_MIN;
  const collapsed = () => effectiveCollapsed(store.get().sidebarCollapsed, window.innerWidth);

  const sidebar = buildSidebar({
    routes: ROUTES,
    onToggle: () => store.set({ sidebarCollapsed: !collapsed() }),
    onClose: () => closeDrawer()
  });
  const header = buildHeader({ onMenu: () => (store.get().drawerOpen ? closeDrawer() : openDrawer()) });
  const backdrop = h("div", { class: "backdrop", onClick: () => closeDrawer() });
  const main = h("main", { id: "main", class: "main", tabindex: "-1" });
  const announcer = h("div", { class: "visually-hidden", role: "status", "aria-live": "polite" });
  const skip = h("button", { class: "skip-link", type: "button", onClick: () => main.focus() }, "Skip to content");
  const column = h("div", { class: "main-col" }, header.element, main);

  root.replaceChildren(skip, sidebar.element, backdrop, column, announcer);

  function openDrawer() {
    store.set({ drawerOpen: true });
    sidebar.firstLink.focus();
  }
  function closeDrawer({ restoreFocus = true } = {}) {
    if (!store.get().drawerOpen) return;
    store.set({ drawerOpen: false });
    if (restoreFocus) header.menuButton.focus();
  }

  async function recheckHealth() {
    store.set({ health: { ...store.get().health, status: "loading" } });
    const result = await checkHealth();
    store.set({ health: { status: result.status, data: result.data ?? null, error: result.error ?? null, checkedAt: Date.now() } });
  }

  const router = createRouter({
    outlet: main, pages: PAGES, store, recheckHealth,
    announce: (msg) => { announcer.textContent = msg; },
    onNavigate: ({ route, title }) => {
      activeId = route?.id ?? null;
      pageTitle = title;
      document.title = `${title} · USD/JPY Workstation`;
      closeDrawer({ restoreFocus: false });
      paint();
    }
  });

  function paint() {
    const s = store.get();
    root.dataset.sidebar = collapsed() ? "collapsed" : "expanded";
    root.dataset.drawer = s.drawerOpen ? "open" : "closed";
    root.dataset.density = s.density;
    // While the drawer is open, the rest of the page is inert so keyboard focus stays in the navigation.
    column.inert = s.drawerOpen;
    sidebar.update({ collapsed: collapsed() && !isMobile(), activeId });
    header.update({ title: pageTitle, tz: s.tz, now: new Date(), health: s.health, drawerOpen: s.drawerOpen });
  }

  store.subscribe((s, prev) => {
    if (s.tz !== prev.tz) router.refresh();
    paint();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && store.get().drawerOpen) closeDrawer();
  });

  let wasMobile = isMobile();
  window.addEventListener("resize", () => {
    if (wasMobile !== isMobile()) { wasMobile = isMobile(); closeDrawer({ restoreFocus: false }); }
    paint();
  });

  setInterval(paint, 15_000); // keeps the device-clock chip current
  setInterval(recheckHealth, 60_000);

  router.start();
  recheckHealth();
}
