// 英語版：パターンの説明文と HTML／CSS 内の文言を英語に差し替える
import { META_EN } from "./en-meta.js?v=20261006h";
import { TEXT_EN, HTML_EN } from "./en-text.js?v=20261006h";

const swap = (text) => {
  const key = text.trim();
  const en = TEXT_EN[key];
  return key && en !== undefined ? text.replace(key, en) : text;
};

const translateHtml = (html) => HTML_EN
  .reduce((acc, [ja, en]) => acc.replaceAll(ja, en), html)
  // タグに挟まれた文字列と aria-label の値を、辞書と完全一致したものだけ置き換える
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
