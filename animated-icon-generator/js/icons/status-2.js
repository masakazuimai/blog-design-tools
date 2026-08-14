// 状態・通知カテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, popInKeys, blinkKeys, bounceKeys } from "./_shared.js?v=20260814f";

export const STATUS_ICONS_2 = [
  {
    id: "help",
    cat: "status",
    label: { ja: "ヘルプ", en: "Help" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "mark", attrs: { d: "M9.4 9.4a2.6 2.6 0 1 1 3.4 2.5c-.5.2-.8.7-.8 1.3v.8" }, animAttrs: DRAW },
      { tag: "path", part: "dot", attrs: { d: "M12 16.8 L12 16.81" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.45) },
        { part: "mark", keys: drawKeys(0.4, 0.75) },
        { part: "dot", origin: "12px 16.8px", keys: popInKeys(0.6) },
      ],
    },
  },
  {
    id: "progress",
    cat: "status",
    label: { ja: "進捗", en: "Progress" },
    parts: [
      { tag: "circle", part: "track", attrs: { cx: 12, cy: 12, r: 8.6, opacity: 0.2 } },
      { tag: "circle", part: "bar", attrs: { cx: 12, cy: 12, r: 8.6, transform: "rotate(-90 12 12)" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.8, easing: "ease-in-out", tracks: [{ part: "bar", keys: drawKeys(0.05, 0.8) }] },
  },
  {
    id: "flame",
    cat: "status",
    label: { ja: "人気", en: "Trending" },
    parts: [
      { tag: "path", part: "outer", attrs: { d: "M12 3.4c1.6 3 4.6 4.4 4.6 8.6A4.6 4.6 0 0 1 12 20.6a4.6 4.6 0 0 1-4.6-8.6c0-4.2 3-5.6 4.6-8.6z" } },
      { tag: "path", part: "inner", attrs: { d: "M12 12.4c.8 1.2 1.8 1.8 1.8 3.4A1.8 1.8 0 0 1 12 17.6a1.8 1.8 0 0 1-1.8-1.8c0-1.6 1-2.2 1.8-3.4z" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "outer", origin: "12px 20px", keys: pulseKeys(1.06) },
        { part: "inner", keys: blinkKeys(0.1) },
      ],
    },
  },
  {
    id: "crown",
    cat: "status",
    label: { ja: "王冠", en: "Crown" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.6 7.4 L7.4 12 L12 5.4 L16.6 12 L20.4 7.4 L18.6 18H5.4z" } },
      { tag: "path", part: "base", attrs: { d: "M5.4 20.6h13.2" } },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: ["body", "base"], origin: "12px 18px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "medal",
    cat: "status",
    label: { ja: "メダル", en: "Medal" },
    parts: [
      { tag: "path", part: "ribbon", attrs: { d: "M8.4 3.6 L11 9.4 M15.6 3.6 L13 9.4" } },
      { tag: "circle", part: "coin", attrs: { cx: 12, cy: 15, r: 5.4 } },
      { tag: "path", part: "star", attrs: { d: "M12 12.6 L12.9 14.4 L14.9 14.7 L13.4 16.1 L13.8 18.1 L12 17.1 L10.2 18.1 L10.6 16.1 L9.1 14.7 L11.1 14.4 Z" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: "star", origin: "12px 15px", keys: popInKeys(0.25) }] },
  },
  {
    id: "trophy",
    cat: "status",
    label: { ja: "トロフィー", en: "Trophy" },
    parts: [
      { tag: "path", part: "cup", attrs: { d: "M7.4 3.6h9.2v5.6a4.6 4.6 0 0 1-9.2 0z" } },
      { tag: "path", part: "handles", attrs: { d: "M7.4 5.4H4.6v1.8a3 3 0 0 0 3 3 M16.6 5.4h2.8v1.8a3 3 0 0 1-3 3" } },
      { tag: "path", part: "base", attrs: { d: "M12 13.8v3.4 M8 20.4h8l-1-3.2H9z" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: ["cup", "handles"], origin: "12px 14px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "bolt",
    cat: "status",
    label: { ja: "高速", en: "Fast" },
    parts: [
      { tag: "path", part: "mark", attrs: { d: "M13.6 3.6 L6.4 13.6h5.4l-1.4 6.8 7.2-10h-5.4z" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [{ part: "mark", keys: drawKeys(0.05, 0.65) }] },
  },
  {
    id: "signal",
    cat: "status",
    label: { ja: "電波", en: "Signal" },
    parts: [
      { tag: "path", part: "b1", attrs: { d: "M4.6 20.4v-3.2" } },
      { tag: "path", part: "b2", attrs: { d: "M9.6 20.4v-6.6" } },
      { tag: "path", part: "b3", attrs: { d: "M14.4 20.4v-10" } },
      { tag: "path", part: "b4", attrs: { d: "M19.4 20.4V6.4" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "b1", origin: "12px 20.4px", keys: growKeys(0) },
        { part: "b2", origin: "12px 20.4px", keys: growKeys(0.12) },
        { part: "b3", origin: "12px 20.4px", keys: growKeys(0.24) },
        { part: "b4", origin: "12px 20.4px", keys: growKeys(0.36) },
      ],
    },
  },
  {
    id: "power",
    cat: "status",
    label: { ja: "電源", en: "Power" },
    parts: [
      { tag: "path", part: "ring", attrs: { d: "M7.4 6.6a8 8 0 1 0 9.2 0" }, animAttrs: DRAW },
      { tag: "path", part: "bar", attrs: { d: "M12 3.6v7.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "bar", keys: drawKeys(0, 0.35) },
        { part: "ring", keys: drawKeys(0.3, 0.85) },
      ],
    },
  },
  {
    id: "bell-off",
    cat: "status",
    label: { ja: "通知オフ", en: "Notifications off" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M7 16.4V10.6a5 5 0 0 1 6.8-4.7 M17 12.6v3.8 M4.8 16.4h14.4" } },
      { tag: "path", part: "clapper", attrs: { d: "M10 19.4a2 2 0 0 0 4 0" } },
      { tag: "path", part: "slash", attrs: { d: "M4.6 4.6 L19.4 19.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "slash", keys: drawKeys(0.15, 0.65) }] },
  },
  {
    id: "timer",
    cat: "status",
    label: { ja: "タイマー", en: "Timer" },
    parts: [
      { tag: "circle", part: "body", attrs: { cx: 12, cy: 13.6, r: 7.6 } },
      { tag: "path", part: "cap", attrs: { d: "M9.4 3.6h5.2 M12 3.6v2.4" } },
      { tag: "path", part: "hand", attrs: { d: "M12 13.6V7.4" } },
    ],
    anim: {
      duration: 2,
      easing: "linear",
      tracks: [
        // 針を長くして可視性を上げ、本体も鼓動させる
        { part: "hand", origin: "12px 13.6px", keys: spinKeys() },
        { part: "body", origin: "12px 13.6px", keys: pulseKeys(1.06) },
      ],
    },
  },
  {
    id: "done-all",
    cat: "status",
    label: { ja: "完了（既読）", en: "Done all" },
    parts: [
      { tag: "path", part: "tick1", attrs: { d: "M3.6 12.4 L7.6 16.4 L14.8 7.6" }, animAttrs: DRAW },
      { tag: "path", part: "tick2", attrs: { d: "M9.4 15.4 L11.6 17.6 L20.4 7.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-out",
      tracks: [
        { part: "tick1", keys: drawKeys(0, 0.45) },
        { part: "tick2", keys: drawKeys(0.35, 0.8) },
      ],
    },
  },
  {
    id: "block",
    cat: "status",
    label: { ja: "禁止", en: "Blocked" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "slash", attrs: { d: "M5.6 5.6 L18.4 18.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.55) },
        { part: "slash", keys: drawKeys(0.5, 0.85) },
      ],
    },
  },
  {
    id: "infinity",
    cat: "status",
    label: { ja: "無制限", en: "Unlimited" },
    parts: [
      { tag: "path", part: "mark", attrs: { d: "M12 12c-1.6-2.4-3-3.6-4.8-3.6a3.6 3.6 0 0 0 0 7.2c1.8 0 3.2-1.2 4.8-3.6s3-3.6 4.8-3.6a3.6 3.6 0 0 1 0 7.2c-1.8 0-3.2-1.2-4.8-3.6z" }, animAttrs: DRAW },
    ],
    anim: { duration: 2, easing: "linear", tracks: [{ part: "mark", keys: drawKeys(0.05, 0.85) }] },
  },
  {
    id: "plug",
    cat: "status",
    label: { ja: "接続", en: "Connected" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M7.4 9.6h9.2v2.8a4.6 4.6 0 0 1-9.2 0z" } },
      { tag: "path", part: "pins", attrs: { d: "M9.8 9.6V4.6 M14.2 9.6V4.6" } },
      { tag: "path", part: "cord", attrs: { d: "M12 17v3.4" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["body", "pins", "cord"], origin: "12px 14px", keys: bounceKeys("Y", -1.4) }] },
  },
];

// 底辺を軸に伸び上がる（電波バー用）
function growKeys(delay) {
  return [
    { at: 0, transform: "scaleY(0)" },
    { at: delay, transform: "scaleY(0)" },
    { at: delay + 0.4, transform: "scaleY(1)" },
    { at: 1, transform: "scaleY(1)" },
  ];
}
