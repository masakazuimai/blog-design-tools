// 紙とペンのプリセット定義

// paperColor / lineColor は初期値。ユーザーがピッカーで上書きできる
// rule: none = 罫線なし / line = 横罫 / grid = 方眼 / cells = マス目（原稿用紙）
// mono: true のとき全文字を等幅（1マス1文字）で組む
export const PAPERS = [
  { id: "none",   label: { ja: "なし（透過）", en: "None (transparent)" }, fill: null,      rule: "none" },
  { id: "plain",  label: { ja: "無地", en: "Plain" },         fill: "#fffdf7", rule: "none" },
  { id: "rule",   label: { ja: "罫線", en: "Ruled" },         fill: "#fffdf7", rule: "line", lineColor: "#7ea2c9" },
  { id: "grid",   label: { ja: "方眼", en: "Graph" },         fill: "#fffdf7", rule: "grid", lineColor: "#9dc0d8" },
  { id: "genko",  label: { ja: "原稿用紙", en: "Manuscript grid" },     fill: "#fffcf2", rule: "cells", lineColor: "#c2604a", mono: true },
  { id: "report", label: { ja: "レポート用紙", en: "Report pad" }, fill: "#fffefb", rule: "line", lineColor: "#8fb6d6", margin: "#d98080" },
  { id: "sticky", label: { ja: "付箋", en: "Sticky note" },         fill: "#fff3a8", rule: "none", corner: true }
];

// w=線の太さ(px/文字サイズ64換算) wVar=字ごとの太さムラ aVar=字ごとの濃さムラ
// blur=にじみ rough=かすれ（blur/roughはSVGではフィルタになる＝厳密な純パスではなくなる）
export const PENS = [
  { id: "ballpoint", label: { ja: "ボールペン", en: "Ballpoint" }, w: 0,   wVar: 0,   aVar: 0,    blur: 0,   rough: 0 },
  { id: "fountain",  label: { ja: "万年筆", en: "Fountain pen" },     w: 0.7, wVar: 0.9, aVar: 0.18, blur: 0,   rough: 0 },
  { id: "sign",      label: { ja: "サインペン", en: "Felt-tip" }, w: 2.2, wVar: 0.4, aVar: 0.05, blur: 0,   rough: 0 },
  { id: "marker",    label: { ja: "マーカー", en: "Marker" },   w: 4.5, wVar: 0.7, aVar: 0.10, blur: 1.4, rough: 0 },
  { id: "pencil",    label: { ja: "鉛筆", en: "Pencil" },       w: 0.6, wVar: 0.5, aVar: 0.18, blur: 0.3, rough: 0.18 }
];

export function findPaper(id) { return PAPERS.filter(function (p) { return p.id === id; })[0] || PAPERS[0]; }
export function findPen(id) { return PENS.filter(function (p) { return p.id === id; })[0] || PENS[0]; }
