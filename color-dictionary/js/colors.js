import { JA_COLORS } from "./data-ja.js?v=20260625d";
import { CSS_COLORS } from "./data-css.js?v=20260625d";

const HUE_RANK = {
  red: 0, orange: 1, yellow: 2, green: 3, blue: 4,
  purple: 5, pink: 6, brown: 7, neutral: 8,
};

function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

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
