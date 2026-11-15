import { word, hue, CARD_CSS } from "./_shared.js?v=20261116a";

const list = (p, n, lang) =>
  Array.from({ length: n }, (_, i) => `<li class="cg-card ${p}-card" style="--h: ${hue(i, n)}">${word(i, lang)}</li>`).join(
    "\n  "
  );

const FIELDS = [
  { key: "n", label: { ja: "枚数", en: "Cards" }, min: 3, max: 12, step: 1, unit: "" },
  { key: "w", label: { ja: "カードの幅", en: "Card width" }, min: 50, max: 100, step: 5, unit: "%" },
];

const SNAP = {
  id: "snap",
  demo: "x",
  cat: "basic",
  method: "css",
  label: { ja: "スクロールスナップ", en: "Scroll snap" },
  desc: {
    ja: "指やトラックパッドで横に送ると、カードがぴたっと止まります。JavaScript を使わない一番の基本です。",
    en: "Swipe or scroll sideways and each card snaps into place. The simplest carousel, with no JavaScript.",
  },
  fields: [...FIELDS, { key: "gap", label: { ja: "間隔", en: "Gap" }, min: 0, max: 40, step: 2, unit: "px" }],
  defaults: { n: 6, w: 80, gap: 16 },
  build(o, lang) {
    const p = "cg-snap";
    return {
      html: `<ul class="${p}">
  ${list(p, o.n, lang)}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: ${o.gap}px;
  margin: 0;
  padding: 24px 16px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 16px;
  overscroll-behavior-x: contain;
}
.${p}-card {
  flex: 0 0 ${o.w}%;
  aspect-ratio: 16 / 9;
  scroll-snap-align: start;
}
${CARD_CSS}`,
      js: "",
    };
  },
};

const MARKERS = {
  id: "scroll-markers",
  demo: "x",
  cat: "basic",
  method: "css-new",
  label: { ja: "CSS だけのボタンと点", en: "CSS-only buttons and dots" },
  desc: {
    ja: "前後のボタンと、いまの位置を示す点を、CSS の ::scroll-button と ::scroll-marker だけで出します。",
    en: "Previous/next buttons and position dots made with only CSS ::scroll-button and ::scroll-marker.",
  },
  support: {
    ja: "::scroll-button と ::scroll-marker は Chrome・Edge 135 以降が対応しています。まだ対応していないブラウザでは、コードの中の短い JS が同じボタンと点を作ります。",
    en: "::scroll-button and ::scroll-marker work in Chrome and Edge 135+. In other browsers, the short JS in the code builds the same buttons and dots.",
  },
  fields: FIELDS,
  defaults: { n: 6, w: 70 },
  build(o, lang) {
    const p = "cg-markers";
    const prev = lang === "en" ? "Previous" : "前へ";
    const next = lang === "en" ? "Next" : "次へ";
    return {
      html: `<ul class="${p}">
  ${list(p, o.n, lang)}
</ul>`,
      css: `.${p} {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 24px 16px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  anchor-name: --${p};
  scroll-marker-group: after;
}
.${p}-card {
  flex: 0 0 ${o.w}%;
  aspect-ratio: 16 / 9;
  scroll-snap-align: center;
}
.${p}::scroll-button(*) {
  position: absolute;
  position-anchor: --${p};
  top: anchor(center);
  translate: 0 -50%;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #13302f;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.${p}::scroll-button(*):disabled {
  opacity: 0.3;
  cursor: default;
}
.${p}::scroll-button(left) {
  content: "←" / "${prev}";
  left: calc(anchor(left) + 8px);
}
.${p}::scroll-button(right) {
  content: "→" / "${next}";
  right: calc(anchor(right) + 8px);
}
.${p}::scroll-marker-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 8px;
}
.${p}-card::scroll-marker {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c7d1c8;
}
.${p}-card::scroll-marker:target-current {
  background: #13302f;
}
.${p}-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
}
.${p}-nav button {
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
.${p}-arrow {
  width: 44px;
  height: 44px;
  background: #13302f;
  color: #fff;
  font-size: 18px;
}
.${p}-dot {
  width: 12px;
  height: 12px;
  padding: 0;
  background: #c7d1c8;
}
.${p}-dot[aria-current="true"] {
  background: #13302f;
}
${CARD_CSS}`,
      js: `if (!CSS.supports("scroll-marker-group: after")) {
  const list = document.querySelector(".${p}");
  const cards = [...list.children];
  const nav = document.createElement("div");
  nav.className = "${p}-nav";
  const go = (i) => list.scrollTo({ left: cards[i].offsetLeft - (list.clientWidth - cards[i].offsetWidth) / 2 });
  const current = () => {
    const mid = list.scrollLeft + list.clientWidth / 2;
    return cards.reduce((best, c, i) => (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid) ? i : best), 0);
  };
  const button = (cls, label, text, onClick) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", label);
    b.textContent = text;
    b.addEventListener("click", onClick);
    return b;
  };
  nav.append(button("${p}-arrow", "${prev}", "←", () => go(Math.max(0, current() - 1))));
  const dots = cards.map((_, i) => button("${p}-dot", String(i + 1), "", () => go(i)));
  nav.append(...dots);
  nav.append(button("${p}-arrow", "${next}", "→", () => go(Math.min(cards.length - 1, current() + 1))));
  list.after(nav);
  const update = () => {
    const c = current();
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === c)));
  };
  list.addEventListener("scroll", update, { passive: true });
  update();
}`,
    };
  },
};

export const BASIC = [SNAP, MARKERS];
