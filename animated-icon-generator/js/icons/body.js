// 人・体・健康カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, swingKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260814f";

export const BODY_ICONS = [
  {
    id: "wave",
    cat: "body",
    label: { ja: "手を振る", en: "Wave" },
    parts: [
      {
        tag: "path",
        part: "hand",
        attrs: { d: "M8.4 12.6V6.8a1.4 1.4 0 0 1 2.8 0v4.4V5.4a1.4 1.4 0 0 1 2.8 0v6V7.4a1.4 1.4 0 0 1 2.8 0v7.2a5.6 5.6 0 0 1-5.6 5.6 5.6 5.6 0 0 1-5.6-5.6v-2a1.4 1.4 0 0 1 2.8 0z" },
      },
    ],
    anim: { duration: 1.2, easing: "ease-in-out", tracks: [{ part: "hand", origin: "12px 19px", keys: swingKeys(14) }] },
  },
  {
    id: "thumbs-down",
    cat: "body",
    label: { ja: "よくない", en: "Thumbs down" },
    parts: [
      { tag: "path", part: "base", attrs: { d: "M3.2 3.4h3.4v9.2H3.2z" } },
      {
        tag: "path",
        part: "hand",
        attrs: { d: "M6.6 12.6 L10.6 20.4 a2.1 2.1 0 0 0 3-1.9 V14 h4.9 a2.1 2.1 0 0 0 2-2.6 l-1.4-6.1 a2.1 2.1 0 0 0-2-1.6 H6.6" },
      },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["base", "hand"],
          origin: "6px 4px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.2, transform: "rotate(10deg)" },
            { at: 0.45, transform: "rotate(-4deg)" },
            { at: 0.65, transform: "rotate(4deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    // 手のひら2枚で拍手を表す案は小サイズで形が読めなかったため、
    // 同じ「祝う」文脈で判別しやすいクラッカーにする
    id: "celebrate",
    cat: "body",
    label: { ja: "お祝い", en: "Celebrate" },
    parts: [
      { tag: "path", part: "cone", attrs: { d: "M3.8 20.2 L9.4 9.2 L14.8 14.6 Z" } },
      { tag: "path", part: "band", attrs: { d: "M6.6 14.6 L10.2 18.2" } },
      { tag: "path", part: "c1", attrs: { d: "M17 8 L17 8.01" } },
      { tag: "path", part: "c2", attrs: { d: "M20.2 11.4 L20.2 11.41" } },
      { tag: "path", part: "c3", attrs: { d: "M15.4 4.6 L15.4 4.61" } },
      { tag: "path", part: "c4", attrs: { d: "M19.8 5.6 L19.8 5.61" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "c1", origin: "17px 8px", keys: popInKeys(0) },
        { part: "c2", origin: "20.2px 11.4px", keys: popInKeys(0.14) },
        { part: "c3", origin: "15.4px 4.6px", keys: popInKeys(0.28) },
        { part: "c4", origin: "19.8px 5.6px", keys: popInKeys(0.42) },
        {
          part: ["cone", "band"],
          origin: "4px 20px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.12, transform: "rotate(-7deg)" },
            { at: 0.3, transform: "rotate(3deg)" },
            { at: 0.5, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    // 手で指し示す絵は小さいサイズで別のジェスチャーに見えるリスクがあるため、
    // 矢印ポインタ（カーソル）で「指し示す」を表す
    id: "cursor",
    cat: "body",
    label: { ja: "カーソル", en: "Cursor" },
    parts: [
      { tag: "path", part: "arrow", attrs: { d: "M6.6 3.8 L6.6 18 L10.2 14.6 L12.8 20.2 L15.2 19.1 L12.7 13.7 L17.6 13.5 Z" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          // 押し込むような小さいクリック動作
          part: "arrow",
          origin: "6.6px 3.8px",
          keys: [
            { at: 0, transform: "translate(0, 0) scale(1)" },
            { at: 0.3, transform: "translate(1.2px, 1.2px) scale(0.92)" },
            { at: 0.6, transform: "translate(0, 0) scale(1)" },
            { at: 1, transform: "translate(0, 0) scale(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "ok-hand",
    cat: "body",
    label: { ja: "OKサイン", en: "OK hand" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 8.8, cy: 8.8, r: 3.6 } },
      { tag: "path", part: "fingers", attrs: { d: "M11.8 11.2 L15.4 7.6a1.5 1.5 0 0 1 2.2 2.2l-2.2 2.4 M13.4 13.4l3.6-1.2a1.4 1.4 0 0 1 1 2.6l-4.6 3.2a6 6 0 0 1-7.6-.8l-2-2" } },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: ["ring", "fingers"], origin: "12px 12px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "heartbeat",
    cat: "body",
    label: { ja: "心拍", en: "Heartbeat" },
    parts: [
      { tag: "path", part: "line", attrs: { d: "M3.4 12h3.6l2-4.4 3 9.2 2.4-6 1.6 3.2h4.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "linear", tracks: [{ part: "line", keys: drawKeys(0.05, 0.75) }] },
  },
  {
    id: "brain",
    cat: "body",
    label: { ja: "思考", en: "Brain" },
    parts: [
      { tag: "path", part: "left", attrs: { d: "M11.4 5.4a3 3 0 0 0-5.4 1.6 2.8 2.8 0 0 0-1.6 4.4 2.8 2.8 0 0 0 .8 4 3 3 0 0 0 4.4 3.2h1.8z" } },
      { tag: "path", part: "right", attrs: { d: "M12.6 5.4a3 3 0 0 1 5.4 1.6 2.8 2.8 0 0 1 1.6 4.4 2.8 2.8 0 0 1-.8 4 3 3 0 0 1-4.4 3.2h-1.8z" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "left", origin: "9px 12px", keys: pulseKeys(1.06) },
        {
          part: "right",
          origin: "15px 12px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.35, transform: "scale(1)" },
            { at: 0.55, transform: "scale(1.06)" },
            { at: 0.8, transform: "scale(1)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "footstep",
    cat: "body",
    label: { ja: "足あと", en: "Footsteps" },
    parts: [
      // 跳ねて出る動きぶんの余白を上下に残す
      { tag: "path", part: "left", attrs: { d: "M7.8 5.4a2.2 2.2 0 0 1 2.2 2.2v3.2a2.2 2.2 0 0 1-4.4 0V7.6a2.2 2.2 0 0 1 2.2-2.2z M5.6 12.8h4.4v2a2.2 2.2 0 0 1-4.4 0z" } },
      { tag: "path", part: "right", attrs: { d: "M16.2 9.6a2.2 2.2 0 0 1 2.2 2.2v3.2a2.2 2.2 0 0 1-4.4 0v-3.2a2.2 2.2 0 0 1 2.2-2.2z M14 17h4.4v2a2.2 2.2 0 0 1-4.4 0z" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "left", origin: "7.8px 10px", keys: popInKeys(0) },
        { part: "right", origin: "16.2px 14.6px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "run",
    cat: "body",
    label: { ja: "ランニング", en: "Running" },
    parts: [
      { tag: "circle", part: "head", attrs: { cx: 15.4, cy: 5.6, r: 2.2 } },
      { tag: "path", part: "body", attrs: { d: "M16.4 9.4 L12.6 11.6l1.6 3.4-2.6 4.6 M14.2 15h3.6l1.6 4.4 M16.4 9.4h-4l-3 3.6H5.6" } },
    ],
    anim: {
      duration: 1,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["head", "body"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.3, transform: "translate(1px, -1px)" },
            { at: 0.6, transform: "translate(-0.8px, 0.6px)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },
  {
    id: "sleep",
    cat: "body",
    label: { ja: "おやすみ", en: "Sleep" },
    parts: [
      { tag: "path", part: "moon", attrs: { d: "M18.4 14.6A7.4 7.4 0 0 1 9.4 5.6a7.4 7.4 0 1 0 9 9z" } },
      { tag: "path", part: "z1", attrs: { d: "M14.6 3.6h3.2l-3.2 3.6h3.2" }, animAttrs: DRAW },
      { tag: "path", part: "z2", attrs: { d: "M19.4 8.6h2.2l-2.2 2.6h2.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 2,
      easing: "ease-out",
      tracks: [
        { part: "z1", keys: drawKeys(0.1, 0.5) },
        { part: "z2", keys: drawKeys(0.4, 0.8) },
      ],
    },
  },
  {
    id: "pill",
    cat: "body",
    label: { ja: "薬", en: "Medicine" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M8.4 4.4a4.6 4.6 0 0 1 6.6 6.6l-4 4a4.6 4.6 0 0 1-6.6-6.6z" } },
      { tag: "path", part: "split", attrs: { d: "M7.4 7.4 L12.6 12.6" } },
      { tag: "circle", part: "second", attrs: { cx: 16.6, cy: 16.6, r: 4 } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: ["body", "split"], origin: "9.5px 9.5px", keys: popInKeys(0) },
        { part: "second", origin: "16.6px 16.6px", keys: popInKeys(0.3) },
      ],
    },
  },
  {
    id: "stethoscope",
    cat: "body",
    label: { ja: "健康診断", en: "Checkup" },
    parts: [
      { tag: "path", part: "tube", attrs: { d: "M6.4 3.6v5.2a4.4 4.4 0 0 0 8.8 0V3.6" }, animAttrs: DRAW },
      { tag: "path", part: "cord", attrs: { d: "M10.8 13.2v3.2a4 4 0 0 0 7 2.6" }, animAttrs: DRAW },
      { tag: "circle", part: "head", attrs: { cx: 18.6, cy: 17.4, r: 2.2 } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "tube", keys: drawKeys(0.05, 0.45) },
        { part: "cord", keys: drawKeys(0.4, 0.75) },
        { part: "head", origin: "18.6px 17.4px", keys: popInKeys(0.7) },
      ],
    },
  },
  {
    id: "dna",
    cat: "body",
    label: { ja: "DNA", en: "DNA" },
    parts: [
      { tag: "path", part: "strand1", attrs: { d: "M7.4 3.6c0 6 9.2 8.4 9.2 16.8" }, animAttrs: DRAW },
      { tag: "path", part: "strand2", attrs: { d: "M16.6 3.6c0 6-9.2 8.4-9.2 16.8" }, animAttrs: DRAW },
      { tag: "path", part: "rungs", attrs: { d: "M8.6 7.4h6.8 M8.6 16.6h6.8 M10.6 12h2.8" } },
    ],
    anim: {
      duration: 2,
      easing: "ease-in-out",
      tracks: [
        { part: "strand1", keys: drawKeys(0, 0.6) },
        { part: "strand2", keys: drawKeys(0.15, 0.75) },
        { part: "rungs", keys: blinkKeys(0.5) },
      ],
    },
  },
  {
    id: "mask",
    cat: "body",
    label: { ja: "マスク", en: "Face mask" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M5.4 8.4h13.2v5.2a6.6 6.6 0 0 1-13.2 0z" } },
      { tag: "path", part: "strap", attrs: { d: "M5.4 9.4 L3.4 7.4 M18.6 9.4 L20.6 7.4" } },
      { tag: "path", part: "folds", attrs: { d: "M5.4 11.4h13.2 M6.4 14h11.2" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: ["body", "strap", "folds"], origin: "12px 12px", keys: pulseKeys(1.06) }] },
  },
];
