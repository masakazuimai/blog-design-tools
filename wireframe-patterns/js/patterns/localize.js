import { META_EN } from "./en-meta.js?v=20261006h";
import { TEXT_EN, HTML_EN } from "./en-text.js?v=20261006h";

const swap = (text) => {
  const key = text.trim();
  const en = TEXT_EN[key];
  return key && en !== undefined ? text.replace(key, en) : text;
};

const translateHtml = (html) => HTML_EN
  .reduce((acc, [ja, en]) => acc.replaceAll(ja, en), html)
  .replace(/>([^<]+)</g, (_, text) => `>${swap(text)}<`)
  .replace(/aria-label="([^"]+)"/g, (_, text) => `aria-label="${swap(text)}"`)
  .replaceAll("¥", "$");

const translateCss = (css) => css.replace(/\/\*([^*]+)\*\//g, (_, text) => `/*${swap(text)}*/`);

export const localizePattern = (p) => ({
  ...p,
  ...META_EN[p.id],
  html: translateHtml(p.html),
  css: translateCss(p.css),
});
