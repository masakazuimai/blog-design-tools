// 開閉パターン定義の共通パーツ。
// コピーコードは self-contained である必要があるため、ここは「定義ファイル側の重複を減らすヘルパー」であって
// 出力されるCSSは各エフェクトごとに完全な形で書き出される（共通クラスへの依存は作らない）。

export const NAV_LINKS = '<a href="#">Home</a><a href="#">About</a><a href="#">Works</a><a href="#">Contact</a>';

// 閉じている間のメニューを隠す理由の注記。transform で画面外へ逃がしただけでは
// リンクがタブ順に残り読み上げられてしまうため、visibility: hidden を併用する
export const A11Y_HIDE_NOTE =
  "/* 閉じている間はタブ順とアクセシビリティツリーから外す（見えなくしただけではタブで到達できてしまう） */";

// ラッパー > ボタン > （任意の追加要素） > nav の順に並べる。
// 開閉状態は nav 側から見て「前にあるボタン」を ~ で参照するため、ボタンは必ず先頭に置く。
export function panelHtml(ns, extra) {
  return (
    '<div class="' +
    ns +
    '">' +
    '<button class="' +
    ns +
    '__btn" aria-label="メニュー" aria-expanded="false"><span></span><span></span><span></span></button>' +
    (extra || "") +
    '<nav class="' +
    ns +
    '__nav">' +
    NAV_LINKS +
    "</nav>" +
    "</div>"
  );
}

// 右上に固定するハンバーガーボタン。openBarColor は開いた時の線の色。
export function btnCss(ns, openBarColor) {
  return [
    "." + ns + "__btn {",
    "  position: fixed; top: 14px; right: 14px; z-index: 30; width: 44px; height: 44px;",
    "  padding: 0; border: none; background: none; cursor: pointer;",
    "}",
    "." + ns + "__btn span {",
    "  position: absolute; left: 9px; top: 50%; width: 26px; height: 3px; margin-top: -1.5px;",
    "  background: #1e293b; border-radius: 2px;",
    "  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;",
    "}",
    "." + ns + "__btn span:nth-child(1) { transform: translateY(-8px); }",
    "." + ns + "__btn span:nth-child(3) { transform: translateY(8px); }",
    "." + ns + '__btn[aria-expanded="true"] span { background: ' + openBarColor + "; }",
    "." + ns + '__btn[aria-expanded="true"] span:nth-child(1) { transform: rotate(45deg); }',
    "." + ns + '__btn[aria-expanded="true"] span:nth-child(2) { opacity: 0; }',
    "." + ns + '__btn[aria-expanded="true"] span:nth-child(3) { transform: rotate(-45deg); }',
  ];
}

// nav 内リンクの見た目（色は呼び出し側で指定）
export function linkCss(ns, color) {
  return [
    "." + ns + "__nav a {",
    "  color: " + color + "; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.02em;",
    "  text-decoration: none; opacity: 0.9; transition: opacity 0.2s ease;",
    "}",
    "." + ns + "__nav a:hover { opacity: 1; }",
  ];
}
