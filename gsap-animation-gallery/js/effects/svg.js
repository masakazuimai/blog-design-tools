// SVG・図形。DrawSVG / MorphSVG（有料）を使わず、標準の属性トゥイーンで同じ表現を作る。
import { CDN } from "./_shared.js?v=20260811a";

export const SVG = [
  {
    key: "svg-draw",
    cat: "svg",
    label: { ja: "線が描かれるSVG", en: "Draw an SVG line" },
    stage: `<svg class="dr" viewBox="0 0 200 110" fill="none">
  <path class="dr-line" d="M10 88 L52 44 L92 66 L132 20 L190 52" stroke="#6366f1" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <circle class="dr-dot" cx="132" cy="20" r="8" fill="#ec4899" />
</svg>`,
    css: `.fx-svg-draw .dr { width: 220px; height: auto; }`,
    mount(stage) {
      const path = stage.querySelector(".dr-line");
      const len = path.getTotalLength();
      gsap
        .timeline()
        .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" })
        .from(stage.querySelector(".dr-dot"), { scale: 0, transformOrigin: "center", ease: "back.out(3)" }, "-=0.4");
    },
    code: `${CDN}

<svg viewBox="0 0 200 110" fill="none">
  <path class="dr-line" d="M10 88 L52 44 L92 66 L132 20 L190 52"
        stroke="#6366f1" stroke-width="5" stroke-linecap="round" />
</svg>

<script>
  // 有料の DrawSVGPlugin を使わず、dasharray / dashoffset で同じ表現ができる
  const path = document.querySelector(".dr-line");
  const len = path.getTotalLength();

  gsap.fromTo(path,
    { strokeDasharray: len, strokeDashoffset: len },  // 破線1本分を線の外に逃がして「消えた」状態にする
    { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }
  );
<\/script>`,
  },

  {
    key: "svg-check",
    cat: "svg",
    label: { ja: "チェックマークが描かれる", en: "Animated checkmark" },
    stage: `<svg class="ck" viewBox="0 0 120 120" fill="none">
  <circle class="ck-ring" cx="60" cy="60" r="50" stroke="#6366f1" stroke-width="7" />
  <path class="ck-mark" d="M36 62 L53 79 L85 45" stroke="#6366f1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
</svg>`,
    css: `.fx-svg-check .ck { width: 140px; height: 140px; }`,
    mount(stage) {
      const ring = stage.querySelector(".ck-ring");
      const mark = stage.querySelector(".ck-mark");
      const ringLen = ring.getTotalLength();
      const markLen = mark.getTotalLength();

      gsap
        .timeline()
        .fromTo(
          ring,
          { strokeDasharray: ringLen, strokeDashoffset: ringLen, rotation: -90, transformOrigin: "center" },
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
        )
        .fromTo(
          mark,
          { strokeDasharray: markLen, strokeDashoffset: markLen },
          { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" },
          "-=0.15",
        );
    },
    code: `${CDN}

<svg viewBox="0 0 120 120" fill="none">
  <circle class="ck-ring" cx="60" cy="60" r="50" stroke="#6366f1" stroke-width="7" />
  <path class="ck-mark" d="M36 62 L53 79 L85 45" stroke="#6366f1" stroke-width="9" stroke-linecap="round" />
</svg>

<script>
  // 送信完了・保存完了のフィードバックに使えるチェックマーク
  const draw = (el) => {
    const len = el.getTotalLength();
    return [{ strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0 }];
  };

  const [ringFrom, ringTo] = draw(document.querySelector(".ck-ring"));
  const [markFrom, markTo] = draw(document.querySelector(".ck-mark"));

  gsap.timeline()
    .fromTo(".ck-ring", { ...ringFrom, rotation: -90, transformOrigin: "center" },
                        { ...ringTo, duration: 0.8, ease: "power2.inOut" })
    .fromTo(".ck-mark", markFrom, { ...markTo, duration: 0.45, ease: "power2.out" }, "-=0.15");
<\/script>`,
  },

  {
    key: "svg-progress",
    cat: "svg",
    label: { ja: "円グラフ（ドーナツ）", en: "Circular progress" },
    stage: `<div class="cp-wrap">
  <svg class="cp" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="12" />
    <circle class="cp-val" cx="60" cy="60" r="50" fill="none" stroke="#6366f1" stroke-width="12" stroke-linecap="round" />
  </svg>
  <div class="cp-num">0%</div>
</div>`,
    css: `.fx-svg-progress .cp-wrap { position: relative; width: 150px; height: 150px; }
.fx-svg-progress .cp { width: 100%; height: 100%; transform: rotate(-90deg); }
.fx-svg-progress .cp-num {
  position: absolute; inset: 0; display: grid; place-items: center;
  font-size: 1.5rem; font-weight: 700; color: #0f172a; font-variant-numeric: tabular-nums;
}`,
    mount(stage) {
      const circle = stage.querySelector(".cp-val");
      const num = stage.querySelector(".cp-num");
      const len = circle.getTotalLength();
      const target = 0.72;
      const state = { p: 0 };

      gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(state, {
        p: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          gsap.set(circle, { strokeDashoffset: len * (1 - state.p) });
          num.textContent = `${Math.round(state.p * 100)}%`;
        },
      });
    },
    code: `${CDN}

<svg class="cp" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="12" />
  <circle class="cp-val" cx="60" cy="60" r="50" fill="none" stroke="#6366f1" stroke-width="12" stroke-linecap="round" />
</svg>

<style>
.cp { transform: rotate(-90deg); }   /* 12時の位置から始めるため */
</style>

<script>
  const circle = document.querySelector(".cp-val");
  const len = circle.getTotalLength();
  const state = { p: 0 };

  gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });

  gsap.to(state, {
    p: 0.72,                 // 72%
    duration: 1.6, ease: "power2.out",
    onUpdate: () => gsap.set(circle, { strokeDashoffset: len * (1 - state.p) }),
  });
<\/script>`,
  },

  {
    key: "svg-morph",
    cat: "svg",
    label: { ja: "図形が変形する", en: "Morph a shape" },
    stage: `<svg class="mp" viewBox="0 0 120 120">
  <polygon class="mp-shape" points="60,10 110,45 91,105 29,105 10,45" fill="#6366f1" />
</svg>`,
    css: `.fx-svg-morph .mp { width: 150px; height: 150px; }`,
    mount(stage) {
      const shape = stage.querySelector(".mp-shape");
      gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.1, ease: "power2.inOut" } })
        .to(shape, { attr: { points: "60,10 105,35 105,85 60,110 15,85 15,35" }, fill: "#ec4899" })
        .to(shape, { attr: { points: "60,20 100,60 60,100 20,60 60,20 20,60" }, fill: "#0f172a" });
    },
    code: `${CDN}

<svg viewBox="0 0 120 120">
  <polygon class="mp-shape" points="60,10 110,45 91,105 29,105 10,45" fill="#6366f1" />
</svg>

<script>
  // 有料の MorphSVGPlugin なしでも、頂点の数が同じ polygon 同士なら attr で補間できる
  gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.1, ease: "power2.inOut" } })
    .to(".mp-shape", { attr: { points: "60,10 105,35 105,85 60,110 15,85 15,35" }, fill: "#ec4899" })
    .to(".mp-shape", { attr: { points: "60,20 100,60 60,100 20,60 60,20 20,60" }, fill: "#0f172a" });
<\/script>`,
  },

  {
    key: "svg-wave",
    cat: "svg",
    label: { ja: "波が流れ続ける", en: "Endless wave" },
    stage: `<svg class="wv2" viewBox="0 0 200 80" preserveAspectRatio="none">
  <path class="wv2-p wv2-back" d="M0,40 C25,15 50,65 100,40 C150,15 175,65 200,40 C225,15 250,65 300,40 C350,15 375,65 400,40 L400,80 L0,80 Z" fill="#c7d2fe" />
  <path class="wv2-p wv2-front" d="M0,45 C25,20 50,70 100,45 C150,20 175,70 200,45 C225,20 250,70 300,45 C350,20 375,70 400,45 L400,80 L0,80 Z" fill="#6366f1" />
</svg>`,
    css: `.fx-svg-wave .wv2 { width: 100%; height: 120px; }
.fx-svg-wave .wv2-p { transform-box: fill-box; }`,
    mount(stage) {
      gsap.to(stage.querySelector(".wv2-back"), { x: -200, duration: 4, ease: "none", repeat: -1 });
      gsap.to(stage.querySelector(".wv2-front"), { x: -200, duration: 2.6, ease: "none", repeat: -1 });
    },
    code: `${CDN}

<svg viewBox="0 0 200 80" preserveAspectRatio="none">
  <path class="wv2-back"  d="M0,40 C25,15 50,65 100,40 C150,15 175,65 200,40 C225,15 250,65 300,40 C350,15 375,65 400,40 L400,80 L0,80 Z" fill="#c7d2fe" />
  <path class="wv2-front" d="M0,45 C25,20 50,70 100,45 C150,20 175,70 200,45 C225,20 250,70 300,45 C350,20 375,70 400,45 L400,80 L0,80 Z" fill="#6366f1" />
</svg>

<script>
  // 同じ波形を横に2つ並べて幅2倍（400）のパスにしておき、
  // 1周期ぶん（この例では200）ちょうど動かすと、継ぎ目なく無限ループする
  gsap.to(".wv2-back",  { x: -200, duration: 4,   ease: "none", repeat: -1 });
  gsap.to(".wv2-front", { x: -200, duration: 2.6, ease: "none", repeat: -1 });  // 速度差で奥行きが出る
<\/script>`,
  },

  {
    key: "svg-arrow",
    cat: "svg",
    label: { ja: "矢印が繰り返し描かれる", en: "Looping arrow draw" },
    stage: `<svg class="ar" viewBox="0 0 200 80" fill="none">
  <path class="ar-line" d="M14 40 H172" stroke="#6366f1" stroke-width="6" stroke-linecap="round" />
  <path class="ar-head" d="M150 20 L176 40 L150 60" stroke="#ec4899" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
</svg>`,
    css: `.fx-svg-arrow .ar { width: 220px; height: auto; }`,
    mount(stage) {
      const draw = (el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        return len;
      };
      draw(stage.querySelector(".ar-line"));
      draw(stage.querySelector(".ar-head"));

      gsap
        .timeline({ repeat: -1, repeatDelay: 0.7 })
        .to(stage.querySelector(".ar-line"), { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" })
        .to(stage.querySelector(".ar-head"), { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, "-=0.15")
        .to([stage.querySelector(".ar-line"), stage.querySelector(".ar-head")], {
          opacity: 0,
          duration: 0.3,
          delay: 0.5,
        });
    },
    code: `${CDN}

<svg viewBox="0 0 200 80" fill="none">
  <path class="ar-line" d="M14 40 H172" stroke="#6366f1" stroke-width="6" stroke-linecap="round" />
  <path class="ar-head" d="M150 20 L176 40 L150 60" stroke="#ec4899" stroke-width="6" stroke-linecap="round" />
</svg>

<script>
  // 線と矢じりを別パスにしておくと、描かれる順番を制御できる
  const draw = (sel) => {
    const el = document.querySelector(sel);
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  };
  draw(".ar-line");
  draw(".ar-head");

  gsap.timeline({ repeat: -1, repeatDelay: 0.7 })
    .to(".ar-line", { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" })
    .to(".ar-head", { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, "-=0.15");
<\/script>`,
  },

  {
    key: "svg-blob",
    cat: "svg",
    label: { ja: "ブロブが有機的に変形", en: "Organic blob morph" },
    stage: `<svg class="bb" viewBox="0 0 200 200">
  <path class="bb-shape" fill="#6366f1" d="M100,26 C142,26 174,58 174,100 C174,142 142,174 100,174 C58,174 26,142 26,100 C26,58 58,26 100,26 Z" />
</svg>`,
    css: `.fx-svg-blob .bb { width: 150px; height: 150px; }`,
    mount(stage) {
      const shape = stage.querySelector(".bb-shape");
      gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { duration: 2, ease: "sine.inOut" } })
        .to(shape, {
          attr: { d: "M100,20 C150,34 180,64 172,108 C164,152 128,182 92,176 C56,170 24,136 30,94 C36,52 50,6 100,20 Z" },
          fill: "#ec4899",
        })
        .to(shape, {
          attr: { d: "M100,32 C136,20 182,52 176,96 C170,140 140,186 96,178 C52,170 20,134 26,90 C32,46 64,44 100,32 Z" },
          fill: "#4f46e5",
        });
    },
    code: `${CDN}

<svg viewBox="0 0 200 200">
  <path class="bb-shape" fill="#6366f1" d="M100,26 C142,26 174,58 174,100 C174,142 142,174 100,174 C58,174 26,142 26,100 C26,58 58,26 100,26 Z" />
</svg>

<script>
  // path の d も、コマンドの並びが同じなら attr で補間できる（C の数と順序を揃えるのがコツ）
  gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2, ease: "sine.inOut" } })
    .to(".bb-shape", {
      attr: { d: "M100,20 C150,34 180,64 172,108 C164,152 128,182 92,176 C56,170 24,136 30,94 C36,52 50,6 100,20 Z" },
      fill: "#ec4899",
    });
<\/script>`,
  },

  {
    key: "svg-bar",
    cat: "svg",
    label: { ja: "棒グラフが伸びる", en: "Bar chart grows" },
    stage: `<svg class="bg2" viewBox="0 0 200 120">
  <line x1="10" y1="108" x2="190" y2="108" stroke="#cbd5e1" stroke-width="2" />
  ${[38, 62, 30, 84, 54].map((h, i) => `<rect class="bg2-bar" x="${20 + i * 34}" y="${106 - h}" width="22" height="${h}" rx="4" fill="${i % 2 ? "#ec4899" : "#6366f1"}" />`).join("")}
</svg>`,
    css: `.fx-svg-bar .bg2 { width: 220px; height: auto; }
.fx-svg-bar .bg2-bar { transform-box: fill-box; transform-origin: bottom center; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".bg2-bar"), {
        scaleY: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    code: `${CDN}

<svg viewBox="0 0 200 120">
  <rect class="bg2-bar" x="20" y="68" width="22" height="38" rx="4" fill="#6366f1" />
  <rect class="bg2-bar" x="54" y="44" width="22" height="62" rx="4" fill="#ec4899" />
</svg>

<style>
/* SVG内で transform-origin を効かせるには transform-box: fill-box が必要 */
.bg2-bar { transform-box: fill-box; transform-origin: bottom center; }
</style>

<script>
  gsap.from(".bg2-bar", { scaleY: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 });
<\/script>`,
  },

  {
    key: "svg-line-chart",
    cat: "svg",
    label: { ja: "折れ線グラフと点", en: "Line chart with points" },
    stage: `<svg class="lc" viewBox="0 0 200 120" fill="none">
  <path class="lc-line" d="M16 96 L58 66 L100 76 L142 34 L184 48" stroke="#6366f1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  ${[[16, 96], [58, 66], [100, 76], [142, 34], [184, 48]].map(([x, y]) => `<circle class="lc-dot" cx="${x}" cy="${y}" r="6" fill="#ec4899" />`).join("")}
</svg>`,
    css: `.fx-svg-line-chart .lc { width: 220px; height: auto; }
.fx-svg-line-chart .lc-dot { transform-box: fill-box; transform-origin: center; }`,
    mount(stage) {
      const path = stage.querySelector(".lc-line");
      const len = path.getTotalLength();
      gsap
        .timeline()
        .fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" },
        )
        .from(stage.querySelectorAll(".lc-dot"), { scale: 0, duration: 0.4, ease: "back.out(3)", stagger: 0.12 }, 0.2);
    },
    code: `${CDN}

<svg viewBox="0 0 200 120" fill="none">
  <path class="lc-line" d="M16 96 L58 66 L100 76 L142 34 L184 48" stroke="#6366f1" stroke-width="4" />
  <circle class="lc-dot" cx="16" cy="96" r="6" fill="#ec4899" />
</svg>

<style>
.lc-dot { transform-box: fill-box; transform-origin: center; }
</style>

<script>
  const path = document.querySelector(".lc-line");
  const len = path.getTotalLength();

  // 線を描き始めた少し後から点を出すと、線に沿って現れるように見える
  gsap.timeline()
    .fromTo(path,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })
    .from(".lc-dot", { scale: 0, duration: 0.4, ease: "back.out(3)", stagger: 0.12 }, 0.2);
<\/script>`,
  },

  {
    key: "svg-signature",
    cat: "svg",
    label: { ja: "手書き署名風", en: "Handwritten signature" },
    stage: `<svg class="sg2" viewBox="0 0 240 90" fill="none">
  <path class="sg2-p" d="M18 62 C34 20 44 22 46 56 C48 82 62 78 70 50 C76 28 88 30 88 58 C88 74 100 74 110 52 C120 30 132 34 130 60 C129 74 142 72 154 52 C166 32 186 34 198 48 C210 62 216 58 222 44"
        stroke="#0f172a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
</svg>`,
    css: `.fx-svg-signature .sg2 { width: 240px; height: auto; }`,
    mount(stage) {
      const path = stage.querySelector(".sg2-p");
      const len = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut", repeat: -1, repeatDelay: 1 },
      );
    },
    code: `${CDN}

<svg viewBox="0 0 240 90" fill="none">
  <path class="sg2-p" d="M18 62 C34 20 44 22 46 56 C48 82 62 78 70 50 ..." stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
</svg>

<script>
  // 1本の連続したパスにしておくと、ペンで書いたように順番どおり描かれる
  const path = document.querySelector(".sg2-p");
  const len = path.getTotalLength();

  gsap.fromTo(path,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut", repeat: -1, repeatDelay: 1 }
  );
<\/script>`,
  },

  {
    key: "svg-dot-path",
    cat: "svg",
    label: { ja: "点がパス上を進む", en: "Dot travels along a path" },
    stage: `<svg class="dp2" viewBox="0 0 220 110" fill="none">
  <path class="dp2-track" d="M14 88 C60 8 100 108 140 40 C168 -6 194 44 206 70" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
  <circle class="dp2-dot" r="9" fill="#ec4899" cx="0" cy="0" />
</svg>`,
    css: `.fx-svg-dot-path .dp2 { width: 240px; height: auto; }`,
    mount(stage) {
      const track = stage.querySelector(".dp2-track");
      const dot = stage.querySelector(".dp2-dot");
      const len = track.getTotalLength();
      const state = { d: 0 };

      gsap.to(state, {
        d: len,
        duration: 2.6,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: () => {
          const p = track.getPointAtLength(state.d);
          gsap.set(dot, { attr: { cx: p.x, cy: p.y } });
        },
      });
    },
    code: `${CDN}

<svg viewBox="0 0 220 110" fill="none">
  <path class="dp2-track" d="M14 88 C60 8 100 108 140 40 C168 -6 194 44 206 70" stroke="#e2e8f0" stroke-width="4" />
  <circle class="dp2-dot" r="9" fill="#ec4899" cx="0" cy="0" />
</svg>

<script>
  // MotionPathPlugin を使わずとも、getPointAtLength で座標を拾えばパス上を動かせる
  const track = document.querySelector(".dp2-track");
  const dot = document.querySelector(".dp2-dot");
  const len = track.getTotalLength();
  const state = { d: 0 };

  gsap.to(state, {
    d: len,
    duration: 2.6, ease: "power1.inOut", repeat: -1, yoyo: true,
    onUpdate: () => {
      const p = track.getPointAtLength(state.d);
      gsap.set(dot, { attr: { cx: p.x, cy: p.y } });
    },
  });
<\/script>`,
  },
];
