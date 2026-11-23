import { svgEl } from "./dom.js";

// Simple 24x24 stroke icons, each a list of path commands. Inline so there are no icon-font or CDN requests.
const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0 ${r} ${r} 0 1 0 ${-2 * r} 0`;

const ICONS = {
  overview: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  market: ["M3 3v18h18", "M7 15l4-4 3 3 5-6"],
  fundamentals: ["M12 3l9 5-9 5-9-5 9-5z", "M3 13l9 5 9-5"],
  intelligence: ["M4 5h13v14H6a2 2 0 0 1-2-2V5z", "M17 9h3v8a2 2 0 0 1-2 2", "M7 9h7", "M7 13h7"],
  strategy: [circle(12, 12, 9), circle(12, 12, 4)],
  journal: ["M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z", "M5 17a3 3 0 0 1 3-3h11"],
  research: [circle(11, 11, 7), "M20 20l-4-4"],
  settings: ["M4 7h10", "M18 7h2", "M4 17h2", "M10 17h10", circle(16, 7, 2), circle(8, 17, 2)],
  "chevron-left": ["M15 6l-6 6 6 6"],
  "chevron-right": ["M9 6l6 6-6 6"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  clock: [circle(12, 12, 9), "M12 7v5l3 2"],
  ban: [circle(12, 12, 9), "M5.6 5.6l12.8 12.8"],
  "minus-circle": [circle(12, 12, 9), "M8 12h8"],
  "arrows-lr": ["M4 8h15", "M15 4l4 4-4 4", "M20 16H5", "M9 12l-4 4 4 4"],
  equal: ["M5 9h14", "M5 15h14"],
  "arrow-up": ["M12 19V5", "M6 11l6-6 6 6"],
  "arrow-down": ["M12 5v14", "M6 13l6 6 6-6"],
  flask: ["M9 3h6", "M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"],
  info: [circle(12, 12, 9), "M12 11v5", "M12 8h.01"],
  alert: ["M12 3l10 18H2L12 3z", "M12 10v4", "M12 17h.01"],
  lock: ["M6 11h12v9H6z", "M8 11V8a4 4 0 0 1 8 0v3"],
  refresh: ["M20 11a8 8 0 1 0-2 6", "M20 4v7h-7"],
  check: ["M5 12l5 5 9-10"]
};

export function icon(name, { size = 18 } = {}) {
  const paths = ICONS[name] ?? ICONS.info;
  return svgEl("svg", {
    class: "icon", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    "stroke-width": "1.75", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false"
  }, paths.map((d) => svgEl("path", { d })));
}
export const ICON_NAMES = Object.freeze(Object.keys(ICONS));
