// UI・装飾カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys } from "./_shared.js?v=20260815c";

export const UI_ICONS = [
  {
    id: "eye",
    cat: "ui",
    label: { ja: "表示", en: "Eye" },
    parts: [
      { tag: "path", part: "outline", attrs: { d: "M2.6 12S6.2 5.4 12 5.4 21.4 12 21.4 12 17.8 18.6 12 18.6 2.6 12 2.6 12z" } },
      { tag: "circle", part: "pupil", attrs: { cx: 12, cy: 12, r: 3.2 } },
    ],
    anim: {
      duration: 2,
      easing: "ease-in-out",
      tracks: [
        {
          // まばたき
          part: ["outline", "pupil"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scaleY(1)" },
            { at: 0.42, transform: "scaleY(1)" },
            { at: 0.5, transform: "scaleY(0.08)" },
            { at: 0.58, transform: "scaleY(1)" },
            { at: 1, transform: "scaleY(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "eye-off",
    cat: "ui",
    label: { ja: "非表示", en: "Eye off" },
    parts: [
      { tag: "path", part: "outline", attrs: { d: "M2.6 12S6.2 5.4 12 5.4 21.4 12 21.4 12 17.8 18.6 12 18.6 2.6 12 2.6 12z" } },
      { tag: "circle", part: "pupil", attrs: { cx: 12, cy: 12, r: 3.2 } },
      { tag: "path", part: "slash", attrs: { d: "M4.2 4.2 L19.8 19.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "slash", keys: drawKeys(0.1, 0.6) },
        {
          part: ["outline", "pupil"],
          keys: [
            { at: 0, opacity: 1 },
            { at: 0.6, opacity: 1 },
            { at: 0.85, opacity: 0.3 },
            { at: 1, opacity: 0.3 },
          ],
        },
      ],
    },
  },

  {
    id: "palette",
    cat: "ui",
    label: { ja: "パレット", en: "Palette" },
    parts: [
      {
        tag: "path",
        part: "body",
        attrs: { d: "M12 3.4a8.6 8.6 0 1 0 0 17.2 1.9 1.9 0 0 0 1.9-1.9c0-.5-.2-.9-.5-1.2a1.8 1.8 0 0 1 1.3-3h2.1a4.1 4.1 0 0 0 4.1-4.1c0-3.9-3.9-7-8.9-7z" },
      },
      { tag: "circle", part: "dot1", attrs: { cx: 7.6, cy: 11.4, r: 1.2 } },
      { tag: "circle", part: "dot2", attrs: { cx: 9.8, cy: 7.6, r: 1.2 } },
      { tag: "circle", part: "dot3", attrs: { cx: 14.2, cy: 7.6, r: 1.2 } },
      { tag: "circle", part: "dot4", attrs: { cx: 17.2, cy: 11, r: 1.2 } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        // 点を円にして大きくし、本体も現れる動きにする
        { part: "body", origin: "12px 12px", keys: popInKeys(0) },
        { part: "dot1", origin: "7.6px 11.4px", keys: popInKeys(0.25) },
        { part: "dot2", origin: "9.8px 7.6px", keys: popInKeys(0.38) },
        { part: "dot3", origin: "14.2px 7.6px", keys: popInKeys(0.51) },
        { part: "dot4", origin: "17.2px 11px", keys: popInKeys(0.64) },
      ],
    },
  },

  {
    id: "brush",
    cat: "ui",
    label: { ja: "ブラシ", en: "Brush" },
    parts: [
      { tag: "path", part: "head", attrs: { d: "M15.2 5 L19 8.8 L11 16.8 L7.2 13z" } },
      { tag: "path", part: "handle", attrs: { d: "M7.6 13.4 L5.2 18.4a1 1 0 0 0 1.4 1.4l5-2.4" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["head", "handle"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg) translate(0, 0)" },
            { at: 0.35, transform: "rotate(-6deg) translate(-1.1px, 1.1px)" },
            { at: 0.7, transform: "rotate(4deg) translate(0.9px, -0.9px)" },
            { at: 1, transform: "rotate(0deg) translate(0, 0)" },
          ],
        },
      ],
    },
  },

  {
    id: "sparkle",
    cat: "ui",
    label: { ja: "きらめき", en: "Sparkle" },
    parts: [
      { tag: "path", part: "big", attrs: { d: "M11 3.4l1.7 5.1 5.1 1.7-5.1 1.7-1.7 5.1-1.7-5.1-5.1-1.7 5.1-1.7z" } },
      { tag: "path", part: "small", attrs: { d: "M18 14.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          part: "big",
          origin: "11px 10.2px",
          keys: [
            { at: 0, transform: "scale(0.6) rotate(-20deg)", opacity: 0.2 },
            { at: 0.3, transform: "scale(1) rotate(0deg)", opacity: 1 },
            { at: 0.7, transform: "scale(1) rotate(0deg)", opacity: 1 },
            { at: 1, transform: "scale(0.6) rotate(-20deg)", opacity: 0.2 },
          ],
        },
        {
          part: "small",
          origin: "18px 17.6px",
          keys: [
            { at: 0, transform: "scale(0.4)", opacity: 0.2 },
            { at: 0.25, transform: "scale(0.4)", opacity: 0.2 },
            { at: 0.55, transform: "scale(1)", opacity: 1 },
            { at: 0.85, transform: "scale(0.4)", opacity: 0.2 },
            { at: 1, transform: "scale(0.4)", opacity: 0.2 },
          ],
        },
      ],
    },
  },

  {
    id: "target",
    cat: "ui",
    label: { ja: "ターゲット", en: "Target" },
    parts: [
      { tag: "circle", part: "ring1", attrs: { cx: 12, cy: 12, r: 9 } },
      { tag: "circle", part: "ring2", attrs: { cx: 12, cy: 12, r: 5.4 } },
      { tag: "path", part: "dot", attrs: { d: "M12 12 L12 12.01" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        {
          part: "ring1",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scale(0.75)", opacity: 0.2 },
            { at: 0.5, transform: "scale(1)", opacity: 1 },
            { at: 1, transform: "scale(1)", opacity: 1 },
          ],
        },
        {
          part: "ring2",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scale(0.5)", opacity: 0.2 },
            { at: 0.35, transform: "scale(1)", opacity: 1 },
            { at: 1, transform: "scale(1)", opacity: 1 },
          ],
        },
        { part: "dot", origin: "12px 12px", keys: popInKeys(0) },
      ],
    },
  },

  {
    id: "flag",
    cat: "ui",
    label: { ja: "フラグ", en: "Flag" },
    parts: [
      { tag: "path", part: "pole", attrs: { d: "M5.4 3.4v17.2" } },
      { tag: "path", part: "cloth", attrs: { d: "M5.4 4.6h12.8l-2.6 3.9 2.6 3.9H5.4z" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          // 風になびく
          part: "cloth",
          origin: "5.4px 8.4px",
          keys: [
            { at: 0, transform: "scaleX(1) skewY(0deg)" },
            { at: 0.3, transform: "scaleX(0.92) skewY(3deg)" },
            { at: 0.6, transform: "scaleX(1.02) skewY(-2deg)" },
            { at: 1, transform: "scaleX(1) skewY(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "gift",
    cat: "ui",
    label: { ja: "ギフト", en: "Gift" },
    parts: [
      { tag: "path", part: "box", attrs: { d: "M4.4 10.6v8a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2v-8" } },
      { tag: "rect", part: "lid", attrs: { x: 2.6, y: 6.2, width: 18.8, height: 4.4, rx: 1.4 } },
      { tag: "path", part: "ribbon", attrs: { d: "M12 6.2v14.4" } },
      { tag: "path", part: "bow", attrs: { d: "M12 6.2S10.4 3.4 8.4 3.4a2.4 2.4 0 0 0 0 4.8h3.6 M12 6.2s1.6-2.8 3.6-2.8a2.4 2.4 0 0 1 0 4.8H12" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [{ part: ["box", "lid", "ribbon", "bow"], origin: "12px 20.6px", keys: bounceKeys("Y", -1.8) }],
    },
  },

  {
    id: "coffee",
    cat: "ui",
    label: { ja: "コーヒー", en: "Coffee" },
    parts: [
      { tag: "path", part: "cup", attrs: { d: "M4.4 8.6h11.8v6.2a4.4 4.4 0 0 1-4.4 4.4H8.8a4.4 4.4 0 0 1-4.4-4.4z" } },
      { tag: "path", part: "handle", attrs: { d: "M16.2 9.8h1.6a2.6 2.6 0 0 1 0 5.2h-1.6" } },
      { tag: "path", part: "base", attrs: { d: "M3.4 21.4h13.8" } },
      { tag: "path", part: "steam1", attrs: { d: "M8.2 6.4V3.6" } },
      { tag: "path", part: "steam2", attrs: { d: "M12.4 6.4V3.6" } },
    ],
    anim: {
      duration: 2,
      easing: "ease-out",
      tracks: [
        // 湯気を長くして移動量も増やす（短い線の微動では気づけなかった）
        { part: "steam1", origin: "8.2px 6.4px", keys: steamKeys(0) },
        { part: "steam2", origin: "12.4px 6.4px", keys: steamKeys(0.3) },
        { part: ["cup", "handle", "base"], origin: "12px 21.4px", keys: pulseKeys(1.05) },
      ],
    },
  },

  {
    id: "bulb",
    cat: "ui",
    label: { ja: "アイデア", en: "Idea" },
    parts: [
      {
        tag: "path",
        part: "glass",
        attrs: { d: "M12 3.4a6.2 6.2 0 0 1 3.7 11.2c-.6.5-1 1.1-1 1.9v.3H9.3v-.3c0-.8-.4-1.4-1-1.9A6.2 6.2 0 0 1 12 3.4z" },
      },
      { tag: "path", part: "base", attrs: { d: "M9.4 19h5.2 M10.2 21.4h3.6" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          // ひらめいて灯る
          part: "glass",
          keys: [
            { at: 0, opacity: 0.25 },
            { at: 0.2, opacity: 1 },
            { at: 0.3, opacity: 0.35 },
            { at: 0.42, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
      ],
    },
  },
];

// 湯気が立ちのぼって消える
function steamKeys(delay) {
  return [
    { at: 0, transform: "translateY(1.6px)", opacity: 0 },
    { at: delay, transform: "translateY(1.6px)", opacity: 0 },
    { at: delay + 0.25, transform: "translateY(0)", opacity: 1 },
    { at: delay + 0.6, transform: "translateY(-1.8px)", opacity: 0 },
    { at: 1, transform: "translateY(-1.8px)", opacity: 0 },
  ];
}
