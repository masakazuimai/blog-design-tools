// コピー・ダウンロード用のHTML/CSSを組み立てる
import { BASE_CSS } from "./wf-base.js?v=20261006f";

// 同じパターンを複数回置いても CSS は1回だけ出す
const uniqueCss = (patterns) => [...new Map(patterns.map((p) => [p.id, p])).values()]
  .map((p) => `/* ${p.id}：${p.name} */\n${p.css}`)
  .join("\n\n");

export const buildHtml = (patterns) => patterns.map((p) => p.html).join("\n\n");

export const buildCss = (patterns) => `${BASE_CSS}\n${uniqueCss(patterns)}\n`;

// 1ファイルで開けるHTML文書
export const buildDocument = (patterns, title = "ワイヤーフレーム") => `<!doctype html>
<html lang="ja">
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
