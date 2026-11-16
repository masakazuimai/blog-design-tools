import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";
import { viewFallback } from "./fallback.js?v=20261116g";

const PARALLAX = {
  id: "parallax",
  demo: "x",
  cat: "scroll",
  method: "css-new",
  label: { ja: "パララックス", en: "Parallax" },
  desc: {
    ja: "横に送ると、奥の景色はカードの枠より遅れて、手前の文字は逆向きに動き、層が分かれて奥行きが出ます。",
    en: "As you scroll sideways, the background scenery lags behind the card frame and the front label moves the other way, so the layers separate and add depth.",
  },
  support: {
    ja: "動きは CSS のスクロール連動（view-timeline）で作っています。Chrome・Edge は CSS だけで動き、まだ対応していないブラウザではコードの中の短い JS が同じ動きをします。",
    en: "The motion uses CSS view timelines. Chrome and Edge run it with CSS alone, and other browsers use the short JS in the code instead.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 10, step: 1, unit: "" },
    { key: "depth", label: { ja: "ずれの大きさ", en: "Depth" }, min: 10, max: 50, step: 5, unit: "%" },
  ],
  defaults: { n: 6, depth: 40 },
  build(o, lang) {
    const p = "cg-parallax";
    const pct = Math.round((o.depth / (1 + (2 * o.depth) / 100)) * 10) / 10;
    const items = Array.from(
      { length: o.n },
      (_, i) =>
        `<li class="${p}-card" style="--h: ${hue(i, o.n)}"><span class="${p}-art" aria-hidden="true"></span><span class="${p}-label">${word(i, lang)}</span></li>`
    ).join("\n  ");
    return {
      html: `<ul class="${p}">
  ${items}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 32px calc(50% - 130px);
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.${p}-card {
  position: relative;
  flex: 0 0 260px;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  scroll-snap-align: center;
  view-timeline: --${p}-card inline;
}
.${p}-art {
  position: absolute;
  inset: 0 -${o.depth}%;
  background:
    radial-gradient(circle at 30% 28%, oklch(0.95 0.06 calc(var(--h) + 60)) 0 7%, transparent 7.5%),
    radial-gradient(ellipse 40% 30% at 20% 100%, oklch(0.35 0.08 var(--h)) 0 99%, transparent 100%),
    radial-gradient(ellipse 45% 38% at 55% 100%, oklch(0.45 0.1 calc(var(--h) + 20)) 0 99%, transparent 100%),
    radial-gradient(ellipse 35% 28% at 85% 100%, oklch(0.3 0.07 var(--h)) 0 99%, transparent 100%),
    linear-gradient(180deg, oklch(0.78 0.1 var(--h)), oklch(0.6 0.14 calc(var(--h) + 40)));
}
.${p}-label {
  position: absolute;
  left: 50%;
  bottom: 22px;
  margin-left: -70px;
  width: 140px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.92);
  color: #13302f;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 8px 18px rgb(0 0 0 / 0.25);
}
@supports (animation-timeline: view()) {
  .${p}-art {
    animation: ${p}-back linear both;
    animation-timeline: --${p}-card;
  }
  .${p}-label {
    animation: ${p}-front linear both;
    animation-timeline: --${p}-card;
  }
}
@keyframes ${p}-back {
  from { transform: translateX(-${pct}%); }
  to { transform: translateX(${pct}%); }
}
@keyframes ${p}-front {
  from { transform: translateX(48px); }
  to { transform: translateX(-48px); }
}`,
      js: viewFallback(
        `.${p}`,
        `card.children[0].style.transform = "translateX(" + -s * ${pct} + "%)";
      card.children[1].style.transform = "translateX(" + s * 48 + "px)";`
      ),
    };
  },
};

const HSCROLL = {
  id: "horizontal-section",
  demo: "y",
  cat: "scroll",
  method: "css-js",
  scroll: true,
  label: { ja: "縦に送ると横に流れる", en: "Scroll down, move sideways" },
  desc: {
    ja: "ページを下へ送ると、画面に固定された列が横へ流れます。見本の中を下へスクロールして試してください。",
    en: "Scrolling down moves a pinned row sideways. Scroll down inside the preview to try it.",
  },
  support: {
    ja: "CSS のスクロール連動（animation-timeline: scroll()）は Chrome・Edge が対応しています。対応していないブラウザでは、コードの中の短い JS が同じ動きをします。",
    en: "CSS scroll timelines work in Chrome and Edge. In other browsers, the short JS in the code does the same job.",
  },
  fields: [
    { key: "n", label: { ja: "枚数", en: "Cards" }, min: 4, max: 12, step: 1, unit: "" },
    { key: "len", label: { ja: "スクロールの長さ", en: "Scroll length" }, min: 200, max: 500, step: 50, unit: "vh" },
  ],
  defaults: { n: 8, len: 300 },
  build(o, lang) {
    const p = "cg-hscroll";
    const items = Array.from(
      { length: o.n },
      (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, o.n)}">${word(i, lang)}</li>`
    ).join("\n      ");
    return {
      html: `<div class="${p}">
  <div class="${p}-sticky">
    <ul class="${p}-row">
      ${items}
    </ul>
  </div>
</div>`,
      css: `.${p} {
  height: ${o.len}vh;
}
.${p}-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.${p}-row {
  display: flex;
  gap: 20px;
  width: max-content;
  margin: 0;
  padding: 0 5vw;
  list-style: none;
}
.${p}-card {
  flex: 0 0 min(320px, 70vw);
  aspect-ratio: 4 / 3;
}
@supports (animation-timeline: scroll()) {
  .${p}-row {
    animation: ${p}-move linear both;
    animation-timeline: scroll(root);
  }
}
@keyframes ${p}-move {
  to { transform: translateX(calc(-100% + 100vw)); }
}
${CARD_CSS}`,
      js: `if (!CSS.supports("animation-timeline: scroll()")) {
  const row = document.querySelector(".${p}-row");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const t = max > 0 ? scrollY / max : 0;
    row.style.transform = "translateX(" + -t * (row.scrollWidth - innerWidth) + "px)";
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}`,
    };
  },
};

export const SCROLL_2 = [PARALLAX, HSCROLL];
