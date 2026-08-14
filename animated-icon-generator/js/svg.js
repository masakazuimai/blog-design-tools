// アイコン定義から SVG を組み立てる
// 画面表示用は DOM要素、ダウンロード用は整形済みの文字列を返す（属性の作り方は共有する）

import { buildInlineCss } from "./anim.js?v=20260815a";

const SVG_NS = "http://www.w3.org/2000/svg";

// 全アイコン共通のルート属性
const ROOT_ATTRS = {
  viewBox: "0 0 24 24",
  fill: "none",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

// パーツの最終的な属性（アニメ対象は p-<part> クラスで参照できるようにする）
//
// animAttrs はアニメーションの下地としてのみ必要な属性（pathLength や stroke-dasharray）。
// 静止版に混ぜると意味のない指定がファイルに残るため、アニメ版のときだけ合成する。
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

// 画面表示用。色は currentColor のままにしておき、CSS側の変数で切り替える
export function createIconSvg(icon, { size, color = "currentColor" } = {}) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const attrs = { ...ROOT_ATTRS, stroke: color };
  if (size) {
    attrs.width = size;
    attrs.height = size;
  }
  Object.keys(attrs).forEach((name) => svg.setAttribute(name, attrs[name]));

  // 画面上のアイコンは常にアニメーションを適用しうるため animAttrs を含める
  icon.parts.forEach((part) => svg.appendChild(createPartNode(part, true)));

  return svg;
}

// パーツを1つ作る。children を持つ場合（defs / clipPath / g）は入れ子で作る
function createPartNode(part, animated) {
  const el = document.createElementNS(SVG_NS, part.tag);
  const attrs = partAttrs(part, animated);
  Object.keys(attrs).forEach((name) => el.setAttribute(name, attrs[name]));
  (part.children || []).forEach((child) => el.appendChild(createPartNode(child, animated)));
  return el;
}

// 文字列側も同じ構造で組み立てる（indent はファイルの読みやすさ用）
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

// ダウンロード用のSVGファイル本文
//
// animated: true にすると @keyframes を <style> としてファイル内に埋め込む。
// 外部参照もスクリプトも含まない自己完結ファイルになるため、<img src="icon.svg"> でもそのまま動く。
// animated: false は parts だけの「アニメ適用前の完成形」＝静止版。
export function buildSvgFile(icon, { size, color, animated = false, speed = 1, loop = "infinite" } = {}) {
  // 塗りつぶしを持つパーツが fill="currentColor" を解決できるよう、ルートに color も置く
  // （画面表示側は CSS の color で色を与えるため createIconSvg では不要）
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
