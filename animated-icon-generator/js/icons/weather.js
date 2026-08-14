// 天気・自然カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, swingKeys } from "./_shared.js?v=20260815a";

// 雲の共通シルエット（雨・雷と使い回す）
const CLOUD_D = "M7 17.6a3.9 3.9 0 0 1 .4-7.8 6 6 0 0 1 11.3 1.2 3.4 3.4 0 0 1-.5 6.6z";

// 落ちて消える（雨粒・雪片用）
const fallKeys = (delay) => [
  { at: 0, transform: "translateY(-2px)", opacity: 0 },
  { at: delay, transform: "translateY(-2px)", opacity: 0 },
  { at: delay + 0.15, transform: "translateY(0)", opacity: 1 },
  { at: delay + 0.4, transform: "translateY(2.6px)", opacity: 0 },
  { at: 1, transform: "translateY(2.6px)", opacity: 0 },
];

export const WEATHER_ICONS = [
  {
    id: "sun",
    cat: "weather",
    label: { ja: "晴れ", en: "Sun" },
    parts: [
      { tag: "circle", part: "core", attrs: { cx: 12, cy: 12, r: 4 } },
      {
        // 光線は本体からはっきり離す（設定アイコンの歯車と描き分けるため）
        tag: "path",
        part: "rays",
        attrs: {
          d: "M12 3.4v2.8 M12 17.8v2.8 M3.4 12h2.8 M17.8 12h2.8 M5.5 5.5l2 2 M16.5 16.5l2 2 M18.5 5.5l-2 2 M7.5 16.5l-2 2",
        },
      },
    ],
    anim: {
      duration: 3,
      easing: "linear",
      tracks: [{ part: "rays", origin: "12px 12px", keys: spinKeys() }],
    },
  },

  {
    id: "moon",
    cat: "weather",
    label: { ja: "月", en: "Moon" },
    parts: [{ tag: "path", part: "crescent", attrs: { d: "M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11z" } }],
    anim: {
      duration: 2.2,
      easing: "ease-in-out",
      tracks: [{ part: "crescent", origin: "12px 12px", keys: swingKeys(8) }],
    },
  },

  {
    id: "cloud",
    cat: "weather",
    label: { ja: "くもり", en: "Cloud" },
    parts: [{ tag: "path", part: "cloud", attrs: { d: CLOUD_D } }],
    anim: {
      duration: 2.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: "cloud",
          origin: "12px 14px",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.35, transform: "translateX(1.2px)" },
            { at: 0.7, transform: "translateX(-1px)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
      ],
    },
  },

  {
    id: "rain",
    cat: "weather",
    label: { ja: "雨", en: "Rain" },
    parts: [
      { tag: "path", part: "cloud", attrs: { d: CLOUD_D } },
      { tag: "path", part: "drop1", attrs: { d: "M8.4 18.6v2" } },
      { tag: "path", part: "drop2", attrs: { d: "M12 18.6v2" } },
      { tag: "path", part: "drop3", attrs: { d: "M15.6 18.6v2" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in",
      tracks: [
        // 落下距離を伸ばし、雲も揺らして全体で動かす
        {
          part: "cloud",
          origin: "12px 14px",
          keys: [
            { at: 0, transform: "translateX(0)" },
            { at: 0.35, transform: "translateX(1.2px)" },
            { at: 0.7, transform: "translateX(-1px)" },
            { at: 1, transform: "translateX(0)" },
          ],
        },
        { part: "drop1", keys: fallKeys(0) },
        { part: "drop2", keys: fallKeys(0.15) },
        { part: "drop3", keys: fallKeys(0.3) },
      ],
    },
  },

  {
    id: "snow",
    cat: "weather",
    label: { ja: "雪", en: "Snow" },
    parts: [
      {
        tag: "path",
        part: "flake",
        attrs: {
          d: "M12 3.4v17.2 M4.6 7.7l14.8 8.6 M19.4 7.7L4.6 16.3 M12 7.4l-2.4-2 M12 7.4l2.4-2 M12 16.6l-2.4 2 M12 16.6l2.4 2",
        },
      },
    ],
    anim: {
      duration: 4,
      easing: "linear",
      tracks: [{ part: "flake", origin: "12px 12px", keys: spinKeys() }],
    },
  },

  {
    id: "wind",
    cat: "weather",
    label: { ja: "風", en: "Wind" },
    parts: [
      { tag: "path", part: "line1", attrs: { d: "M3.4 8.4h8.8a2.8 2.8 0 1 0-2.8-2.8" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M3.4 12.4h12.6a2.8 2.8 0 1 1-2.8 2.8" }, animAttrs: DRAW },
      { tag: "path", part: "line3", attrs: { d: "M3.4 16.6h7" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 2,
      easing: "ease-in-out",
      tracks: [
        { part: "line1", keys: drawKeys(0, 0.4) },
        { part: "line2", keys: drawKeys(0.15, 0.6) },
        { part: "line3", keys: drawKeys(0.35, 0.75) },
      ],
    },
  },

  {
    id: "thunder",
    cat: "weather",
    label: { ja: "雷", en: "Thunder" },
    parts: [
      { tag: "path", part: "cloud", attrs: { d: CLOUD_D } },
      { tag: "path", part: "bolt", attrs: { d: "M13.4 12.6 L9.4 18.2h3.2l-1 4.2 4.2-6.4h-3.2z" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        {
          part: "bolt",
          origin: "12px 17px",
          keys: [
            { at: 0, opacity: 0 },
            { at: 0.25, opacity: 0 },
            { at: 0.32, opacity: 1 },
            { at: 0.4, opacity: 0.2 },
            { at: 0.48, opacity: 1 },
            { at: 0.8, opacity: 1 },
            { at: 1, opacity: 0 },
          ],
        },
      ],
    },
  },

  {
    id: "rainbow",
    cat: "weather",
    label: { ja: "虹", en: "Rainbow" },
    parts: [
      { tag: "path", part: "arc1", attrs: { d: "M3.4 18.6a8.6 8.6 0 0 1 17.2 0" }, animAttrs: DRAW },
      { tag: "path", part: "arc2", attrs: { d: "M6.8 18.6a5.2 5.2 0 0 1 10.4 0" }, animAttrs: DRAW },
      { tag: "path", part: "arc3", attrs: { d: "M10.2 18.6a1.8 1.8 0 0 1 3.6 0" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 2,
      easing: "ease-out",
      tracks: [
        { part: "arc1", keys: drawKeys(0, 0.45) },
        { part: "arc2", keys: drawKeys(0.2, 0.65) },
        { part: "arc3", keys: drawKeys(0.4, 0.85) },
      ],
    },
  },
];
