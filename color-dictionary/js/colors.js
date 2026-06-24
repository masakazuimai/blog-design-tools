// 色データの統合モジュール。
// 伝統色（data-ja.js）とCSS名前付き色（data-css.js）を結合して提供する。
import { JA_COLORS } from "./data-ja.js?v=20260625a";
import { CSS_COLORS } from "./data-css.js?v=20260625a";

export const COLORS = [...JA_COLORS, ...CSS_COLORS];

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
