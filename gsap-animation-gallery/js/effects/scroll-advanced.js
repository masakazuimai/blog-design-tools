// スクロール演出（応用）のうち「画面を固定して見せる」大きめの見せ場。
// ScrollTrigger の pin は使わず sticky で固定している（レイアウトを壊さず、入れ子のスクロール領域でも安定するため）。
// ページ全体の見せ方に関わるものは scroll-scenes.js に分けてある。
import { CDN_ST, repeat } from "./_shared.js?v=20260811a";

export const SCROLL_ADVANCED = [
  {
    key: "sa-horizontal",
    cat: "scroll",
    label: { ja: "横スクロール（縦で横に流す）", en: "Horizontal scroll section" },
    scroll: true,
    stage: `<div class="hz-sec">
  <div class="hz-viewport">
    <div class="hz-track">
      <div class="hz-panel hz-1">01</div>
      <div class="hz-panel hz-2">02</div>
      <div class="hz-panel hz-3">03</div>
    </div>
  </div>
</div>`,
    css: `.fx-sa-horizontal .hz-sec { height: 570px; }
.fx-sa-horizontal .hz-viewport { position: sticky; top: 0; height: 190px; overflow: hidden; }
.fx-sa-horizontal .hz-track { display: flex; width: 300%; height: 100%; }
.fx-sa-horizontal .hz-panel { width: 33.3333%; height: 100%; display: grid; place-items: center; color: #fff; font-size: 2rem; font-weight: 700; }
.fx-sa-horizontal .hz-1 { background: #6366f1; }
.fx-sa-horizontal .hz-2 { background: #ec4899; }
.fx-sa-horizontal .hz-3 { background: #0f172a; }`,
    mount(stage) {
      gsap.to(stage.querySelector(".hz-track"), {
        xPercent: -66.6666,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".hz-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
    },
    code: `${CDN_ST}

<section class="hz-sec">
  <div class="hz-viewport">
    <div class="hz-track">
      <div class="hz-panel">01</div>
      <div class="hz-panel">02</div>
      <div class="hz-panel">03</div>
    </div>
  </div>
</section>

<style>
/* 高さ = パネル数ぶんの縦スクロール量を確保する */
.hz-sec { height: 300vh; }
.hz-viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.hz-track { display: flex; width: 300%; height: 100%; }
.hz-panel { width: 33.3333%; height: 100%; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  // position:sticky で固定しておけば pin なしでも横スクロールが作れる
  gsap.to(".hz-track", {
    xPercent: -66.6666,      // パネル3枚なら -66.6666（= -100 × (枚数-1) / 枚数）
    ease: "none",
    scrollTrigger: { trigger: ".hz-sec", start: "top top", end: "bottom bottom", scrub: 0.5 },
  });
<\/script>`,
  },

  {
    key: "sa-pin-text",
    cat: "scroll",
    label: { ja: "固定しながらテキスト切替", en: "Swap text while pinned" },
    scroll: true,
    stage: `<div class="pt-sec">
  <div class="pt-viewport">
    <div class="pt-slot">
      <span class="pt-word pt-w1">速い</span>
      <span class="pt-word pt-w2">軽い</span>
      <span class="pt-word pt-w3">滑らか</span>
    </div>
  </div>
</div>`,
    css: `.fx-sa-pin-text .pt-sec { height: 600px; }
.fx-sa-pin-text .pt-viewport { position: sticky; top: 0; height: 190px; display: grid; place-items: center; background: #0f172a; }
.fx-sa-pin-text .pt-slot { position: relative; width: 100%; height: 48px; }
.fx-sa-pin-text .pt-word {
  position: absolute; inset: 0; display: grid; place-items: center;
  color: #fff; font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em;
}
.fx-sa-pin-text .pt-w2 { color: #a5b4fc; }
.fx-sa-pin-text .pt-w3 { color: #f9a8d4; }`,
    mount(stage) {
      const words = stage.querySelectorAll(".pt-word");
      gsap.set(words, { opacity: 0, y: 30 });
      gsap.set(words[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.querySelector(".pt-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      words.forEach((word, i) => {
        if (i === 0) return;
        tl.to(words[i - 1], { opacity: 0, y: -30, duration: 1 }).to(word, { opacity: 1, y: 0, duration: 1 }, "<");
      });
    },
    code: `${CDN_ST}

<section class="pt-sec">
  <div class="pt-viewport">
    <div class="pt-slot">
      <span class="pt-word">速い</span>
      <span class="pt-word">軽い</span>
      <span class="pt-word">滑らか</span>
    </div>
  </div>
</section>

<style>
.pt-sec { height: 300vh; }
.pt-viewport { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; }
.pt-slot { position: relative; }
.pt-word { position: absolute; inset: 0; }   /* 重ねて置き、透明度で入れ替える */
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const words = gsap.utils.toArray(".pt-word");
  gsap.set(words, { opacity: 0, y: 30 });
  gsap.set(words[0], { opacity: 1, y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".pt-sec", start: "top top", end: "bottom bottom", scrub: true },
  });

  words.forEach((word, i) => {
    if (i === 0) return;
    tl.to(words[i - 1], { opacity: 0, y: -30, duration: 1 })
      .to(word, { opacity: 1, y: 0, duration: 1 }, "<");
  });
<\/script>`,
  },

  {
    key: "sa-counter",
    cat: "scroll",
    label: { ja: "スクロールで数字が伸びる", en: "Count up while scrolling" },
    scroll: true,
    stage: `<div class="cs-sec">
  <div class="cs-viewport">
    <div class="cs-num">0</div>
    <div class="cs-cap">実装したサンプル数</div>
  </div>
</div>`,
    css: `.fx-sa-counter .cs-sec { height: 540px; }
.fx-sa-counter .cs-viewport { position: sticky; top: 0; height: 190px; display: grid; place-items: center; align-content: center; }
.fx-sa-counter .cs-num { font-size: 3rem; font-weight: 700; color: #6366f1; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
.fx-sa-counter .cs-cap { color: #64748b; font-size: 1rem; }`,
    mount(stage) {
      const el = stage.querySelector(".cs-num");
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 100,
        ease: "none",
        onUpdate: () => {
          el.textContent = Math.round(obj.v);
        },
        scrollTrigger: {
          trigger: stage.querySelector(".cs-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<div class="cs-num">0</div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const el = document.querySelector(".cs-num");
  const obj = { v: 0 };   // ただの箱をトゥイーンして、その値を表示に反映する

  gsap.to(obj, {
    v: 100, ease: "none",
    onUpdate: () => { el.textContent = Math.round(obj.v); },
    scrollTrigger: { trigger: ".cs-sec", start: "top top", end: "bottom bottom", scrub: true },
  });
<\/script>`,
  },

  {
    key: "sa-frames",
    cat: "scroll",
    label: { ja: "コマ送り（画像シーケンス）", en: "Frame-by-frame sequence" },
    scroll: true,
    stage: `<div class="fr-sec">
  <div class="fr-viewport">
    <div class="fr-stageArea">
      ${repeat(6, (i) => `<span class="fr-frame" data-i="${i}">${i + 1}</span>`)}
    </div>
    <div class="fr-cap">frame <b class="fr-n">1</b> / 6</div>
  </div>
</div>`,
    css: `.fx-sa-frames .fr-sec { height: 620px; }
.fx-sa-frames .fr-viewport { position: sticky; top: 0; height: 190px; display: grid; place-items: center; align-content: center; gap: 10px; }
.fx-sa-frames .fr-stageArea { position: relative; width: 96px; height: 96px; }
.fx-sa-frames .fr-frame {
  position: absolute; inset: 0; display: grid; place-items: center;
  border-radius: 18px; color: #fff; font-size: 2rem; font-weight: 700; opacity: 0;
  background: linear-gradient(135deg, #6366f1, #ec4899);
}
.fx-sa-frames .fr-frame:nth-child(2n) { background: linear-gradient(135deg, #0f172a, #6366f1); }
.fx-sa-frames .fr-cap { color: #64748b; font-size: 1rem; }`,
    mount(stage) {
      const frames = stage.querySelectorAll(".fr-frame");
      const label = stage.querySelector(".fr-n");
      const state = { i: 0 };
      gsap.set(frames[0], { opacity: 1 });

      gsap.to(state, {
        i: frames.length - 1,
        ease: "none",
        snap: { i: 1 },
        onUpdate: () => {
          frames.forEach((f, idx) => gsap.set(f, { opacity: idx === state.i ? 1 : 0 }));
          label.textContent = state.i + 1;
        },
        scrollTrigger: {
          trigger: stage.querySelector(".fr-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<canvas class="fr-canvas"></canvas>

<script>
  gsap.registerPlugin(ScrollTrigger);

  // Apple公式サイト風の「スクロールでコマ送り」。連番画像の添字をトゥイーンする
  const frames = gsap.utils.toArray(".fr-frame");
  const state = { i: 0 };

  gsap.to(state, {
    i: frames.length - 1,
    ease: "none",
    snap: { i: 1 },          // 整数にスナップしてコマ落ちを防ぐ
    onUpdate: () => {
      frames.forEach((f, idx) => gsap.set(f, { opacity: idx === state.i ? 1 : 0 }));
    },
    scrollTrigger: { trigger: ".fr-sec", start: "top top", end: "bottom bottom", scrub: true },
  });
<\/script>`,
  },

  {
    key: "sa-split-open",
    cat: "scroll",
    label: { ja: "左右に開くカーテン", en: "Split open curtain" },
    scroll: true,
    stage: `<div class="so-sec">
  <div class="so-viewport">
    <div class="so-content">CONTENT</div>
    <div class="so-half so-l"></div>
    <div class="so-half so-r"></div>
  </div>
</div>`,
    css: `.fx-sa-split-open .so-sec { height: 540px; }
.fx-sa-split-open .so-viewport { position: sticky; top: 0; height: 190px; overflow: hidden; }
.fx-sa-split-open .so-content {
  position: absolute; inset: 0; display: grid; place-items: center;
  background: #f8fafc; color: #0f172a; font-weight: 700; letter-spacing: 0.16em;
}
.fx-sa-split-open .so-half { position: absolute; top: 0; width: 50%; height: 100%; }
.fx-sa-split-open .so-l { left: 0; background: #6366f1; }
.fx-sa-split-open .so-r { right: 0; background: #ec4899; }`,
    mount(stage) {
      gsap.to(stage.querySelector(".so-l"), {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".so-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      gsap.to(stage.querySelector(".so-r"), {
        xPercent: 100,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".so-sec"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<div class="so-viewport">
  <div class="so-content">CONTENT</div>
  <div class="so-half so-l"></div>
  <div class="so-half so-r"></div>
</div>

<style>
.so-viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.so-half { position: absolute; top: 0; width: 50%; height: 100%; }
.so-l { left: 0; } .so-r { right: 0; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const st = { trigger: ".so-sec", start: "top top", end: "bottom bottom", scrub: true };

  gsap.to(".so-l", { xPercent: -100, ease: "none", scrollTrigger: st });
  gsap.to(".so-r", { xPercent: 100,  ease: "none", scrollTrigger: st });
<\/script>`,
  },

  {
    key: "sa-timeline-scrub",
    cat: "scroll",
    label: { ja: "タイムライン全体をscrubに繋ぐ", en: "Scrub a whole timeline" },
    scroll: true,
    stage: `<div class="tsc-sec">
  <div class="tsc-viewport">
    <div class="tsc-box tsc-1"></div>
    <div class="tsc-box tsc-2"></div>
    <div class="tsc-box tsc-3"></div>
  </div>
</div>`,
    css: `.fx-sa-timeline-scrub .tsc-sec { height: 620px; }
.fx-sa-timeline-scrub .tsc-viewport { position: sticky; top: 0; height: 190px; display: flex; align-items: center; justify-content: center; gap: 14px; }
.fx-sa-timeline-scrub .tsc-box { width: 54px; height: 54px; border-radius: 14px; }
.fx-sa-timeline-scrub .tsc-1 { background: #6366f1; }
.fx-sa-timeline-scrub .tsc-2 { background: #ec4899; }
.fx-sa-timeline-scrub .tsc-3 { background: #0f172a; }`,
    mount(stage) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: stage.querySelector(".tsc-sec"),
            scroller: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
          defaults: { ease: "none", duration: 1 },
        })
        .from(stage.querySelector(".tsc-1"), { y: -80, rotation: -90, opacity: 0 })
        .from(stage.querySelector(".tsc-2"), { scale: 0, opacity: 0 })
        .from(stage.querySelector(".tsc-3"), { y: 80, rotation: 90, opacity: 0 });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  // timeline 自体に scrollTrigger を渡すと、複数段の動きを1本のスクロールに割り当てられる
  gsap.timeline({
    scrollTrigger: { trigger: ".tsc-sec", start: "top top", end: "bottom bottom", scrub: 0.6 },
    defaults: { ease: "none", duration: 1 },   // scrub では duration が「配分の比率」になる
  })
    .from(".tsc-1", { y: -80, rotation: -90, opacity: 0 })
    .from(".tsc-2", { scale: 0, opacity: 0 })
    .from(".tsc-3", { y: 80, rotation: 90, opacity: 0 });
<\/script>`,
  },

  {
    key: "sa-card-fan",
    cat: "scroll",
    label: { ja: "カードが扇状に開く", en: "Cards fan out" },
    scroll: true,
    stage: `<div class="cf-sec">
  <div class="cf-viewport">
    <div class="cf-card cf-1"></div>
    <div class="cf-card cf-2"></div>
    <div class="cf-card cf-3"></div>
  </div>
</div>`,
    css: `.fx-sa-card-fan .cf-sec { height: 560px; }
.fx-sa-card-fan .cf-viewport { position: sticky; top: 0; height: 190px; display: grid; place-items: center; }
.fx-sa-card-fan .cf-card {
  position: absolute; width: 88px; height: 122px; border-radius: 12px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
}
.fx-sa-card-fan .cf-1 { background: #6366f1; }
.fx-sa-card-fan .cf-2 { background: #ec4899; }
.fx-sa-card-fan .cf-3 { background: #0f172a; }`,
    mount(stage) {
      const st = {
        trigger: stage.querySelector(".cf-sec"),
        scroller: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      };
      gsap.to(stage.querySelector(".cf-1"), { x: -96, rotation: -18, ease: "none", scrollTrigger: st });
      gsap.to(stage.querySelector(".cf-3"), { x: 96, rotation: 18, ease: "none", scrollTrigger: st });
    },
    code: `${CDN_ST}

<div class="cf-card cf-1"></div>
<div class="cf-card cf-2"></div>
<div class="cf-card cf-3"></div>

<style>
.cf-card { position: absolute; }   /* 重ねてから左右へ開く */
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const st = { trigger: ".cf-sec", start: "top top", end: "bottom bottom", scrub: 0.5 };

  gsap.to(".cf-1", { x: -96, rotation: -18, ease: "none", scrollTrigger: st });
  gsap.to(".cf-3", { x: 96,  rotation: 18,  ease: "none", scrollTrigger: st });
<\/script>`,
  },

  {
    key: "sa-zoom-through",
    cat: "scroll",
    label: { ja: "中央を突き抜けるズーム", en: "Zoom through the center" },
    scroll: true,
    stage: `<div class="zt-sec">
  <div class="zt-viewport">
    <div class="zt-behind">
      <span class="zt-title">CONTENT</span>
      <span class="zt-sub">穴が広がって中身が現れます</span>
    </div>
    <span class="zt-hole"></span>
  </div>
</div>`,
    css: `.fx-sa-zoom-through .zt-sec { height: 620px; }
.fx-sa-zoom-through .zt-viewport { position: sticky; top: 0; height: 190px; overflow: hidden; display: grid; place-items: center; }
.fx-sa-zoom-through .zt-behind {
  position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 6px;
  background: repeating-linear-gradient(45deg, #f8fafc 0 12px, #eef2ff 12px 24px);
}
.fx-sa-zoom-through .zt-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; letter-spacing: 0.16em; }
.fx-sa-zoom-through .zt-sub { font-size: 1rem; color: #64748b; }
/* 覆いは box-shadow だけが担当する。親に背景を敷くと穴が塗り潰されて何も見えない */
.fx-sa-zoom-through .zt-hole {
  position: absolute; width: 46px; height: 46px; border-radius: 50%;
  background: transparent; box-shadow: 0 0 0 9999px #6366f1;
}`,
    mount(stage) {
      gsap.fromTo(
        stage.querySelector(".zt-hole"),
        { scale: 0.2 },
        {
          scale: 9,
          ease: "none",
          scrollTrigger: {
            trigger: stage.querySelector(".zt-sec"),
            scroller: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        },
      );
    },
    code: `${CDN_ST}

<div class="zt-viewport">
  <div class="zt-behind">CONTENT</div>
  <span class="zt-hole"></span>
</div>

<style>
.zt-viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; display: grid; place-items: center; }
.zt-behind { position: absolute; inset: 0; }
/* 巨大な box-shadow で穴の外側を塗りつぶす＝穴が広がると中身が現れる */
/* 覆いは box-shadow だけが担当する。親に背景を敷くと穴が塗り潰されて何も見えない */
.zt-hole { position: absolute; width: 46px; height: 46px; border-radius: 50%;
           background: transparent; box-shadow: 0 0 0 9999px #6366f1; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  // 画面の対角線を覆いきる倍率まで拡げる（46px の円なら 9倍で約414px）
  gsap.fromTo(".zt-hole",
    { scale: 0.2 },
    {
      scale: 9, ease: "none",
      scrollTrigger: { trigger: ".zt-sec", start: "top top", end: "bottom bottom", scrub: 0.4 },
    }
  );
<\/script>`,
  },
];
