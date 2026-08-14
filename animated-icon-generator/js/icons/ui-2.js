// UI・装飾カテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260814f";

export const UI_ICONS_2 = [
  {
    id: "theme",
    cat: "ui",
    label: { ja: "テーマ切替", en: "Theme" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "half", attrs: { d: "M12 3.4a8.6 8.6 0 0 1 0 17.2z", fill: "currentColor", stroke: "none" } },
    ],
    anim: {
      duration: 2,
      easing: "ease-in-out",
      tracks: [
        {
          part: "half",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.5, transform: "rotate(180deg)" },
            { at: 1, transform: "rotate(360deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "contrast",
    cat: "ui",
    label: { ja: "コントラスト", en: "Contrast" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "lines", attrs: { d: "M12 6.4h5.2 M12 9.6h7 M12 12.8h7 M12 16h5.2" } },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "lines", keys: blinkKeys(0.15) }] },
  },
  {
    id: "layout",
    cat: "ui",
    label: { ja: "レイアウト", en: "Layout" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "header", attrs: { d: "M3.4 9.4h17.2" } },
      { tag: "path", part: "divider", attrs: { d: "M10.4 9.4v10.2" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "header", origin: "12px 9.4px", keys: popInKeys(0.1) },
        { part: "divider", origin: "10.4px 14px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "columns",
    cat: "ui",
    label: { ja: "カラム", en: "Columns" },
    parts: [
      { tag: "rect", part: "c1", attrs: { x: 3.4, y: 4.4, width: 5, height: 15.2, rx: 1.4 } },
      { tag: "rect", part: "c2", attrs: { x: 9.5, y: 4.4, width: 5, height: 15.2, rx: 1.4 } },
      { tag: "rect", part: "c3", attrs: { x: 15.6, y: 4.4, width: 5, height: 15.2, rx: 1.4 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "c1", origin: "5.9px 12px", keys: popInKeys(0) },
        { part: "c2", origin: "12px 12px", keys: popInKeys(0.14) },
        { part: "c3", origin: "18.1px 12px", keys: popInKeys(0.28) },
      ],
    },
  },
  {
    id: "ruler",
    cat: "ui",
    label: { ja: "定規", en: "Ruler" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.6 15.2 L15.2 3.6l5.2 5.2L8.8 20.4z" } },
      { tag: "path", part: "ticks", attrs: { d: "M7.4 11.4l2 2 M10.2 8.6l2 2 M13 5.8l2 2" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        // 目盛りの点滅だけでは動きが小さいので、定規を斜めに滑らせる
        {
          part: ["body", "ticks"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.4, transform: "translate(1.4px, -1.4px)" },
            { at: 0.8, transform: "translate(0, 0)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },
  {
    id: "wand",
    cat: "ui",
    label: { ja: "自動調整", en: "Magic wand" },
    parts: [
      { tag: "path", part: "stick", attrs: { d: "M4.6 19.4 L14.6 9.4" } },
      { tag: "path", part: "star", attrs: { d: "M17.4 4.6l1.1 2.9 2.9 1.1-2.9 1.1-1.1 2.9-1.1-2.9-2.9-1.1 2.9-1.1z" } },
      { tag: "path", part: "spark", attrs: { d: "M8.4 5.4v2.4 M7.2 6.6h2.4" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "star", origin: "17.4px 8.6px", keys: popInKeys(0.1) },
        { part: "spark", keys: blinkKeys(0.4) },
      ],
    },
  },
  {
    id: "badge",
    cat: "ui",
    label: { ja: "バッジ", en: "Badge" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M12 3.4l2.4 1.8 3-.2.8 2.9 2.4 1.8-1.3 2.7 1.3 2.7-2.4 1.8-.8 2.9-3-.2-2.4 1.8-2.4-1.8-3 .2-.8-2.9-2.4-1.8 1.3-2.7-1.3-2.7 2.4-1.8.8-2.9 3 .2z" } },
      { tag: "path", part: "tick", attrs: { d: "M8.8 12.2 L11 14.4 L15.2 10.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        // 小さなチェックの描画だけでは変化が足りないので、バッジごと回して出す
        {
          part: "body",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(-30deg) scale(0.5)", opacity: 0 },
            { at: 0.45, transform: "rotate(6deg) scale(1.08)", opacity: 1 },
            { at: 0.65, transform: "rotate(0deg) scale(1)", opacity: 1 },
            { at: 1, transform: "rotate(0deg) scale(1)", opacity: 1 },
          ],
        },
        { part: "tick", keys: drawKeys(0.55, 0.9) },
      ],
    },
  },
  {
    id: "ribbon",
    cat: "ui",
    label: { ja: "リボン", en: "Ribbon" },
    parts: [
      { tag: "circle", part: "medal", attrs: { cx: 12, cy: 8.6, r: 5.2 } },
      { tag: "path", part: "tails", attrs: { d: "M8.6 12.8 L6.6 20.4 L12 17.6 L17.4 20.4 L15.4 12.8" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: ["medal", "tails"], origin: "12px 8.6px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "frame",
    cat: "ui",
    label: { ja: "フレーム", en: "Frame" },
    parts: [
      { tag: "path", part: "lines", attrs: { d: "M7.4 3.6v16.8 M16.6 3.6v16.8 M3.6 7.4h16.8 M3.6 16.6h16.8" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.5, easing: "ease-in-out", tracks: [{ part: "lines", keys: drawKeys(0.1, 0.8) }] },
  },
  {
    id: "opacity",
    cat: "ui",
    label: { ja: "不透明度", en: "Opacity" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "fill", attrs: { d: "M12 3.4a8.6 8.6 0 0 1 0 17.2z", fill: "currentColor", stroke: "none" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          part: "fill",
          keys: [
            { at: 0, opacity: 0.15 },
            { at: 0.5, opacity: 1 },
            { at: 1, opacity: 0.15 },
          ],
        },
      ],
    },
  },
  {
    id: "blur",
    cat: "ui",
    label: { ja: "ぼかし", en: "Blur" },
    parts: [
      { tag: "circle", part: "sharp", attrs: { cx: 12, cy: 12, r: 4 } },
      { tag: "circle", part: "mid", attrs: { cx: 12, cy: 12, r: 6.6, opacity: 0.5 } },
      { tag: "circle", part: "soft", attrs: { cx: 12, cy: 12, r: 9, opacity: 0.25 } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "mid", origin: "12px 12px", keys: pulseKeys(1.08) },
        { part: "soft", keys: blinkKeys(0.2) },
      ],
    },
  },
  {
    id: "shadow",
    cat: "ui",
    label: { ja: "影", en: "Shadow" },
    parts: [
      { tag: "rect", part: "back", attrs: { x: 8.4, y: 8.4, width: 11.2, height: 11.2, rx: 2, opacity: 0.3 } },
      { tag: "rect", part: "front", attrs: { x: 4.4, y: 4.4, width: 11.2, height: 11.2, rx: 2 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: "back",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.5, transform: "translate(1.2px, 1.2px)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },
  {
    id: "radius",
    cat: "ui",
    label: { ja: "角丸", en: "Border radius" },
    parts: [
      { tag: "path", part: "corner", attrs: { d: "M3.6 20.4v-11a5.8 5.8 0 0 1 5.8-5.8h11" }, animAttrs: DRAW },
      { tag: "path", part: "dots", attrs: { d: "M3.6 20.4 L3.6 20.41 M20.4 3.6 L20.4 3.61" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "corner", keys: drawKeys(0.1, 0.7) },
        { part: "dots", keys: blinkKeys(0.55) },
      ],
    },
  },
  {
    id: "text-size",
    cat: "ui",
    label: { ja: "文字サイズ", en: "Text size" },
    parts: [
      { tag: "path", part: "big", attrs: { d: "M3.6 18.4 L8.4 5.6 L13.2 18.4 M5.6 14h5.6" } },
      { tag: "path", part: "small", attrs: { d: "M15 18.4 L17.6 11.4 L20.2 18.4 M16 16h3.2" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "big", origin: "8.4px 18.4px", keys: popInKeys(0) },
        { part: "small", origin: "17.6px 18.4px", keys: popInKeys(0.25) },
      ],
    },
  },
  {
    id: "align-left",
    cat: "ui",
    label: { ja: "左揃え", en: "Align left" },
    parts: [
      { tag: "path", part: "l1", attrs: { d: "M3.6 6h16.8" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M3.6 12h10.8" }, animAttrs: DRAW },
      { tag: "path", part: "l3", attrs: { d: "M3.6 18h14" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "l1", keys: drawKeys(0, 0.35) },
        { part: "l2", keys: drawKeys(0.2, 0.55) },
        { part: "l3", keys: drawKeys(0.4, 0.75) },
      ],
    },
  },
  {
    id: "quote",
    cat: "ui",
    label: { ja: "引用", en: "Quote" },
    parts: [
      { tag: "path", part: "q1", attrs: { d: "M9.4 6.4a5.4 5.4 0 0 0-5.4 5.4v5.8h5.8v-5.8H6.4" }, animAttrs: DRAW },
      { tag: "path", part: "q2", attrs: { d: "M20 6.4a5.4 5.4 0 0 0-5.4 5.4v5.8h5.8v-5.8H17" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "q1", keys: drawKeys(0, 0.5) },
        { part: "q2", keys: drawKeys(0.3, 0.8) },
      ],
    },
  },
];
