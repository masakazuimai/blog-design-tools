// 天気・自然カテゴリの追加分（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260814f";

const CLOUD_D = "M7 17.6a3.9 3.9 0 0 1 .4-7.8 6 6 0 0 1 11.3 1.2 3.4 3.4 0 0 1-.5 6.6z";

export const WEATHER_ICONS_2 = [
  {
    id: "sun-cloud",
    cat: "weather",
    label: { ja: "晴れときどき曇り", en: "Partly cloudy" },
    parts: [
      { tag: "circle", part: "sun", attrs: { cx: 8.6, cy: 8, r: 3.2 } },
      { tag: "path", part: "rays", attrs: { d: "M8.6 3v1.6 M8.6 11.4V13 M3.6 8h1.6 M12 8h1.6 M5 4.4l1.2 1.2 M11 10.4l1.2 1.2 M12.2 4.4L11 5.6" } },
      { tag: "path", part: "cloud", attrs: { d: "M9.6 19.6a3.4 3.4 0 0 1 .4-6.8 5.2 5.2 0 0 1 9.8 1 3 3 0 0 1-.4 5.8z" } },
    ],
    anim: {
      duration: 2.4,
      easing: "linear",
      tracks: [{ part: "rays", origin: "8.6px 8px", keys: spinKeys() }],
    },
  },
  {
    id: "fog",
    cat: "weather",
    label: { ja: "霧", en: "Fog" },
    parts: [
      { tag: "path", part: "cloud", attrs: { d: "M7 13.6a3.6 3.6 0 0 1 .4-7.2 5.6 5.6 0 0 1 10.6 1.2 3.2 3.2 0 0 1-.5 6z" } },
      { tag: "path", part: "l1", attrs: { d: "M4.6 16.6h14.8" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M6.6 19.6h11" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "l1", keys: drawKeys(0.1, 0.5) },
        { part: "l2", keys: drawKeys(0.35, 0.75) },
      ],
    },
  },
  {
    id: "temperature",
    cat: "weather",
    label: { ja: "気温", en: "Temperature" },
    parts: [
      { tag: "path", part: "tube", attrs: { d: "M10 14.4V6.4a2 2 0 0 1 4 0v8a4 4 0 1 1-4 0z" } },
      { tag: "path", part: "level", attrs: { d: "M12 17.4v-6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "level", keys: drawKeys(0.15, 0.8) },
        // 温度計本体も脈打たせて、細い液柱だけに頼らない
        { part: "tube", origin: "12px 17.4px", keys: pulseKeys(1.07) },
      ],
    },
  },
  {
    id: "humidity",
    cat: "weather",
    label: { ja: "湿度", en: "Humidity" },
    parts: [
      { tag: "path", part: "drop", attrs: { d: "M12 3.6c3.4 4 5.6 6.6 5.6 9.4A5.6 5.6 0 0 1 12 18.6a5.6 5.6 0 0 1-5.6-5.6c0-2.8 2.2-5.4 5.6-9.4z" } },
      { tag: "path", part: "shine", attrs: { d: "M9.6 13.4a2.4 2.4 0 0 0 2.4 2.4" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "drop", origin: "12px 18px", keys: pulseKeys(1.06) },
        { part: "shine", keys: blinkKeys(0.25) },
      ],
    },
  },
  {
    id: "umbrella",
    cat: "weather",
    label: { ja: "傘", en: "Umbrella" },
    parts: [
      { tag: "path", part: "canopy", attrs: { d: "M3.6 12a8.4 8.4 0 0 1 16.8 0z" } },
      { tag: "path", part: "handle", attrs: { d: "M12 12v5.6a2.4 2.4 0 0 1-4.8 0" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["canopy", "handle"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.3, transform: "rotate(-6deg)" },
            { at: 0.65, transform: "rotate(4deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "sunrise",
    cat: "weather",
    label: { ja: "日の出", en: "Sunrise" },
    parts: [
      { tag: "path", part: "sun", attrs: { d: "M7.4 14.6a4.6 4.6 0 0 1 9.2 0" } },
      { tag: "path", part: "ground", attrs: { d: "M3.6 17.6h16.8" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 3.6v5 M9.4 6.2 L12 3.6 L14.6 6.2" } },
      { tag: "path", part: "rays", attrs: { d: "M4.6 11.4l1.4-1.4 M19.4 11.4L18 10" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "arrow", origin: "12px 6px", keys: bounceKeys("Y", -1.4) },
        { part: "rays", keys: blinkKeys(0.3) },
      ],
    },
  },
  {
    id: "sunset",
    cat: "weather",
    label: { ja: "日の入り", en: "Sunset" },
    parts: [
      { tag: "path", part: "sun", attrs: { d: "M7.4 14.6a4.6 4.6 0 0 1 9.2 0" } },
      { tag: "path", part: "ground", attrs: { d: "M3.6 17.6h16.8" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 8.6v-5 M9.4 6 L12 8.6 L14.6 6" } },
      { tag: "path", part: "rays", attrs: { d: "M4.6 11.4l1.4-1.4 M19.4 11.4L18 10" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "arrow", origin: "12px 6px", keys: bounceKeys("Y", 1.4) },
        { part: "rays", keys: blinkKeys(0.3) },
      ],
    },
  },
  {
    id: "tornado",
    cat: "weather",
    label: { ja: "竜巻", en: "Tornado" },
    parts: [
      { tag: "path", part: "l1", attrs: { d: "M3.6 5.6h16.8" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M5.6 9.4h12.8" }, animAttrs: DRAW },
      { tag: "path", part: "l3", attrs: { d: "M8 13.2h8" }, animAttrs: DRAW },
      { tag: "path", part: "l4", attrs: { d: "M10.4 17h3.4" }, animAttrs: DRAW },
      { tag: "path", part: "tail", attrs: { d: "M11.4 20.4h1.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "l1", keys: drawKeys(0, 0.3) },
        { part: "l2", keys: drawKeys(0.15, 0.45) },
        { part: "l3", keys: drawKeys(0.3, 0.6) },
        { part: "l4", keys: drawKeys(0.45, 0.72) },
        { part: "tail", keys: drawKeys(0.6, 0.85) },
      ],
    },
  },
  {
    id: "leaf",
    cat: "weather",
    label: { ja: "葉", en: "Leaf" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M20.4 3.6c0 9.4-4.8 14.2-10.4 14.2a5.6 5.6 0 0 1 0-11.2c5.6 0 6-3 10.4-3z" } },
      { tag: "path", part: "vein", attrs: { d: "M20.4 3.6 L5.6 18.4 M20.4 3.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "vein", keys: drawKeys(0.2, 0.7) },
        {
          part: "body",
          origin: "6px 18px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(-5deg)" },
            { at: 0.7, transform: "rotate(3deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "droplet",
    cat: "weather",
    label: { ja: "水滴", en: "Droplet" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M12 3.6c3.4 4 5.6 6.6 5.6 9.4A5.6 5.6 0 0 1 12 18.6a5.6 5.6 0 0 1-5.6-5.6c0-2.8 2.2-5.4 5.6-9.4z" } },
      { tag: "path", part: "ripple", attrs: { d: "M6.6 20.6a10 10 0 0 0 10.8 0" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "body", origin: "12px 12px", keys: bounceKeys("Y", -1.4) },
        { part: "ripple", keys: blinkKeys(0.4) },
      ],
    },
  },
  {
    id: "mountain",
    cat: "weather",
    label: { ja: "山", en: "Mountain" },
    parts: [
      { tag: "path", part: "big", attrs: { d: "M3.6 19.4 L10 7.6 L16.4 19.4z" }, animAttrs: DRAW },
      { tag: "path", part: "small", attrs: { d: "M13.4 19.4 L17 12.6 L20.4 19.4z" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "big", keys: drawKeys(0, 0.55) },
        { part: "small", keys: drawKeys(0.35, 0.8) },
      ],
    },
  },
  {
    id: "wave-water",
    cat: "weather",
    label: { ja: "波", en: "Wave" },
    parts: [
      { tag: "path", part: "w1", attrs: { d: "M3.6 8.6c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" } },
      { tag: "path", part: "w2", attrs: { d: "M3.6 13.4c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" } },
      { tag: "path", part: "w3", attrs: { d: "M3.6 18.2c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "w1", keys: waveKeys(0) },
        { part: "w2", keys: waveKeys(0.12) },
        { part: "w3", keys: waveKeys(0.24) },
      ],
    },
  },
];

// 左右にゆっくり流れる（波用）
function waveKeys(delay) {
  return [
    { at: 0, transform: "translateX(0)" },
    { at: delay, transform: "translateX(0)" },
    { at: delay + 0.35, transform: "translateX(1.4px)" },
    { at: delay + 0.7, transform: "translateX(0)" },
    { at: 1, transform: "translateX(0)" },
  ];
}
