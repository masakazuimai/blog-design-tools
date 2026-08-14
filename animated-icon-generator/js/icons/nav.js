// ナビゲーションカテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）
//
// ハンバーガーメニューは hamburger-menu-gallery と役割が重なるため、ここには置かない。
//
// ⚠️ 移動するアイコンは図形を内側に描く: 他のアイコンと同じ 3.4〜20.6 いっぱいに描くと、
//    translate した瞬間に線幅ぶんも含めて viewBox からはみ出して見切れる。
//    矢印系は 4.4〜19.6 に収め、移動量は 3 までとする（4.4 - 線幅1 - 3 = 0.4 で枠内）。

import { DRAW, drawKeys, bounceKeys, slideKeys, popInKeys } from "./_shared.js?v=20260815b";

// 矢印の移動量。図形の内寸から決めた上限
const ARROW_SHIFT = 3;

export const NAV_ICONS = [
  {
    id: "arrow-right",
    cat: "nav",
    label: { ja: "矢印（右）", en: "Arrow right" },
    parts: [
      { tag: "path", part: "shaft", attrs: { d: "M4.4 12h15.2" } },
      { tag: "path", part: "head", attrs: { d: "M13.4 5.8 L19.6 12 L13.4 18.2" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("X", ARROW_SHIFT) }],
    },
  },

  {
    id: "arrow-left",
    cat: "nav",
    label: { ja: "矢印（左）", en: "Arrow left" },
    parts: [
      { tag: "path", part: "shaft", attrs: { d: "M19.6 12H4.4" } },
      { tag: "path", part: "head", attrs: { d: "M10.6 5.8 L4.4 12 L10.6 18.2" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("X", -ARROW_SHIFT) }],
    },
  },

  {
    id: "arrow-up",
    cat: "nav",
    label: { ja: "矢印（上）", en: "Arrow up" },
    parts: [
      { tag: "path", part: "shaft", attrs: { d: "M12 19.6V4.4" } },
      { tag: "path", part: "head", attrs: { d: "M5.8 10.6 L12 4.4 L18.2 10.6" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("Y", -ARROW_SHIFT) }],
    },
  },

  {
    id: "arrow-down",
    cat: "nav",
    label: { ja: "矢印（下）", en: "Arrow down" },
    parts: [
      { tag: "path", part: "shaft", attrs: { d: "M12 4.4v15.2" } },
      { tag: "path", part: "head", attrs: { d: "M5.8 13.4 L12 19.6 L18.2 13.4" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("Y", ARROW_SHIFT) }],
    },
  },

  {
    id: "chevron-right",
    cat: "nav",
    label: { ja: "山括弧（右）", en: "Chevron right" },
    parts: [{ tag: "path", part: "mark", attrs: { d: "M8.8 4.4 L16.4 12 L8.8 19.6" } }],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: "mark", origin: "12px 12px", keys: slideKeys("X", 7) }],
    },
  },

  {
    id: "chevron-down",
    cat: "nav",
    label: { ja: "山括弧（下）", en: "Chevron down" },
    parts: [{ tag: "path", part: "mark", attrs: { d: "M4.4 8.8 L12 16.4 L19.6 8.8" } }],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: "mark", origin: "12px 12px", keys: slideKeys("Y", 7) }],
    },
  },

  {
    id: "external-link",
    cat: "nav",
    label: { ja: "外部リンク", en: "External link" },
    parts: [
      { tag: "path", part: "frame", attrs: { d: "M18.4 13.4v5.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2V7.6a2 2 0 0 1 2-2h5.2" } },
      { tag: "path", part: "corner", attrs: { d: "M13.8 4.4h5.8v5.8" } },
      { tag: "path", part: "arrow", attrs: { d: "M19.6 4.4 L11.2 12.8" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["corner", "arrow"],
          origin: "16px 8px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.35, transform: "translate(1.8px, -1.8px)" },
            { at: 0.7, transform: "translate(0, 0)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },

  {
    id: "home",
    cat: "nav",
    label: { ja: "ホーム", en: "Home" },
    parts: [
      { tag: "path", part: "roof", attrs: { d: "M3.4 10.6 L12 3.4 L20.6 10.6" }, animAttrs: DRAW },
      { tag: "path", part: "body", attrs: { d: "M5.6 8.8V19.6a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1V8.8" }, animAttrs: DRAW },
      { tag: "path", part: "door", attrs: { d: "M9.8 20.6v-5.4h4.4v5.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "roof", keys: drawKeys(0, 0.4) },
        { part: "body", keys: drawKeys(0.35, 0.75) },
        { part: "door", keys: drawKeys(0.7, 0.95) },
      ],
    },
  },

  {
    id: "close",
    cat: "nav",
    label: { ja: "閉じる", en: "Close" },
    parts: [
      { tag: "path", part: "slash1", attrs: { d: "M5.6 5.6 L18.4 18.4" }, animAttrs: DRAW },
      { tag: "path", part: "slash2", attrs: { d: "M18.4 5.6 L5.6 18.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1,
      easing: "ease-in-out",
      tracks: [
        { part: "slash1", keys: drawKeys(0, 0.5) },
        { part: "slash2", keys: drawKeys(0.45, 0.9) },
      ],
    },
  },

  {
    id: "expand",
    cat: "nav",
    label: { ja: "拡大", en: "Expand" },
    parts: [
      { tag: "path", part: "tl", attrs: { d: "M3.6 9V3.6H9" } },
      { tag: "path", part: "tr", attrs: { d: "M15 3.6h5.4V9" } },
      { tag: "path", part: "br", attrs: { d: "M20.4 15v5.4H15" } },
      { tag: "path", part: "bl", attrs: { d: "M9 20.4H3.6V15" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["tl", "tr", "br", "bl"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scale(0.7)" },
            { at: 0.5, transform: "scale(1)" },
            { at: 1, transform: "scale(0.7)" },
          ],
        },
      ],
    },
  },

  {
    id: "collapse",
    cat: "nav",
    label: { ja: "縮小", en: "Collapse" },
    parts: [
      { tag: "path", part: "tl", attrs: { d: "M9 3.6V9H3.6" } },
      { tag: "path", part: "tr", attrs: { d: "M20.4 9H15V3.6" } },
      { tag: "path", part: "br", attrs: { d: "M15 20.4V15h5.4" } },
      { tag: "path", part: "bl", attrs: { d: "M3.6 15H9v5.4" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["tl", "tr", "br", "bl"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.5, transform: "scale(0.7)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "back",
    cat: "nav",
    label: { ja: "戻る", en: "Back" },
    parts: [
      { tag: "path", part: "shaft", attrs: { d: "M4.6 9.6h10.8a5 5 0 0 1 0 10H11.4" } },
      { tag: "path", part: "head", attrs: { d: "M9.2 4.8 L4.6 9.6 L9.2 14.4" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("X", -2.6) }],
    },
  },

  {
    id: "grid",
    cat: "nav",
    label: { ja: "グリッド表示", en: "Grid" },
    parts: [
      { tag: "rect", part: "cell1", attrs: { x: 3.4, y: 3.4, width: 7.2, height: 7.2, rx: 1.6 } },
      { tag: "rect", part: "cell2", attrs: { x: 13.4, y: 3.4, width: 7.2, height: 7.2, rx: 1.6 } },
      { tag: "rect", part: "cell3", attrs: { x: 3.4, y: 13.4, width: 7.2, height: 7.2, rx: 1.6 } },
      { tag: "rect", part: "cell4", attrs: { x: 13.4, y: 13.4, width: 7.2, height: 7.2, rx: 1.6 } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        { part: "cell1", origin: "7px 7px", keys: popInKeys(0) },
        { part: "cell2", origin: "17px 7px", keys: popInKeys(0.12) },
        { part: "cell3", origin: "7px 17px", keys: popInKeys(0.24) },
        { part: "cell4", origin: "17px 17px", keys: popInKeys(0.36) },
      ],
    },
  },

  {
    id: "list",
    cat: "nav",
    label: { ja: "リスト表示", en: "List" },
    parts: [
      { tag: "path", part: "dot1", attrs: { d: "M4 6.6 L4 6.61" } },
      { tag: "path", part: "dot2", attrs: { d: "M4 12 L4 12.01" } },
      { tag: "path", part: "dot3", attrs: { d: "M4 17.4 L4 17.41" } },
      { tag: "path", part: "line1", attrs: { d: "M8.6 6.6h11.4" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M8.6 12h11.4" }, animAttrs: DRAW },
      { tag: "path", part: "line3", attrs: { d: "M8.6 17.4h11.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "line1", keys: drawKeys(0, 0.35) },
        { part: "line2", keys: drawKeys(0.2, 0.55) },
        { part: "line3", keys: drawKeys(0.4, 0.75) },
      ],
    },
  },
];
