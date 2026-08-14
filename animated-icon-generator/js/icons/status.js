// 状態・通知カテゴリのアイコン定義
//
// 共通ルール（全カテゴリ共通・アイコン追加時も厳守）
//  - viewBox は 0 0 24 24 / stroke-width 2 / linecap・linejoin ともに round / fill なし
//  - 描画はおおむね 3〜21 の範囲に収める（線幅ぶんの余白を残す）
//  - parts は「アニメを適用していない完成形」。静止SVGとPNGはこれをそのまま書き出す
//  - 線を描くアニメは animAttrs に pathLength="1" を持たせ、stroke-dashoffset を 1→0 で動かす
//    （実際のパス長を測らずに済み、どのアイコンでも同じ書き方で通る）
//  - 動きの語彙は draw / spin / pulse / swing / bounce / blink / slide に統一する

import { DRAW, drawKeys, spinKeys, swingKeys } from "./_shared.js?v=20260815a";

export const STATUS_ICONS = [
  {
    id: "check",
    cat: "status",
    label: { ja: "チェック", en: "Check" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "tick", attrs: { d: "M7.8 12.4 L10.7 15.3 L16.4 9.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.55) },
        { part: "tick", keys: drawKeys(0.45, 0.85) },
      ],
    },
  },

  {
    id: "error",
    cat: "status",
    label: { ja: "エラー", en: "Error" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "slash1", attrs: { d: "M8.6 8.6 L15.4 15.4" }, animAttrs: DRAW },
      { tag: "path", part: "slash2", attrs: { d: "M15.4 8.6 L8.6 15.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.5) },
        { part: "slash1", keys: drawKeys(0.45, 0.7) },
        { part: "slash2", keys: drawKeys(0.65, 0.9) },
      ],
    },
  },

  {
    id: "warning",
    cat: "status",
    label: { ja: "警告", en: "Warning" },
    parts: [
      { tag: "path", part: "tri", attrs: { d: "M12 4.2 L21 19.8 H3 Z" }, animAttrs: DRAW },
      { tag: "path", part: "mark", attrs: { d: "M12 10.2 V14" } },
      { tag: "path", part: "dot", attrs: { d: "M12 17.2 L12 17.21" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "tri", keys: drawKeys(0, 0.45) },
        {
          part: ["mark", "dot"],
          keys: [
            { at: 0, opacity: 0 },
            { at: 0.45, opacity: 0 },
            { at: 0.55, opacity: 1 },
            { at: 0.7, opacity: 0.2 },
            { at: 0.85, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "info",
    cat: "status",
    label: { ja: "インフォメーション", en: "Info" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "dot", attrs: { d: "M12 7.9 L12 7.91" } },
      { tag: "path", part: "bar", attrs: { d: "M12 11.4 V16.4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.5) },
        {
          part: "dot",
          keys: [
            { at: 0, opacity: 0 },
            { at: 0.5, opacity: 0 },
            { at: 0.6, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
        { part: "bar", keys: drawKeys(0.6, 0.85) },
      ],
    },
  },

  {
    id: "bell",
    cat: "status",
    label: { ja: "ベル", en: "Bell" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M7 16.4V10.6a5 5 0 0 1 10 0v5.8 M4.8 16.4h14.4" } },
      { tag: "path", part: "clapper", attrs: { d: "M10 19.4a2 2 0 0 0 4 0" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          // ベル本体と振り子を同じ軸で揺らす。軸は傘の頂点あたり（viewBox座標）
          part: ["body", "clapper"],
          origin: "12px 5.5px",
          keys: swingKeys(13),
        },
      ],
    },
  },

  {
    id: "heart",
    cat: "status",
    label: { ja: "ハート", en: "Heart" },
    parts: [
      {
        tag: "path",
        part: "shape",
        attrs: {
          d: "M12 20.4 C12 20.4 3.6 15 3.6 9.4 A4.6 4.6 0 0 1 12 6.8 A4.6 4.6 0 0 1 20.4 9.4 C20.4 15 12 20.4 12 20.4 Z",
        },
      },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: "shape",
          origin: "12px 13px",
          keys: [
            { at: 0, transform: "scale(1)" },
            { at: 0.15, transform: "scale(1.16)" },
            { at: 0.3, transform: "scale(1)" },
            { at: 0.45, transform: "scale(1.12)" },
            { at: 0.6, transform: "scale(1)" },
            { at: 1, transform: "scale(1)" },
          ],
        },
      ],
    },
  },

  {
    id: "star",
    cat: "status",
    label: { ja: "スター", en: "Star" },
    parts: [
      {
        tag: "path",
        part: "shape",
        attrs: { d: "M12 3.6 L14.6 9.3 L20.8 10.1 L16.2 14.3 L17.5 20.4 L12 17.4 L6.5 20.4 L7.8 14.3 L3.2 10.1 L9.4 9.3 Z" },
      },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-out",
      tracks: [
        {
          part: "shape",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(-30deg) scale(0.4)", opacity: 0 },
            { at: 0.55, transform: "rotate(8deg) scale(1.12)", opacity: 1 },
            { at: 0.75, transform: "rotate(0deg) scale(1)", opacity: 1 },
            { at: 1, transform: "rotate(0deg) scale(1)", opacity: 1 },
          ],
        },
      ],
    },
  },

  {
    id: "loading",
    cat: "status",
    label: { ja: "読み込み中", en: "Loading" },
    parts: [
      { tag: "circle", part: "track", attrs: { cx: 12, cy: 12, r: 9, opacity: 0.2 } },
      // 1/4 円だと小サイズで弧が見えないため半円にする
      { tag: "path", part: "arc", attrs: { d: "M12 3 A9 9 0 0 1 12 21" } },
    ],
    anim: {
      duration: 0.9,
      easing: "linear",
      tracks: [
        {
          part: "arc",
          origin: "12px 12px",
          keys: spinKeys(),
        },
      ],
    },
  },

  {
    id: "thumbs-up",
    cat: "status",
    label: { ja: "いいね", en: "Thumbs up" },
    parts: [
      { tag: "path", part: "base", attrs: { d: "M3.2 11.4h3.4v9.2H3.2z" } },
      {
        tag: "path",
        part: "hand",
        attrs: { d: "M6.6 11.4 L10.6 3.6 a2.1 2.1 0 0 1 3 1.9 V10 h4.9 a2.1 2.1 0 0 1 2 2.6 l-1.4 6.1 a2.1 2.1 0 0 1-2 1.6 H6.6" },
      },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          part: ["base", "hand"],
          origin: "6px 20px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.2, transform: "rotate(-10deg)" },
            { at: 0.45, transform: "rotate(4deg)" },
            { at: 0.65, transform: "rotate(-4deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "shield",
    cat: "status",
    label: { ja: "シールド", en: "Shield" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M12 3.2 L20 6.2 v5.6 c0 4.7-3.3 7.7-8 9.1 -4.7-1.4-8-4.4-8-9.1 V6.2 Z" }, animAttrs: DRAW },
      { tag: "path", part: "tick", attrs: { d: "M8.8 12.1 L11.2 14.5 L15.4 10.3" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: "body", keys: drawKeys(0, 0.55) },
        { part: "tick", keys: drawKeys(0.55, 0.85) },
      ],
    },
  },

  {
    id: "clock",
    cat: "status",
    label: { ja: "時計", en: "Clock" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 } },
      // 短針は3時方向へ。両方を12時に置くと静止状態で時計に見えない
      { tag: "path", part: "hour", attrs: { d: "M12 12 H15.4" } },
      { tag: "path", part: "minute", attrs: { d: "M12 12 V6.6" } },
    ],
    anim: {
      duration: 2.4,
      easing: "linear",
      tracks: [
        {
          part: "minute",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(360deg)" },
          ],
        },
        {
          part: "hour",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(30deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "hourglass",
    cat: "status",
    label: { ja: "砂時計", en: "Hourglass" },
    parts: [
      {
        tag: "path",
        part: "body",
        attrs: {
          d: "M6.6 3.4h10.8 M6.6 20.6h10.8 M7.8 3.4v3.1c0 1 .4 1.9 1.1 2.6L12 12l-3.1 2.9c-.7.7-1.1 1.6-1.1 2.6v3.1 M16.2 3.4v3.1c0 1-.4 1.9-1.1 2.6L12 12l3.1 2.9c.7.7 1.1 1.6 1.1 2.6v3.1",
        },
      },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          part: "body",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.6, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(180deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "hourglass-sand",
    cat: "status",
    label: { ja: "砂時計（砂が落ちる）", en: "Hourglass (draining)" },
    parts: [
      {
        tag: "path",
        part: "frame",
        attrs: {
          d: "M6.6 3.4h10.8 M6.6 20.6h10.8 M7.8 3.4v3.1c0 1 .4 1.9 1.1 2.6L12 12l-3.1 2.9c-.7.7-1.1 1.6-1.1 2.6v3.1 M16.2 3.4v3.1c0 1-.4 1.9-1.1 2.6L12 12l3.1 2.9c.7.7 1.1 1.6 1.1 2.6v3.1",
        },
      },
      // 砂は「枠の形で切り抜いた面を上下させる」方式にする。
      // 三角形を拡大縮小する方式だと、すぼまった壁沿いに必ず隙間が残るため。
      // clipPath を掛けた <g> は動かさず、中の <rect> だけを動かすのが要点
      // （clip-path は要素自身の transform と一緒に動いてしまい、掛け直しにならない）
      {
        tag: "defs",
        children: [
          {
            tag: "clipPath",
            attrs: { id: "aig-hourglass-top" },
            children: [{ tag: "path", attrs: { d: "M7.8 3.4 H16.2 V6.5 c0 1-.4 1.9-1.1 2.6 L12 12 L8.9 9.1 c-.7-.7-1.1-1.6-1.1-2.6 Z" } }],
          },
          {
            tag: "clipPath",
            attrs: { id: "aig-hourglass-bottom" },
            children: [{ tag: "path", attrs: { d: "M12 12 L15.1 14.9 c.7.7 1.1 1.6 1.1 2.6 V20.6 H7.8 V17.5 c0-1 .4-1.9 1.1-2.6 Z" } }],
          },
        ],
      },
      {
        tag: "g",
        attrs: { "clip-path": "url(#aig-hourglass-top)" },
        children: [{ tag: "rect", part: "sandTop", attrs: { x: 7, y: 3, width: 10, height: 9.6, fill: "currentColor", stroke: "none" } }],
      },
      {
        // 初期位置は枠の下＝空。上がってくると底から順に埋まる
        tag: "g",
        attrs: { "clip-path": "url(#aig-hourglass-bottom)" },
        children: [{ tag: "rect", part: "sandBottom", attrs: { x: 7, y: 21, width: 10, height: 9.6, fill: "currentColor", stroke: "none" } }],
      },
      { tag: "path", part: "grain", attrs: { d: "M12 11.8 V13.6" } },
    ],
    anim: {
      duration: 2.6,
      easing: "linear",
      tracks: [
        {
          // 砂の表面が下がる＝上の砂が減る
          part: "sandTop",
          keys: [
            { at: 0, transform: "translateY(0)" },
            { at: 0.85, transform: "translateY(9.6px)" },
            { at: 1, transform: "translateY(9.6px)" },
          ],
        },
        {
          // 下は逆に、面が上がってきて底から埋まる
          part: "sandBottom",
          keys: [
            { at: 0, transform: "translateY(0)" },
            { at: 0.85, transform: "translateY(-9.6px)" },
            { at: 1, transform: "translateY(-9.6px)" },
          ],
        },
        {
          // 落ちている間だけ砂粒の筋を見せる
          part: "grain",
          keys: [
            { at: 0, opacity: 0 },
            { at: 0.06, opacity: 1 },
            { at: 0.8, opacity: 1 },
            { at: 0.88, opacity: 0 },
            { at: 1, opacity: 0 },
          ],
        },
      ],
    },
  },

  {
    id: "battery",
    cat: "status",
    label: { ja: "バッテリー", en: "Battery" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.4, y: 8.4, width: 15.2, height: 7.2, rx: 2 } },
      { tag: "path", part: "cap", attrs: { d: "M20.4 11 V13" } },
      { tag: "path", part: "level", attrs: { d: "M5.4 12 H14.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [{ part: "level", keys: drawKeys(0.1, 0.9) }],
    },
  },

  {
    id: "wifi",
    cat: "status",
    label: { ja: "Wi-Fi", en: "Wi-Fi" },
    parts: [
      { tag: "path", part: "wave3", attrs: { d: "M2.4 9.3a14.2 14.2 0 0 1 19.2 0" } },
      { tag: "path", part: "wave2", attrs: { d: "M5.8 12.9a9.4 9.4 0 0 1 12.4 0" } },
      { tag: "path", part: "wave1", attrs: { d: "M9.1 16.4a4.6 4.6 0 0 1 5.8 0" } },
      { tag: "path", part: "dot", attrs: { d: "M12 19.6 L12 19.61" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        // 内側から外側へ順に灯る
        { part: "dot", keys: [{ at: 0, opacity: 0.15 }, { at: 0.15, opacity: 1 }, { at: 1, opacity: 1 }] },
        { part: "wave1", keys: [{ at: 0, opacity: 0.15 }, { at: 0.2, opacity: 0.15 }, { at: 0.35, opacity: 1 }, { at: 1, opacity: 1 }] },
        { part: "wave2", keys: [{ at: 0, opacity: 0.15 }, { at: 0.4, opacity: 0.15 }, { at: 0.55, opacity: 1 }, { at: 1, opacity: 1 }] },
        { part: "wave3", keys: [{ at: 0, opacity: 0.15 }, { at: 0.6, opacity: 0.15 }, { at: 0.75, opacity: 1 }, { at: 1, opacity: 1 }] },
      ],
    },
  },

  {
    id: "sync",
    cat: "status",
    label: { ja: "同期", en: "Sync" },
    parts: [
      { tag: "path", part: "top", attrs: { d: "M3.4 12a8.6 8.6 0 0 1 14.7-6.1" } },
      { tag: "path", part: "topHead", attrs: { d: "M18.2 3.6 V7 H14.8" } },
      { tag: "path", part: "bottom", attrs: { d: "M20.6 12a8.6 8.6 0 0 1-14.7 6.1" } },
      { tag: "path", part: "bottomHead", attrs: { d: "M5.8 20.4 V17 H9.2" } },
    ],
    anim: {
      duration: 1.2,
      easing: "linear",
      tracks: [
        {
          part: ["top", "topHead", "bottom", "bottomHead"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(360deg)" },
          ],
        },
      ],
    },
  },

  {
    id: "bookmark",
    cat: "status",
    label: { ja: "ブックマーク", en: "Bookmark" },
    parts: [
      { tag: "path", part: "shape", attrs: { d: "M6.4 3.4h11.2a1 1 0 0 1 1 1v16.2L12 16.2 5.4 20.6V4.4a1 1 0 0 1 1-1z" } },
    ],
    anim: {
      duration: 1.1,
      easing: "ease-out",
      tracks: [
        {
          part: "shape",
          origin: "12px 4px",
          keys: [
            { at: 0, transform: "translateY(-2.2px)", opacity: 0 },
            { at: 0.25, transform: "translateY(-1px)", opacity: 0.5 },
            { at: 0.5, transform: "translateY(1px)", opacity: 1 },
            { at: 0.7, transform: "translateY(-0.5px)", opacity: 1 },
            { at: 1, transform: "translateY(0)", opacity: 1 },
          ],
        },
      ],
    },
  },
];
