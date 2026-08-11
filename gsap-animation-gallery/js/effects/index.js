// エフェクト定義の集約。カテゴリの並び順もここで決める。
import { BASIC } from "./basic.js?v=20260811a";
import { TIMELINE } from "./timeline.js?v=20260811a";
import { SCROLLTRIGGER } from "./scrolltrigger.js?v=20260811a";
import { SCROLLTRIGGER_REVEAL } from "./scrolltrigger-reveal.js?v=20260811a";
import { SCROLL_ADVANCED } from "./scroll-advanced.js?v=20260811a";
import { SCROLL_SCENES } from "./scroll-scenes.js?v=20260811a";
import { TEXT } from "./text.js?v=20260811a";
import { SVG } from "./svg.js?v=20260811a";
import { INTERACTION } from "./interaction.js?v=20260811a";

export const CATEGORIES = [
  { key: "all", label: { ja: "すべて", en: "All" } },
  { key: "basic", label: { ja: "基本トゥイーン", en: "Basic tweens" } },
  { key: "timeline", label: { ja: "タイムライン", en: "Timeline" } },
  { key: "scrolltrigger", label: { ja: "ScrollTrigger", en: "ScrollTrigger" } },
  { key: "scroll", label: { ja: "スクロール演出", en: "Scroll scenes" } },
  { key: "text", label: { ja: "テキスト・数値", en: "Text & numbers" } },
  { key: "svg", label: { ja: "SVG・図形", en: "SVG & shapes" } },
  { key: "interaction", label: { ja: "インタラクション", en: "Interaction" } },
];

export const EFFECTS = [
  ...BASIC,
  ...TIMELINE,
  ...SCROLLTRIGGER,
  ...SCROLLTRIGGER_REVEAL,
  ...SCROLL_ADVANCED,
  ...SCROLL_SCENES,
  ...TEXT,
  ...SVG,
  ...INTERACTION,
];
