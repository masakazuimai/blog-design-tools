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
  ja: "↓ 自動でスクロールしています（自分で上下に動かしても試せます）",
  en: "↓ Scrolling automatically (you can scroll yourself too)",
};

export function combined(code) {
  const parts = [code.html, `<style>\n${code.css}\n</style>`];
  if (code.js) parts.push(`<script>\n${code.js}\n</script>`);
  return parts.join("\n\n");
}

const DEMO = (mode) => `(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let rest = 0;
  const hold = () => { rest = Date.now() + 6000; };
  ["pointerdown", "wheel", "touchstart", "keydown"].forEach((e) => addEventListener(e, hold, { passive: true, capture: true }));
  if ("${mode}" === "x") {
    const el = [...document.querySelectorAll("body *")].find((n) => n.scrollWidth > n.clientWidth + 20 && /auto|scroll/.test(getComputedStyle(n).overflowX));
    if (!el) return;
    let dir = 1;
    setInterval(() => {
      if (Date.now() < rest) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) dir = -1;
      if (el.scrollLeft <= 2) dir = 1;
      const card = el.firstElementChild;
      const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.6;
      el.scrollBy({ left: dir * w, behavior: "smooth" });
    }, 1600);
  } else {
    const se = document.scrollingElement;
    let dir = 1;
    let pos = se.scrollTop;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(50, now - last);
      last = now;
      const max = se.scrollHeight - innerHeight;
      if (Date.now() < rest) {
        pos = se.scrollTop;
      } else if (max > 0) {
        pos += dir * dt * (max / 7000);
        if (pos >= max) { pos = max; dir = -1; }
        if (pos <= 0) { pos = 0; dir = 1; }
        se.scrollTop = pos;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();`;

export function previewDoc(type, code, lang, thumb = false) {
  const cls = [type.scroll ? "is-scroll" : "", thumb ? "is-thumb" : ""].join(" ").trim();
  const hint = type.scroll && !thumb ? `<p class="cg-hint">${HINT[lang] || HINT.ja}</p>` : "";
  const js = code.js ? `<script>${code.js}<\/script>` : "";
  const demo = type.demo ? `<script>${DEMO(type.demo)}<\/script>` : "";
  const zoom = thumb && type.thumbZoom ? ` style="--thumb: ${type.thumbZoom}"` : "";
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${BASE_CSS}\n${code.css}</style></head><body class="${cls}"${zoom}>${hint}${code.html}${js}${demo}</body></html>`;
}
