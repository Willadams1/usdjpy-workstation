// Minimal DOM helpers. All text goes in via textContent/createTextNode, never as parsed markup.
const SVG_NS = "http://www.w3.org/2000/svg";

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null) continue;
    if (value === false) {
      if (key.startsWith("aria-")) el.setAttribute(key, "false");
      continue;
    }
    if (key === "class") el.setAttribute("class", value);
    else if (key === "dataset") Object.assign(el.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === true) el.setAttribute(key, key.startsWith("aria-") ? "true" : "");
    else el.setAttribute(key, String(value));
  }
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  applyProps(el, props);
  return append(el, children);
}

export function svgEl(tag, props, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  applyProps(el, props);
  return append(el, children);
}
