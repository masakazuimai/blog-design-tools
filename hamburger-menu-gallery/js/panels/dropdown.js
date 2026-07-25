// ドロップダウン系の開閉パターン（4種）
// ヘッダー直下に小さめのメニューを出すタイプ。全画面を覆わないので情報量の少ないサイト向き
// アクセント色 #6366f1 / サブ色 #ec4899（rgbは 99,102,241 / 236,72,153）は main.js が置換する

import { panelHtml, btnCss } from "./shared.js?v=20260725b";

// 白いカード状のドロップダウン（位置・見た目の共通部分）
function cardCss(ns) {
  return [
    "." + ns + "__nav {",
    "  position: fixed; top: 66px; right: 14px; z-index: 20;",
    "  width: 190px; padding: 8px; border-radius: 14px;",
    "  display: flex; flex-direction: column;",
    "  background: #fff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);",
    "}",
    "." + ns + "__nav a {",
    "  padding: 9px 12px; border-radius: 8px;",
    "  color: #1e293b; font-size: 1rem; font-weight: 600; text-decoration: none;",
    "  transition: background 0.2s ease, color 0.2s ease;",
    "}",
    "." + ns + "__nav a:hover { background: #eef2ff; color: #6366f1; }",
  ];
}

export const DROPDOWN_PANELS = [
  {
    key: "hbp-accordion",
    mode: "panel",
    cat: "dropdown",
    label: { ja: "高さがアコーディオンで開く", en: "Accordion height reveal" },
    html:
      '<div class="hbp-accordion">' +
      '<button class="hbp-accordion__btn" aria-label="メニュー" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<nav class="hbp-accordion__nav"><div class="hbp-accordion__inner"><a href="#">Home</a><a href="#">About</a><a href="#">Works</a><a href="#">Contact</a></div></nav>' +
      "</div>",
    css: [
      ...btnCss("hbp-accordion", "#1e293b"),
      "/* grid-template-rows: 0fr → 1fr で「中身の高さぶんだけ」滑らかに開く */",
      ".hbp-accordion__nav {",
      "  position: fixed; top: 66px; right: 14px; z-index: 20;",
      "  width: 190px; border-radius: 14px; overflow: hidden;",
      "  display: grid; grid-template-rows: 0fr;",
      "  background: #fff; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);",
      "  opacity: 0; visibility: hidden;",
      "  transition: grid-template-rows 0.4s ease, opacity 0.25s ease, visibility 0s linear 0.4s;",
      "}",
      ".hbp-accordion__inner { overflow: hidden; display: flex; flex-direction: column; padding: 0 8px; }",
      ".hbp-accordion__nav a {",
      "  padding: 9px 12px; border-radius: 8px;",
      "  color: #1e293b; font-size: 1rem; font-weight: 600; text-decoration: none;",
      "  transition: background 0.2s ease, color 0.2s ease;",
      "}",
      ".hbp-accordion__nav a:first-child { margin-top: 8px; }",
      ".hbp-accordion__nav a:last-child { margin-bottom: 8px; }",
      ".hbp-accordion__nav a:hover { background: #eef2ff; color: #6366f1; }",
      '.hbp-accordion__btn[aria-expanded="true"] ~ .hbp-accordion__nav {',
      "  grid-template-rows: 1fr; opacity: 1; visibility: visible;",
      "  transition: grid-template-rows 0.4s ease, opacity 0.25s ease, visibility 0s;",
      "}",
    ],
  },
  {
    key: "hbp-fliptop",
    mode: "panel",
    cat: "dropdown",
    label: { ja: "上端を軸にめくれて開く", en: "Flips down from the top edge" },
    html: panelHtml("hbp-fliptop"),
    css: [
      ...btnCss("hbp-fliptop", "#1e293b"),
      ...cardCss("hbp-fliptop"),
      ".hbp-fliptop__nav {",
      "  transform-origin: top center; transform: perspective(800px) rotateX(-90deg);",
      "  opacity: 0; visibility: hidden;",
      "  transition: transform 0.4s ease, opacity 0.3s ease, visibility 0s linear 0.4s;",
      "}",
      '.hbp-fliptop__btn[aria-expanded="true"] ~ .hbp-fliptop__nav {',
      "  transform: perspective(800px) rotateX(0deg); opacity: 1; visibility: visible;",
      "  transition: transform 0.4s ease, opacity 0.3s ease, visibility 0s;",
      "}",
    ],
  },
  {
    key: "hbp-pop",
    mode: "panel",
    cat: "dropdown",
    label: { ja: "ボタンから弾んで開く", en: "Pops out from the button" },
    html: panelHtml("hbp-pop"),
    css: [
      ...btnCss("hbp-pop", "#1e293b"),
      ...cardCss("hbp-pop"),
      ".hbp-pop__nav {",
      "  transform-origin: top right; transform: scale(0.2);",
      "  opacity: 0; visibility: hidden;",
      "  transition: transform 0.4s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.25s ease, visibility 0s linear 0.4s;",
      "}",
      '.hbp-pop__btn[aria-expanded="true"] ~ .hbp-pop__nav {',
      "  transform: scale(1); opacity: 1; visibility: visible;",
      "  transition: transform 0.4s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.25s ease, visibility 0s;",
      "}",
    ],
  },
  {
    key: "hbp-slidefade",
    mode: "panel",
    cat: "dropdown",
    label: { ja: "少し下がりながらフェード", en: "Fades in while sliding down" },
    html: panelHtml("hbp-slidefade"),
    css: [
      ...btnCss("hbp-slidefade", "#1e293b"),
      ...cardCss("hbp-slidefade"),
      ".hbp-slidefade__nav {",
      "  transform: translateY(-14px); opacity: 0; visibility: hidden;",
      "  transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s linear 0.3s;",
      "}",
      '.hbp-slidefade__btn[aria-expanded="true"] ~ .hbp-slidefade__nav {',
      "  transform: translateY(0); opacity: 1; visibility: visible;",
      "  transition: transform 0.3s ease, opacity 0.3s ease, visibility 0s;",
      "}",
    ],
  },
];
