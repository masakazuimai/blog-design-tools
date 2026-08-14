// メディアカテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys } from "./_shared.js?v=20260815c";

export const MEDIA_ICONS = [
  {
    id: "play",
    cat: "media",
    label: { ja: "再生", en: "Play" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 } },
      { tag: "path", part: "tri", attrs: { d: "M10 8.2 L16.2 12 L10 15.8 Z" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [
        { part: "ring", origin: "12px 12px", keys: pulseKeys(1.08) },
        { part: "tri", origin: "12px 12px", keys: popInKeys(0.15) },
      ],
    },
  },

  {
    id: "pause",
    cat: "media",
    label: { ja: "一時停止", en: "Pause" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 } },
      { tag: "path", part: "bar1", attrs: { d: "M9.8 8.4v7.2" } },
      { tag: "path", part: "bar2", attrs: { d: "M14.2 8.4v7.2" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        // 縮み幅が小さいと止まって見えるため、はっきり縮ませる
        {
          part: "bar1",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scaleY(1)" },
            { at: 0.3, transform: "scaleY(0.25)" },
            { at: 0.6, transform: "scaleY(1)" },
            { at: 1, transform: "scaleY(1)" },
          ],
        },
        {
          part: "bar2",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scaleY(1)" },
            { at: 0.2, transform: "scaleY(1)" },
            { at: 0.5, transform: "scaleY(0.25)" },
            { at: 0.8, transform: "scaleY(1)" },
            { at: 1, transform: "scaleY(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "stop",
    cat: "media",
    label: { ja: "停止", en: "Stop" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 } },
      { tag: "rect", part: "square", attrs: { x: 8.6, y: 8.6, width: 6.8, height: 6.8, rx: 1.4 } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [{ part: "square", origin: "12px 12px", keys: pulseKeys(1.18) }],
    },
  },

  {
    id: "volume",
    cat: "media",
    label: { ja: "音量", en: "Volume" },
    parts: [
      { tag: "path", part: "speaker", attrs: { d: "M3.4 9.4h3.8L12 5v14l-4.8-4.4H3.4z" } },
      { tag: "path", part: "wave1", attrs: { d: "M15.2 9.6a3.6 3.6 0 0 1 0 4.8" } },
      { tag: "path", part: "wave2", attrs: { d: "M18 7a7.4 7.4 0 0 1 0 10" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        { part: "wave1", keys: [{ at: 0, opacity: 0.15 }, { at: 0.2, opacity: 1 }, { at: 0.75, opacity: 1 }, { at: 1, opacity: 0.15 }] },
        { part: "wave2", keys: [{ at: 0, opacity: 0.15 }, { at: 0.35, opacity: 0.15 }, { at: 0.5, opacity: 1 }, { at: 0.75, opacity: 1 }, { at: 1, opacity: 0.15 }] },
      ],
    },
  },

  {
    id: "mute",
    cat: "media",
    label: { ja: "ミュート", en: "Mute" },
    parts: [
      { tag: "path", part: "speaker", attrs: { d: "M3.4 9.4h3.8L12 5v14l-4.8-4.4H3.4z" } },
      { tag: "path", part: "slash1", attrs: { d: "M15.6 9.6 L20.6 14.6" }, animAttrs: DRAW },
      { tag: "path", part: "slash2", attrs: { d: "M20.6 9.6 L15.6 14.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "slash1", keys: drawKeys(0.1, 0.5) },
        { part: "slash2", keys: drawKeys(0.45, 0.85) },
      ],
    },
  },

  {
    id: "camera",
    cat: "media",
    label: { ja: "カメラ", en: "Camera" },
    parts: [
      {
        tag: "path",
        part: "body",
        attrs: { d: "M2.6 9.6a2 2 0 0 1 2-2h2.4l1.6-2.6h6.8l1.6 2.6h2.4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.6a2 2 0 0 1-2-2z" },
      },
      { tag: "circle", part: "lens", attrs: { cx: 12, cy: 13.4, r: 3.8 } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-out",
      tracks: [
        {
          // シャッターが切れる
          part: "lens",
          origin: "12px 13.4px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.25, transform: "scale(0.55)" },
            { at: 0.45, transform: "scale(1.1)" },
            { at: 0.65, transform: "scale(1)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "image",
    cat: "media",
    label: { ja: "画像", en: "Image" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "circle", part: "sun", attrs: { cx: 8.6, cy: 9.6, r: 1.8 } },
      { tag: "path", part: "hill", attrs: { d: "M3.8 17.6 L9.4 12 L13.4 16 L16.6 12.8 L20.2 16.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "sun", origin: "8.6px 9.6px", keys: popInKeys(0.1) },
        { part: "hill", keys: drawKeys(0.3, 0.8) },
      ],
    },
  },

  {
    id: "video",
    cat: "media",
    label: { ja: "動画", en: "Video" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.6, y: 6.4, width: 13, height: 11.2, rx: 2 } },
      { tag: "path", part: "lens", attrs: { d: "M15.6 10.8 L21.4 7.2v9.6l-5.8-3.6z" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "lens",
          origin: "15.6px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(-14deg)" },
            { at: 0.7, transform: "rotate(6deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
        // 本体も揺らして、撮影中らしい動きにする
        {
          part: "body",
          origin: "9.1px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.35, transform: "rotate(-2.5deg)" },
            { at: 0.7, transform: "rotate(1.5deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "music",
    cat: "media",
    label: { ja: "音楽", en: "Music" },
    parts: [
      { tag: "path", part: "stem", attrs: { d: "M9.4 17.4V6.2l9.2-2v11.6" } },
      { tag: "circle", part: "head1", attrs: { cx: 6.8, cy: 17.4, r: 2.6 } },
      { tag: "circle", part: "head2", attrs: { cx: 16, cy: 15.8, r: 2.6 } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["stem", "head1", "head2"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translateY(0) rotate(0deg)" },
            { at: 0.3, transform: "translateY(-1.4px) rotate(-3deg)" },
            { at: 0.65, transform: "translateY(0.8px) rotate(2deg)" },
            { at: 1, transform: "translateY(0) rotate(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "mic",
    cat: "media",
    label: { ja: "マイク", en: "Microphone" },
    parts: [
      { tag: "path", part: "capsule", attrs: { d: "M12 3.4a3 3 0 0 1 3 3v5.4a3 3 0 0 1-6 0V6.4a3 3 0 0 1 3-3z" } },
      { tag: "path", part: "arc", attrs: { d: "M5.6 11.2a6.4 6.4 0 0 0 12.8 0" } },
      { tag: "path", part: "stand", attrs: { d: "M12 17.6v3 M8.4 20.6h7.2" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "capsule",
          origin: "12px 9px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.3, transform: "scale(1.12)" },
            { at: 0.6, transform: "scale(0.96)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "headphone",
    cat: "media",
    label: { ja: "ヘッドホン", en: "Headphones" },
    parts: [
      { tag: "path", part: "band", attrs: { d: "M3.8 15.4V12a8.2 8.2 0 0 1 16.4 0v3.4" } },
      { tag: "rect", part: "cupL", attrs: { x: 2.6, y: 14.2, width: 4.6, height: 6.4, rx: 2 } },
      { tag: "rect", part: "cupR", attrs: { x: 16.8, y: 14.2, width: 4.6, height: 6.4, rx: 2 } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: "cupL",
          origin: "4.9px 17.4px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.25, transform: "scale(1.18)" },
            { at: 0.5, transform: "scale(1)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
        {
          part: "cupR",
          origin: "19.1px 17.4px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.25, transform: "scale(1)" },
            { at: 0.5, transform: "scale(1.18)" },
            { at: 0.75, transform: "scale(1)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "skip",
    cat: "media",
    label: { ja: "次へ", en: "Skip" },
    parts: [
      { tag: "path", part: "tri", attrs: { d: "M4.6 6.2 L13 12 L4.6 17.8 Z" } },
      { tag: "path", part: "bar", attrs: { d: "M17.4 6.2v11.6" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [{ part: "tri", origin: "12px 12px", keys: bounceKeys("X", 3.5) }],
    },
  },
];
