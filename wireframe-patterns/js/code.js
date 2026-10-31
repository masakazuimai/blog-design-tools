import { BASE_CSS } from "./wf-base.js?v=20261006h";
import { LANG, t } from "./i18n.js?v=20261006h";

const baseCss = () => BASE_CSS.replace("/* ワイヤーフレーム共通 */", `/* ${t("baseCssComment")} */`);

const uniqueCss = (patterns) => [...new Map(patterns.map((p) => [p.id, p])).values()]
  .map((p) => `/* ${p.id}${t("idSep")}${p.name} */\n${p.css}`)
  .join("\n\n");

export const buildHtml = (patterns) => patterns.map((p) => p.html).join("\n\n");

export const buildCss = (patterns) => `${baseCss()}\n${uniqueCss(patterns)}\n`;

export const buildDocument = (patterns, title = t("docTitle")) => `<!doctype html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { margin: 0; }
${buildCss(patterns)}</style>
</head>
<body>
${buildHtml(patterns)}
</body>
</html>
`;
