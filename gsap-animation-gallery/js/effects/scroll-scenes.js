// スクロール演出のうち、ページ全体の見せ方に関わるもの（背景色・積み重ね・目次追従など）。
// 固定して見せる大きな演出は scroll-advanced.js を参照。
import { CDN_ST, repeat } from "./_shared.js?v=20260811a";

export const SCROLL_SCENES = [
  {
    key: "sa-section-color",
    cat: "scroll",
    label: { ja: "背景色がセクションで変わる", en: "Background color per section" },
    scroll: true,
    stage: `<div class="bc-inner">
  <section class="bc-sec" data-bg="#eef2ff">SECTION 1</section>
  <section class="bc-sec" data-bg="#fce7f3">SECTION 2</section>
  <section class="bc-sec" data-bg="#0f172a" data-fg="#ffffff">SECTION 3</section>
</div>`,
    css: `.fx-sa-section-color .bc-inner { background: #eef2ff; }
.fx-sa-section-color .bc-sec {
  height: 190px; display: grid; place-items: center;
  font-weight: 700; letter-spacing: 0.1em; color: #1e293b;
}`,
    mount(stage) {
      const inner = stage.querySelector(".bc-inner");
      stage.querySelectorAll(".bc-sec").forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          scroller: stage,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (!self.isActive) return;
            gsap.to(inner, { backgroundColor: sec.dataset.bg, duration: 0.5, ease: "power2.out" });
            gsap.to(stage.querySelectorAll(".bc-sec"), { color: sec.dataset.fg || "#1e293b", duration: 0.5 });
          },
        });
      });
    },
    code: `${CDN_ST}

<section class="bc-sec" data-bg="#eef2ff">SECTION 1</section>
<section class="bc-sec" data-bg="#0f172a">SECTION 2</section>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".bc-sec").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 60%",
      end: "bottom 60%",
      // onToggle は範囲に入った時と出た時の両方で呼ばれる。isActive で入った時だけ拾う
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to("body", { backgroundColor: sec.dataset.bg, duration: 0.5, ease: "power2.out" });
      },
    });
  });
<\/script>`,
  },

  {
    key: "sa-stack-cards",
    cat: "scroll",
    label: { ja: "カードが重なって積み上がる", en: "Stacking cards" },
    scroll: true,
    stage: `<div class="sk-inner">
  ${repeat(3, (i) => `<div class="sk-card sk-c${i + 1}">CARD ${i + 1}</div>`)}
  <div class="sk-tail"></div>
</div>`,
    css: `.fx-sa-stack-cards .sk-inner { padding: 16px 16px 0; }
.fx-sa-stack-cards .sk-card {
  position: sticky; top: 16px; height: 120px; margin-bottom: 24px;
  border-radius: 14px; display: grid; place-items: center;
  color: #fff; font-weight: 700; letter-spacing: 0.08em;
  box-shadow: 0 -6px 20px rgba(15, 23, 42, 0.18);
}
.fx-sa-stack-cards .sk-c1 { background: #6366f1; }
.fx-sa-stack-cards .sk-c2 { background: #ec4899; }
.fx-sa-stack-cards .sk-c3 { background: #0f172a; }
.fx-sa-stack-cards .sk-tail { height: 60px; }`,
    mount(stage) {
      const cards = stage.querySelectorAll(".sk-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], scroller: stage, start: "top 60%", end: "top 16%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<div class="sk-card">CARD 1</div>
<div class="sk-card">CARD 2</div>
<div class="sk-card">CARD 3</div>

<style>
/* sticky で重ねる。GSAPは「奥に下がる」表現だけを担当する */
.sk-card { position: sticky; top: 16px; height: 60vh; margin-bottom: 24px; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray(".sk-card");

  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    gsap.to(card, {
      scale: 0.9, opacity: 0.6, ease: "none",
      // 「次のカード」の位置を基準にして、今のカードを奥へ下げる
      scrollTrigger: { trigger: cards[i + 1], start: "top 60%", end: "top 16%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "sa-text-highlight",
    cat: "scroll",
    label: { ja: "読み進めた行がハイライト", en: "Highlight as you read" },
    scroll: true,
    stage: `<div class="th-sec">
  <div class="th-viewport">
    <p class="th-line">スクロールに合わせて</p>
    <p class="th-line">読んでいる行だけが</p>
    <p class="th-line">濃く表示されます</p>
    <p class="th-line">長文の導入に有効です</p>
  </div>
</div>`,
    css: `.fx-sa-text-highlight .th-sec { height: 620px; }
.fx-sa-text-highlight .th-viewport {
  position: sticky; top: 0; height: 190px;
  display: grid; align-content: center; gap: 6px; padding: 0 20px;
}
.fx-sa-text-highlight .th-line {
  font-size: 1.1rem; font-weight: 700; color: #cbd5e1; transition: none;
}`,
    mount(stage) {
      const lines = stage.querySelectorAll(".th-line");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.querySelector(".th-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      lines.forEach((line) => tl.to(line, { color: "#0f172a", duration: 1, ease: "none" }));
    },
    code: `${CDN_ST}

<p class="th-line">スクロールに合わせて</p>
<p class="th-line">読んでいる行だけが</p>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".th-sec", start: "top top", end: "bottom bottom", scrub: true },
  });

  // 行数ぶん to() を並べれば、スクロール量が自動で等分される
  gsap.utils.toArray(".th-line").forEach((line) => {
    tl.to(line, { color: "#0f172a", duration: 1, ease: "none" });
  });
<\/script>`,
  },

  {
    key: "sa-grid-collapse",
    cat: "scroll",
    label: { ja: "グリッドが1枚に収束", en: "Grid collapses into one" },
    scroll: true,
    stage: `<div class="gc-sec">
  <div class="gc-viewport">
    <div class="gc-grid">${repeat(9, () => `<span class="gc-cell"></span>`)}</div>
  </div>
</div>`,
    css: `.fx-sa-grid-collapse .gc-sec { height: 560px; }
.fx-sa-grid-collapse .gc-viewport { position: sticky; top: 0; height: 190px; display: grid; place-items: center; }
.fx-sa-grid-collapse .gc-grid { display: grid; grid-template-columns: repeat(3, 42px); gap: 8px; }
.fx-sa-grid-collapse .gc-cell { width: 42px; height: 42px; border-radius: 8px; background: #6366f1; }
.fx-sa-grid-collapse .gc-cell:nth-child(2n) { background: #ec4899; }`,
    mount(stage) {
      const cells = stage.querySelectorAll(".gc-cell");
      const center = cells[4].getBoundingClientRect();
      gsap.to(cells, {
        x: (i, el) => center.left - el.getBoundingClientRect().left,
        y: (i, el) => center.top - el.getBoundingClientRect().top,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".gc-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    },
    code: `${CDN_ST}

<div class="gc-grid">
  <span class="gc-cell"></span><span class="gc-cell"></span>
</div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const cells = gsap.utils.toArray(".gc-cell");
  const center = cells[4].getBoundingClientRect();   // 中央のセルを集合点にする

  gsap.to(cells, {
    // 関数で渡すと (index, element) を受け取れる＝要素ごとに移動量を計算できる
    x: (i, el) => center.left - el.getBoundingClientRect().left,
    y: (i, el) => center.top - el.getBoundingClientRect().top,
    ease: "none",
    scrollTrigger: { trigger: ".gc-sec", start: "top top", end: "bottom bottom", scrub: 0.5 },
  });
<\/script>`,
  },

  {
    key: "sa-marquee-dir",
    cat: "scroll",
    label: { ja: "スクロール方向で流れが変わる", en: "Marquee follows scroll direction" },
    scroll: true,
    stage: `<div class="md2-inner">
  <p class="md2-lead">上下にスクロール</p>
  <div class="md2-wrap"><div class="md2-track">
    <span class="md2-set">SCROLL ・ GSAP ・ MARQUEE ・</span>
    <span class="md2-set">SCROLL ・ GSAP ・ MARQUEE ・</span>
  </div></div>
  <div class="md2-tail"></div>
</div>`,
    css: `.fx-sa-marquee-dir .md2-lead { height: 150px; display: grid; place-items: center; color: #64748b; }
.fx-sa-marquee-dir .md2-wrap { overflow: hidden; padding: 14px 0; background: #0f172a; }
.fx-sa-marquee-dir .md2-track { display: flex; width: max-content; }
.fx-sa-marquee-dir .md2-set {
  padding-right: 18px; white-space: nowrap;
  font-size: 1.3rem; font-weight: 700; color: #a5b4fc; letter-spacing: 0.04em;
}
.fx-sa-marquee-dir .md2-tail { height: 260px; }`,
    mount(stage) {
      const set = stage.querySelector(".md2-set");
      const loop = gsap.to(stage.querySelector(".md2-track"), {
        x: -set.offsetWidth,
        duration: 8,
        ease: "none",
        repeat: -1,
      });

      ScrollTrigger.create({
        scroller: stage,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          // 下スクロールで正方向、上スクロールで逆方向に流す
          gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 0.3, overwrite: true });
        },
      });
    },
    code: `${CDN_ST}

<div class="md2-wrap"><div class="md2-track">
  <span class="md2-set">SCROLL ・ GSAP ・</span>
  <span class="md2-set">SCROLL ・ GSAP ・</span>
</div></div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const set = document.querySelector(".md2-set");
  const loop = gsap.to(".md2-track", { x: -set.offsetWidth, duration: 8, ease: "none", repeat: -1 });

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      // 下スクロールで正方向、上スクロールで逆方向に流す
      gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 0.3, overwrite: true });
    },
  });
<\/script>`,
  },

  {
    key: "sa-progress-circle",
    cat: "scroll",
    label: { ja: "円形の読了インジケーター", en: "Circular reading indicator" },
    scroll: true,
    stage: `<div class="pc2-inner">
  <div class="pc2-fixed">
    <svg viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" stroke-width="5" />
      <circle class="pc2-val" cx="24" cy="24" r="20" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round" />
    </svg>
  </div>
  <div class="pc2-body">${repeat(5, (i) => `<p>本文 ${i + 1}</p>`)}</div>
</div>`,
    css: `.fx-sa-progress-circle .pc2-fixed {
  position: sticky; top: 10px; z-index: 3; width: 48px; margin-left: auto; margin-right: 10px;
}
.fx-sa-progress-circle .pc2-fixed svg { width: 48px; height: 48px; transform: rotate(-90deg); }
.fx-sa-progress-circle .pc2-body { padding: 0 20px 40px; color: #475569; margin-top: -48px; }
.fx-sa-progress-circle .pc2-body p { margin-bottom: 44px; }`,
    mount(stage) {
      const circle = stage.querySelector(".pc2-val");
      const len = circle.getTotalLength();
      gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });

      gsap.to(circle, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".pc2-body"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<svg class="pc2-fixed" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" stroke-width="5" />
  <circle class="pc2-val" cx="24" cy="24" r="20" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round" />
</svg>

<style>
.pc2-fixed { position: fixed; top: 20px; right: 20px; transform: rotate(-90deg); }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const circle = document.querySelector(".pc2-val");
  const len = circle.getTotalLength();
  gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });

  gsap.to(circle, {
    strokeDashoffset: 0, ease: "none",
    scrollTrigger: { trigger: ".pc2-body", start: "top top", end: "bottom bottom", scrub: true },
  });
<\/script>`,
  },

  {
    key: "sa-columns",
    cat: "scroll",
    label: { ja: "列ごとに時間差で立ち上がる", en: "Columns rise in sequence" },
    scroll: true,
    stage: `<div class="co-inner">
  <p class="co-lead">下にスクロール</p>
  <div class="co-chart">${repeat(6, (i) => `<span class="co-bar" style="height:${28 + i * 12}%"></span>`)}</div>
  <div class="co-tail"></div>
</div>`,
    css: `.fx-sa-columns .co-inner { padding: 16px; }
.fx-sa-columns .co-lead { height: 150px; display: grid; place-items: center; color: #64748b; }
.fx-sa-columns .co-chart { height: 150px; display: flex; align-items: flex-end; gap: 10px; }
.fx-sa-columns .co-bar { flex: 1; border-radius: 6px 6px 0 0; background: #6366f1; transform-origin: bottom center; }
.fx-sa-columns .co-bar:nth-child(2n) { background: #ec4899; }
.fx-sa-columns .co-tail { height: 160px; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".co-bar"), {
        scaleY: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: stage.querySelector(".co-chart"), scroller: stage, start: "top 85%" },
      });
    },
    code: `${CDN_ST}

<div class="co-chart">
  <span class="co-bar" style="height:40%"></span>
  <span class="co-bar" style="height:70%"></span>
</div>

<style>
.co-bar { transform-origin: bottom center; }   /* 下端を軸にしないと真ん中から伸びる */
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".co-bar", {
    scaleY: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
    scrollTrigger: { trigger: ".co-chart", start: "top 85%" },
  });
<\/script>`,
  },

  {
    key: "sa-toc",
    cat: "scroll",
    label: { ja: "目次が現在地に追従", en: "Table of contents follows" },
    scroll: true,
    stage: `<div class="toc-inner">
  <nav class="toc-nav">
    ${repeat(3, (i) => `<span class="toc-item" data-i="${i}">0${i + 1}</span>`)}
  </nav>
  <div class="toc-body">
    ${repeat(3, (i) => `<section class="toc-sec" data-i="${i}">Section 0${i + 1}</section>`)}
  </div>
</div>`,
    css: `.fx-sa-toc .toc-nav {
  position: sticky; top: 0; z-index: 3; display: flex; gap: 6px;
  padding: 8px 10px; background: rgba(255, 255, 255, 0.94); border-bottom: 1px solid #e2e8f0;
}
.fx-sa-toc .toc-item {
  border-radius: 999px; padding: 2px 12px; font-size: 1rem; font-weight: 700;
  color: #94a3b8; background: #f1f5f9;
}
.fx-sa-toc .toc-item.is-current { background: #6366f1; color: #fff; }
.fx-sa-toc .toc-sec {
  height: 180px; display: grid; place-items: center;
  font-weight: 700; color: #0f172a; border-bottom: 1px dashed #e2e8f0;
}`,
    mount(stage) {
      const items = stage.querySelectorAll(".toc-item");
      const setCurrent = (i) => items.forEach((el, idx) => el.classList.toggle("is-current", idx === i));
      setCurrent(0);

      stage.querySelectorAll(".toc-sec").forEach((sec, i) => {
        ScrollTrigger.create({
          trigger: sec,
          scroller: stage,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setCurrent(i),
        });
      });
    },
    code: `${CDN_ST}

<nav class="toc-nav"><span class="toc-item">01</span><span class="toc-item">02</span></nav>
<section class="toc-sec">Section 01</section>
<section class="toc-sec">Section 02</section>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const items = gsap.utils.toArray(".toc-item");
  const setCurrent = (i) => items.forEach((el, idx) => el.classList.toggle("is-current", idx === i));

  gsap.utils.toArray(".toc-sec").forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec,
      // 画面の中央付近を判定線にすると、現在地の切り替わりが自然に見える
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => self.isActive && setCurrent(i),
    });
  });
<\/script>`,
  },
];
