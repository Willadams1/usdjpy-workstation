import { h } from "../dom.js";
import { SAMPLE_DATA as D } from "../sample-data.js";
import { card } from "../components/card.js";
import { sampleBanner } from "../components/sample-label.js";
import { badge, driverStateBadge, importanceBadge, linkButton, plannedButton } from "../components/badge.js";
import { driverMeter, pressureBar, strengthMeter } from "../components/gauge.js";
import { bandLabel, classifyDriver, confidenceLabel, DRIVER_STATES, pressureLabel } from "../logic/driver-state.js";
import { FEED_CATEGORIES } from "../sample-data.js";
import { formatDateTime } from "../time.js";
import { hrefFor } from "../logic/routes.js";

const categoryLabel = (id) => FEED_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export function render(ctx) {
  const tz = ctx.store.get().tz;
  const bias = D.bias;
  const biasMeta = DRIVER_STATES[bias.direction];

  const biasCard = card({ title: "Directional bias (fundamental)", eyebrow: "Summary", sample: true, className: "kpi" },
    h("div", { class: `kpi-value tone-${biasMeta.tone}` }, biasMeta.label),
    h("p", { class: "muted small" }, `Strength ${bandLabel(bias.strength)} · Confidence ${confidenceLabel(bias.confidence)}`),
    h("p", { class: "muted small" }, bias.note));

  const strengthCard = (title, currency, step, tone) => card({ title, eyebrow: "Indicator", sample: true, className: "kpi" },
    h("div", { class: "kpi-value" }, bandLabel(step)),
    strengthMeter({ step, tone, name: `${currency} strength` }),
    h("p", { class: "muted small" }, "Categorical band, not a numerical score."));

  const pressureCard = card({ title: "Relative market pressure", eyebrow: "USD vs JPY", sample: true, className: "kpi" },
    h("div", { class: "kpi-value" }, pressureLabel(D.pressure.step)),
    pressureBar(D.pressure.step));

  const driverRows = D.drivers.map((d) => {
    const key = classifyDriver(d);
    return h("li", { class: "row" },
      h("div", {}, h("div", { class: "row-title" }, d.name), h("div", { class: "muted small" }, d.scope)),
      h("div", { class: "row-end" }, driverMeter(d, key, DRIVER_STATES[key].tone), driverStateBadge(key)));
  });
  const driversCard = card({ title: "Fundamental drivers", eyebrow: "Six driver groups", sample: true,
    actions: linkButton("Open fundamentals", hrefFor("fundamentals")) }, h("ul", { class: "list" }, ...driverRows));

  const eventsCard = card({ title: "Economic events preview", eyebrow: "Calendar", sample: true },
    h("ul", { class: "list" }, ...D.events.slice(0, 4).map((e) => h("li", { class: "row" },
      h("div", {}, h("div", { class: "row-title" }, e.title), h("div", { class: "muted small" }, formatDateTime(e.at, tz))),
      h("div", { class: "row-end" }, badge(e.currency), importanceBadge(e.importance))))),
    h("p", { class: "muted small" }, "A real calendar source and SAST conversion are planned for M3."));

  const readinessCard = card({ title: "Strategy readiness", eyebrow: "Discipline" },
    h("div", { class: "row-end" }, badge("Not assessed", { tone: "neutral" })),
    h("p", { class: "muted" }, "The readiness assessment (Ready, Caution or Observe-only) is not available yet. Until then no readiness result is shown."),
    plannedButton("Start assessment", "M6"));

  const intelCard = card({ title: "Recent intelligence", eyebrow: "Feed preview", sample: true,
    actions: linkButton("Open intelligence", hrefFor("intelligence")) },
    h("ul", { class: "list" }, ...D.feed.slice(0, 3).map((f) => h("li", { class: "row" },
      h("div", {}, h("div", { class: "row-title" }, f.title), h("div", { class: "muted small" }, `${categoryLabel(f.category)} · ${f.evidenceType} · ${formatDateTime(f.at, tz)}`)),
      h("div", { class: "row-end" }, importanceBadge(f.importance))))));

  const journalCard = card({ title: "Trade journal", eyebrow: "Quick access" },
    h("p", { class: "muted" }, "Review the journal layout. Trade capture and storage are not available in this milestone."),
    h("div", { class: "btn-row" }, linkButton("Open journal", hrefFor("journal"), { primary: true }), plannedButton("Log a trade", "M7")));

  return h("div", { class: "page" },
    sampleBanner(),
    h("div", { class: "grid grid-4" }, biasCard, strengthCard("USD strength", "USD", D.strength.usd, "usd"), strengthCard("JPY strength", "JPY", D.strength.jpy, "jpy"), pressureCard),
    h("div", { class: "grid grid-main" }, driversCard, h("div", { class: "stack" }, eventsCard, readinessCard)),
    h("div", { class: "grid grid-2" }, intelCard, journalCard));
}
