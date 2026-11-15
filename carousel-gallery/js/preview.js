const BASE_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0;
  background: #f6f8f4;
  color: #13302f;
  font-family: "M PLUS 1", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  overflow-x: hidden;
}
body:not(.is-scroll) { overflow: hidden; }
body.is-scroll { display: block; padding: 0; }
body.is-thumb { zoom: var(--thumb, 0.5); min-height: calc(100vh / var(--thumb, 0.5)); pointer-events: none; overflow: hidden; }
body.is-thumb div { --s: 1; }
body.is-thumb.is-scroll [class$="-sticky"] { height: calc(100vh / var(--thumb, 0.5)); }
.cg-hint { margin: 0; padding: 16px; text-align: center; color: #4a615f; }
`;

const HINT = {
  ja: "↓ 下へスクロールしてください",
  en: "↓ Scroll down",
};

export function combined(code) {
  const parts = [code.html, `<style>\n${code.css}\n</style>`];
  if (code.js) parts.push(`<script>\n${code.js}\n</script>`);
  return parts.join("\n\n");
}

export function previewDoc(type, code, lang, thumb = false) {
  const cls = [type.scroll ? "is-scroll" : "", thumb ? "is-thumb" : ""].join(" ").trim();
  const hint = type.scroll && !thumb ? `<p class="cg-hint">${HINT[lang] || HINT.ja}</p>` : "";
  const js = code.js ? `<script>${code.js}<\/script>` : "";
  const zoom = thumb && type.thumbZoom ? ` style="--thumb: ${type.thumbZoom}"` : "";
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${BASE_CSS}\n${code.css}</style></head><body class="${cls}"${zoom}>${hint}${code.html}${js}</body></html>`;
}
