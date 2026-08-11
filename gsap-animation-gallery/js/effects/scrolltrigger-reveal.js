// ScrollTrigger の登場演出と奥行き（フェード/マスク/クリップ/パララックス）。
// 基本形は scrolltrigger.js を参照。デモの scroller 指定などの前提も同じ。
import { CDN_ST, repeat } from "./_shared.js?v=20260811a";

export const SCROLLTRIGGER_REVEAL = [
  {
    key: "st-parallax",
    cat: "scrolltrigger",
    label: { ja: "パララックス（背景だけ遅らせる）", en: "Parallax background" },
    scroll: true,
    stage: `<div class="px-inner">
  <div class="px-spacer">下にスクロール</div>
  <div class="px-hero">
    <div class="px-bg"></div>
    <div class="px-fg">
      <span class="px-tag">前景は等速</span>
      <span class="px-tag px-tag-bg">背景はゆっくり</span>
    </div>
  </div>
  <div class="px-body">縞模様のズレ方で速度差が分かります</div>
</div>`,
    css: `.fx-st-parallax .px-spacer { height: 170px; display: grid; place-items: center; color: #64748b; }
.fx-st-parallax .px-hero { position: relative; height: 190px; overflow: hidden; }
/* 縞模様にすると「どれだけズレたか」が目で追える。なめらかな単色だと動きが見えない */
.fx-st-parallax .px-bg {
  position: absolute; inset: -35% 0;
  background: repeating-linear-gradient(-45deg, #6366f1 0 18px, #4f46e5 18px 36px);
}
.fx-st-parallax .px-fg {
  position: relative; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
}
.fx-st-parallax .px-tag {
  background: rgba(255, 255, 255, 0.94); color: #0f172a;
  border-radius: 999px; padding: 4px 14px; font-size: 1rem; font-weight: 700;
}
.fx-st-parallax .px-tag-bg { background: rgba(15, 23, 42, 0.82); color: #fff; }
.fx-st-parallax .px-body { height: 240px; padding: 24px; display: grid; place-items: center; background: #fff; color: #64748b; text-align: center; }`,
    mount(stage) {
      gsap.fromTo(
        stage.querySelector(".px-bg"),
        { yPercent: -18 },
        {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: stage.querySelector(".px-hero"),
            scroller: stage,
            // 画面に入った瞬間から出ていくまでを丸ごと使うと、動く距離が確保できる
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    code: `${CDN_ST}

<div class="px-hero">
  <div class="px-bg"></div>
  <div class="px-fg">前景（等速で流れる）</div>
</div>

<style>
.px-hero { position: relative; height: 100vh; overflow: hidden; }
/* 動かす分だけ上下にはみ出させておくのがポイント */
.px-bg { position: absolute; inset: -35% 0; background: url(hero.jpg) center / cover; }
.px-fg { position: relative; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".px-bg",
    { yPercent: -18 },
    {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".px-hero",
        // 画面に入った瞬間から出ていくまでを丸ごと使うと、動く距離が確保できる
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
<\/script>`,
  },

  {
    key: "st-mask",
    cat: "scrolltrigger",
    label: { ja: "マスクで下から現れる", en: "Reveal from mask" },
    scroll: true,
    stage: `<div class="mk-inner">
  <p class="mk-lead">下にスクロール</p>
  ${repeat(3, (i) => `<div class="mk-mask"><div class="mk-line">Reveal line ${i + 1}</div></div>`)}
  <div class="mk-tail"></div>
</div>`,
    css: `.fx-st-mask .mk-inner { padding: 16px; }
.fx-st-mask .mk-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-mask .mk-mask { overflow: hidden; margin-bottom: 12px; }
.fx-st-mask .mk-line {
  padding: 12px 16px; border-radius: 8px; background: #0f172a; color: #fff; font-weight: 700; font-size: 1rem;
}
.fx-st-mask .mk-tail { height: 140px; }`,
    mount(stage) {
      stage.querySelectorAll(".mk-mask").forEach((mask) => {
        gsap.from(mask.querySelector(".mk-line"), {
          yPercent: 110,
          ease: "none",
          scrollTrigger: { trigger: mask, scroller: stage, start: "top bottom", end: "top 55%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<div class="mk-mask"><div class="mk-line">Reveal line</div></div>

<style>
/* 親で隠して、中身を下から押し上げる。文字が「せり上がる」定番表現 */
.mk-mask { overflow: hidden; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".mk-line", {
    yPercent: 110, ease: "none",
    scrollTrigger: { trigger: ".mk-mask", start: "top bottom", end: "top 55%", scrub: true },
  });
<\/script>`,
  },

  {
    key: "st-zoom",
    cat: "scrolltrigger",
    label: { ja: "画像がゆっくりズーム", en: "Slow zoom on scroll" },
    scroll: true,
    stage: `<div class="zm-inner">
  <div class="zm-spacer">下にスクロール</div>
  <div class="zm-frame">
    <div class="zm-img">
      <span class="zm-subject">被写体</span>
    </div>
    <span class="zm-ref"></span>
    <span class="zm-badge">1.60×</span>
  </div>
  <div class="zm-tail">点線の枠は拡大しないので、差が分かります</div>
</div>`,
    css: `.fx-st-zoom .zm-spacer { height: 170px; display: grid; place-items: center; color: #64748b; }
.fx-st-zoom .zm-frame { position: relative; height: 190px; overflow: hidden; }
.fx-st-zoom .zm-img {
  height: 100%; display: grid; place-items: center;
  background:
    linear-gradient(#6366f1 0 0) padding-box,
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.32) 0 1px, transparent 1px 26px),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.32) 0 1px, transparent 1px 26px),
    #6366f1;
}
.fx-st-zoom .zm-subject {
  width: 74px; height: 74px; border-radius: 50%;
  background: #ec4899; color: #fff;
  display: grid; place-items: center; font-size: 1rem; font-weight: 700;
}
/* 拡大しない基準枠。これがあると「どれだけ大きくなったか」が読み取れる */
.fx-st-zoom .zm-ref {
  position: absolute; inset: 26px; border: 2px dashed rgba(255, 255, 255, 0.85); border-radius: 6px;
  pointer-events: none;
}
.fx-st-zoom .zm-badge {
  position: absolute; top: 8px; right: 8px;
  background: rgba(15, 23, 42, 0.82); color: #fff;
  border-radius: 999px; padding: 2px 12px;
  font-size: 1rem; font-weight: 700; font-variant-numeric: tabular-nums;
}
.fx-st-zoom .zm-tail { height: 240px; padding: 24px; display: grid; place-items: center; color: #64748b; text-align: center; }`,
    mount(stage) {
      const img = stage.querySelector(".zm-img");
      const badge = stage.querySelector(".zm-badge");

      gsap.fromTo(
        img,
        { scale: 1.6 },
        {
          scale: 1,
          ease: "none",
          onUpdate: () => {
            badge.textContent = `${gsap.getProperty(img, "scale").toFixed(2)}×`;
          },
          scrollTrigger: {
            trigger: stage.querySelector(".zm-frame"),
            scroller: stage,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    code: `${CDN_ST}

<div class="zm-frame"><img class="zm-img" src="hero.jpg" alt="" /></div>

<style>
/* 拡大しても隙間が出ないよう、親で刈り取って object-fit: cover を敷く */
.zm-frame { height: 100vh; overflow: hidden; }
.zm-img { width: 100%; height: 100%; object-fit: cover; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".zm-img",
    { scale: 1.6 },        // 拡大側から等倍へ戻すと「引いていく」印象になる
    {
      scale: 1, ease: "none",
      scrollTrigger: {
        trigger: ".zm-frame",
        // 画面に入った瞬間から出ていくまでを丸ごと使うと、動く距離が確保できる
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
<\/script>`,
  },

  {
    key: "st-line-grow",
    cat: "scrolltrigger",
    label: { ja: "区切り線が伸びる", en: "Divider line grows" },
    scroll: true,
    stage: `<div class="lg-inner">
  <p class="lg-lead">下にスクロール</p>
  ${repeat(3, (i) => `<div class="lg-block"><span class="lg-line"></span><span class="lg-txt">Section ${i + 1}</span></div>`)}
  <div class="lg-tail"></div>
</div>`,
    css: `.fx-st-line-grow .lg-inner { padding: 16px; }
.fx-st-line-grow .lg-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-line-grow .lg-block { margin-bottom: 40px; }
.fx-st-line-grow .lg-line {
  display: block; height: 4px; border-radius: 2px; width: 100%;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  transform: scaleX(0); transform-origin: left center;
}
.fx-st-line-grow .lg-txt { display: block; margin-top: 8px; font-weight: 700; color: #0f172a; }
.fx-st-line-grow .lg-tail { height: 140px; }`,
    mount(stage) {
      stage.querySelectorAll(".lg-block").forEach((block) => {
        gsap.to(block.querySelector(".lg-line"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: block, scroller: stage, start: "top bottom", end: "top 50%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<div class="lg-block"><span class="lg-line"></span><span class="lg-txt">Section 1</span></div>

<style>
.lg-line { transform: scaleX(0); transform-origin: left center; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".lg-block").forEach((block) => {
    gsap.to(block.querySelector(".lg-line"), {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: block, start: "top bottom", end: "top 50%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "st-rotate-in",
    cat: "scrolltrigger",
    label: { ja: "回転しながら入ってくる", en: "Rotate in on scroll" },
    scroll: true,
    stage: `<div class="ri-inner">
  <p class="ri-lead">下にスクロール</p>
  ${repeat(3, (i) => `<div class="ri-card">0${i + 1}</div>`)}
  <div class="ri-tail"></div>
</div>`,
    css: `.fx-st-rotate-in .ri-inner { padding: 16px; }
.fx-st-rotate-in .ri-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-rotate-in .ri-card {
  height: 86px; margin-bottom: 18px; border-radius: 14px;
  background: #6366f1; color: #fff; display: grid; place-items: center;
  font-size: 1.5rem; font-weight: 700;
}
.fx-st-rotate-in .ri-card:nth-child(3) { background: #ec4899; }
.fx-st-rotate-in .ri-tail { height: 130px; }`,
    mount(stage) {
      stage.querySelectorAll(".ri-card").forEach((card) => {
        gsap.from(card, {
          rotation: -10,
          y: 50,
          opacity: 0,
          transformOrigin: "left bottom",
          ease: "none",
          scrollTrigger: { trigger: card, scroller: stage, start: "top bottom", end: "top 55%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".ri-card").forEach((card) => {
    gsap.from(card, {
      rotation: -10, y: 50, opacity: 0,
      // 軸を左下に置くと「めくれ上がる」ような入り方になる
      transformOrigin: "left bottom",
      ease: "none",
      scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "st-blur-focus",
    cat: "scrolltrigger",
    label: { ja: "ぼけて入りピントが合う", en: "Blur in, then focus" },
    scroll: true,
    stage: `<div class="bf-inner">
  <p class="bf-lead">下にスクロール</p>
  ${repeat(3, (i) => `<div class="bf-item">FOCUS ${i + 1}</div>`)}
  <div class="bf-tail"></div>
</div>`,
    css: `.fx-st-blur-focus .bf-inner { padding: 16px; }
.fx-st-blur-focus .bf-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-blur-focus .bf-item {
  height: 80px; margin-bottom: 20px; border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: grid; place-items: center; font-weight: 700; letter-spacing: 0.1em;
}
.fx-st-blur-focus .bf-tail { height: 140px; }`,
    mount(stage) {
      stage.querySelectorAll(".bf-item").forEach((item) => {
        gsap.from(item, {
          filter: "blur(10px)",
          opacity: 0,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: item, scroller: stage, start: "top bottom", end: "top 55%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".bf-item").forEach((item) => {
    gsap.from(item, {
      filter: "blur(10px)", opacity: 0, scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: item, start: "top bottom", end: "top 55%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "st-clip",
    cat: "scrolltrigger",
    label: { ja: "クリップで下から開く", en: "Clip-path reveal on scroll" },
    scroll: true,
    stage: `<div class="cl-inner">
  <p class="cl-lead">下にスクロール</p>
  ${repeat(2, (i) => `<div class="cl-item">CLIP ${i + 1}</div>`)}
  <div class="cl-tail"></div>
</div>`,
    css: `.fx-st-clip .cl-inner { padding: 16px; }
.fx-st-clip .cl-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-clip .cl-item {
  height: 110px; margin-bottom: 20px; border-radius: 12px;
  background: repeating-linear-gradient(45deg, #6366f1 0 16px, #4f46e5 16px 32px);
  color: #fff; display: grid; place-items: center; font-weight: 700; letter-spacing: 0.12em;
}
.fx-st-clip .cl-tail { height: 160px; }`,
    mount(stage) {
      stage.querySelectorAll(".cl-item").forEach((item) => {
        gsap.from(item, {
          clipPath: "inset(100% 0 0 0)",
          ease: "none",
          scrollTrigger: { trigger: item, scroller: stage, start: "top bottom", end: "top 50%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".cl-item").forEach((item) => {
    gsap.from(item, {
      // inset の4辺は「上 右 下 左」。上を100%削ると下から開く
      clipPath: "inset(100% 0 0 0)",
      ease: "none",
      scrollTrigger: { trigger: item, start: "top bottom", end: "top 50%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "st-alternate",
    cat: "scrolltrigger",
    label: { ja: "左右交互に入ってくる", en: "Alternate left and right" },
    scroll: true,
    stage: `<div class="al-inner">
  <p class="al-lead">下にスクロール</p>
  ${repeat(4, (i) => `<div class="al-row"><span class="al-item">${i + 1}</span></div>`)}
  <div class="al-tail"></div>
</div>`,
    css: `.fx-st-alternate .al-inner { padding: 16px; }
.fx-st-alternate .al-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-alternate .al-row { margin-bottom: 16px; display: flex; }
.fx-st-alternate .al-row:nth-child(2n) { justify-content: flex-end; }
.fx-st-alternate .al-item {
  width: 62%; height: 62px; border-radius: 12px;
  background: #6366f1; color: #fff; display: grid; place-items: center; font-weight: 700;
}
.fx-st-alternate .al-row:nth-child(2n) .al-item { background: #ec4899; }
.fx-st-alternate .al-tail { height: 130px; }`,
    mount(stage) {
      stage.querySelectorAll(".al-row").forEach((row, i) => {
        gsap.from(row.querySelector(".al-item"), {
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: row, scroller: stage, start: "top bottom", end: "top 55%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".al-row").forEach((row, i) => {
    gsap.from(row.querySelector(".al-item"), {
      // 添字の偶奇で向きを変えるだけ。CSS側の並びと揃えるのを忘れずに
      x: i % 2 === 0 ? -80 : 80,
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: row, start: "top bottom", end: "top 55%", scrub: true },
    });
  });
<\/script>`,
  },

  {
    key: "st-depth",
    cat: "scrolltrigger",
    label: { ja: "多層パララックス（3層）", en: "Three-layer parallax" },
    scroll: true,
    stage: `<div class="dp-inner">
  <div class="dp-spacer">下にスクロール</div>
  <div class="dp-scene">
    <div class="dp-layer dp-back"></div>
    <div class="dp-layer dp-mid"></div>
    <div class="dp-layer dp-front"></div>
    <span class="dp-tag">奥ほどゆっくり</span>
  </div>
  <div class="dp-tail"></div>
</div>`,
    css: `.fx-st-depth .dp-spacer { height: 170px; display: grid; place-items: center; color: #64748b; }
.fx-st-depth .dp-scene { position: relative; height: 190px; overflow: hidden; background: #0f172a; }
.fx-st-depth .dp-layer { position: absolute; left: 0; right: 0; height: 60px; border-radius: 40px 40px 0 0; }
.fx-st-depth .dp-back { bottom: 66px; background: #312e81; }
.fx-st-depth .dp-mid { bottom: 34px; background: #6366f1; }
.fx-st-depth .dp-front { bottom: 0; background: #ec4899; }
.fx-st-depth .dp-tag {
  position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9); color: #0f172a;
  border-radius: 999px; padding: 3px 14px; font-size: 1rem; font-weight: 700;
}
.fx-st-depth .dp-tail { height: 200px; }`,
    mount(stage) {
      const scene = stage.querySelector(".dp-scene");
      const st = { trigger: scene, scroller: stage, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(stage.querySelector(".dp-back"), { y: 26 }, { y: -26, ease: "none", scrollTrigger: st });
      gsap.fromTo(stage.querySelector(".dp-mid"), { y: 46 }, { y: -46, ease: "none", scrollTrigger: st });
      gsap.fromTo(stage.querySelector(".dp-front"), { y: 72 }, { y: -72, ease: "none", scrollTrigger: st });
    },
    code: `${CDN_ST}

<div class="dp-scene">
  <div class="dp-layer dp-back"></div>
  <div class="dp-layer dp-mid"></div>
  <div class="dp-layer dp-front"></div>
</div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const st = { trigger: ".dp-scene", start: "top bottom", end: "bottom top", scrub: true };

  // 手前ほど大きく動かすと奥行きが出る。同じ設定オブジェクトを使い回せる
  gsap.fromTo(".dp-back",  { y: 26 }, { y: -26, ease: "none", scrollTrigger: st });
  gsap.fromTo(".dp-mid",   { y: 46 }, { y: -46, ease: "none", scrollTrigger: st });
  gsap.fromTo(".dp-front", { y: 72 }, { y: -72, ease: "none", scrollTrigger: st });
<\/script>`,
  },
];
