// ナビゲーションカテゴリの追加分（共通ルールは status.js のヘッダーを参照）
//
// ⚠️ 移動するアイコンは図形を内側に描くこと（nav.js のヘッダー参照）

import { DRAW, drawKeys, bounceKeys, slideKeys, popInKeys } from "./_shared.js?v=20260815c";

export const NAV_ICONS_2 = [
  {
    id: "chevron-left",
    cat: "nav",
    label: { ja: "山括弧（左）", en: "Chevron left" },
    parts: [{ tag: "path", part: "mark", attrs: { d: "M15.2 4.4 L7.6 12 L15.2 19.6" } }],
    anim: { duration: 1.2, easing: "ease-in-out", tracks: [{ part: "mark", origin: "12px 12px", keys: slideKeys("X", -7) }] },
  },
  {
    id: "chevron-up",
    cat: "nav",
    label: { ja: "山括弧（上）", en: "Chevron up" },
    parts: [{ tag: "path", part: "mark", attrs: { d: "M4.4 15.2 L12 7.6 L19.6 15.2" } }],
    anim: { duration: 1.2, easing: "ease-in-out", tracks: [{ part: "mark", origin: "12px 12px", keys: slideKeys("Y", -7) }] },
  },
  {
    id: "double-arrow-right",
    cat: "nav",
    label: { ja: "二重矢印（右）", en: "Double arrow right" },
    parts: [
      { tag: "path", part: "a1", attrs: { d: "M6.4 6.6 L11.8 12 L6.4 17.4" } },
      { tag: "path", part: "a2", attrs: { d: "M12.6 6.6 L18 12 L12.6 17.4" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: "a1", origin: "12px 12px", keys: bounceKeys("X", 2.2) },
        { part: "a2", origin: "12px 12px", keys: bounceKeys("X", 2.2) },
      ],
    },
  },
  {
    id: "double-arrow-left",
    cat: "nav",
    label: { ja: "二重矢印（左）", en: "Double arrow left" },
    parts: [
      { tag: "path", part: "a1", attrs: { d: "M17.6 6.6 L12.2 12 L17.6 17.4" } },
      { tag: "path", part: "a2", attrs: { d: "M11.4 6.6 L6 12 L11.4 17.4" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: "a1", origin: "12px 12px", keys: bounceKeys("X", -2.2) },
        { part: "a2", origin: "12px 12px", keys: bounceKeys("X", -2.2) },
      ],
    },
  },
  {
    id: "dots-vertical",
    cat: "nav",
    label: { ja: "縦三点メニュー", en: "More (vertical)" },
    parts: [
      { tag: "path", part: "d1", attrs: { d: "M12 5.6 L12 5.61" } },
      { tag: "path", part: "d2", attrs: { d: "M12 12 L12 12.01" } },
      { tag: "path", part: "d3", attrs: { d: "M12 18.4 L12 18.41" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        { part: "d1", origin: "12px 5.6px", keys: popInKeys(0) },
        { part: "d2", origin: "12px 12px", keys: popInKeys(0.15) },
        { part: "d3", origin: "12px 18.4px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "dots-horizontal",
    cat: "nav",
    label: { ja: "横三点メニュー", en: "More (horizontal)" },
    parts: [
      { tag: "path", part: "d1", attrs: { d: "M5.6 12 L5.6 12.01" } },
      { tag: "path", part: "d2", attrs: { d: "M12 12 L12 12.01" } },
      { tag: "path", part: "d3", attrs: { d: "M18.4 12 L18.4 12.01" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        { part: "d1", origin: "5.6px 12px", keys: popInKeys(0) },
        { part: "d2", origin: "12px 12px", keys: popInKeys(0.15) },
        { part: "d3", origin: "18.4px 12px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "compass",
    cat: "nav",
    label: { ja: "コンパス", en: "Compass" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "needle", attrs: { d: "M15.4 8.6 L13.6 13.6 L8.6 15.4 L10.4 10.4 Z" } },
    ],
    anim: {
      duration: 2.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: "needle",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.4, transform: "rotate(140deg)" },
            { at: 0.6, transform: "rotate(120deg)" },
            { at: 1, transform: "rotate(360deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "anchor",
    cat: "nav",
    label: { ja: "アンカーリンク", en: "Anchor" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 5.8, r: 2.4 } },
      { tag: "path", part: "shaft", attrs: { d: "M12 8.2v12.2 M8 11.4h8" } },
      { tag: "path", part: "arc", attrs: { d: "M4.6 14a7.6 7.6 0 0 0 14.8 0" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "arc", keys: drawKeys(0.15, 0.75) }] },
  },
  {
    id: "sidebar",
    cat: "nav",
    label: { ja: "サイドバー", en: "Sidebar" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "divider", attrs: { d: "M9.6 4.4v15.2" } },
      { tag: "path", part: "items", attrs: { d: "M5.6 8.6h2 M5.6 12h2 M5.6 15.4h2" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["divider", "items"],
          origin: "3.4px 12px",
          keys: [
            { at: 0, transform: "translateX(-3.6px)", opacity: 0 },
            { at: 0.45, transform: "translateX(0)", opacity: 1 },
            { at: 1, transform: "translateX(0)", opacity: 1 },
          ],
        },
      ],
    },
  },
  {
    id: "scroll-down",
    cat: "nav",
    label: { ja: "スクロール", en: "Scroll down" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 7.6, y: 3.6, width: 8.8, height: 12.4, rx: 4.4 } },
      { tag: "path", part: "dot", attrs: { d: "M12 6.6v2.4" } },
      { tag: "path", part: "chevron", attrs: { d: "M9 17.6 L12 20 L15 17.6" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: "dot",
          keys: [
            { at: 0, transform: "translateY(0)", opacity: 1 },
            { at: 0.5, transform: "translateY(4.4px)", opacity: 0 },
            { at: 0.6, transform: "translateY(0)", opacity: 0 },
            { at: 1, transform: "translateY(0)", opacity: 1 },
          ],
        },
        // 下向きの山も動かすが、枠に触れないよう図形を内側に描いてから跳ねさせる
        { part: "chevron", origin: "12px 18.8px", keys: bounceKeys("Y", 1.4) },
      ],
    },
  },
  {
    id: "minimize",
    cat: "nav",
    label: { ja: "最小化", en: "Minimize" },
    parts: [{ tag: "path", part: "bar", attrs: { d: "M5.4 12h13.2" }, animAttrs: DRAW }],
    anim: { duration: 1.1, easing: "ease-out", tracks: [{ part: "bar", keys: drawKeys(0.1, 0.7) }] },
  },
  {
    id: "maximize",
    cat: "nav",
    label: { ja: "最大化", en: "Maximize" },
    parts: [{ tag: "rect", part: "frame", attrs: { x: 4.4, y: 4.4, width: 15.2, height: 15.2, rx: 2 } }],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "frame",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scale(0.72)" },
            { at: 0.5, transform: "scale(1)" },
            { at: 1, transform: "scale(0.72)" },
          ],
        },
      ],
    },
  },
  {
    id: "swap-vertical",
    cat: "nav",
    label: { ja: "上下入れ替え", en: "Swap vertical" },
    parts: [
      { tag: "path", part: "up", attrs: { d: "M8.4 18.6V6.4 M5.6 9.2 L8.4 6.4 L11.2 9.2" } },
      { tag: "path", part: "down", attrs: { d: "M15.6 5.4v12.2 M12.8 14.8 L15.6 17.6 L18.4 14.8" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "up", origin: "8.4px 12px", keys: bounceKeys("Y", -1.6) },
        { part: "down", origin: "15.6px 12px", keys: bounceKeys("Y", 1.6) },
      ],
    },
  },
  {
    id: "route",
    cat: "nav",
    label: { ja: "ルート", en: "Route" },
    parts: [
      { tag: "circle", part: "start", attrs: { cx: 5.6, cy: 18.4, r: 2.4 } },
      { tag: "circle", part: "goal", attrs: { cx: 18.4, cy: 5.6, r: 2.4 } },
      { tag: "path", part: "path", attrs: { d: "M8 18.4h5.4a3.4 3.4 0 0 0 0-6.8H10a3.4 3.4 0 0 1 0-6.8h5.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "path", keys: drawKeys(0.1, 0.75) },
        { part: "goal", origin: "18.4px 5.6px", keys: popInKeys(0.7) },
      ],
    },
  },
];
