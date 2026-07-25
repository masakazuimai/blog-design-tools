// メニュー項目の出方（6種）
// パネル自体はフルスクリーンのフェードで共通化し、中のリンクの出方だけを変えている
// アクセント色 #6366f1 / サブ色 #ec4899（rgbは 99,102,241 / 236,72,153）は main.js が置換する

import { panelHtml, btnCss, linkCss } from "./shared.js?v=20260725a";

// リンクを時間差で動かす土台（パネルは共通のフェード）
function itemsBase(ns) {
  return [
    "." + ns + "__nav {",
    "  position: fixed; inset: 0; z-index: 20;",
    "  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;",
    "  background: #6366f1;",
    "  opacity: 0; visibility: hidden;",
    "  transition: opacity 0.3s ease, visibility 0s linear 0.3s;",
    "}",
    "." + ns + '__btn[aria-expanded="true"] ~ .' + ns + "__nav {",
    "  opacity: 1; visibility: visible;",
    "  transition: opacity 0.3s ease, visibility 0s;",
    "}",
  ];
}

// リンク1〜4に 0.08秒刻みのディレイを与える
function stagger(ns, base) {
  return [
    "." + ns + '__btn[aria-expanded="true"] ~ .' + ns + "__nav a:nth-child(1) { transition-delay: " + base + "s; }",
    "." + ns + '__btn[aria-expanded="true"] ~ .' + ns + "__nav a:nth-child(2) { transition-delay: " + (base + 0.08).toFixed(2) + "s; }",
    "." + ns + '__btn[aria-expanded="true"] ~ .' + ns + "__nav a:nth-child(3) { transition-delay: " + (base + 0.16).toFixed(2) + "s; }",
    "." + ns + '__btn[aria-expanded="true"] ~ .' + ns + "__nav a:nth-child(4) { transition-delay: " + (base + 0.24).toFixed(2) + "s; }",
  ];
}

export const ITEM_PANELS = [
  {
    key: "hbp-staggerup",
    mode: "panel",
    cat: "items",
    label: { ja: "項目が順に下からフェードイン", en: "Items fade up one by one" },
    html: panelHtml("hbp-staggerup"),
    css: [
      ...btnCss("hbp-staggerup", "#fff"),
      ...itemsBase("hbp-staggerup"),
      ...linkCss("hbp-staggerup", "#fff"),
      ".hbp-staggerup__nav a {",
      "  opacity: 0; transform: translateY(24px);",
      "  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);",
      "}",
      '.hbp-staggerup__btn[aria-expanded="true"] ~ .hbp-staggerup__nav a { opacity: 0.9; transform: translateY(0); }',
      ...stagger("hbp-staggerup", 0.15),
    ],
  },
  {
    key: "hbp-staggerleft",
    mode: "panel",
    cat: "items",
    label: { ja: "項目が順に左からスライド", en: "Items slide in from the left" },
    html: panelHtml("hbp-staggerleft"),
    css: [
      ...btnCss("hbp-staggerleft", "#fff"),
      ...itemsBase("hbp-staggerleft"),
      ...linkCss("hbp-staggerleft", "#fff"),
      ".hbp-staggerleft__nav a {",
      "  opacity: 0; transform: translateX(-40px);",
      "  transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);",
      "}",
      '.hbp-staggerleft__btn[aria-expanded="true"] ~ .hbp-staggerleft__nav a { opacity: 0.9; transform: translateX(0); }',
      ...stagger("hbp-staggerleft", 0.15),
    ],
  },
  {
    key: "hbp-flipitems",
    mode: "panel",
    cat: "items",
    label: { ja: "項目が起き上がって現れる", en: "Items flip up into place" },
    html: panelHtml("hbp-flipitems"),
    css: [
      ...btnCss("hbp-flipitems", "#fff"),
      ...itemsBase("hbp-flipitems"),
      ".hbp-flipitems__nav { perspective: 600px; }",
      ...linkCss("hbp-flipitems", "#fff"),
      ".hbp-flipitems__nav a {",
      "  opacity: 0; transform-origin: center bottom; transform: rotateX(-80deg);",
      "  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);",
      "}",
      '.hbp-flipitems__btn[aria-expanded="true"] ~ .hbp-flipitems__nav a { opacity: 0.9; transform: rotateX(0); }',
      ...stagger("hbp-flipitems", 0.15),
    ],
  },
  {
    key: "hbp-zoomitems",
    mode: "panel",
    cat: "items",
    label: { ja: "項目が拡大しながら現れる", en: "Items zoom in" },
    html: panelHtml("hbp-zoomitems"),
    css: [
      ...btnCss("hbp-zoomitems", "#fff"),
      ...itemsBase("hbp-zoomitems"),
      ...linkCss("hbp-zoomitems", "#fff"),
      ".hbp-zoomitems__nav a {",
      "  opacity: 0; transform: scale(0.4);",
      "  transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);",
      "}",
      '.hbp-zoomitems__btn[aria-expanded="true"] ~ .hbp-zoomitems__nav a { opacity: 0.9; transform: scale(1); }',
      ...stagger("hbp-zoomitems", 0.15),
    ],
  },
  {
    key: "hbp-bluritems",
    mode: "panel",
    cat: "items",
    label: { ja: "項目のぼかしが晴れて現れる", en: "Items sharpen from a blur" },
    html: panelHtml("hbp-bluritems"),
    css: [
      ...btnCss("hbp-bluritems", "#fff"),
      ...itemsBase("hbp-bluritems"),
      ...linkCss("hbp-bluritems", "#fff"),
      ".hbp-bluritems__nav a {",
      "  opacity: 0; filter: blur(10px); transform: scale(1.15);",
      "  transition: opacity 0.45s ease, filter 0.45s ease, transform 0.45s ease;",
      "}",
      '.hbp-bluritems__btn[aria-expanded="true"] ~ .hbp-bluritems__nav a { opacity: 0.9; filter: blur(0); transform: scale(1); }',
      ...stagger("hbp-bluritems", 0.15),
    ],
  },
  {
    key: "hbp-clipitems",
    mode: "panel",
    cat: "items",
    label: { ja: "項目が下から捲れて現れる", en: "Items wipe up into view" },
    html: panelHtml("hbp-clipitems"),
    css: [
      ...btnCss("hbp-clipitems", "#fff"),
      ...itemsBase("hbp-clipitems"),
      ...linkCss("hbp-clipitems", "#fff"),
      "/* clip-path で下側だけ見せた状態から、文字の高さぶん捲り上げる */",
      ".hbp-clipitems__nav a {",
      "  clip-path: inset(100% 0 0 0); transform: translateY(14px);",
      "  transition: clip-path 0.45s cubic-bezier(0.65, 0, 0.35, 1), transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);",
      "}",
      '.hbp-clipitems__btn[aria-expanded="true"] ~ .hbp-clipitems__nav a { clip-path: inset(0 0 0 0); transform: translateY(0); }',
      ...stagger("hbp-clipitems", 0.15),
    ],
  },
];
