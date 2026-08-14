// 操作カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, spinKeys, pulseKeys, bounceKeys, slideKeys } from "./_shared.js?v=20260815b";

export const ACTION_ICONS = [
  {
    id: "copy",
    cat: "action",
    label: { ja: "コピー", en: "Copy" },
    parts: [
      { tag: "rect", part: "back", attrs: { x: 8.6, y: 3.4, width: 12, height: 12, rx: 2 } },
      { tag: "rect", part: "front", attrs: { x: 3.4, y: 8.6, width: 12, height: 12, rx: 2 } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [
        {
          // 手前の紙が奥から抜き出される
          part: "front",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(5.2px, -5.2px)", opacity: 0 },
            { at: 0.5, transform: "translate(0, 0)", opacity: 1 },
            { at: 1, transform: "translate(0, 0)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "download",
    cat: "action",
    label: { ja: "ダウンロード", en: "Download" },
    parts: [
      { tag: "path", part: "tray", attrs: { d: "M3.6 15.4v3.2a2 2 0 0 0 2 2h12.8a2 2 0 0 0 2-2v-3.2" } },
      { tag: "path", part: "shaft", attrs: { d: "M12 3.4V15" } },
      { tag: "path", part: "head", attrs: { d: "M7.4 10.6 L12 15.2 L16.6 10.6" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [{ part: ["shaft", "head"], origin: "12px 12px", keys: bounceKeys("Y", 4) }],
    },
  },

  {
    id: "upload",
    cat: "action",
    label: { ja: "アップロード", en: "Upload" },
    parts: [
      { tag: "path", part: "tray", attrs: { d: "M3.6 15.4v3.2a2 2 0 0 0 2 2h12.8a2 2 0 0 0 2-2v-3.2" } },
      { tag: "path", part: "shaft", attrs: { d: "M12 15V3.4" } },
      { tag: "path", part: "head", attrs: { d: "M7.4 8 L12 3.4 L16.6 8" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          // 矢印の先端が y=3.4 にあり、跳ねさせると viewBox の上に見切れる。
          // 上へ抜けながら消し、トレイの側から戻す動きにして枠内に収める
          part: ["shaft", "head"],
          origin: "12px 12px",
          keys: slideKeys("Y", -2.2),
        },
      ],
    },
  },

  {
    id: "send",
    cat: "action",
    label: { ja: "送信", en: "Send" },
    parts: [
      { tag: "path", part: "plane", attrs: { d: "M20.6 3.4 L10.4 13.6 M20.6 3.4 L14.2 20.6 L10.4 13.6 L3.4 9.8 Z" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        {
          part: "plane",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)", opacity: 1 },
            { at: 0.4, transform: "translate(2.2px, -2.2px)", opacity: 0 },
            { at: 0.5, transform: "translate(-2.2px, 2.2px)", opacity: 0 },
            { at: 0.9, transform: "translate(0, 0)", opacity: 1 },
            { at: 1, transform: "translate(0, 0)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "search",
    cat: "action",
    label: { ja: "検索", en: "Search" },
    parts: [
      { tag: "circle", part: "lens", attrs: { cx: 10.8, cy: 10.8, r: 6.4 } },
      { tag: "path", part: "handle", attrs: { d: "M15.4 15.4 L19.6 19.6" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          // 探すように少しだけ動く
          part: ["lens", "handle"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.25, transform: "translate(1.8px, 1.2px)" },
            { at: 0.5, transform: "translate(-1.2px, 1.8px)" },
            { at: 0.75, transform: "translate(1px, -1.2px)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
      ],
    },
  },

  {
    id: "settings",
    cat: "action",
    label: { ja: "設定", en: "Settings" },
    parts: [
      { tag: "circle", part: "hub", attrs: { cx: 12, cy: 12, r: 5.4 } },
      {
        // 歯は本体の円に接する位置から生やす。円と離すと太陽アイコンに見えてしまう
        tag: "path",
        part: "teeth",
        attrs: {
          d: "M17.4 12h3 M15.8 15.8l2.1 2.1 M12 17.4v3 M8.2 15.8l-2.1 2.1 M6.6 12h-3 M8.2 8.2L6.1 6.1 M12 6.6v-3 M15.8 8.2l2.1-2.1",
        },
      },
    ],
    anim: {
      duration: 2.4,
      easing: "linear",
      tracks: [{ part: ["hub", "teeth"], origin: "12px 12px", keys: spinKeys() }],
    },
  },

  {
    id: "trash",
    cat: "action",
    label: { ja: "削除", en: "Delete" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M5.6 6.6l1 13a1.6 1.6 0 0 0 1.6 1.5h7.6a1.6 1.6 0 0 0 1.6-1.5l1-13" } },
      { tag: "path", part: "lid", attrs: { d: "M3.4 6.6h17.2 M9.4 6.6V4.4a1 1 0 0 1 1-1h3.2a1 1 0 0 1 1 1v2.2" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          // 蓋が開いて閉じる
          part: "lid",
          origin: "3.4px 6.6px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.3, transform: "rotate(-10deg)" },
            { at: 0.6, transform: "rotate(-10deg)" },
            { at: 0.9, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "edit",
    cat: "action",
    label: { ja: "編集", en: "Edit" },
    parts: [
      { tag: "path", part: "pencil", attrs: { d: "M16.4 4.2a2.3 2.3 0 0 1 3.4 3.4L8.4 19 3.6 20.4 5 15.6z" } },
      { tag: "path", part: "line", attrs: { d: "M3.6 20.6h16.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        {
          part: "pencil",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(-1.6px, 1.6px)" },
            { at: 0.6, transform: "translate(1.6px, -1.6px)" },
            { at: 1, transform: "translate(-1.6px, 1.6px)" },
          ],
        },
        { part: "line", keys: drawKeys(0, 0.6) },
      ],
    },
  },

  {
    id: "save",
    cat: "action",
    label: { ja: "保存", en: "Save" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 5.4a2 2 0 0 1 2-2h10.4l4.8 4.8v10.4a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "slot", attrs: { d: "M7.6 3.4v5.2h6.8V3.4" } },
      { tag: "path", part: "label", attrs: { d: "M6.8 20.6v-6.2h10.4v6.2" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [{ part: ["body", "slot", "label"], origin: "12px 12px", keys: pulseKeys(1.1) }],
    },
  },

  {
    id: "share",
    cat: "action",
    label: { ja: "共有", en: "Share" },
    parts: [
      { tag: "path", part: "link", attrs: { d: "M8.4 10.7 L15.6 6.5 M8.4 13.3 L15.6 17.5" } },
      { tag: "circle", part: "node1", attrs: { cx: 5.8, cy: 12, r: 2.6 } },
      { tag: "circle", part: "node2", attrs: { cx: 18.2, cy: 5.2, r: 2.6 } },
      { tag: "circle", part: "node3", attrs: { cx: 18.2, cy: 18.8, r: 2.6 } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        {
          part: "node1",
          origin: "5.8px 12px",
          keys: [
            { at: 0, transform: "scale(0.3)", opacity: 0 },
            { at: 0.25, transform: "scale(1)", opacity: 1 },
            { at: 1, transform: "scale(1)", opacity: 1 },
          ],
        },
        {
          part: "node2",
          origin: "18.2px 5.2px",
          keys: [
            { at: 0, transform: "scale(0.3)", opacity: 0 },
            { at: 0.3, transform: "scale(0.3)", opacity: 0 },
            { at: 0.55, transform: "scale(1)", opacity: 1 },
            { at: 1, transform: "scale(1)", opacity: 1 },
          ],
        },
        {
          part: "node3",
          origin: "18.2px 18.8px",
          keys: [
            { at: 0, transform: "scale(0.3)", opacity: 0 },
            { at: 0.5, transform: "scale(0.3)", opacity: 0 },
            { at: 0.75, transform: "scale(1)", opacity: 1 },
            { at: 1, transform: "scale(1)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "filter",
    cat: "action",
    label: { ja: "絞り込み", en: "Filter" },
    parts: [
      { tag: "path", part: "funnel", attrs: { d: "M3.4 4.6h17.2l-6.9 8.2v6.6l-3.4 2v-8.6z" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [{ part: "funnel", keys: drawKeys(0, 0.75) }],
    },
  },

  {
    id: "refresh",
    cat: "action",
    label: { ja: "更新", en: "Refresh" },
    parts: [
      { tag: "path", part: "arc", attrs: { d: "M20.2 12a8.2 8.2 0 1 1-2.4-5.8" } },
      { tag: "path", part: "head", attrs: { d: "M19.4 4.6v4.2h-4.2" } },
    ],
    anim: {
      duration: 1,
      easing: "ease-in-out",
      tracks: [{ part: ["arc", "head"], origin: "12px 12px", keys: spinKeys() }],
    },
  },

  {
    id: "plus",
    cat: "action",
    label: { ja: "追加", en: "Add" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "bar1", attrs: { d: "M12 7.6V16.4" }, animAttrs: DRAW },
      { tag: "path", part: "bar2", attrs: { d: "M7.6 12H16.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.5) },
        { part: "bar1", keys: drawKeys(0.45, 0.7) },
        { part: "bar2", keys: drawKeys(0.65, 0.9) },
      ],
    },
  },

  {
    id: "minus",
    cat: "action",
    label: { ja: "削除（マイナス）", en: "Remove" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "bar", attrs: { d: "M7.6 12H16.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.55) },
        { part: "bar", keys: drawKeys(0.5, 0.85) },
      ],
    },
  },

  {
    id: "lock",
    cat: "action",
    label: { ja: "ロック", en: "Lock" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 4.4, y: 10.4, width: 15.2, height: 10.2, rx: 2 } },
      { tag: "path", part: "shackle", attrs: { d: "M8 10.4V7.6a4 4 0 0 1 8 0v2.8" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          // かんぬきが持ち上がって落ちる＝施錠の所作
          part: "shackle",
          origin: "12px 10px",
          keys: [
            { at: 0, transform: "translateY(-1.8px)" },
            { at: 0.45, transform: "translateY(-1.8px)" },
            { at: 0.7, transform: "translateY(0)" },
            { at: 1, transform: "translateY(0)" },
          ],
        },
      ],
    },
  },

  {
    id: "unlock",
    cat: "action",
    label: { ja: "ロック解除", en: "Unlock" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 4.4, y: 10.4, width: 15.2, height: 10.2, rx: 2 } },
      { tag: "path", part: "shackle", attrs: { d: "M8 10.4V7.6a4 4 0 0 1 7.7-1.5" } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        {
          part: "shackle",
          origin: "8px 10.4px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.4, transform: "rotate(-16deg)" },
            { at: 0.75, transform: "rotate(-16deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "pin",
    cat: "action",
    label: { ja: "ピン留め", en: "Pin" },
    parts: [
      { tag: "path", part: "head", attrs: { d: "M8.9 5.4h6.2l-.9 5.2 3.4 3.2H6.4l3.4-3.2z" } },
      { tag: "path", part: "needle", attrs: { d: "M12 13.8V20.4" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-out",
      // 図形を内側に描き直したうえで移動量も抑える（5.4 - 線幅1 - 3 = 1.4 で枠内）
      tracks: [{ part: ["head", "needle"], origin: "12px 12px", keys: bounceKeys("Y", -3) }],
    },
  },

  {
    id: "print",
    cat: "action",
    label: { ja: "印刷", en: "Print" },
    parts: [
      { tag: "path", part: "top", attrs: { d: "M7 8.4V3.4h10v5" } },
      { tag: "path", part: "body", attrs: { d: "M7 17.6H5.4a2 2 0 0 1-2-2v-4.2a2 2 0 0 1 2-2h13.2a2 2 0 0 1 2 2v4.2a2 2 0 0 1-2 2H17" } },
      { tag: "path", part: "paper", attrs: { d: "M7 14.2h10v6.4H7z" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        {
          // 印刷された紙が出てくる
          part: "paper",
          origin: "12px 14.2px",
          keys: [
            { at: 0, transform: "translateY(4px) scaleY(0.35)" },
            { at: 0.55, transform: "translateY(0) scaleY(1)" },
            { at: 1, transform: "translateY(0) scaleY(1)" },
          ],
        },
      ],
    },
  },
];
