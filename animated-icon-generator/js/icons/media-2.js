// メディアカテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260815c";

export const MEDIA_ICONS_2 = [
  {
    id: "rewind",
    cat: "media",
    label: { ja: "巻き戻し", en: "Rewind" },
    parts: [
      { tag: "path", part: "t1", attrs: { d: "M11.4 6.6 L4.6 12 L11.4 17.4 Z" } },
      { tag: "path", part: "t2", attrs: { d: "M19.4 6.6 L12.6 12 L19.4 17.4 Z" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "t1", origin: "12px 12px", keys: bounceKeys("X", -1.6) },
        { part: "t2", origin: "12px 12px", keys: bounceKeys("X", -1.6) },
      ],
    },
  },
  {
    id: "forward",
    cat: "media",
    label: { ja: "早送り", en: "Fast forward" },
    parts: [
      { tag: "path", part: "t1", attrs: { d: "M4.6 6.6 L11.4 12 L4.6 17.4 Z" } },
      { tag: "path", part: "t2", attrs: { d: "M12.6 6.6 L19.4 12 L12.6 17.4 Z" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "t1", origin: "12px 12px", keys: bounceKeys("X", 1.6) },
        { part: "t2", origin: "12px 12px", keys: bounceKeys("X", 1.6) },
      ],
    },
  },
  {
    id: "repeat",
    cat: "media",
    label: { ja: "リピート", en: "Repeat" },
    parts: [
      // 折り返しの角は矢じりと反対側の端に置く（同じ端に重ねると入れ替えアイコンに見える）
      { tag: "path", part: "top", attrs: { d: "M6.4 11.6V8.4h11.2" } },
      { tag: "path", part: "topHead", attrs: { d: "M14.6 5.4 L17.6 8.4 L14.6 11.4" } },
      { tag: "path", part: "bottom", attrs: { d: "M17.6 12.4v3.2H6.4" } },
      { tag: "path", part: "bottomHead", attrs: { d: "M9.4 18.6 L6.4 15.6 L9.4 12.6" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: ["top", "topHead"], origin: "12px 8.4px", keys: bounceKeys("X", 1.4) },
        { part: ["bottom", "bottomHead"], origin: "12px 15.6px", keys: bounceKeys("X", -1.4) },
      ],
    },
  },
  {
    id: "shuffle",
    cat: "media",
    label: { ja: "シャッフル", en: "Shuffle" },
    parts: [
      { tag: "path", part: "p1", attrs: { d: "M3.6 7.4h3.6l9.2 9.2h3.6" }, animAttrs: DRAW },
      { tag: "path", part: "p2", attrs: { d: "M3.6 16.6h3.6l3-3" }, animAttrs: DRAW },
      { tag: "path", part: "p3", attrs: { d: "M13.4 10.4l3-3h3.6" }, animAttrs: DRAW },
      { tag: "path", part: "heads", attrs: { d: "M17.4 4.6 L20.4 7.4 L17.4 10.2 M17.4 13.8 L20.4 16.6 L17.4 19.4" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "p1", keys: drawKeys(0, 0.5) },
        { part: ["p2", "p3"], keys: drawKeys(0.35, 0.75) },
      ],
    },
  },
  {
    id: "playlist",
    cat: "media",
    label: { ja: "プレイリスト", en: "Playlist" },
    parts: [
      { tag: "path", part: "lines", attrs: { d: "M3.6 6.6h11.2 M3.6 11.4h11.2 M3.6 16.2h6.8" }, animAttrs: DRAW },
      { tag: "path", part: "tri", attrs: { d: "M14.6 14 L20.4 17.4 L14.6 20.8 Z" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "lines", keys: drawKeys(0, 0.55) },
        { part: "tri", origin: "17px 17.4px", keys: popInKeys(0.5) },
      ],
    },
  },
  {
    id: "film",
    cat: "media",
    label: { ja: "フィルム", en: "Film" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "rails", attrs: { d: "M7.4 4.4v15.2 M16.6 4.4v15.2" } },
      { tag: "path", part: "holes", attrs: { d: "M5.4 6.4h0.01 M5.4 10.4h0.01 M5.4 14.4h0.01 M5.4 18.4h0.01 M18.6 6.4h0.01 M18.6 10.4h0.01 M18.6 14.4h0.01 M18.6 18.4h0.01" } },
      { tag: "path", part: "cut", attrs: { d: "M7.4 12h9.2" } },
    ],
    anim: {
      duration: 1.6,
      easing: "linear",
      tracks: [
        // 小さな穴の点滅ではなく、フィルムが送られる動きにする
        {
          part: "holes",
          keys: [
            { at: 0, transform: "translateY(0)" },
            { at: 1, transform: "translateY(4px)" },
          ],
        },
        {
          part: "cut",
          keys: [
            { at: 0, transform: "translateY(-4px)" },
            { at: 1, transform: "translateY(4px)" },
          ],
        },
      ],
    },
  },
  {
    id: "podcast",
    cat: "media",
    label: { ja: "ポッドキャスト", en: "Podcast" },
    parts: [
      { tag: "circle", part: "core", attrs: { cx: 12, cy: 12, r: 2.6 } },
      { tag: "path", part: "inner", attrs: { d: "M8.2 15.8a5.4 5.4 0 0 1 0-7.6 M15.8 8.2a5.4 5.4 0 0 1 0 7.6" } },
      { tag: "path", part: "outer", attrs: { d: "M5.4 18.6a9.4 9.4 0 0 1 0-13.2 M18.6 5.4a9.4 9.4 0 0 1 0 13.2" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "inner", keys: blinkKeys(0.1) },
        { part: "outer", keys: blinkKeys(0.3) },
      ],
    },
  },
  {
    id: "equalizer",
    cat: "media",
    label: { ja: "イコライザー", en: "Equalizer" },
    parts: [
      { tag: "path", part: "b1", attrs: { d: "M5.4 20.4v-8" } },
      { tag: "path", part: "b2", attrs: { d: "M9.8 20.4v-13" } },
      { tag: "path", part: "b3", attrs: { d: "M14.2 20.4v-10" } },
      { tag: "path", part: "b4", attrs: { d: "M18.6 20.4v-15" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "b1", origin: "12px 20.4px", keys: eqKeys(0.35) },
        { part: "b2", origin: "12px 20.4px", keys: eqKeys(0.6) },
        { part: "b3", origin: "12px 20.4px", keys: eqKeys(0.45) },
        { part: "b4", origin: "12px 20.4px", keys: eqKeys(0.7) },
      ],
    },
  },
  {
    id: "subtitle",
    cat: "media",
    label: { ja: "字幕", en: "Subtitles" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 2.6, y: 5.4, width: 18.8, height: 13.2, rx: 2 } },
      { tag: "path", part: "line1", attrs: { d: "M6.4 11.4h4" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M13.6 11.4h4" }, animAttrs: DRAW },
      { tag: "path", part: "line3", attrs: { d: "M6.4 15h11.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: ["line1", "line2"], keys: drawKeys(0.1, 0.45) },
        { part: "line3", keys: drawKeys(0.4, 0.8) },
      ],
    },
  },
  {
    id: "live",
    cat: "media",
    label: { ja: "ライブ配信", en: "Live" },
    parts: [
      { tag: "circle", part: "dot", attrs: { cx: 12, cy: 12, r: 2.6 } },
      { tag: "path", part: "inner", attrs: { d: "M7.6 16.4a6.2 6.2 0 0 1 0-8.8 M16.4 7.6a6.2 6.2 0 0 1 0 8.8" } },
      { tag: "path", part: "outer", attrs: { d: "M4.6 19.4a10.4 10.4 0 0 1 0-14.8 M19.4 4.6a10.4 10.4 0 0 1 0 14.8" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "dot", origin: "12px 12px", keys: pulseKeys(1.2) },
        { part: "inner", keys: blinkKeys(0.15) },
        { part: "outer", keys: blinkKeys(0.35) },
      ],
    },
  },
  {
    id: "record",
    cat: "media",
    label: { ja: "録画", en: "Record" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "circle", part: "dot", attrs: { cx: 12, cy: 12, r: 4 } },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "dot", origin: "12px 12px", keys: pulseKeys(1.16) }] },
  },
  {
    id: "gallery",
    cat: "media",
    label: { ja: "ギャラリー", en: "Gallery" },
    parts: [
      { tag: "rect", part: "back", attrs: { x: 7.4, y: 3.6, width: 13, height: 13, rx: 2 } },
      { tag: "rect", part: "front", attrs: { x: 3.6, y: 7.4, width: 13, height: 13, rx: 2 } },
      { tag: "path", part: "hill", attrs: { d: "M5.4 17.6 L9 14 L12 17 L14.6 14.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "front", origin: "10px 14px", keys: popInKeys(0.1) },
        { part: "hill", keys: drawKeys(0.4, 0.8) },
      ],
    },
  },
  {
    id: "speaker",
    cat: "media",
    label: { ja: "スピーカー", en: "Speaker" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 5.4, y: 3.4, width: 13.2, height: 17.2, rx: 2 } },
      { tag: "circle", part: "cone", attrs: { cx: 12, cy: 14.6, r: 3.4 } },
      { tag: "path", part: "tweeter", attrs: { d: "M12 7 L12 7.01" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "cone", origin: "12px 14.6px", keys: pulseKeys(1.22) },
        { part: "tweeter", keys: blinkKeys(0.2) },
        // 箱ごと震わせて低音の迫力を出す
        {
          part: "body",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.2, transform: "translateX(0.9px)" },
            { at: 0.45, transform: "translateX(-0.9px)" },
            { at: 0.7, transform: "translateX(0.5px)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
      ],
    },
  },
  {
    id: "video-off",
    cat: "media",
    label: { ja: "ビデオオフ", en: "Video off" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M13.6 6.4H4.6a2 2 0 0 0-2 2v7.2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2" } },
      { tag: "path", part: "lens", attrs: { d: "M15.6 10.8 L21.4 7.2v9.6l-3.4-2.2" } },
      { tag: "path", part: "slash", attrs: { d: "M4.6 4.6 L19.4 19.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "slash", keys: drawKeys(0.15, 0.65) }] },
  },
];

// 音量バーが上下する
function eqKeys(peak) {
  return [
    { at: 0, transform: "scaleY(1)" },
    { at: 0.25, transform: `scaleY(${peak})` },
    { at: 0.5, transform: "scaleY(1)" },
    { at: 0.75, transform: `scaleY(${peak * 0.7})` },
    { at: 1, transform: "scaleY(1)" },
  ];
}
