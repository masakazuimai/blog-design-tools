// 開発・技術カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys } from "./_shared.js?v=20260815b";

export const DEV_ICONS = [
  {
    id: "git-branch",
    cat: "dev",
    label: { ja: "ブランチ", en: "Branch" },
    parts: [
      { tag: "path", part: "line", attrs: { d: "M6.4 7.6v8.8" } },
      { tag: "path", part: "curve", attrs: { d: "M17.6 9.6v1.6a3.2 3.2 0 0 1-3.2 3.2H9.6a3.2 3.2 0 0 0-3.2 3.2" }, animAttrs: DRAW },
      { tag: "circle", part: "top", attrs: { cx: 6.4, cy: 5.6, r: 2.2 } },
      { tag: "circle", part: "bottom", attrs: { cx: 6.4, cy: 18.4, r: 2.2 } },
      { tag: "circle", part: "side", attrs: { cx: 17.6, cy: 7.4, r: 2.2 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "curve", keys: drawKeys(0.15, 0.6) },
        { part: "side", origin: "17.6px 7.4px", keys: popInKeys(0.55) },
      ],
    },
  },
  {
    id: "git-commit",
    cat: "dev",
    label: { ja: "コミット", en: "Commit" },
    parts: [
      { tag: "path", part: "line", attrs: { d: "M3.4 12h5.2 M15.4 12h5.2" } },
      { tag: "circle", part: "node", attrs: { cx: 12, cy: 12, r: 3.4 } },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: "node", origin: "12px 12px", keys: pulseKeys(1.18) }] },
  },
  {
    id: "git-merge",
    cat: "dev",
    label: { ja: "マージ", en: "Merge" },
    parts: [
      { tag: "path", part: "line", attrs: { d: "M6.4 7.6v8.8" } },
      { tag: "path", part: "curve", attrs: { d: "M6.4 9.6a6 6 0 0 0 6 6h2.8" }, animAttrs: DRAW },
      { tag: "circle", part: "top", attrs: { cx: 6.4, cy: 5.6, r: 2.2 } },
      { tag: "circle", part: "bottom", attrs: { cx: 6.4, cy: 18.4, r: 2.2 } },
      { tag: "circle", part: "target", attrs: { cx: 17.6, cy: 15.6, r: 2.2 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "curve", keys: drawKeys(0.15, 0.6) },
        { part: "target", origin: "17.6px 15.6px", keys: popInKeys(0.55) },
      ],
    },
  },
  {
    id: "pull-request",
    cat: "dev",
    label: { ja: "プルリクエスト", en: "Pull request" },
    parts: [
      { tag: "path", part: "left", attrs: { d: "M6.4 7.6v8.8" } },
      { tag: "path", part: "right", attrs: { d: "M17.6 9.6v6.8" } },
      { tag: "circle", part: "n1", attrs: { cx: 6.4, cy: 5.6, r: 2.2 } },
      { tag: "circle", part: "n2", attrs: { cx: 6.4, cy: 18.4, r: 2.2 } },
      { tag: "circle", part: "n3", attrs: { cx: 17.6, cy: 18.4, r: 2.2 } },
      { tag: "path", part: "head", attrs: { d: "M14.6 6.6h3v3" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: ["right", "head"], origin: "17.6px 12px", keys: popInKeys(0.2) },
        { part: "n3", origin: "17.6px 18.4px", keys: popInKeys(0.45) },
      ],
    },
  },
  {
    id: "bug",
    cat: "dev",
    label: { ja: "バグ", en: "Bug" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M8 8.4a4 4 0 0 1 8 0v4.8a4 4 0 0 1-8 0z" } },
      { tag: "path", part: "legs", attrs: { d: "M8 10H4.4 M16 10h3.6 M8 14H4.4 M16 14h3.6 M9.2 5.6 L7 3.6 M14.8 5.6 L17 3.6 M12 17.2v3" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["body", "legs"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.25, transform: "translate(-1px, 0.6px)" },
            { at: 0.5, transform: "translate(1px, -0.6px)" },
            { at: 0.75, transform: "translate(-0.6px, 0.4px)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },
  {
    id: "cpu",
    cat: "dev",
    label: { ja: "CPU", en: "CPU" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 5.4, y: 5.4, width: 13.2, height: 13.2, rx: 2 } },
      { tag: "rect", part: "core", attrs: { x: 9.4, y: 9.4, width: 5.2, height: 5.2, rx: 1 } },
      { tag: "path", part: "pins", attrs: { d: "M9.4 3.4v2 M14.6 3.4v2 M9.4 18.6v2 M14.6 18.6v2 M3.4 9.4h2 M3.4 14.6h2 M18.6 9.4h2 M18.6 14.6h2" } },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "core", keys: blinkKeys(0.15) }] },
  },
  {
    id: "server",
    cat: "dev",
    label: { ja: "サーバー", en: "Server" },
    parts: [
      { tag: "rect", part: "top", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 6, rx: 1.6 } },
      { tag: "rect", part: "bottom", attrs: { x: 3.4, y: 13.6, width: 17.2, height: 6, rx: 1.6 } },
      { tag: "path", part: "bar1", attrs: { d: "M10.4 7.4h7.4" } },
      { tag: "path", part: "bar2", attrs: { d: "M10.4 16.6h7.4" } },
      { tag: "path", part: "led1", attrs: { d: "M7 7.4 L7 7.41" } },
      { tag: "path", part: "led2", attrs: { d: "M7 16.6 L7 16.61" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        // ランプ2つの点滅だけでは動きが小さいので、転送量のバーを伸縮させる
        { part: "bar1", origin: "10.4px 7.4px", keys: barKeys(0) },
        { part: "bar2", origin: "10.4px 16.6px", keys: barKeys(0.25) },
        { part: "led1", keys: blinkKeys(0.1) },
        { part: "led2", keys: blinkKeys(0.35) },
      ],
    },
  },
  {
    id: "api",
    cat: "dev",
    label: { ja: "API", en: "API" },
    parts: [
      { tag: "circle", part: "hub", attrs: { cx: 12, cy: 12, r: 3.2 } },
      { tag: "circle", part: "n1", attrs: { cx: 12, cy: 4.6, r: 2 } },
      { tag: "circle", part: "n2", attrs: { cx: 19.4, cy: 16, r: 2 } },
      { tag: "circle", part: "n3", attrs: { cx: 4.6, cy: 16, r: 2 } },
      { tag: "path", part: "link", attrs: { d: "M12 6.6v2.2 M14.6 13.8l3 1.2 M9.4 13.8l-3 1.2" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "n1", origin: "12px 4.6px", keys: popInKeys(0.1) },
        { part: "n2", origin: "19.4px 16px", keys: popInKeys(0.25) },
        { part: "n3", origin: "4.6px 16px", keys: popInKeys(0.4) },
      ],
    },
  },
  {
    id: "rocket",
    cat: "dev",
    label: { ja: "デプロイ", en: "Deploy" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M12 3.6c3 2.4 4.4 5.6 4.4 9L12 16.4 7.6 12.6c0-3.4 1.4-6.6 4.4-9z" } },
      { tag: "path", part: "fins", attrs: { d: "M7.6 12.6 L5 15.4l2.2.6 M16.4 12.6l2.6 2.8-2.2.6" } },
      { tag: "circle", part: "window", attrs: { cx: 12, cy: 9, r: 1.6 } },
      { tag: "path", part: "flame", attrs: { d: "M10.4 17.4 L12 20.4 L13.6 17.4" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: ["body", "fins", "window"], origin: "12px 12px", keys: bounceKeys("Y", -1.6) },
        { part: "flame", keys: blinkKeys(0.05) },
      ],
    },
  },
  {
    id: "gauge",
    cat: "dev",
    label: { ja: "パフォーマンス", en: "Performance" },
    parts: [
      { tag: "path", part: "dial", attrs: { d: "M4 17.4a8.6 8.6 0 1 1 16 0" } },
      { tag: "path", part: "needle", attrs: { d: "M12 17 L15.4 11.8" } },
      { tag: "path", part: "hub", attrs: { d: "M12 17.4 L12 17.41" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          part: "needle",
          origin: "12px 17.4px",
          keys: [
            { at: 0, transform: "rotate(-62deg)" },
            { at: 0.5, transform: "rotate(24deg)" },
            { at: 1, transform: "rotate(-62deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "container",
    cat: "dev",
    label: { ja: "コンテナ", en: "Container" },
    parts: [
      { tag: "rect", part: "b1", attrs: { x: 4.4, y: 11.4, width: 5, height: 5, rx: 0.8 } },
      { tag: "rect", part: "b2", attrs: { x: 9.6, y: 11.4, width: 5, height: 5, rx: 0.8 } },
      { tag: "rect", part: "b3", attrs: { x: 9.6, y: 6.2, width: 5, height: 5, rx: 0.8 } },
      { tag: "path", part: "sea", attrs: { d: "M3.4 18.6h17.2" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "b1", origin: "6.9px 16.4px", keys: popInKeys(0) },
        { part: "b2", origin: "12.1px 16.4px", keys: popInKeys(0.14) },
        { part: "b3", origin: "12.1px 11.2px", keys: popInKeys(0.28) },
      ],
    },
  },
  {
    id: "stack",
    cat: "dev",
    label: { ja: "スタック", en: "Stack" },
    parts: [
      { tag: "path", part: "top", attrs: { d: "M12 3.6 L20.4 7.8 L12 12 L3.6 7.8z" } },
      { tag: "path", part: "mid", attrs: { d: "M3.6 12 L12 16.2 L20.4 12" } },
      { tag: "path", part: "bottom", attrs: { d: "M3.6 16.2 L12 20.4 L20.4 16.2" } },
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
    id: "webhook",
    cat: "dev",
    label: { ja: "Webhook", en: "Webhook" },
    parts: [
      { tag: "path", part: "hook", attrs: { d: "M9.4 8.4a3.2 3.2 0 1 1 4.4 3l-2.6 4.6" }, animAttrs: DRAW },
      { tag: "circle", part: "n1", attrs: { cx: 6.4, cy: 16.6, r: 2.6 } },
      { tag: "circle", part: "n2", attrs: { cx: 17.6, cy: 16.6, r: 2.6 } },
      { tag: "path", part: "link", attrs: { d: "M9 16.6h6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "hook", keys: drawKeys(0.05, 0.5) },
        { part: "link", keys: drawKeys(0.45, 0.8) },
      ],
    },
  },
  {
    id: "console",
    cat: "dev",
    label: { ja: "コンソール", en: "Console" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 5.4, width: 17.2, height: 13.2, rx: 2 } },
      { tag: "path", part: "bar", attrs: { d: "M3.4 9h17.2" } },
      { tag: "path", part: "prompt", attrs: { d: "M6.6 12.4 L8.8 14.2 L6.6 16" } },
      { tag: "path", part: "typed", attrs: { d: "M10.6 16h7" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "linear",
      tracks: [
        // カーソルの点滅だけでは動きが小さいので、文字列が打ち込まれる動きを主役にする
        { part: "typed", keys: drawKeys(0.15, 0.7) },
        {
          part: "prompt",
          keys: [
            { at: 0, opacity: 0.3 },
            { at: 0.1, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
      ],
    },
  },
  {
    id: "log",
    cat: "dev",
    label: { ja: "ログ", en: "Log" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "l1", attrs: { d: "M6.8 8.6h6.4" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M6.8 12h10.4" }, animAttrs: DRAW },
      { tag: "path", part: "l3", attrs: { d: "M6.8 15.4h8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "l1", keys: drawKeys(0, 0.3) },
        { part: "l2", keys: drawKeys(0.22, 0.55) },
        { part: "l3", keys: drawKeys(0.45, 0.78) },
      ],
    },
  },
  {
    id: "test",
    cat: "dev",
    label: { ja: "テスト", en: "Test" },
    parts: [
      { tag: "path", part: "tube", attrs: { d: "M9.4 3.6v7.8L5.6 18a2.4 2.4 0 0 0 2.1 3.6h8.6a2.4 2.4 0 0 0 2.1-3.6l-3.8-6.6V3.6" } },
      { tag: "path", part: "cap", attrs: { d: "M8.2 3.6h7.6" } },
      { tag: "path", part: "level", attrs: { d: "M6.6 16.4h10.8" } },
      { tag: "path", part: "bubble", attrs: { d: "M9.8 18.6 L9.8 18.61 M13.8 19.6 L13.8 19.61" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          // 液面が上下する。小さな泡だけでは変化が見えなかった
          part: "level",
          keys: [
            { at: 0, transform: "translateY(2.6px) scaleX(0.78)" },
            { at: 0.5, transform: "translateY(-1.6px) scaleX(1.12)" },
            { at: 1, transform: "translateY(2.6px) scaleX(0.78)" },
          ],
        },
        {
          part: "bubble",
          keys: [
            { at: 0, transform: "translateY(1.6px)", opacity: 0 },
            { at: 0.3, transform: "translateY(0)", opacity: 1 },
            { at: 0.7, transform: "translateY(-2px)", opacity: 0 },
            { at: 1, transform: "translateY(-2px)", opacity: 0 },
          ],
        },
      ],
    },
  },
  {
    id: "version",
    cat: "dev",
    label: { ja: "バージョン", en: "Version" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "tag", attrs: { d: "M8.4 9.6 L12 15.6 L15.6 9.6" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: "tag", keys: drawKeys(0.15, 0.7) }] },
  },
  {
    id: "plugin",
    cat: "dev",
    label: { ja: "プラグイン", en: "Plugin" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M6.4 8.4h11.2v8.2a3.4 3.4 0 0 1-3.4 3.4H9.8a3.4 3.4 0 0 1-3.4-3.4z" } },
      { tag: "path", part: "pins", attrs: { d: "M9.6 8.4V4.4 M14.4 8.4V4.4" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["body", "pins"], origin: "12px 14px", keys: bounceKeys("Y", 1.4) }] },
  },
  {
    id: "cache",
    cat: "dev",
    label: { ja: "キャッシュ", en: "Cache" },
    parts: [
      { tag: "ellipse", part: "top", attrs: { cx: 12, cy: 7, rx: 7.4, ry: 2.8 } },
      { tag: "path", part: "side", attrs: { d: "M4.6 7v10c0 1.5 3.3 2.8 7.4 2.8s7.4-1.3 7.4-2.8V7" } },
      { tag: "path", part: "bolt", attrs: { d: "M12.8 10.4 L10.4 14h3l-.6 3.2 2.8-4h-2.8z" } },
    ],
    anim: { duration: 1.6, easing: "ease-out", tracks: [{ part: "bolt", keys: blinkKeys(0.15) }] },
  },
  {
    id: "memory",
    cat: "dev",
    label: { ja: "メモリ", en: "Memory" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 3.4, y: 7.4, width: 17.2, height: 9.2, rx: 1.6 } },
      { tag: "path", part: "pins", attrs: { d: "M6.6 16.6v2.6 M12 16.6v2.6 M17.4 16.6v2.6" } },
      { tag: "path", part: "chip", attrs: { d: "M7.4 11h3.2v2.6H7.4z M13.4 11h3.2v2.6h-3.2z" } },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "chip", keys: blinkKeys(0.2) }] },
  },
  {
    id: "network",
    cat: "dev",
    label: { ja: "ネットワーク", en: "Network" },
    parts: [
      { tag: "circle", part: "globe", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "lines", attrs: { d: "M3.4 12h17.2 M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.8, easing: "ease-in-out", tracks: [{ part: "lines", keys: drawKeys(0.1, 0.8) }] },
  },
  {
    id: "code-branch-check",
    cat: "dev",
    label: { ja: "ビルド成功", en: "Build passed" },
    parts: [
      { tag: "rect", part: "frame", attrs: { x: 3.4, y: 4.4, width: 17.2, height: 15.2, rx: 2 } },
      { tag: "path", part: "tick", attrs: { d: "M8 12.2 L10.8 15 L16 9.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-out",
      tracks: [
        { part: "frame", origin: "12px 12px", keys: pulseKeys(1.1) },
        { part: "tick", keys: drawKeys(0.25, 0.8) },
      ],
    },
  },
];

// 転送量のように伸び縮みする
function barKeys(delay) {
  return [
    { at: 0, transform: "scaleX(0.15)" },
    { at: Math.min(1, delay), transform: "scaleX(0.15)" },
    { at: Math.min(1, delay + 0.35), transform: "scaleX(1)" },
    { at: Math.min(1, delay + 0.7), transform: "scaleX(0.15)" },
    { at: 1, transform: "scaleX(0.15)" },
  ];
}
