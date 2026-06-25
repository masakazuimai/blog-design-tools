// 色データの統合モジュール。
// 伝統色（data-ja.js）とCSS名前付き色（data-css.js）を結合して提供する。
import { JA_COLORS } from "./data-ja.js?v=20260625d";
import { CSS_COLORS } from "./data-css.js?v=20260625d";

// 並び順：色相グループ（下記HUE_GROUPS順）→ グループ内は明→暗。
// 伝統色ブロック → CSS色ブロックの2段構成。新色を追記しても自動で正しい位置に整列する。
const HUE_RANK = {
  red: 0, orange: 1, yellow: 2, green: 3, blue: 4,
  purple: 5, pink: 6, brown: 7, neutral: 8,
};

// 知覚的な明るさ（高いほど明るい）。色相内を明→暗で並べるための指標。
function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// 色相グループ順 → 同一色相は明るい順。同値はnameで安定化。
function byHueThenLight(a, b) {
  const hue = (HUE_RANK[a.hue] ?? 99) - (HUE_RANK[b.hue] ?? 99);
  if (hue !== 0) return hue;
  const light = luminance(b.hex) - luminance(a.hex);
  if (light !== 0) return light;
  return a.name.localeCompare(b.name, "ja");
}

const sortByHueLight = (list) => [...list].sort(byHueThenLight);

export const COLORS = [
  ...sortByHueLight(JA_COLORS),
  ...sortByHueLight(CSS_COLORS),
];

// 色相グループの定義（表示順・ラベル・代表色）
export const HUE_GROUPS = [
  { key: "all", labelJa: "すべて", labelEn: "All", dot: "" },
  { key: "red", labelJa: "赤", labelEn: "Red", dot: "#c0392b" },
  { key: "orange", labelJa: "橙", labelEn: "Orange", dot: "#e07b39" },
  { key: "yellow", labelJa: "黄", labelEn: "Yellow", dot: "#e6b422" },
  { key: "green", labelJa: "緑", labelEn: "Green", dot: "#4a8b53" },
  { key: "blue", labelJa: "青", labelEn: "Blue", dot: "#2a6f97" },
  { key: "purple", labelJa: "紫", labelEn: "Purple", dot: "#7d5ba6" },
  { key: "pink", labelJa: "桃", labelEn: "Pink", dot: "#d4849b" },
  { key: "brown", labelJa: "茶", labelEn: "Brown", dot: "#8a5a3c" },
  { key: "neutral", labelJa: "白黒灰", labelEn: "Neutral", dot: "#9c9488" },
];
