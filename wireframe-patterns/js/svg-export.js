// 描画済みのワイヤーフレームを測って、Figma 等に貼れる SVG（rect / line / text）に変換する
import { mountPatterns } from "./render.js?v=20261006e";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const round = (n) => Math.round(n * 10) / 10;
const isPaint = (c) => c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c);

// 1要素の背景と枠線
const boxShapes = (el, cs, r) => {
  const out = [];
  const { left: x, top: y, width: w, height: h } = r;
  const radius = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, h / 2);
  const sides = ["Top", "Right", "Bottom", "Left"].map((s) => ({
    s,
    w: cs[`border${s}Style`] === "none" ? 0 : parseFloat(cs[`border${s}Width`]) || 0,
    c: cs[`border${s}Color`],
    dash: cs[`border${s}Style`] === "dashed",
  }));
  const uniform = sides.every((d) => d.w === sides[0].w && d.c === sides[0].c && d.w > 0);
  const fill = isPaint(cs.backgroundColor) ? cs.backgroundColor : "none";

  if (uniform) {
    const sw = sides[0].w;
    out.push(`<rect x="${round(x + sw / 2)}" y="${round(y + sw / 2)}" width="${round(w - sw)}" height="${round(h - sw)}" rx="${round(radius)}" fill="${fill}" stroke="${sides[0].c}" stroke-width="${sw}"/>`);
  } else {
    if (fill !== "none") out.push(`<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${round(radius)}" fill="${fill}"/>`);
    const line = { Top: [x, y, x + w, y], Right: [x + w, y, x + w, y + h], Bottom: [x, y + h, x + w, y + h], Left: [x, y, x, y + h] };
    sides.filter((d) => d.w > 0 && isPaint(d.c)).forEach((d) => {
      const [x1, y1, x2, y2] = line[d.s].map(round);
      out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${d.c}" stroke-width="${d.w}"${d.dash ? ' stroke-dasharray="6 4"' : ""}/>`);
    });
  }
  // 画像枠は斜線（×）を描く
  if (el.classList.contains("wf-img")) {
    const c = "#cfcfcf";
    out.push(`<line x1="${round(x)}" y1="${round(y)}" x2="${round(x + w)}" y2="${round(y + h)}" stroke="${c}" stroke-width="2"/>`);
    out.push(`<line x1="${round(x + w)}" y1="${round(y)}" x2="${round(x)}" y2="${round(y + h)}" stroke="${c}" stroke-width="2"/>`);
  }
  return out;
};

// テキストノードを行ごとに分けて <text> にする（1文字ずつ位置を測り、上端が同じものを1行とみなす）
const textShapes = (node, origin) => {
  const cs = getComputedStyle(node.parentElement);
  const range = document.createRange();
  const lines = [];
  const src = node.data;
  for (let i = 0; i < src.length; i += 1) {
    if (/\s/.test(src[i]) && (i === 0 || /\s/.test(src[i - 1]))) continue;
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const r = range.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.top - r.top) < 2) {
      last.text += src[i];
      last.bottom = Math.max(last.bottom, r.bottom);
    } else {
      lines.push({ text: src[i], left: r.left, top: r.top, bottom: r.bottom });
    }
  }
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, " ").trim() }))
    .filter((l) => l.text)
    .map((l) => `<text x="${round(l.left - origin.left)}" y="${round((l.top + l.bottom) / 2 - origin.top)}" dominant-baseline="central" font-size="${parseFloat(cs.fontSize)}" font-weight="${cs.fontWeight}" fill="${cs.color}">${esc(l.text)}</text>`);
};

const walk = (node, origin, out) => {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.data.trim()) out.push(...textShapes(node, origin));
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || node.tagName === "STYLE") return;
  const cs = getComputedStyle(node);
  if (cs.display === "none" || cs.visibility === "hidden") return;
  const b = node.getBoundingClientRect();
  if (b.width > 0 && b.height > 0) {
    const r = { left: b.left - origin.left, top: b.top - origin.top, width: b.width, height: b.height };
    out.push(...boxShapes(node, cs, r));
  }
  // 閉じた details は summary だけ描く（中身は表示されていないが位置は取れてしまうため）
  const children = node.tagName === "DETAILS" && !node.open
    ? [...node.children].filter((c) => c.tagName === "SUMMARY")
    : node.childNodes;
  children.forEach((c) => walk(c, origin, out));
};

// patterns を幅 width で画面外に描画し、SVG文字列とサイズを返す
export const buildSvg = (patterns, width) => {
  const host = document.createElement("div");
  host.style.cssText = `position:fixed; left:-100000px; top:0; width:${width}px;`;
  document.body.appendChild(host);
  try {
    const root = mountPatterns(host, patterns);
    const origin = host.getBoundingClientRect();
    const height = Math.ceil(origin.height);
    const shapes = [];
    root.childNodes.forEach((c) => walk(c, origin, shapes));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="system-ui, -apple-system, 'Hiragino Sans', 'Noto Sans JP', sans-serif">
<rect width="${width}" height="${height}" fill="#ffffff"/>
${shapes.join("\n")}
</svg>
`;
    return { svg, width, height };
  } finally {
    host.remove();
  }
};
