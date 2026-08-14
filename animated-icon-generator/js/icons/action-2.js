// 操作カテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260815b";

export const ACTION_ICONS_2 = [
  {
    id: "scissors",
    cat: "action",
    label: { ja: "切り取り", en: "Cut" },
    parts: [
      { tag: "circle", part: "ring1", attrs: { cx: 6.4, cy: 17.6, r: 2.6 } },
      { tag: "circle", part: "ring2", attrs: { cx: 17.6, cy: 17.6, r: 2.6 } },
      { tag: "path", part: "blade1", attrs: { d: "M8.2 15.8 L18.4 4.4" } },
      { tag: "path", part: "blade2", attrs: { d: "M15.8 15.8 L5.6 4.4" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["ring1", "blade2"],
          origin: "12px 11px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(-7deg)" },
            { at: 0.7, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
        {
          part: ["ring2", "blade1"],
          origin: "12px 11px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(7deg)" },
            { at: 0.7, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "undo",
    cat: "action",
    label: { ja: "元に戻す", en: "Undo" },
    parts: [
      { tag: "path", part: "arc", attrs: { d: "M4.6 10.4h9.4a4.6 4.6 0 0 1 0 9.2H9.4" }, animAttrs: DRAW },
      { tag: "path", part: "head", attrs: { d: "M8.6 5.6 L4.4 10.4 L8.6 15" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["arc", "head"], origin: "12px 12px", keys: bounceKeys("X", -1.8) }] },
  },
  {
    id: "redo",
    cat: "action",
    label: { ja: "やり直す", en: "Redo" },
    parts: [
      { tag: "path", part: "arc", attrs: { d: "M19.4 10.4h-9.4a4.6 4.6 0 0 0 0 9.2h4.6" }, animAttrs: DRAW },
      { tag: "path", part: "head", attrs: { d: "M15.4 5.6 L19.6 10.4 L15.4 15" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["arc", "head"], origin: "12px 12px", keys: bounceKeys("X", 1.8) }] },
  },
  {
    id: "zoom-in",
    cat: "action",
    label: { ja: "拡大", en: "Zoom in" },
    parts: [
      { tag: "circle", part: "lens", attrs: { cx: 10.8, cy: 10.8, r: 6.4 } },
      { tag: "path", part: "handle", attrs: { d: "M15.4 15.4 L19.6 19.6" } },
      { tag: "path", part: "plus", attrs: { d: "M10.8 8v5.6 M8 10.8h5.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: "plus", keys: drawKeys(0.2, 0.7) }] },
  },
  {
    id: "zoom-out",
    cat: "action",
    label: { ja: "縮小", en: "Zoom out" },
    parts: [
      { tag: "circle", part: "lens", attrs: { cx: 10.8, cy: 10.8, r: 6.4 } },
      { tag: "path", part: "handle", attrs: { d: "M15.4 15.4 L19.6 19.6" } },
      { tag: "path", part: "minus", attrs: { d: "M8 10.8h5.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [
        // 虫眼鏡が縮む動きを足す
        { part: ["lens", "handle"], origin: "12px 12px", keys: [
          { at: 0, transform: "scale(1)" },
          { at: 0.5, transform: "scale(0.78)" },
          { at: 1, transform: "scale(1)" },
        ] },
        { part: "minus", keys: drawKeys(0.2, 0.7) },
      ],
    },
  },
  {
    id: "move",
    cat: "action",
    label: { ja: "移動", en: "Move" },
    parts: [
      { tag: "path", part: "cross", attrs: { d: "M12 5.4v13.2 M5.4 12h13.2" } },
      { tag: "path", part: "heads", attrs: { d: "M9.6 7.8 L12 5.4 L14.4 7.8 M9.6 16.2 L12 18.6 L14.4 16.2 M7.8 9.6 L5.4 12 L7.8 14.4 M16.2 9.6 L18.6 12 L16.2 14.4" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: ["cross", "heads"], origin: "12px 12px", keys: pulseKeys(1.1) }] },
  },
  {
    id: "crop",
    cat: "action",
    label: { ja: "切り抜き", en: "Crop" },
    parts: [
      { tag: "path", part: "l1", attrs: { d: "M6.4 3.6v14h14" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M3.6 6.4h14v14" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "l1", keys: drawKeys(0, 0.5) },
        { part: "l2", keys: drawKeys(0.35, 0.85) },
      ],
    },
  },
  {
    id: "eyedropper",
    cat: "action",
    label: { ja: "スポイト", en: "Eyedropper" },
    parts: [
      { tag: "path", part: "tip", attrs: { d: "M14.4 6.6 L6.4 14.6v3h3l8-8" } },
      { tag: "path", part: "cap", attrs: { d: "M14.8 4.4a2.6 2.6 0 0 1 3.8 3.6l-2 2-3.4-3.4z" } },
      { tag: "path", part: "drop", attrs: { d: "M6.4 20.4 L6.4 20.41" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        { part: ["tip", "cap"], origin: "12px 12px", keys: bounceKeys("Y", -1.4) },
        { part: "drop", origin: "6.4px 20.4px", keys: popInKeys(0.45) },
      ],
    },
  },
  {
    id: "layers",
    cat: "action",
    label: { ja: "レイヤー", en: "Layers" },
    parts: [
      { tag: "path", part: "top", attrs: { d: "M12 3.6 L20.4 8 L12 12.4 L3.6 8z" } },
      { tag: "path", part: "mid", attrs: { d: "M3.6 12 L12 16.4 L20.4 12" } },
      { tag: "path", part: "bottom", attrs: { d: "M3.6 16 L12 20.4 L20.4 16" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "top", origin: "12px 8px", keys: popInKeys(0) },
        { part: "mid", origin: "12px 14px", keys: popInKeys(0.15) },
        { part: "bottom", origin: "12px 18px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "duplicate",
    cat: "action",
    label: { ja: "複製", en: "Duplicate" },
    parts: [
      { tag: "rect", part: "back", attrs: { x: 8.6, y: 3.4, width: 12, height: 12, rx: 2 } },
      { tag: "rect", part: "front", attrs: { x: 3.4, y: 8.6, width: 12, height: 12, rx: 2 } },
      { tag: "path", part: "plus", attrs: { d: "M9.4 12v5.2 M6.8 14.6h5.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [
        // 手前の紙が奥から抜き出される（＋の描画だけでは動きが小さい）
        {
          part: "front",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(5.2px, -5.2px)", opacity: 0 },
            { at: 0.5, transform: "translate(0, 0)", opacity: 1 },
            { at: 1, transform: "translate(0, 0)", opacity: 1 },
          ],
        },
        { part: "plus", keys: drawKeys(0.55, 0.85) },
      ],
    },
  },
  {
    id: "sort",
    cat: "action",
    label: { ja: "並べ替え", en: "Sort" },
    parts: [
      { tag: "path", part: "up", attrs: { d: "M7.4 19.4V5.4 M4.4 8.4 L7.4 5.4 L10.4 8.4" } },
      { tag: "path", part: "down", attrs: { d: "M16.6 4.6v14 M13.6 15.6 L16.6 18.6 L19.6 15.6" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "up", origin: "7.4px 12px", keys: bounceKeys("Y", -1.4) },
        { part: "down", origin: "16.6px 12px", keys: bounceKeys("Y", 1.4) },
      ],
    },
  },
  {
    id: "swap",
    cat: "action",
    label: { ja: "入れ替え", en: "Swap" },
    parts: [
      { tag: "path", part: "top", attrs: { d: "M5.4 8.6h13.2 M15.6 5.6 L18.6 8.6 L15.6 11.6" } },
      { tag: "path", part: "bottom", attrs: { d: "M18.6 15.4H5.4 M8.4 12.4 L5.4 15.4 L8.4 18.4" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "top", origin: "12px 8.6px", keys: bounceKeys("X", 1.4) },
        { part: "bottom", origin: "12px 15.4px", keys: bounceKeys("X", -1.4) },
      ],
    },
  },
  {
    id: "drag",
    cat: "action",
    label: { ja: "ドラッグ", en: "Drag" },
    parts: [
      { tag: "path", part: "left", attrs: { d: "M9 6.6 L9 6.61 M9 12 L9 12.01 M9 17.4 L9 17.41" } },
      { tag: "path", part: "right", attrs: { d: "M15 6.6 L15 6.61 M15 12 L15 12.01 M15 17.4 L15 17.41" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "left", origin: "12px 12px", keys: bounceKeys("X", -1.6) },
        { part: "right", origin: "12px 12px", keys: bounceKeys("X", 1.6) },
      ],
    },
  },
  {
    id: "attach",
    cat: "action",
    label: { ja: "添付", en: "Attach" },
    parts: [
      { tag: "path", part: "clip", attrs: { d: "M17.4 11.4 L11 17.8a4.2 4.2 0 0 1-6-6l7.4-7.4a2.8 2.8 0 0 1 4 4l-7.4 7.4a1.4 1.4 0 0 1-2-2l6.6-6.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.8, easing: "ease-in-out", tracks: [{ part: "clip", keys: drawKeys(0.05, 0.85) }] },
  },
  {
    id: "slider",
    cat: "action",
    label: { ja: "スライダー", en: "Slider" },
    parts: [
      { tag: "path", part: "rails", attrs: { d: "M3.6 8h16.8 M3.6 16h16.8" } },
      { tag: "circle", part: "knob1", attrs: { cx: 9, cy: 8, r: 2.4 } },
      { tag: "circle", part: "knob2", attrs: { cx: 15, cy: 16, r: 2.4 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: "knob1",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.4, transform: "translateX(4.4px)" },
            { at: 0.8, transform: "translateX(0)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
        {
          part: "knob2",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.4, transform: "translateX(-4.4px)" },
            { at: 0.8, transform: "translateX(0)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
      ],
    },
  },
  {
    id: "toggle",
    cat: "action",
    label: { ja: "トグル", en: "Toggle" },
    parts: [
      { tag: "rect", part: "track", attrs: { x: 2.6, y: 7.4, width: 18.8, height: 9.2, rx: 4.6 } },
      { tag: "circle", part: "knob", attrs: { cx: 7.4, cy: 12, r: 2.8 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: "knob",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.4, transform: "translateX(9.2px)" },
            { at: 0.8, transform: "translateX(0)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
      ],
    },
  },
  {
    id: "checkbox",
    cat: "action",
    label: { ja: "チェックボックス", en: "Checkbox" },
    parts: [
      { tag: "rect", part: "box", attrs: { x: 3.6, y: 3.6, width: 16.8, height: 16.8, rx: 2.4 } },
      { tag: "path", part: "tick", attrs: { d: "M7.8 12.2 L10.6 15 L16.2 9.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [
        { part: "box", origin: "12px 12px", keys: pulseKeys(1.12) },
        { part: "tick", keys: drawKeys(0.25, 0.8) },
      ],
    },
  },
  {
    id: "radio",
    cat: "action",
    label: { ja: "ラジオボタン", en: "Radio button" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "circle", part: "dot", attrs: { cx: 12, cy: 12, r: 3.6 } },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [{ part: "dot", origin: "12px 12px", keys: popInKeys(0.15) }] },
  },
  {
    id: "key",
    cat: "action",
    label: { ja: "鍵", en: "Key" },
    parts: [
      { tag: "circle", part: "head", attrs: { cx: 7.6, cy: 16.4, r: 4 } },
      { tag: "path", part: "shaft", attrs: { d: "M10.4 13.6 L19.4 4.6 M16.6 7.4l2.2 2.2 M14.4 9.6l2.2 2.2" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["head", "shaft"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(-10deg)" },
            { at: 0.7, transform: "rotate(5deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "fingerprint",
    cat: "action",
    label: { ja: "指紋認証", en: "Fingerprint" },
    parts: [
      { tag: "path", part: "a1", attrs: { d: "M4.6 11.6a7.4 7.4 0 0 1 14.8 0v2" }, animAttrs: DRAW },
      { tag: "path", part: "a2", attrs: { d: "M8 11.6a4 4 0 0 1 8 0v3.4" }, animAttrs: DRAW },
      { tag: "path", part: "a3", attrs: { d: "M12 11.6v6.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "a1", keys: drawKeys(0, 0.4) },
        { part: "a2", keys: drawKeys(0.2, 0.6) },
        { part: "a3", keys: drawKeys(0.4, 0.8) },
      ],
    },
  },
];
