import { GSAP_CDN } from "./effects/_shared.js?v=20261112a";

const STAGE_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  padding: 0 clamp(16px, 4vw, 40px) 40px;
  transition: background 0.3s, color 0.3s;
}
body.theme-light { background: #fffdf8; color: #2b2118; --line: #eadfce; --btn: #2b2118; --btn-text: #fffdf8; }
body.theme-dark { background: #14161c; color: #e8e4dc; --line: #2c303a; --btn: #e8e4dc; --btn-text: #14161c; }
body.theme-photo {
  background: radial-gradient(circle at 15% 20%, #ffb36b 0, transparent 45%),
    radial-gradient(circle at 85% 30%, #ff6fa5 0, transparent 50%),
    radial-gradient(circle at 50% 100%, #4f7cff 0, transparent 60%), #2a1f4a;
  color: #fff;
  --line: rgba(255, 255, 255, 0.3);
  --btn: #fff;
  --btn-text: #2a1f4a;
}
a { color: inherit; }
nav { display: flex; align-items: center; gap: 24px; padding: 20px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
nav strong { font-size: 18px; margin-right: auto; letter-spacing: 0.04em; }
nav a { text-decoration: none; }
.hero { padding: 48px 0 32px; max-width: 34em; }
.hero h1 { margin: 0 0 12px; font-size: clamp(28px, 5vw, 44px); line-height: 1.25; letter-spacing: -0.02em; }
.hero p { margin: 0 0 24px; opacity: 0.8; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
button { font: inherit; font-weight: 700; padding: 12px 24px; border-radius: 999px; border: 2px solid var(--btn); cursor: pointer; }
.primary { background: var(--btn); color: var(--btn-text); }
.ghost { background: transparent; color: inherit; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { display: block; text-decoration: none; border-radius: 12px; overflow: hidden; border: 1px solid var(--line); }
.card i { display: block; aspect-ratio: 4 / 3; }
.card span { display: block; padding: 10px 14px; font-weight: 700; }
.c1 { background: #e8b36a url(images/stage-card1.webp) center / cover; }
.c2 { background: #d9c19a url(images/stage-card2.webp) center / cover; }
.c3 { background: #f2a6a0 url(images/stage-card3.webp) center / cover; }
@media (max-width: 560px) { .cards { grid-template-columns: 1fr 1fr; } .cards a:last-child { display: none; } }
`;

const SAMPLE = `
<nav>
  <strong>こむぎ堂</strong>
  <a href="#">メニュー</a>
  <a href="#">お店について</a>
  <a href="#">アクセス</a>
</nav>
<section class="hero">
  <h1>朝いちばんの、焼きたてを。</h1>
  <p>マウスを動かしたり、リンクやボタンに乗せたりして、動きを試してください。</p>
  <div class="actions">
    <button class="primary" type="button">メニューを見る</button>
    <button class="ghost" type="button">地図を開く</button>
  </div>
</section>
<div class="cards">
  <a class="card" href="#"><i class="c1" data-stalker-gl data-stalker-reveal="images/stage-card1b.webp"></i><span>クロワッサン</span></a>
  <a class="card" href="#"><i class="c2" data-stalker-gl data-stalker-reveal="images/stage-card2b.webp"></i><span>バゲット</span></a>
  <a class="card" href="#"><i class="c3" data-stalker-gl data-stalker-reveal="images/stage-card3b.webp"></i><span>季節のタルト</span></a>
</div>
`;

const BLOCK_LINKS = `document.addEventListener("click", function (e) { if (e.target.closest("a")) e.preventDefault(); });`;

export function previewJs(js) {
  return js
    .split("\n")
    .filter((l) => !l.includes("matchMedia("))
    .join("\n");
}

export function stageDoc(code, theme, needsGsap) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${STAGE_CSS}\n${code.css}</style></head><body class="theme-${theme}">${SAMPLE}${code.html}${needsGsap ? GSAP_CDN : ""}<script>${BLOCK_LINKS}\n${previewJs(code.js)}<\/script></body></html>`;
}
