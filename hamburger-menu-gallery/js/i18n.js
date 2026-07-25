// UI文字列の多言語辞書。<html lang> で言語を切り替える
// エフェクト個別のラベルは js/icons/ ・ js/panels/ の定義（label: {ja, en}）に持たせ、ここではUI文言のみ扱う

const dict = {
  ja: {
    modeLabels: { icon: "アイコン変形", panel: "開閉パターン" },
    modeCounts: { icon: "60種", panel: "30種" },
    catLabels: {
      all: "すべて",
      basic: "定番",
      spin: "回転",
      slide: "スライド",
      symbol: "矢印・記号",
      frame: "枠・背景",
      unique: "変わり種",
      drawer: "ドロワー",
      fullscreen: "フルスクリーン",
      items: "項目の出方",
      dropdown: "ドロップダウン",
      special: "変わり種",
    },
    countNote: (total, shown) => "全 " + total + " 種類 / 表示中 " + shown + " 種類",
    copied: "✓ コピー",
    copiedToast: (label) => label + "をコピーしました",
    copyFailed: "コピーに失敗しました",
    labelCode: "コード",
    closedAll: "開いているメニューを閉じました",
  },
  en: {
    modeLabels: { icon: "Icon morph", panel: "Open / close" },
    modeCounts: { icon: "60", panel: "30" },
    catLabels: {
      all: "All",
      basic: "Classic",
      spin: "Spin",
      slide: "Slide",
      symbol: "Arrows & signs",
      frame: "Frame & fill",
      unique: "Unusual",
      drawer: "Drawer",
      fullscreen: "Fullscreen",
      items: "Item reveal",
      dropdown: "Dropdown",
      special: "Unusual",
    },
    countNote: (total, shown) => shown + " of " + total + " shown",
    copied: "✓ Copied",
    copiedToast: (label) => "Copied " + label,
    copyFailed: "Copy failed",
    labelCode: "code",
    closedAll: "Closed every open menu",
  },
};

