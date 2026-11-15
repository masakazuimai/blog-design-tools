const TEXT = {
  autoX: {
    ja: "動かし方：自動で横に送っています。見本の中を横にスクロールしても動かせます",
    en: "How it moves: it scrolls sideways on its own. You can also scroll the preview yourself",
  },
  markers: {
    ja: "動かし方：自動で送っています。← → や下の点を押しても切り替わります",
    en: "How it moves: it advances on its own. You can also press ← → or the dots",
  },
  autoY: {
    ja: "動かし方：自動で下へスクロールしています。見本の中を上下にスクロールしても動かせます",
    en: "How it moves: the preview scrolls down on its own. You can also scroll it yourself",
  },
  drag: {
    ja: "動かし方：見本の中をマウスでドラッグしてください（スマホは指で）",
    en: "How it moves: drag inside the preview with your mouse (or finger on mobile)",
  },
  click: {
    ja: "動かし方：ボタン・点・サムネイルを押してください",
    en: "How it moves: press the buttons, dots or thumbnails",
  },
  hover: {
    ja: "動かし方：カードにマウスを乗せてください",
    en: "How it moves: hover over the cards",
  },
  auto: {
    ja: "動かし方：自動で動き続けます",
    en: "How it moves: it keeps moving on its own",
  },
};

const BY_ID = {
  "scroll-markers": "markers",
  "inertia-drag": "drag",
  "bounce-snap": "drag",
  "skew-drag": "drag",
  "drag-helix": "drag",
  "swipe-cards": "drag",
  "stretch-drag": "drag",
  thumbnails: "click",
  "radio-slide": "click",
  numbered: "click",
  dial: "click",
  fan: "hover",
  accordion: "hover",
  slanted: "hover",
  polaroid: "hover",
  hexagon: "hover",
  "slowdown-loop": "hover",
};

export function howText(type, lang) {
  const key = BY_ID[type.id] || (type.demo === "x" ? "autoX" : type.demo === "y" ? "autoY" : "auto");
  return TEXT[key][lang] || TEXT[key].ja;
}
