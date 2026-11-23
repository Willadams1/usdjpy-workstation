import { h } from "../dom.js";
import { card } from "../components/card.js";
import { badge } from "../components/badge.js";
import { dataTable } from "../components/table.js";
import { emptyState, notice } from "../components/states.js";
import { segmented } from "../components/filters.js";
import { SESSIONS, isSessionActive, tzLabel, utcHourInTz } from "../time.js";

const TIMEFRAMES = [{ value: "15m", label: "15m" }, { value: "1H", label: "1H" }, { value: "4H", label: "4H" }, { value: "1D", label: "1D" }];
const pad = (n) => String(n).padStart(2, "0");

export function render(ctx) {
  const tz = ctx.store.get().tz;

  const selection = h("p", { class: "muted small" });
  const paintSelection = () => (selection.textContent = `Selected timeframe: ${ctx.store.get().timeframe}. The selection does not change any data yet because no chart is connected.`);
  paintSelection();

  const chart = card({ title: "USD/JPY chart", eyebrow: "Price action",
    actions: segmented({ label: "Chart timeframe", options: TIMEFRAMES, value: ctx.store.get().timeframe, onChange: (v) => { ctx.store.set({ timeframe: v }); paintSelection(); } }) },
    h("div", { class: "chart-placeholder" },
      h("div", { class: "chart-symbol" }, "USD/JPY"), h("strong", {}, "Chart placeholder"),
      h("p", { class: "muted" }, "No price data is connected and no candles are drawn. The TradingView embed is planned for M3.")),
    selection);

  const biasPanel = (title) => card({ title, eyebrow: "Directional bias" },
    badge("Not assessed"), h("p", { class: "muted" }, "Technical bias is recorded through the strategy workflow, which is not built yet."));

  const structure = card({ title: "Market structure", eyebrow: "Placeholder" },
    h("dl", { class: "kv" },
      ...["Trend structure", "Most recent change of character", "Premium / discount position"].flatMap((k) => [h("dt", {}, k), h("dd", {}, badge("Not available"))])));

  const liquidity = card({ title: "Liquidity and fair value gaps", eyebrow: "Placeholder" },
    h("div", { class: "grid grid-2" },
      emptyState({ title: "No liquidity levels", message: "Liquidity analysis is not available yet." }),
      emptyState({ title: "No fair value gaps", message: "Fair value gap analysis is not available yet." })));

  const sessionsHost = h("div");
  function paintSessions() {
    const now = new Date();
    sessionsHost.replaceChildren(dataTable({
      caption: "Approximate market sessions",
      columns: [
        { key: "name", label: "Session" },
        { key: "utc", label: "Approx. window (UTC)" },
        { key: "local", label: `Window (${tzLabel(tz)})` },
        { key: "now", label: "Now", render: (r) => (r.active ? badge("Active", { tone: "pos", iconName: "check" }) : badge("Closed")) }
      ],
      rows: SESSIONS.map((s) => ({
        name: s.name,
        utc: `${pad(s.startUtc)}:00–${pad(s.endUtc)}:00`,
        local: `${utcHourInTz(s.startUtc, tz)}–${utcHourInTz(s.endUtc, tz)}`,
        active: isSessionActive(s, now)
      }))
    }));
  }
  paintSessions();
  const timer = setInterval(paintSessions, 30_000);
  ctx.onCleanup(() => clearInterval(timer));

  const sessions = card({ title: "Market sessions", eyebrow: "Informational" },
    sessionsHost,
    h("p", { class: "muted small" }, "Approximate reference windows, unverified, with no daylight-saving adjustment. Active status uses your device clock."),
    h("p", { class: "muted small" }, "Historical practice noted in the project brief: 13:00–16:00 SAST. This is unconfirmed and is not an active rule."));

  return h("div", { class: "page" },
    notice({ tone: "info", title: "No market data connected.", text: "This page shows layout only. Nothing here is a price, a signal or a live reading." }),
    chart,
    h("div", { class: "grid grid-2" }, biasPanel("Daily bias"), biasPanel("4H bias")),
    h("div", { class: "grid grid-2" }, structure, liquidity),
    sessions);
}