// コピーコード・プレビュー内の日本語テキストの対訳。
// エフェクト定義（js/icons/・js/panels/）は日本語で共有し、enページでは main.js がこの表で差し替える
export const TEXT_EN = {
  'aria-label="メニュー"': 'aria-label="Menu"',
  "ここがページ本文です。": "This is your page content.",
  "/* 閉じる時は「回転→広がる」、開く時は「寄る→回転」の順になるよう delay を反転させる */":
    "/* Delays are swapped so it gathers-then-rotates on open, and rotates-then-spreads on close */",
  "/* ×の2本は擬似要素。3本線が消えるのを待って現れる */":
    "/* The × is made of pseudo-elements that appear once the three bars have faded */",
  "/* 1本目が中央へ移動しながら縦になり、3本目は消えて ＋ が残る */":
    "/* The first bar moves to the center and turns vertical while the third fades, leaving a plus */",
  "/* 225deg / -225deg ＝ 半周以上まわってから×の角度に収まる */":
    "/* 225deg / -225deg means it spins past half a turn before settling into the × */",
  "/* 3本線が縮んで消えた後、擬似要素の×が半回転しながら現れる */":
    "/* After the bars shrink away, the pseudo-element × spins into view */",
  "/* ×は擬似要素で作り、3本線が抜けきってから左から入れる */":
    "/* The × is built from pseudo-elements and enters from the left once the bars have exited */",
  "/* 「一度大きく開く → 中央で×になる」の2段モーションは keyframes で表現する */":
    "/* Keyframes handle the two-step motion: spread wide, then close into the × */",
  "/* 上下の線は矢じりになるので、左端（矢印の先端）を軸に回す */":
    "/* The outer bars become the arrowhead, so they pivot around the left end (the tip) */",
  "/* 左向き矢印を作り、ボタンごと90度回して上向きにする */":
    "/* Builds a left arrow, then rotates the whole button 90deg to point it up */",
  "/* 2本の線が「く」の字の頂点で接するよう、左右の端を軸にして畳む */":
    "/* Each bar pivots on its outer end so the two meet at the checkmark's corner */",
  "/* 3本が重なって1つの点に見える */": "/* All three stack on top of each other and read as a single dot */",
  "/* 上下の線が横に伸び、続いて左右の線が縦に伸びて枠になる */":
    "/* Top and bottom edges grow horizontally, then the sides grow vertically to close the frame */",
  "/* 暗い背景向け */": "/* For dark backgrounds */",
  "/* 暗い背景・写真の上向き。backdrop-filter は主要ブラウザで対応 */":
    "/* For dark backgrounds and photos. backdrop-filter is supported in all major browsers */",
  "/* MENU と CLOSE を縦に並べ、開閉に合わせてスライドさせる */":
    "/* MENU and CLOSE are stacked vertically and slide as the button toggles */",
  "/* 擬似要素の2本が割り込んで5本になり、そのまま中央へ吸い込まれる */":
    "/* Two pseudo-element bars cut in to make five, then all of them collapse to the center */",
  "/* 暗幕。開いている間だけクリックを受け取る */":
    "/* The backdrop only accepts clicks while the menu is open */",
  "/* .hbp-push__page があなたのページ本文。メニュー幅ぶん右へずらす */":
    "/* .hbp-push__page is your page content — it shifts right by the menu width */",
  "/* backdrop-filter で背景をぼかす。写真や色の上に重ねると効果が出る */":
    "/* backdrop-filter blurs what is behind it — most effective over photos or color */",
  "/* 2枚のカーテンは擬似要素。z-index: -1 でリンクの背面に置く */":
    "/* The two curtains are pseudo-elements, placed behind the links with z-index: -1 */",
  "/* clip-path の円をボタン位置（右上）を中心に広げる */":
    "/* A clip-path circle expands outward from the button in the top-right corner */",
  "/* 5枚の帯を時間差で下ろしてブラインドに見せる */":
    "/* Five strips drop with staggered delays to read as window blinds */",
  "/* clip-path で下側だけ見せた状態から、文字の高さぶん捲り上げる */":
    "/* clip-path hides the text, then wipes upward by the height of the line */",
  "/* grid-template-rows: 0fr → 1fr で「中身の高さぶんだけ」滑らかに開く */":
    "/* grid-template-rows: 0fr to 1fr animates to exactly the content height */",
  "/* nav はボタン中心の「点」。リンクをそこから弧を描くように飛ばす */":
    "/* The nav is a single point at the button; links fly out from it along an arc */",
  "/* 半径124px・直径64pxなら、4つを30度おきに置いても円同士が重ならない */":
    "/* A 124px radius with 64px circles keeps all four from overlapping at 30deg apart */",
  "/* ボタンと同じ位置・同じ大きさの円から、カードへ広げる */":
    "/* Starts as a circle matching the button, then grows into a card */",
  "/* 閉じている間も細い帯として残るタイプ。幅だけを動かす */":
    "/* Stays visible as a slim rail when closed — only the width animates */",
  "/* 閉じている間はタブ順とアクセシビリティツリーから外す（見えなくしただけではタブで到達できてしまう） */":
    "/* Keep it out of the tab order and the accessibility tree while closed — hiding it visually is not enough */",
  "/* 閉じている間は文字が途中で切れるので隠す */": "/* The labels would be cut off while the rail is collapsed */",
  "/* このパターンは本文がメニューを覆い隠すだけなので、隠す指定がないと常にタブで到達できてしまう */":
    "/* Here the page content merely covers the menu, so without this it would stay reachable by keyboard */",
  "// 開閉のトグル（aria-expanded を true / false で切り替えるだけ）":
    "// Toggle: this only flips aria-expanded between true and false",
};

export const lang = document.documentElement.lang === "en" ? "en" : "ja";
export const t = dict[lang];
