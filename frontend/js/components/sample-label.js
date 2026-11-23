import { h } from "../dom.js";
import { icon } from "../icons.js";
import { SAMPLE_NOTICE } from "../sample-data.js";

// Small label attached to every card that shows demonstration values.
export function sampleBadge(text = "Sample") {
  return h("span", { class: "badge badge-sample", title: SAMPLE_NOTICE }, icon("flask", { size: 12 }), text);
}

// Page-level banner shown at the top of any page containing sample data.
export function sampleBanner(extra) {
  return h("div", { class: "notice tone-caution", role: "note" },
    icon("flask", { size: 18 }),
    h("div", {}, h("strong", {}, "Sample data."), " Illustrative only. Not live market information.", extra ? ` ${extra}` : ""));
}
