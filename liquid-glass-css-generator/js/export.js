// コピペ用スニペット生成: { html, css } を返す
import { buildDisplacementMap, buildFilterSvg, buildGlassCss } from "./glass.js?v=20260619";

const FILTER_ID = "liquid-glass-filter";

const COMMENTS = {
  ja: {
    markup: "リキッドガラス・ボタン（このマークアップを貼り付け）",
    filter: "屈折用SVGフィルタ（ページに1つでOK）",
    css: "ライブ屈折はChrome/Edgeで表示。Safari/Firefoxはurl()を無視し、ぼかし＋ティントに自動で劣化します（崩れません）",
    hit: "クリック範囲を形状に一致させる",
    replace: "↑ href を実際のリンク先に差し替えてください",
  },
  en: {
    markup: "Liquid glass button (paste this markup)",
    filter: "SVG refraction filter (one per page is enough)",
    css: "Live refraction shows in Chrome/Edge. Safari/Firefox ignore url() and gracefully fall back to blur + tint (never breaks)",
    hit: "Match the clickable area to the shape",
    replace: "Replace href above with your real destination",
  },
};

export function generateSnippet(params, lang = "ja") {
  const t = COMMENTS[lang] || COMMENTS.ja;
  const mapDataUri = buildDisplacementMap(params);
  const filterSvg = buildFilterSvg(FILTER_ID, params, mapDataUri);
  const { radius, decls } = buildGlassCss(params, FILTER_ID);

  const href = params.linkUrl ? params.linkUrl : "#";
  const replaceNote = params.linkUrl ? "" : ` <!-- ${t.replace} -->`;
  const label = params.text || "";

  const html = `<!-- ${t.markup} -->
<a class="liquid-glass" href="${href}">${label}</a>${replaceNote}

<!-- ${t.filter} -->
${filterSvg}`;

  const cssDecls = decls.map((d) => `  ${d};`).join("\n");
  const css = `/* ${t.css} */
.liquid-glass {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
${cssDecls}
  /* ${t.hit} */
  -webkit-clip-path: inset(0 round ${radius});
  clip-path: inset(0 round ${radius});
}`;

  return { html, css };
}
