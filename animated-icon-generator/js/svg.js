
import { buildInlineCss } from "./anim.js?v=20260815c";

const SVG_NS = "http://www.w3.org/2000/svg";

const ROOT_ATTRS = {
  viewBox: "0 0 24 24",
  fill: "none",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

function partAttrs(part, animated) {
  return {
    ...part.attrs,
    ...(animated ? part.animAttrs : null),
    ...(part.part ? { class: `p-${part.part}` } : null),
  };
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function attrsToString(attrs) {
  return Object.keys(attrs)
    .map((name) => ` ${name}="${escapeAttr(attrs[name])}"`)
    .join("");
}

export function createIconSvg(icon, { size, color = "currentColor" } = {}) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const attrs = { ...ROOT_ATTRS, stroke: color };
  if (size) {
    attrs.width = size;
    attrs.height = size;
  }
  Object.keys(attrs).forEach((name) => svg.setAttribute(name, attrs[name]));

  icon.parts.forEach((part) => svg.appendChild(createPartNode(part, true)));

  return svg;
}

function createPartNode(part, animated) {
  const el = document.createElementNS(SVG_NS, part.tag);
  const attrs = partAttrs(part, animated);
  Object.keys(attrs).forEach((name) => el.setAttribute(name, attrs[name]));
  (part.children || []).forEach((child) => el.appendChild(createPartNode(child, animated)));
  return el;
}

function partToLines(part, animated, indent) {
  const pad = "  ".repeat(indent);
  const attrs = attrsToString(partAttrs(part, animated));
  if (!part.children || !part.children.length) return [`${pad}<${part.tag}${attrs} />`];

  return [
    `${pad}<${part.tag}${attrs}>`,
    ...part.children.flatMap((child) => partToLines(child, animated, indent + 1)),
    `${pad}</${part.tag}>`,
  ];
}

export function buildSvgFile(icon, { size, color, animated = false, speed = 1, loop = "infinite" } = {}) {
  const attrs = { xmlns: SVG_NS, ...ROOT_ATTRS, stroke: color, color, width: size, height: size };
  const lines = [`<svg${attrsToString(attrs)}>`];

  if (animated) {
    const css = buildInlineCss(icon, { speed, loop });
    lines.push("  <style>");
    css.split("\n").forEach((line) => lines.push(line ? `    ${line}` : ""));
    lines.push("  </style>");
  }

  icon.parts.forEach((part) => lines.push(...partToLines(part, animated, 1)));

  lines.push("</svg>");
  return `${lines.join("\n")}\n`;
}
