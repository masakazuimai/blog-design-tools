// コミュニケーションカテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, swingKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260814f";

export const COMM_ICONS_2 = [
  {
    id: "mail-open",
    cat: "comm",
    label: { ja: "開封済みメール", en: "Mail opened" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 10.4 L12 4.4 L20.6 10.4v8.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "flap", attrs: { d: "M3.4 10.4 L12 16.4 L20.6 10.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: "flap", keys: drawKeys(0.2, 0.7) }] },
  },
  {
    id: "inbox",
    cat: "comm",
    label: { ja: "受信トレイ", en: "Inbox" },
    parts: [
      { tag: "path", part: "tray", attrs: { d: "M3.4 13.4h4.6l1.4 2.6h5.2l1.4-2.6h4.6v5.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 3.6v7 M9 7.8 L12 10.8 L15 7.8" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: "arrow", origin: "12px 8px", keys: bounceKeys("Y", 1.6) }] },
  },
  {
    id: "reply",
    cat: "comm",
    label: { ja: "返信", en: "Reply" },
    parts: [
      { tag: "path", part: "arc", attrs: { d: "M4.6 9.6h9.8a5.4 5.4 0 0 1 5.4 5.4v3.4" }, animAttrs: DRAW },
      { tag: "path", part: "head", attrs: { d: "M9 5.2 L4.4 9.6 L9 14" } },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: ["arc", "head"], origin: "12px 12px", keys: bounceKeys("X", -1.8) }] },
  },
  {
    id: "contact",
    cat: "comm",
    label: { ja: "連絡先", en: "Contact card" },
    parts: [
      { tag: "rect", part: "card", attrs: { x: 2.6, y: 4.4, width: 18.8, height: 15.2, rx: 2 } },
      { tag: "circle", part: "face", attrs: { cx: 8.6, cy: 10.4, r: 2.4 } },
      { tag: "path", part: "shoulder", attrs: { d: "M5 15.6a3.8 3.8 0 0 1 7.2 0" } },
      { tag: "path", part: "lines", attrs: { d: "M14.8 9.6h3.8 M14.8 13.4h3.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: ["face", "shoulder"], origin: "8.6px 12px", keys: popInKeys(0.05) },
        { part: "lines", keys: drawKeys(0.35, 0.75) },
      ],
    },
  },
  {
    id: "video-call",
    cat: "comm",
    label: { ja: "ビデオ通話", en: "Video call" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.6, y: 6.4, width: 13, height: 11.2, rx: 2 } },
      { tag: "path", part: "lens", attrs: { d: "M15.6 10.8 L21.4 7.2v9.6l-5.8-3.6z" } },
      { tag: "circle", part: "face", attrs: { cx: 9.1, cy: 12, r: 2.6 } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        { part: "face", origin: "9.1px 12px", keys: popInKeys(0.15) },
        {
          // レンズ側も振って、通話中らしい動きにする
          part: "lens",
          origin: "15.6px 12px",
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
    id: "phone-off",
    cat: "comm",
    label: { ja: "通話終了", en: "Call ended" },
    parts: [
      { tag: "path", part: "handset", attrs: { d: "M6.6 3.6h3.2l1.6 4-2 1.4a12.4 12.4 0 0 0 5.8 5.8l1.4-2 4 1.6v3.2a1.6 1.6 0 0 1-1.7 1.6" } },
      { tag: "path", part: "slash", attrs: { d: "M4.6 4.6 L19.4 19.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "slash", keys: drawKeys(0.15, 0.65) }] },
  },
  {
    id: "megaphone",
    cat: "comm",
    label: { ja: "お知らせ", en: "Announcement" },
    parts: [
      { tag: "path", part: "horn", attrs: { d: "M4.4 9.6h3.6l10-4.4v13.6l-10-4.4H4.4a2 2 0 0 1-2-2v-.8a2 2 0 0 1 2-2z" } },
      { tag: "path", part: "handle", attrs: { d: "M8 14.4v4.6a1.6 1.6 0 0 0 3.2 0v-3.2" } },
      { tag: "path", part: "wave", attrs: { d: "M20.4 9.6a4 4 0 0 1 0 4.8" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: ["horn", "handle"], origin: "4.4px 12px", keys: swingKeys(7) },
        { part: "wave", keys: blinkKeys(0.25) },
      ],
    },
  },
  {
    id: "rss",
    cat: "comm",
    label: { ja: "RSS", en: "RSS" },
    parts: [
      { tag: "path", part: "dot", attrs: { d: "M5.4 18.6 L5.4 18.61" } },
      { tag: "path", part: "arc1", attrs: { d: "M4.6 12.4a7.4 7.4 0 0 1 7.4 7.4" }, animAttrs: DRAW },
      { tag: "path", part: "arc2", attrs: { d: "M4.6 5.4a14.4 14.4 0 0 1 14.4 14.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "dot", origin: "5.4px 18.6px", keys: popInKeys(0) },
        { part: "arc1", keys: drawKeys(0.2, 0.55) },
        { part: "arc2", keys: drawKeys(0.45, 0.85) },
      ],
    },
  },
  {
    id: "hashtag",
    cat: "comm",
    label: { ja: "ハッシュタグ", en: "Hashtag" },
    parts: [
      { tag: "path", part: "v", attrs: { d: "M9.6 3.6 L7.6 20.4 M16.4 3.6 L14.4 20.4" }, animAttrs: DRAW },
      { tag: "path", part: "h", attrs: { d: "M4.6 8.6h15.4 M4 15.4h15.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        { part: "v", keys: drawKeys(0, 0.5) },
        { part: "h", keys: drawKeys(0.35, 0.85) },
      ],
    },
  },
  {
    id: "thread",
    cat: "comm",
    label: { ja: "スレッド", en: "Thread" },
    parts: [
      { tag: "path", part: "line", attrs: { d: "M6.4 4.6v10a3 3 0 0 0 3 3h2" }, animAttrs: DRAW },
      { tag: "rect", part: "b1", attrs: { x: 3.6, y: 3.4, width: 11.2, height: 5.6, rx: 1.6 } },
      { tag: "rect", part: "b2", attrs: { x: 10.4, y: 14.6, width: 10, height: 5.6, rx: 1.6 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "line", keys: drawKeys(0.15, 0.55) },
        { part: "b2", origin: "15.4px 17.4px", keys: popInKeys(0.5) },
      ],
    },
  },
  {
    id: "translate",
    cat: "comm",
    label: { ja: "翻訳", en: "Translate" },
    parts: [
      { tag: "path", part: "letters", attrs: { d: "M3.6 6.4h7.6 M7.4 4.6v1.8 M9.4 6.4a10 10 0 0 1-6 8.4 M5.6 10.4a8 8 0 0 0 5.6 4" } },
      { tag: "path", part: "second", attrs: { d: "M11.4 20.4l4-9.6 4 9.6 M12.8 17.4h5.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "ease-out", tracks: [{ part: "second", keys: drawKeys(0.25, 0.8) }] },
  },
  {
    id: "world",
    cat: "comm",
    label: { ja: "多言語・世界", en: "Global" },
    parts: [
      { tag: "circle", part: "globe", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "lat", attrs: { d: "M3.4 12h17.2" } },
      { tag: "path", part: "lng", attrs: { d: "M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2" } },
    ],
    anim: { duration: 3, easing: "linear", tracks: [{ part: "lng", origin: "12px 12px", keys: [
      { at: 0, transform: "scaleX(1)" },
      { at: 0.5, transform: "scaleX(0.1)" },
      { at: 1, transform: "scaleX(1)" },
    ] }] },
  },
  {
    id: "address-book",
    cat: "comm",
    label: { ja: "アドレス帳", en: "Address book" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 5.4, y: 3.4, width: 14.2, height: 17.2, rx: 2 } },
      { tag: "path", part: "rings", attrs: { d: "M3.4 8h3.2 M3.4 12h3.2 M3.4 16h3.2" } },
      { tag: "circle", part: "face", attrs: { cx: 12.5, cy: 10.4, r: 2.4 } },
      { tag: "path", part: "shoulder", attrs: { d: "M8.9 16a3.8 3.8 0 0 1 7.2 0" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: ["face", "shoulder"], origin: "12.5px 12px", keys: popInKeys(0.15) }] },
  },
  {
    id: "invite",
    cat: "comm",
    label: { ja: "招待", en: "Invite" },
    parts: [
      { tag: "circle", part: "head", attrs: { cx: 9.4, cy: 8.4, r: 3.4 } },
      { tag: "path", part: "body", attrs: { d: "M3.6 20.4a5.8 5.8 0 0 1 11.6 0" } },
      { tag: "path", part: "plus", attrs: { d: "M18.6 6.4v6 M15.6 9.4h6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: "plus", keys: drawKeys(0.25, 0.75) }] },
  },
];
