
export const NAV_LINKS = '<a href="#">Home</a><a href="#">About</a><a href="#">Works</a><a href="#">Contact</a>';

export const A11Y_HIDE_NOTE =
  "/* 閉じている間はタブ順とアクセシビリティツリーから外す（見えなくしただけではタブで到達できてしまう） */";

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

export function linkCss(ns, color) {
  return [
    "." + ns + "__nav a {",
    "  color: " + color + "; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.02em;",
    "  text-decoration: none; opacity: 0.9; transition: opacity 0.2s ease;",
    "}",
    "." + ns + "__nav a:hover { opacity: 1; }",
  ];
}
