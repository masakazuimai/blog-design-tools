// デバイスカテゴリのアイコン定義（共通ルールは status.js のヘッダーを参照）

import { DRAW, drawKeys, pulseKeys, bounceKeys, popInKeys, blinkKeys, spinKeys } from "./_shared.js?v=20260815c";

export const DEVICE_ICONS = [
  {
    id: "desktop",
    cat: "device",
    label: { ja: "デスクトップ", en: "Desktop" },
    parts: [
      { tag: "rect", part: "screen", attrs: { x: 2.6, y: 4.4, width: 18.8, height: 12, rx: 2 } },
      { tag: "path", part: "stand", attrs: { d: "M12 16.4v3.2 M8 19.6h8" } },
      { tag: "path", part: "l1", attrs: { d: "M6 8.6h8" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M6 12.2h12" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        // 画面に内容が出る動き。全体のわずかな拡大では変化が読み取れなかった
        { part: "l1", keys: drawKeys(0.1, 0.45) },
        { part: "l2", keys: drawKeys(0.35, 0.75) },
      ],
    },
  },
  {
    id: "laptop",
    cat: "device",
    label: { ja: "ノートPC", en: "Laptop" },
    parts: [
      { tag: "path", part: "screen", attrs: { d: "M5 5.4h14v10H5z" } },
      { tag: "path", part: "base", attrs: { d: "M2.6 18.6h18.8l-1.4-3.2H4z" } },
    ],
    anim: {
      duration: 1.5,
      easing: "ease-in-out",
      tracks: [
        {
          // 画面が開く
          part: "screen",
          origin: "12px 15.4px",
          keys: [
            { at: 0, transform: "scaleY(0.1)" },
            { at: 0.5, transform: "scaleY(1)" },
            { at: 1, transform: "scaleY(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "tablet",
    cat: "device",
    label: { ja: "タブレット", en: "Tablet" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 4.4, y: 3.4, width: 15.2, height: 17.2, rx: 2 } },
      { tag: "path", part: "home", attrs: { d: "M12 17.8 L12 17.81" } },
      { tag: "path", part: "l1", attrs: { d: "M7.4 7.6h9.2" }, animAttrs: DRAW },
      { tag: "path", part: "l2", attrs: { d: "M7.4 11h9.2" }, animAttrs: DRAW },
      { tag: "path", part: "l3", attrs: { d: "M7.4 14.4h5.6" }, animAttrs: DRAW },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "l1", keys: drawKeys(0.05, 0.35) },
        { part: "l2", keys: drawKeys(0.25, 0.55) },
        { part: "l3", keys: drawKeys(0.45, 0.75) },
      ],
    },
  },
  {
    id: "smartphone",
    cat: "device",
    label: { ja: "スマートフォン", en: "Smartphone" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 6.4, y: 3.4, width: 11.2, height: 17.2, rx: 2.4 } },
      { tag: "path", part: "home", attrs: { d: "M12 17.8 L12 17.81" } },
      { tag: "path", part: "speaker", attrs: { d: "M10.6 6.2h2.8" } },
    ],
    anim: {
      duration: 1.2,
      easing: "ease-in-out",
      tracks: [
        {
          // 着信のように小刻みに震える
          part: ["body", "home", "speaker"],
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.2, transform: "rotate(4deg)" },
            { at: 0.4, transform: "rotate(-4deg)" },
            { at: 0.6, transform: "rotate(3deg)" },
            { at: 0.8, transform: "rotate(-2deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "watch",
    cat: "device",
    label: { ja: "スマートウォッチ", en: "Smartwatch" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 6.6, y: 6.6, width: 10.8, height: 10.8, rx: 2.4 } },
      { tag: "path", part: "band", attrs: { d: "M9 6.6V3.4h6v3.2 M9 17.4v3.2h6v-3.2" } },
      { tag: "path", part: "minute", attrs: { d: "M12 12V8.6" } },
      { tag: "path", part: "hour", attrs: { d: "M12 12h2.6" } },
    ],
    anim: {
      duration: 2,
      easing: "linear",
      tracks: [
        // 短針も足して2本動かす。細い針1本では変化が小さかった
        { part: "minute", origin: "12px 12px", keys: spinKeys() },
        {
          part: "hour",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 1, transform: "rotate(120deg)" },
          ],
        },
      ],
    },
  },
  {
    id: "tv",
    cat: "device",
    label: { ja: "テレビ", en: "TV" },
    parts: [
      { tag: "rect", part: "screen", attrs: { x: 2.6, y: 6.4, width: 18.8, height: 12, rx: 2 } },
      { tag: "path", part: "legs", attrs: { d: "M8.4 6.4 L12 3.4 L15.6 6.4" } },
      { tag: "path", part: "scan", attrs: { d: "M5 12h14" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        {
          // 走査線が画面を流れる。隅のランプの点滅では気づけなかった
          part: "scan",
          keys: [
            { at: 0, transform: "translateY(-3.6px)", opacity: 0.2 },
            { at: 0.15, transform: "translateY(-3.6px)", opacity: 1 },
            { at: 0.8, transform: "translateY(3.6px)", opacity: 1 },
            { at: 0.95, transform: "translateY(3.6px)", opacity: 0.2 },
            { at: 1, transform: "translateY(-3.6px)", opacity: 0.2 },
          ],
        },
      ],
    },
  },
  {
    id: "keyboard",
    cat: "device",
    label: { ja: "キーボード", en: "Keyboard" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.6, y: 6.4, width: 18.8, height: 11.2, rx: 2 } },
      { tag: "path", part: "row1", attrs: { d: "M6 10 L6 10.01 M9.4 10 L9.4 10.01 M12.8 10 L12.8 10.01 M16.2 10 L16.2 10.01" } },
      { tag: "path", part: "space", attrs: { d: "M8 14.4h8" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        { part: "row1", keys: blinkKeys(0.1) },
        { part: "space", origin: "12px 14.4px", keys: popInKeys(0.4) },
      ],
    },
  },
  {
    id: "mouse",
    cat: "device",
    label: { ja: "マウス", en: "Mouse" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 7.4, y: 4.4, width: 9.2, height: 15.2, rx: 4.6 } },
      { tag: "path", part: "wheel", attrs: { d: "M12 7.6v3" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        {
          // 本体ごと動かす。ホイールだけの微動では変化が見えなかった
          part: "body",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0)" },
            { at: 0.3, transform: "translate(2px, -1.4px)" },
            { at: 0.6, transform: "translate(-1.6px, 1.2px)" },
            { at: 1, transform: "translate(0, 0)" },
          ],
        },
        {
          // 同じパーツを2つのトラックで指定すると animation が後勝ちで打ち消し合うため、
          // ホイールは本体と同じ移動量にスクロールの縮みを合成して1トラックにする
          part: "wheel",
          origin: "12px 12px",
          keys: [
            { at: 0, transform: "translate(0, 0) scaleY(1)" },
            { at: 0.3, transform: "translate(2px, -1.4px) scaleY(0.35)" },
            { at: 0.6, transform: "translate(-1.6px, 1.2px) scaleY(1)" },
            { at: 1, transform: "translate(0, 0) scaleY(1)" },
          ],
        },
      ],
    },
  },
  {
    id: "usb",
    cat: "device",
    label: { ja: "USB", en: "USB" },
    parts: [
      { tag: "path", part: "cable", attrs: { d: "M12 20.6V7.4" } },
      { tag: "path", part: "head", attrs: { d: "M9.4 7.4h5.2V3.6H9.4z" } },
      { tag: "path", part: "prongs", attrs: { d: "M9 12h6" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["cable", "head", "prongs"], origin: "12px 12px", keys: bounceKeys("Y", -1.6) }] },
  },
  {
    id: "hard-drive",
    cat: "device",
    label: { ja: "ハードディスク", en: "Hard drive" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 3.4, y: 7.4, width: 17.2, height: 9.2, rx: 2 } },
      { tag: "path", part: "led", attrs: { d: "M17.4 12 L17.4 12.01" } },
      { tag: "path", part: "bar", attrs: { d: "M6.6 12h5.6" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        // 小さなランプの点滅だけでは動きが見えないので、読み書きのバーを走らせる
        {
          part: "bar",
          origin: "9.4px 12px",
          keys: [
            { at: 0, transform: "scaleX(0.15)" },
            { at: 0.45, transform: "scaleX(1)" },
            { at: 0.9, transform: "scaleX(0.15)" },
            { at: 1, transform: "scaleX(0.15)" },
          ],
        },
        { part: "led", keys: blinkKeys(0.1) },
      ],
    },
  },
  {
    id: "sd-card",
    cat: "device",
    label: { ja: "SDカード", en: "SD card" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M6.4 3.4h8.4l4.8 4.8v12.4H6.4z" } },
      { tag: "path", part: "pins", attrs: { d: "M9.4 6.4v3 M12 6.4v3 M14.6 8.4v1" } },
    ],
    anim: { duration: 1.3, easing: "ease-in-out", tracks: [{ part: ["body", "pins"], origin: "12px 12px", keys: bounceKeys("Y", -1.4) }] },
  },
  {
    id: "charging",
    cat: "device",
    label: { ja: "充電中", en: "Charging" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 2.4, y: 8.4, width: 15.2, height: 7.2, rx: 2 } },
      { tag: "path", part: "cap", attrs: { d: "M20.4 11v2" } },
      { tag: "path", part: "bolt", attrs: { d: "M11.4 10 L8.8 13.4h2.6l-.4 2.6 2.8-3.6h-2.6z" } },
    ],
    anim: { duration: 1.4, easing: "ease-in-out", tracks: [{ part: "bolt", keys: blinkKeys(0.1) }] },
  },
  {
    id: "bluetooth",
    cat: "device",
    label: { ja: "Bluetooth", en: "Bluetooth" },
    parts: [
      { tag: "path", part: "mark", attrs: { d: "M7.4 8 L16.6 16 L12 20.4V3.6L16.6 8 L7.4 16" }, animAttrs: DRAW },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "mark", keys: drawKeys(0.05, 0.8) }] },
  },
  {
    id: "router",
    cat: "device",
    label: { ja: "ルーター", en: "Router" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 3.4, y: 13.4, width: 17.2, height: 6.2, rx: 1.6 } },
      { tag: "path", part: "antenna", attrs: { d: "M7.4 13.4V9.4 M16.6 13.4V9.4" } },
      { tag: "path", part: "led", attrs: { d: "M7.4 16.6 L7.4 16.61 M10.4 16.6 L10.4 16.61" } },
      { tag: "path", part: "wave", attrs: { d: "M9.6 6.6a5 5 0 0 1 4.8 0" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-in-out",
      tracks: [
        { part: "led", keys: blinkKeys(0.1) },
        // 電波が広がる動きにする（点滅だけでは変化が小さい）
        {
          part: "wave",
          origin: "12px 6.6px",
          keys: [
            { at: 0, transform: "scale(0.3)", opacity: 0 },
            { at: 0.35, transform: "scale(1)", opacity: 1 },
            { at: 0.75, transform: "scale(1.5)", opacity: 0 },
            { at: 1, transform: "scale(1.5)", opacity: 0 },
          ],
        },
      ],
    },
  },
  {
    id: "cable",
    cat: "device",
    label: { ja: "ケーブル", en: "Cable" },
    parts: [
      { tag: "path", part: "wire", attrs: { d: "M7 10v2a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3v0.8" }, animAttrs: DRAW },
      { tag: "path", part: "plug1", attrs: { d: "M4.6 6h4.8v1.6a2.4 2.4 0 0 1-4.8 0z M5.6 3.6v2.4 M8.4 3.6v2.4" } },
      { tag: "path", part: "plug2", attrs: { d: "M12.6 18.8h4.8v-1.6a2.4 2.4 0 0 0-4.8 0z M13.8 21v-2.2 M16.2 21v-2.2" } },
    ],
    anim: { duration: 1.6, easing: "ease-in-out", tracks: [{ part: "wire", keys: drawKeys(0.1, 0.8) }] },
  },
  {
    id: "sim",
    cat: "device",
    label: { ja: "SIMカード", en: "SIM card" },
    parts: [
      { tag: "path", part: "body", attrs: { d: "M5.4 3.4h9l4.2 4.2v13H5.4z" } },
      { tag: "rect", part: "chip", attrs: { x: 8.6, y: 11.4, width: 6.8, height: 5.4, rx: 1 } },
    ],
    anim: { duration: 1.4, easing: "ease-out", tracks: [{ part: "chip", origin: "12px 14.1px", keys: popInKeys(0.2) }] },
  },
  {
    id: "projector",
    cat: "device",
    label: { ja: "プロジェクター", en: "Projector" },
    parts: [
      { tag: "rect", part: "body", attrs: { x: 3.4, y: 12.4, width: 17.2, height: 7.2, rx: 2 } },
      { tag: "circle", part: "lens", attrs: { cx: 9, cy: 16, r: 2.2 } },
      { tag: "path", part: "beam", attrs: { d: "M13.4 8.4a5 5 0 0 1 5.6 0 M14.8 5.4a8 8 0 0 1 4.2 0" } },
    ],
    anim: {
      duration: 1.8,
      easing: "ease-out",
      tracks: [
        { part: "lens", origin: "9px 16px", keys: pulseKeys(1.14) },
        { part: "beam", keys: blinkKeys(0.2) },
      ],
    },
  },
  {
    id: "robot",
    cat: "device",
    label: { ja: "ロボット", en: "Robot" },
    parts: [
      { tag: "rect", part: "head", attrs: { x: 4.6, y: 7.4, width: 14.8, height: 11.2, rx: 2.4 } },
      { tag: "path", part: "antenna", attrs: { d: "M12 7.4V4.6 M10.6 3.4h2.8" } },
      { tag: "path", part: "eyes", attrs: { d: "M9.4 12 L9.4 12.01 M14.6 12 L14.6 12.01" } },
      { tag: "path", part: "mouth", attrs: { d: "M9.8 15.6h4.4" } },
    ],
    anim: {
      duration: 1.6,
      easing: "ease-in-out",
      tracks: [
        // 同じパーツを2トラックで指定すると animation が後勝ちで打ち消し合うため、
        // 目は「首振り＋まばたき」を1トラックに合成する
        {
          part: ["head", "antenna", "mouth"],
          origin: "12px 18.6px",
          keys: [
            { at: 0, transform: "rotate(0deg)" },
            { at: 0.3, transform: "rotate(-3deg)" },
            { at: 0.6, transform: "rotate(3deg)" },
            { at: 1, transform: "rotate(0deg)" },
          ],
        },
        {
          part: "eyes",
          origin: "12px 18.6px",
          keys: [
            { at: 0, transform: "rotate(0deg)", opacity: 1 },
            { at: 0.3, transform: "rotate(-3deg)", opacity: 0.15 },
            { at: 0.45, transform: "rotate(0deg)", opacity: 1 },
            { at: 0.6, transform: "rotate(3deg)", opacity: 1 },
            { at: 1, transform: "rotate(0deg)", opacity: 1 },
          ],
        },
      ],
    },
  },
];
