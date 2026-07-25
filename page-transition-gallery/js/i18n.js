// UI文字列の多言語辞書。<html lang> で言語を切り替える
// エフェクト個別のラベルは js/effects/ 内の定義（label: {ja, en}）に持たせ、ここではUI文言のみ扱う

const dict = {
  ja: {
    catLabels: {
      all: "すべて",
      curtain: "カーテン",
      transition: "ページ遷移",
      loading: "ローディング",
    },
    countNote: (total, shown) => "全 " + total + " 種類 / 表示中 " + shown + " 種類",
    play: "▶ 再生",
    playing: "再生中…",
    copied: "✓ コピー",
    copiedToast: (label) => label + "をコピーしました",
    copyFailed: "コピーに失敗しました",
    labelCode: "コード",
    playAll: "▶ 表示中を順に再生",
  },
  en: {
    catLabels: {
      all: "All",
      curtain: "Curtain",
      transition: "Page transition",
      loading: "Loading",
    },
    countNote: (total, shown) => shown + " of " + total + " shown",
    play: "▶ Play",
    playing: "Playing…",
    copied: "✓ Copied",
    copiedToast: (label) => "Copied " + label,
    copyFailed: "Copy failed",
    labelCode: "code",
    playAll: "▶ Play all shown",
  },
};

// コピーコード・プレビュー内の日本語テキストの対訳。
// エフェクト定義（js/effects/）は日本語で共有し、enページでは main.js がこの表で差し替える
export const TEXT_EN = {
  'aria-label="読み込み中"': 'aria-label="Loading"',
  "// 読み込み直後に幕を開き、内部リンクのクリックで幕を閉じてから遷移する":
    "// Open the veil on load, then close it before following an internal link",
  "// 読み込み完了でローディング画面を閉じる": "// Dismiss the loading screen once the page has loaded",
  "/* 1本ごとに左右へ交互に抜ける */": "/* Each stripe exits to the opposite side */",
  "/* 左上から右下へ、対角線の順に消える */": "/* Tiles disappear diagonally, top-left to bottom-right */",
  "/* 傾けたぶん画面より大きくして、角に隙間ができないようにする */":
    "/* Oversized to cover the corners left exposed by the skew */",
  "/* 4点の多角形どうしを補間するので、開いた側も同じ点数で書く */":
    "/* clip-path interpolates point by point, so both states need the same number of points */",
  "/* 下辺だけ楕円にして、めくれ上がる布のふちに見せる */":
    "/* Only the bottom edge is curved, reading as the hem of a lifting cloth */",
  "/* 下辺の影が巻き取り棒に見える */": "/* The shadow along the bottom edge reads as the roller bar */",
  "/* 折り目を上下交互にすると蛇腹らしく畳まれる */":
    "/* Alternating fold origins give it the concertina look */",
  "/* 縦の陰影で布のひだを表現する */": "/* Vertical shading suggests the folds of fabric */",
  "/* 上下左右の4枚が同時に縮み、中央から長方形の穴が広がる */":
    "/* Four panels shrink at once, opening a rectangle out from the center */",
  "/* 右端を軸に畳むので、面が左から右へ拭き取られるように見える */":
    "/* Collapsing toward the right edge reads as a wipe from left to right */",
  "/* 文字が消えてから幕が上がる（transition-delay で順番を作る） */":
    "/* transition-delay orders it: the text fades first, then the veil lifts */",
  "/* @property 対応ブラウザ（Chrome/Edge/Safari/Firefox 最新）で数字が動く */":
    "/* The number animates in browsers that support @property (recent Chrome / Edge / Safari / Firefox) */",
  "/* inherits: true が必須。false だと ::after が親の値を受け取れず 0 のまま止まる */":
    "/* inherits: true is required — with false the ::after cannot read the animated value and stays at 0 */",
  "/* 画面を覆わないタイプ。本文を隠さずに読み込み中だけ知らせる */":
    "/* Does not cover the page — it signals loading without hiding the content */",
};

export const lang = document.documentElement.lang === "en" ? "en" : "ja";
export const t = dict[lang];
