// EC・お金カテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys, swingKeys } from "./_shared.js?v=20260815b";

export const COMMERCE_ICONS = [
  {
    id: "cart",
    cat: "commerce",
    label: { ja: "カート", en: "Cart" },
    parts: [
      { tag: "path", part: "basket", attrs: { d: "M3.4 4.4h2.6l2.4 10.4h9.2l2.2-7.6H7.2" } },
      { tag: "circle", part: "wheel1", attrs: { cx: 9.6, cy: 19, r: 1.6 } },
      { tag: "circle", part: "wheel2", attrs: { cx: 17.2, cy: 19, r: 1.6 } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [{ part: ["basket", "wheel1", "wheel2"], origin: "12px 12px", keys: bounceKeys("X", 2) }],
    },
  },
  {
    id: "cart-add",
    cat: "commerce",
    label: { ja: "カートに追加", en: "Add to cart" },
    parts: [
      { tag: "path", part: "basket", attrs: { d: "M3.4 4.4h2.6l2.4 10.4h9.2l1.2-4.2" } },
      { tag: "circle", part: "wheel1", attrs: { cx: 9.6, cy: 19, r: 1.6 } },
      { tag: "circle", part: "wheel2", attrs: { cx: 17.2, cy: 19, r: 1.6 } },
      { tag: "path", part: "plus", attrs: { d: "M16.8 3.4v6.4 M13.6 6.6h6.4" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.3, easing: "ease-out", tracks: [{ part: "plus", keys: drawKeys(0.2, 0.7) }] },
  },
  {
    id: "bag",
    cat: "commerce",
    label: { ja: "ショッピングバッグ", en: "Shopping bag" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M4.6 7.6h14.8l-1.2 12a1.4 1.4 0 0 1-1.4 1.2H7.2a1.4 1.4 0 0 1-1.4-1.2z" } },
      { tag: "path", part: "handle", attrs: { d: "M8.6 10.2V7.2a3.4 3.4 0 0 1 6.8 0v3" } },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [{ part: ["body", "handle"], origin: "12px 12px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "wallet",
    cat: "commerce",
    label: { ja: "財布", en: "Wallet" },
    parts: [
      { tag: "path", part: "card", attrs: { d: "M7.4 8.6h9.2v4.8H7.4z" } },
      { tag: "path", part: "body", attrs: { d: "M3.6 8.4a2 2 0 0 1 2-2h12.8a2 2 0 0 1 2 2v1.8h-2.6a2.6 2.6 0 0 0 0 5.2h2.6v1.8a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z" } },
      { tag: "path", part: "coin", attrs: { d: "M17.6 12.8 L17.6 12.81" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          // カードが抜き差しされる（小さな点の点滅では動きが読み取れなかった）
          part: "card",
          keys: [
            { at: 0, transform: "translateY(0)" },
            { at: 0.4, transform: "translateY(-4.6px)" },
            { at: 0.8, transform: "translateY(0)" },
            { at: 1, transform: "translateY(0)" },
          ],
        },
      ],
    },
  },
  {
    id: "credit-card",
    cat: "commerce",
    label: { ja: "クレジットカード", en: "Credit card" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 4.4, y: 5.4, width: 15.2, height: 13.2, rx: 2 } },
      { tag: "path", part: "stripe", attrs: { d: "M4.4 9.8h15.2" } },
      { tag: "path", part: "number", attrs: { d: "M7.4 14.6h4" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          // カード全体を通す動き。細い線を描くだけでは変化が見えなかった
          part: ["body", "stripe", "number"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translateX(0)", opacity: 1 },
            { at: 0.4, transform: "translateX(3.4px)", opacity: 0 },
            { at: 0.5, transform: "translateX(-3.4px)", opacity: 0 },
            { at: 0.9, transform: "translateX(0)", opacity: 1 },
            { at: 1, transform: "translateX(0)", opacity: 1 },
          ],
        },
      ],
    },
  },
  {
    id: "coin",
    cat: "commerce",
    label: { ja: "コイン", en: "Coin" },
    parts: [
      { tag: "circle", part: "outer", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "circle", part: "inner", attrs: { cx: 12, cy: 12, r: 4.6 } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          // 表裏がひっくり返るように横方向だけ潰す
          part: ["outer", "inner"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "scaleX(1)" },
            { at: 0.5, transform: "scaleX(0.08)" },
            { at: 1, transform: "scaleX(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "yen",
    cat: "commerce",
    label: { ja: "円マーク", en: "Yen" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 }, animAttrs: DRAW },
      { tag: "path", part: "mark", attrs: { d: "M8 7.4 L12 12.4 L16 7.4 M8.4 13h7.2 M8.4 15.8h7.2 M12 12.4v4.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-in-out",
      tracks: [
        { part: "ring", keys: drawKeys(0, 0.5) },
        { part: "mark", keys: drawKeys(0.45, 0.9) },
      ],
    },
  },
  {
    id: "receipt",
    cat: "commerce",
    label: { ja: "レシート", en: "Receipt" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M5.4 3.4h13.2v17.2l-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6z" } },
      { tag: "path", part: "line1", attrs: { d: "M8.6 8.4h6.8" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M8.6 12h6.8" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: "line1", keys: drawKeys(0.15, 0.5) },
        { part: "line2", keys: drawKeys(0.4, 0.75) },
      ],
    },
  },
  {
    id: "price-tag",
    cat: "commerce",
    label: { ja: "値札", en: "Price tag" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M11.4 3.6H4.6a1 1 0 0 0-1 1v6.8l9 9a1.4 1.4 0 0 0 2 0l6.4-6.4a1.4 1.4 0 0 0 0-2z" } },
      { tag: "path", part: "hole", attrs: { d: "M7.8 7.8 L7.8 7.81" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["body", "hole"], origin: "5px 5px", keys: swingKeys(9) }] },
  },
  {
    id: "discount",
    cat: "commerce",
    label: { ja: "割引", en: "Discount" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 9 } },
      { tag: "path", part: "slash", attrs: { d: "M15.8 8.2 L8.2 15.8" }, animAttrs: DRAW },
      { tag: "path", part: "dot1", attrs: { d: "M9 9 L9 9.01" } },
      { tag: "path", part: "dot2", attrs: { d: "M15 15 L15 15.01" } },
    ],
    anim: {
      duration: 1.4,
      easing: "ease-out",
      tracks: [
        { part: "slash", keys: drawKeys(0.1, 0.5) },
        { part: "dot1", origin: "9px 9px", keys: popInKeys(0.45) },
        { part: "dot2", origin: "15px 15px", keys: popInKeys(0.58) },
      ],
    },
  },
  {
    id: "package",
    cat: "commerce",
    label: { ja: "荷物", en: "Package" },
    parts: [
      { tag: "path", part: "box", attrs: { d: "M12 3.6 L20.4 8v8L12 20.4 L3.6 16V8z" } },
      { tag: "path", part: "edge", attrs: { d: "M3.6 8 L12 12.4 L20.4 8 M12 12.4v8" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "edge", keys: drawKeys(0.2, 0.75) }] },
  },
  {
    id: "truck",
    cat: "commerce",
    label: { ja: "配送", en: "Delivery truck" },
    parts: [
      // 横移動と車輪の回転ぶんの余白を残すため、荷台を内側に収める
      { tag: "path", part: "body", attrs: { d: "M3.6 6.6h9.6v9.6H3.6z M13.2 9.8h3.4l2.8 2.8v3.6h-6.2z" } },
      { tag: "circle", part: "wheel1", attrs: { cx: 7.2, cy: 18, r: 1.7 } },
      { tag: "circle", part: "wheel2", attrs: { cx: 16.4, cy: 18, r: 1.7 } },
    ],
    anim: {
      duration: 1.3,
      easing: "ease-in-out",
      tracks: [
        { part: ["body", "wheel1", "wheel2"], origin: "12px 12px", keys: bounceKeys("X", 1.2) },
      ],
    },
  },
  {
    id: "store",
    cat: "commerce",
    label: { ja: "店舗", en: "Store" },
    parts: [
      { tag: "path", part: "roof", attrs: { d: "M3.4 8.4 L5 4.4h14l1.6 4z" } },
      { tag: "path", part: "body", attrs: { d: "M4.6 8.4v11.2a1 1 0 0 0 1 1h12.8a1 1 0 0 0 1-1V8.4" } },
      { tag: "path", part: "shutter", attrs: { d: "M6.6 10.4h10.8v9.2H6.6z" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          // シャッターが上がって開店する（ドアの線を描くだけでは伝わらなかった）
          part: "shutter",
          origin: "12px 10.4px",
          keys: [
            { at: 0, transform: "scaleY(1)" },
            { at: 0.45, transform: "scaleY(0.08)" },
            { at: 0.85, transform: "scaleY(0.08)" },
            { at: 1, transform: "scaleY(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "barcode",
    cat: "commerce",
    label: { ja: "バーコード", en: "Barcode" },
    parts: [
      { tag: "path", part: "frame", attrs: { d: "M3.4 6.6V4.6h3 M17.6 4.6h3v2 M20.6 17.4v2h-3 M6.4 19.4h-3v-2" } },
      { tag: "path", part: "bar1", attrs: { d: "M7.4 8.4v7.2" }, animAttrs: DRAW },
      { tag: "path", part: "bar2", attrs: { d: "M10.4 8.4v7.2" }, animAttrs: DRAW },
      { tag: "path", part: "bar3", attrs: { d: "M13.6 8.4v7.2" }, animAttrs: DRAW },
      { tag: "path", part: "bar4", attrs: { d: "M16.6 8.4v7.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "bar1", keys: drawKeys(0, 0.3) },
        { part: "bar2", keys: drawKeys(0.15, 0.45) },
        { part: "bar3", keys: drawKeys(0.3, 0.6) },
        { part: "bar4", keys: drawKeys(0.45, 0.75) },
      ],
    },
  },
  {
    id: "qr",
    cat: "commerce",
    label: { ja: "QRコード", en: "QR code" },
    parts: [
      { tag: "rect", part: "tl", attrs: { x: 3.6, y: 3.6, width: 6.4, height: 6.4, rx: 1.2 } },
      { tag: "rect", part: "tr", attrs: { x: 14, y: 3.6, width: 6.4, height: 6.4, rx: 1.2 } },
      { tag: "rect", part: "bl", attrs: { x: 3.6, y: 14, width: 6.4, height: 6.4, rx: 1.2 } },
      { tag: "path", part: "dots", attrs: { d: "M14 14 L14 14.01 M18 14 L18 14.01 M14 18 L14 18.01 M18 18 L18 18.01 M16 16 L16 16.01" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "tl", origin: "6.8px 6.8px", keys: popInKeys(0) },
        { part: "tr", origin: "17.2px 6.8px", keys: popInKeys(0.12) },
        { part: "bl", origin: "6.8px 17.2px", keys: popInKeys(0.24) },
        { part: "dots", origin: "16px 16px", keys: popInKeys(0.36) },
      ],
    },
  },
  {
    id: "invoice",
    cat: "commerce",
    label: { ja: "請求書", en: "Invoice" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M5.4 3.6h13.2v16.8H5.4z" } },
      { tag: "path", part: "line1", attrs: { d: "M8.4 8h7.2" }, animAttrs: DRAW },
      { tag: "path", part: "line2", attrs: { d: "M8.4 11.4h7.2" }, animAttrs: DRAW },
      { tag: "path", part: "total", attrs: { d: "M11.6 16h4" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "line1", keys: drawKeys(0.05, 0.35) },
        { part: "line2", keys: drawKeys(0.25, 0.55) },
        { part: "total", keys: drawKeys(0.5, 0.8) },
      ],
    },
  },
  {
    id: "refund",
    cat: "commerce",
    label: { ja: "返金", en: "Refund" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.4 } },
      { tag: "path", part: "arrow", attrs: { d: "M12 7.6 L8.4 11.2 L12 14.8" } },
      { tag: "path", part: "tail", attrs: { d: "M8.4 11.2h5.2a3 3 0 0 1 0 6" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["arrow", "tail"], origin: "12px 12px", keys: bounceKeys("X", -1.6) }] },
  },
  {
    id: "piggy-bank",
    cat: "commerce",
    label: { ja: "貯金", en: "Savings" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M4.4 13.6a7 7 0 0 1 7-6.4h3a7 7 0 0 1 5.2 2.4h1.8v4h-1.6a7 7 0 0 1-2.4 3v2.4h-3v-1.6h-3v1.6h-3v-2.6a7 7 0 0 1-3-2.8z" } },
      { tag: "path", part: "slot", attrs: { d: "M10.4 7.4h3.6" } },
      { tag: "circle", part: "coin", attrs: { cx: 12.2, cy: 4.6, r: 2.2 } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in",
      tracks: [
        {
          // コインが上から落ちて投入口に消える
          part: "coin",
          keys: [
            { at: 0, transform: "translateY(-1.4px)", opacity: 0 },
            { at: 0.2, transform: "translateY(0)", opacity: 1 },
            { at: 0.6, transform: "translateY(3px)", opacity: 1 },
            { at: 0.75, transform: "translateY(3.6px)", opacity: 0 },
            { at: 1, transform: "translateY(3.6px)", opacity: 0 },
          ],
        },
      ],
    },
  },
  {
    id: "sales-up",
    cat: "commerce",
    label: { ja: "売上アップ", en: "Sales up" },
    parts: [
      { tag: "path", part: "axis", attrs: { d: "M3.6 3.6v16.8h16.8" } },
      { tag: "path", part: "line", attrs: { d: "M6.6 16.6 L10.6 12 L14 14.4 L19 7.4" }, animAttrs: DRAW },
      { tag: "path", part: "head", attrs: { d: "M15.4 7.4H19v3.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-out",
      tracks: [
        { part: "line", keys: drawKeys(0.05, 0.65) },
        { part: "head", keys: drawKeys(0.6, 0.85) },
      ],
    },
  },
  {
    id: "basket",
    cat: "commerce",
    label: { ja: "買い物かご", en: "Basket" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 9.4h17.2l-1.8 9.4a1.4 1.4 0 0 1-1.4 1.2H6.6a1.4 1.4 0 0 1-1.4-1.2z" } },
      { tag: "path", part: "handle", attrs: { d: "M8.4 9.4 L10.6 4.4 M15.6 9.4 L13.4 4.4" } },
    ],
    anim: { duration: 1.2, easing: "ease-out", tracks: [{ part: ["body", "handle"], origin: "12px 14px", keys: pulseKeys(1.08) }] },
  },
  {
    id: "ticket",
    cat: "commerce",
    label: { ja: "チケット", en: "Ticket" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M3.4 7.4h17.2v3a2 2 0 0 0 0 4v2.2H3.4v-2.2a2 2 0 0 0 0-4z" } },
      { tag: "path", part: "line", attrs: { d: "M12 9v1.6 M12 13.4v1.6" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        { part: "body", origin: "12px 12px", keys: pulseKeys(1.08) },
        {
          // ミシン目が切り離れるように点滅させる（伸ばすと枠外へ出るため長さは変えない）
          part: "line",
          keys: [
            { at: 0, opacity: 1 },
            { at: 0.4, opacity: 0.15 },
            { at: 0.7, opacity: 1 },
            { at: 1, opacity: 1 },
          ],
        },
      ],
    },
  },
  {
    id: "membership",
    cat: "commerce",
    label: { ja: "会員証", en: "Membership" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.6, y: 5.4, width: 18.8, height: 13.2, rx: 2 } },
      { tag: "circle", part: "face", attrs: { cx: 8.6, cy: 10.6, r: 2.2 } },
      { tag: "path", part: "shoulder", attrs: { d: "M5.2 15.6a3.6 3.6 0 0 1 6.8 0" } },
      { tag: "path", part: "line", attrs: { d: "M14.6 10h4.2 M14.6 13.6h4.2" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-out",
      tracks: [
        { part: ["face", "shoulder"], origin: "8.6px 12px", keys: popInKeys(0.1) },
        { part: "line", keys: drawKeys(0.35, 0.75) },
      ],
    },
  },
  {
    id: "delivery",
    cat: "commerce",
    label: { ja: "お届け", en: "Delivery" },
    parts: [
      { tag: "path", part: "box", attrs: { d: "M6.4 9.6h11.2v9.6H6.4z" } },
      { tag: "path", part: "tape", attrs: { d: "M6.4 13.6h11.2 M12 9.6v9.6" } },
      { tag: "path", part: "arrow", attrs: { d: "M12 3.4v4.4 M9.6 5.8 L12 8.2 L14.4 5.8" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [
        { part: ["box", "tape"], origin: "12px 19.2px", keys: bounceKeys("Y", -1.6) },
        { part: "arrow", origin: "12px 6px", keys: bounceKeys("Y", 2.2) },
      ],
    },
  },
  {
    id: "point-star",
    cat: "commerce",
    label: { ja: "ポイント", en: "Points" },
    parts: [
      { tag: "circle", part: "ring", attrs: { cx: 12, cy: 12, r: 8.6 } },
      { tag: "path", part: "star", attrs: { d: "M12 7.2 L13.5 10.6 L17.2 11 L14.4 13.5 L15.2 17.2 L12 15.3 L8.8 17.2 L9.6 13.5 L6.8 11 L10.5 10.6 Z" } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: "star", origin: "12px 12px", keys: popInKeys(0.15) }] },
  },
];
