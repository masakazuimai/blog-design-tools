import { writeFileSync } from "node:fs";
import { TYPES } from "../../carousel-gallery/js/types/index.js";

const COPY = {
  ja: { title: "カルーセル<br>CSS サンプル集", sub: "トルネード・螺旋・無限ループなど12種を<br>動かして選び、コードをコピー", tag: "ほとんどが JavaScript 不要" },
  en: { title: "CSS Carousel<br>Examples", sub: "Tornado, helix, infinite loop, coverflow.<br>Preview, tweak and copy the code.", tag: "Most need no JavaScript" },
};

for (const lang of ["ja", "en"]) {
  const t = TYPES.find((x) => x.id === "tornado");
  const c = t.build(t.defaults, lang);
  const k = COPY[lang];
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@600;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body { display: grid; grid-template-columns: 640px 560px; background: #e9eee8; color: #13302f; font-family: "M PLUS 1", sans-serif; }
.text { padding: 64px 0 0 72px; }
h1 { margin: 0 0 24px; font-size: 68px; line-height: 1.12; font-weight: 800; letter-spacing: -0.04em; }
p { margin: 0 0 28px; font-size: 27px; line-height: 1.5; color: #4a615f; font-weight: 600; }
.tag { display: inline-block; padding: 10px 22px; border-radius: 999px; background: #4b2fe0; color: #fff; font-size: 26px; font-weight: 600; }
.site { position: absolute; left: 72px; bottom: 40px; font-size: 24px; font-weight: 600; }
.art { position: relative; }
.art > * { position: absolute; inset: 0; min-height: 0 !important; transform: scale(0.82); }
${c.css}
.cg-tornado-item, .cg-tornado-item > * { animation-play-state: paused !important; }
</style></head><body>
<div class="text"><h1>${k.title}</h1><p>${k.sub}</p><span class="tag">${k.tag}</span></div>
<div class="art">${c.html}</div>
<div class="site">CodeQuest.work</div>
</body></html>`;
  writeFileSync(new URL(`./og-${lang}.html`, import.meta.url), html);
}
