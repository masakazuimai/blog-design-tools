// ファイル・データカテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260814f";

// 底辺を軸に伸び上がる（棒グラフ用）
const growKeys = (delay) => [
  { at: 0, transform: "scaleY(0)" },
  { at: delay, transform: "scaleY(0)" },
  { at: delay + 0.45, transform: "scaleY(1)" },
  { at: 1, transform: "scaleY(1)" },
];

export const FILE_ICONS = [
  {
    id: "file",
    cat: "file",
    label: { ja: "ファイル", en: "File" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M13.6 3.4H6.4a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2V9.4z" }, animAttrs: DRAW },
      { tag: "path", part: "fold", attrs: { d: "M13.6 3.4v6h6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: "body", keys: drawKeys(0, 0.65) },
        { part: "fold", keys: drawKeys(0.6, 0.9) },
      ],
    },
  },

  {
    id: "folder",
    cat: "file",
    label: { ja: "フォルダ", en: "Folder" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 6.4a2 2 0 0 1 2-2h4.2l2 2.6h7a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [{ part: "body", origin: "12px 12px", keys: pulseKeys(1.1) }],
    },
  },

  {
    id: "folder-open",
    cat: "file",
    label: { ja: "フォルダ（開く）", en: "Folder open" },
    parts: [
      { tag: "path", part: "back", attrs: { d: "M3.4 18.6V6.4a2 2 0 0 1 2-2h4.2l2 2.6h7a2 2 0 0 1 2 2v2.4" } },
      { tag: "path", part: "flap", attrs: { d: "M3.6 18.6l2.7-7.2h14.4l-2.7 7.2z" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "flap",
          origin: "5px 18.6px",
          keys: [
            { at: 0, transform: "rotate(9deg)" },
            { at: 0.45, transform: "rotate(0deg)" },
            { at: 0.8, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(9deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "document",
    cat: "file",
    label: { ja: "ドキュメント", en: "Document" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M13.6 3.4H6.4a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2V9.4z M13.6 3.4v6h6" } },
      { tag: "path", part: "line1", attrs: { d: "M8 12.4h8" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M8 16h8" }, animAttrs: DRAW },
      { tag: "path", part: "line3", attrs: { d: "M8 8.8h3.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "line3", keys: drawKeys(0, 0.3) },
        { part: "line1", keys: drawKeys(0.25, 0.6) },
        { part: "line2", keys: drawKeys(0.5, 0.85) },
      ],
    },
  },

  {
    id: "clipboard",
    cat: "file",
    label: { ja: "クリップボード", en: "Clipboard" },
    parts: [
      { tag: "path", part: "board", attrs: { d: "M8.6 4.8H6.4a2 2 0 0 0-2 2v11.8a2 2 0 0 0 2 2h11.2a2 2 0 0 0 2-2V6.8a2 2 0 0 0-2-2h-2.2" } },
      { tag: "rect", part: "clip", attrs: { x: 8.4, y: 2.8, width: 7.2, height: 4, rx: 1.4 } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [{ part: "clip", origin: "12px 4.8px", keys: popInKeys(0.15) }],
    },
  },

  {
    id: "archive",
    cat: "file",
    label: { ja: "アーカイブ", en: "Archive" },
    parts: [
      { tag: "rect", part: "lid", attrs: { x: 2.6, y: 4.4, width: 18.8, height: 4.4, rx: 1.4 } },
      { tag: "path", part: "body", attrs: { d: "M4.6 8.8v9.8a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2V8.8" } },
      { tag: "path", part: "handle", attrs: { d: "M9.8 13h4.4" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "lid",
          origin: "12px 6.6px",
          keys: [
            { at: 0, transform: "translateY(-3.4px)", opacity: 0 },
            { at: 0.45, transform: "translateY(0)", opacity: 1 },
            { at: 1, transform: "translateY(0)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "chart-bar",
    cat: "file",
    label: { ja: "棒グラフ", en: "Bar chart" },
    parts: [
      { tag: "path", part: "axis", attrs: { d: "M3.6 20.4h16.8" } },
      { tag: "path", part: "bar1", attrs: { d: "M7.4 20.4v-5.8" } },
      { tag: "path", part: "bar2", attrs: { d: "M12 20.4v-11" } },
      { tag: "path", part: "bar3", attrs: { d: "M16.6 20.4v-8" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "bar1", origin: "12px 20.4px", keys: growKeys(0) },
        { part: "bar2", origin: "12px 20.4px", keys: growKeys(0.15) },
        { part: "bar3", origin: "12px 20.4px", keys: growKeys(0.3) },
      ],
    },
  },

  {
    id: "chart-line",
    cat: "file",
    label: { ja: "折れ線グラフ", en: "Line chart" },
    parts: [
      { tag: "path", part: "axis", attrs: { d: "M3.6 3.6v16.8h16.8" } },
      { tag: "path", part: "line", attrs: { d: "M6.6 16.6 L10.4 11.4 L14.2 14 L19.4 6.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [{ part: "line", keys: drawKeys(0.1, 0.8) }],
    },
  },

  {
    id: "chart-pie",
    cat: "file",
    label: { ja: "円グラフ", en: "Pie chart" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "slice", attrs: { d: "M12 12 V3.4 A8.6 8.6 0 0 1 20.6 12 Z" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        {
          part: "slice",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(-90deg)", opacity: 0 },
            { at: 0.55, transform: "rotate(0deg)", opacity: 1 },
            { at: 1, transform: "rotate(0deg)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "database",
    cat: "file",
    label: { ja: "データベース", en: "Database" },
    parts: [
      { tag: "ellipse", part: "top", attrs: { cx: 12, cy: 6.2, rx: 8, ry: 2.8 } },
      { tag: "path", part: "side", attrs: { d: "M4 6.2v11.6c0 1.6 3.6 2.8 8 2.8s8-1.2 8-2.8V6.2" } },
      { tag: "path", part: "mid", attrs: { d: "M20 12c0 1.6-3.6 2.8-8 2.8S4 13.6 4 12" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "top", keys: blinkKeys(0.05) },
        { part: "mid", keys: blinkKeys(0.25) },
      ],
    },
  },

  {
    id: "code",
    cat: "file",
    label: { ja: "コード", en: "Code" },
    parts: [
      { tag: "path", part: "left", attrs: { d: "M8.4 7.6 L3.8 12 L8.4 16.4" } },
      { tag: "path", part: "right", attrs: { d: "M15.6 7.6 L20.2 12 L15.6 16.4" } },
      { tag: "path", part: "slash", attrs: { d: "M13.4 5.4 L10.6 18.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: "left",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.4, transform: "translateX(-2.2px)" },
            { at: 0.8, transform: "translateX(0)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
        {
          part: "right",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.4, transform: "translateX(2.2px)" },
            { at: 0.8, transform: "translateX(0)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
        { part: "slash", keys: drawKeys(0.15, 0.6) },
      ],
    },
  },

  {
    id: "terminal",
    cat: "file",
    label: { ja: "ターミナル", en: "Terminal" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 2.6, y: 4.4, width: 18.8, height: 15.2, rx: 2 } },
      { tag: "path", part: "prompt", attrs: { d: "M6.6 9.6 L9.8 12.4 L6.6 15.2" }, animAttrs: DRAW },
      { tag: "path", part: "cursor", attrs: { d: "M12.6 15.4h5" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "prompt", keys: drawKeys(0, 0.4) },
        {
          part: "cursor",
          keys: [
            { at: 0, opacity: 0 },
            { at: 0.4, opacity: 0 },
            { at: 0.5, opacity: 1 },
            { at: 0.65, opacity: 0 },
            { at: 0.8, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
      ],
    },
  },
];
