// コミュニケーションカテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, swingKeys, popInKeys, bounceKeys } from "./_shared.js?v=20260815b";

export const COMM_ICONS = [
  {
    id: "mail",
    cat: "comm",
    label: { ja: "メール", en: "Mail" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.6, y: 5.4, width: 18.8, height: 13.2, rx: 2 } },
      { tag: "path", part: "flap", attrs: { d: "M3.2 7 L12 13.4 L20.8 7" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [{ part: "flap", keys: drawKeys(0.15, 0.7) }],
    },
  },

  {
    id: "message",
    cat: "comm",
    label: { ja: "メッセージ", en: "Message" },
    parts: [
      {
        tag: "path",
        part: "bubble",
        attrs: { d: "M20.6 11.8a7.8 7.8 0 0 1-8.4 7.8 8.8 8.8 0 0 1-3.8-.9L3.6 20.4l1.5-4.3a7.7 7.7 0 0 1-1.1-4.3 7.8 7.8 0 0 1 8.4-7.8 7.8 7.8 0 0 1 8.2 7.8z" },
      },
      { tag: "path", part: "dot1", attrs: { d: "M8.6 11.9 L8.6 11.91" } },
      { tag: "path", part: "dot2", attrs: { d: "M12 11.9 L12 11.91" } },
      { tag: "path", part: "dot3", attrs: { d: "M15.4 11.9 L15.4 11.91" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        // 3点の上下だけでは変化が小さいので、吹き出しごと現れる動きを足す
        { part: "bubble", origin: "12px 20.4px", keys: popInKeys(0) },
        { part: "dot1", origin: "8.6px 11.9px", keys: typingKeys(0.3) },
        { part: "dot2", origin: "12px 11.9px", keys: typingKeys(0.42) },
        { part: "dot3", origin: "15.4px 11.9px", keys: typingKeys(0.54) },
      ],
    },
  },

  {
    id: "chat",
    cat: "comm",
    label: { ja: "チャット", en: "Chat" },
    parts: [
      { tag: "path", part: "bubble1", attrs: { d: "M3.4 5.4a2 2 0 0 1 2-2h8.8a2 2 0 0 1 2 2v5.2a2 2 0 0 1-2 2H8.2L4.6 15.6v-3H5.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "bubble2", attrs: { d: "M20.6 12.6a2 2 0 0 0-2-2h-1.4v0a2 2 0 0 1-2 2h-4.6v3.8a2 2 0 0 0 2 2h4.6l2.8 2.8v-2.8a2 2 0 0 0 .6-1.4z" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "bubble1", origin: "9px 9px", keys: popInKeys(0) },
        { part: "bubble2", origin: "16px 16px", keys: popInKeys(0.28) },
      ],
    },
  },

  {
    id: "phone",
    cat: "comm",
    label: { ja: "電話", en: "Phone" },
    parts: [
      {
        tag: "path",
        part: "handset",
        attrs: { d: "M6.6 3.4h3.2l1.6 4-2 1.4a12.4 12.4 0 0 0 5.8 5.8l1.4-2 4 1.6v3.2a1.6 1.6 0 0 1-1.7 1.6A16.6 16.6 0 0 1 5 5.1a1.6 1.6 0 0 1 1.6-1.7z" },
      },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: "handset", origin: "12px 12px", keys: swingKeys(10) }],
    },
  },

  {
    id: "user",
    cat: "comm",
    label: { ja: "ユーザー", en: "User" },
    parts: [
      { tag: "circle", part: "head", attrs: { cx: 12, cy: 8.2, r: 3.8 } },
      { tag: "path", part: "body", attrs: { d: "M4.6 20.6a7.4 7.4 0 0 1 14.8 0" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-out",
      tracks: [
        { part: "head", origin: "12px 8.2px", keys: popInKeys(0) },
        {
          part: "body",
          origin: "12px 20.6px",
          keys: [
            { at: 0, transform: "scaleY(0.2)", opacity: 0 },
            { at: 0.25, transform: "scaleY(0.2)", opacity: 0 },
            { at: 0.6, transform: "scaleY(1)", opacity: 1 },
            { at: 1, transform: "scaleY(1)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "users",
    cat: "comm",
    label: { ja: "ユーザー（複数）", en: "Users" },
    parts: [
      { tag: "circle", part: "head1", attrs: { cx: 9.2, cy: 8.4, r: 3.4 } },
      { tag: "path", part: "body1", attrs: { d: "M3.4 20.6a5.8 5.8 0 0 1 11.6 0" } },
      { tag: "circle", part: "head2", attrs: { cx: 17, cy: 8.4, r: 2.8 } },
      { tag: "path", part: "body2", attrs: { d: "M17 14.8a5 5 0 0 1 3.6 5.8" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: ["head1", "body1"], origin: "9.2px 12px", keys: popInKeys(0) },
        { part: ["head2", "body2"], origin: "17px 12px", keys: popInKeys(0.25) },
      ],
    },
  },

  {
    id: "at",
    cat: "comm",
    label: { ja: "アットマーク", en: "At sign" },
    parts: [
      { tag: "circle", part: "inner", attrs: { cx: 12, cy: 12, r: 3.4 }, animAttrs: DRAW },
      { tag: "path", part: "outer", attrs: { d: "M15.4 12v1.8a2.6 2.6 0 0 0 5.2 0V12a8.6 8.6 0 1 0-3.5 6.9" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "inner", keys: drawKeys(0, 0.4) },
        { part: "outer", keys: drawKeys(0.35, 0.9) },
      ],
    },
  },

  {
    id: "link",
    cat: "comm",
    label: { ja: "リンク", en: "Link" },
    parts: [
      { tag: "path", part: "left", attrs: { d: "M10.2 13.8a4 4 0 0 1 0-5.6l2.6-2.6a4 4 0 0 1 5.6 5.6l-1.2 1.2" } },
      { tag: "path", part: "right", attrs: { d: "M13.8 10.2a4 4 0 0 1 0 5.6l-2.6 2.6a4 4 0 0 1-5.6-5.6l1.2-1.2" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "left",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.4, transform: "translate(1.4px, -1.4px)" },
            { at: 0.8, transform: "translate(0, 0)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
        {
          part: "right",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.4, transform: "translate(-1.4px, 1.4px)" },
            { at: 0.8, transform: "translate(0, 0)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },

  {
    id: "calendar",
    cat: "comm",
    label: { ja: "カレンダー", en: "Calendar" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 5.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "rings", attrs: { d: "M8.2 3.4v4 M15.8 3.4v4 M3.4 10.2h17.2" } },
      // 日付を並べて順に埋める。点1つの点滅では動きが読み取れない
      { tag: "path", part: "day1", attrs: { d: "M7.6 13.8 L7.6 13.81" } },
      { tag: "path", part: "day2", attrs: { d: "M12 13.8 L12 13.81" } },
      { tag: "path", part: "day3", attrs: { d: "M16.4 13.8 L16.4 13.81" } },
      { tag: "path", part: "day4", attrs: { d: "M7.6 17.4 L7.6 17.41" } },
      { tag: "path", part: "day5", attrs: { d: "M12 17.4 L12 17.41" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        // 本体も現れる動きにして、全体として変化が伝わるようにする
        { part: ["frame", "rings"], origin: "12px 12px", keys: popInKeys(0) },
        { part: "day1", origin: "7.6px 13.8px", keys: popInKeys(0.3) },
        { part: "day2", origin: "12px 13.8px", keys: popInKeys(0.4) },
        { part: "day3", origin: "16.4px 13.8px", keys: popInKeys(0.5) },
        { part: "day4", origin: "7.6px 17.4px", keys: popInKeys(0.6) },
        { part: "day5", origin: "12px 17.4px", keys: popInKeys(0.7) },
      ],
    },
  },

  {
    id: "map-pin",
    cat: "comm",
    label: { ja: "地図ピン", en: "Map pin" },
    parts: [
      // 跳ねる余白を残すため一回り小さく描く（4.3 - 線幅1 - 2.4 = 0.9 で枠内）
      { tag: "path", part: "pin", attrs: { d: "M12 20.6s6.2-5.8 6.2-10.1a6.2 6.2 0 0 0-12.4 0c0 4.3 6.2 10.1 6.2 10.1z" } },
      { tag: "circle", part: "dot", attrs: { cx: 12, cy: 10.5, r: 2.3 } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: ["pin", "dot"], origin: "12px 20.6px", keys: bounceKeys("Y", -2.4) }],
    },
  },
];

// 打っている最中のように上下する（吹き出しの3点用）
function typingKeys(delay) {
  return [
    { at: 0, transform: "translateY(0)", opacity: 0.3 },
    { at: delay, transform: "translateY(0)", opacity: 0.3 },
    { at: delay + 0.15, transform: "translateY(-2.2px)", opacity: 1 },
    { at: delay + 0.3, transform: "translateY(0)", opacity: 0.3 },
    { at: 1, transform: "translateY(0)", opacity: 0.3 },
  ];
}
