// 基本トゥイーン（to / from / fromTo / stagger / ease / repeat）
import { CDN, repeat } from "./_shared.js?v=20260809b";

export const BASIC = [
  {
    key: "fade-up",
    cat: "basic",
    label: { ja: "フェードアップ", en: "Fade up" },
    stage: `<div class="box">GSAP</div>`,
    css: `.fx-fade-up .box {
  width: 128px; height: 128px; border-radius: 18px;
  background: #6366f1; color: #fff;
  display: grid; place-items: center; font-weight: 700; font-size: 1.1rem;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".box"), { y: 64, opacity: 0, duration: 0.9, ease: "power3.out" });
    },
    code: `${CDN}

<div class="box">GSAP</div>

<style>
.box {
  width: 128px; height: 128px; border-radius: 18px;
  background: #6366f1; color: #fff;
  display: grid; place-items: center; font-weight: 700;
}
</style>

<script>
  // from() は「今の見た目」をゴールにして、指定した状態から動かす
  gsap.from(".box", {
    y: 64,        // 64px下から
    opacity: 0,   // 透明から
    duration: 0.9,
    ease: "power3.out",
  });
<\/script>`,
  },

  {
    key: "fade-scale",
    cat: "basic",
    label: { ja: "フェード＋拡大", en: "Fade in with scale" },
    stage: `<div class="box">SCALE</div>`,
    css: `.fx-fade-scale .box {
  width: 150px; height: 110px; border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: grid; place-items: center; font-weight: 700; letter-spacing: 0.08em;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".box"), {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    },
    code: `${CDN}

<div class="box">SCALE</div>

<script>
  gsap.from(".box", {
    scale: 0.6,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",   // 行き過ぎて戻る＝弾む印象になる
  });
<\/script>`,
  },

  {
    key: "slide-in",
    cat: "basic",
    label: { ja: "左右からスライドイン", en: "Slide in from both sides" },
    stage: `<div class="rows">
  <div class="row row-l">← from left</div>
  <div class="row row-r">from right →</div>
</div>`,
    css: `.fx-slide-in .rows { display: grid; gap: 12px; width: 100%; padding: 0 20px; }
.fx-slide-in .row {
  padding: 14px 18px; border-radius: 10px; color: #fff; font-weight: 700;
}
.fx-slide-in .row-l { background: #6366f1; }
.fx-slide-in .row-r { background: #ec4899; text-align: right; }`,
    mount(stage) {
      gsap.from(stage.querySelector(".row-l"), { x: -120, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(stage.querySelector(".row-r"), { x: 120, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });
    },
    code: `${CDN}

<div class="row row-l">← from left</div>
<div class="row row-r">from right →</div>

<script>
  gsap.from(".row-l", { x: -120, opacity: 0, duration: 0.8, ease: "power3.out" });
  gsap.from(".row-r", { x: 120,  opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });
<\/script>`,
  },

  {
    key: "stagger-grid",
    cat: "basic",
    label: { ja: "スタガー（中央から順に）", en: "Stagger from center" },
    stage: `<div class="sq-grid">${repeat(9, () => `<span class="sq"></span>`)}</div>`,
    css: `.fx-stagger-grid .sq-grid { display: grid; grid-template-columns: repeat(3, 40px); gap: 10px; }
.fx-stagger-grid .sq { width: 40px; height: 40px; border-radius: 10px; background: #6366f1; }
.fx-stagger-grid .sq:nth-child(2n) { background: #ec4899; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".sq"), {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: { each: 0.06, from: "center", grid: [3, 3] },
      });
    },
    code: `${CDN}

<div class="sq-grid">
  <span class="sq"></span><span class="sq"></span><span class="sq"></span>
  <span class="sq"></span><span class="sq"></span><span class="sq"></span>
  <span class="sq"></span><span class="sq"></span><span class="sq"></span>
</div>

<style>
.sq-grid { display: grid; grid-template-columns: repeat(3, 40px); gap: 10px; }
.sq { width: 40px; height: 40px; border-radius: 10px; background: #6366f1; }
</style>

<script>
  gsap.from(".sq", {
    scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)",
    // grid を渡すと「中央から波紋状に」など2次元の順番が指定できる
    stagger: { each: 0.06, from: "center", grid: [3, 3] },
  });
<\/script>`,
  },

  {
    key: "stagger-list",
    cat: "basic",
    label: { ja: "リストを順に表示", en: "Stagger a list" },
    stage: `<ul class="li-list">${repeat(5, (i) => `<li>メニュー項目 ${i + 1}</li>`)}</ul>`,
    css: `.fx-stagger-list .li-list { list-style: none; width: 100%; padding: 0 22px; display: grid; gap: 8px; }
.fx-stagger-list .li-list li {
  padding: 8px 14px; border-radius: 8px; background: #fff;
  border-left: 4px solid #6366f1; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}`,
    mount(stage) {
      gsap.from(stage.querySelectorAll("li"), {
        x: -28,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.09,
      });
    },
    code: `${CDN}

<ul class="li-list">
  <li>メニュー項目 1</li>
  <li>メニュー項目 2</li>
  <li>メニュー項目 3</li>
</ul>

<script>
  // stagger に数値を渡すだけで「1件あたり◯秒ずらす」になる
  gsap.from(".li-list li", {
    x: -28, opacity: 0, duration: 0.5, ease: "power2.out",
    stagger: 0.09,
  });
<\/script>`,
  },

  {
    key: "ease-compare",
    cat: "basic",
    label: { ja: "イージング比較（4種）", en: "Compare 4 easings" },
    stage: `<div class="ease-list">
  <div class="ease-row"><span class="ease-name">power2.out</span><span class="ball" data-ease="power2.out"></span></div>
  <div class="ease-row"><span class="ease-name">back.out(2)</span><span class="ball" data-ease="back.out(2)"></span></div>
  <div class="ease-row"><span class="ease-name">elastic.out</span><span class="ball" data-ease="elastic.out(1, 0.4)"></span></div>
  <div class="ease-row"><span class="ease-name">bounce.out</span><span class="ball" data-ease="bounce.out"></span></div>
</div>`,
    css: `.fx-ease-compare .ease-list { width: 100%; padding: 0 14px; display: grid; gap: 12px; }
.fx-ease-compare .ease-row { display: grid; grid-template-columns: 108px 1fr; align-items: center; }
.fx-ease-compare .ease-name { font-size: 1rem; color: #64748b; font-family: Consolas, Menlo, monospace; }
.fx-ease-compare .ball { width: 18px; height: 18px; border-radius: 50%; background: #6366f1; }`,
    mount(stage) {
      stage.querySelectorAll(".ball").forEach((ball) => {
        const travel = ball.parentElement.offsetWidth - 108 - 18;
        gsap.fromTo(ball, { x: 0 }, { x: travel, duration: 1.4, ease: ball.dataset.ease });
      });
    },
    code: `${CDN}

<div class="ease-row"><span>power2.out</span><span class="ball"></span></div>

<script>
  // fromTo() は開始値と終了値の両方を明示する書き方
  gsap.fromTo(".ball",
    { x: 0 },
    { x: 240, duration: 1.4, ease: "power2.out" }
  );
  // 主な ease: power1〜4.out / back.out(2) / elastic.out(1, 0.4) / bounce.out / none
<\/script>`,
  },

  {
    key: "rotate-in",
    cat: "basic",
    label: { ja: "回転しながら登場", en: "Rotate in" },
    stage: `<div class="rot">★</div>`,
    css: `.fx-rotate-in .rot {
  width: 110px; height: 110px; border-radius: 24px;
  background: #ec4899; color: #fff;
  display: grid; place-items: center; font-size: 2.4rem;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".rot"), {
        rotation: -180,
        scale: 0.2,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    },
    code: `${CDN}

<div class="rot">★</div>

<script>
  gsap.from(".rot", {
    rotation: -180,   // 度数で指定（CSSのdeg不要）
    scale: 0.2,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
  });
<\/script>`,
  },

  {
    key: "flip-3d",
    cat: "basic",
    label: { ja: "3Dフリップ", en: "3D flip" },
    stage: `<div class="flip-scene"><div class="flip-el">FLIP</div></div>`,
    css: `.fx-flip-3d .flip-scene { perspective: 800px; }
.fx-flip-3d .flip-el {
  width: 150px; height: 110px; border-radius: 14px;
  background: linear-gradient(135deg, #0f172a, #6366f1);
  color: #fff; display: grid; place-items: center;
  font-weight: 700; letter-spacing: 0.1em;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".flip-el"), {
        rotationY: 90,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        transformOrigin: "left center",
      });
    },
    code: `${CDN}

<div class="flip-scene"><div class="flip-el">FLIP</div></div>

<style>
/* 3D回転は親に perspective が必要 */
.flip-scene { perspective: 800px; }
</style>

<script>
  gsap.from(".flip-el", {
    rotationY: 90,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    transformOrigin: "left center",   // 左端を軸にして開く
  });
<\/script>`,
  },

  {
    key: "repeat-yoyo",
    cat: "basic",
    label: { ja: "往復し続ける（repeat / yoyo）", en: "Loop back and forth" },
    stage: `<div class="yo-wrap"><span class="yo-dot"></span><span class="yo-dot"></span><span class="yo-dot"></span></div>`,
    css: `.fx-repeat-yoyo .yo-wrap { display: flex; gap: 16px; }
.fx-repeat-yoyo .yo-dot { width: 26px; height: 26px; border-radius: 50%; background: #6366f1; }`,
    mount(stage) {
      gsap.to(stage.querySelectorAll(".yo-dot"), {
        y: -26,
        duration: 0.45,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });
    },
    code: `${CDN}

<span class="yo-dot"></span><span class="yo-dot"></span><span class="yo-dot"></span>

<script>
  // ローディングインジケーターなどに使える無限往復
  gsap.to(".yo-dot", {
    y: -26,
    duration: 0.45,
    ease: "power1.inOut",
    repeat: -1,      // -1 で無限ループ
    yoyo: true,      // 折り返して戻る
    stagger: 0.12,
  });
<\/script>`,
  },

  {
    key: "keyframes",
    cat: "basic",
    label: { ja: "キーフレーム（多段の動き）", en: "Keyframes in one tween" },
    stage: `<div class="kf">KF</div>`,
    css: `.fx-keyframes .kf {
  width: 84px; height: 84px; border-radius: 20px;
  background: #ec4899; color: #fff;
  display: grid; place-items: center; font-weight: 700;
}`,
    mount(stage) {
      gsap.to(stage.querySelector(".kf"), {
        keyframes: [
          { x: -70, duration: 0.5, ease: "power2.inOut" },
          { y: -46, rotation: 180, duration: 0.5, ease: "power2.inOut" },
          { x: 70, duration: 0.5, ease: "power2.inOut" },
          { y: 0, rotation: 360, duration: 0.5, ease: "power2.inOut" },
          { x: 0, duration: 0.5, ease: "power2.inOut" },
        ],
      });
    },
    code: `${CDN}

<div class="kf">KF</div>

<script>
  // 1つのトゥイーンで多段の動きを書ける。timelineを組むまでもない時に便利
  gsap.to(".kf", {
    keyframes: [
      { x: -70, duration: 0.5 },
      { y: -46, rotation: 180, duration: 0.5 },
      { x: 70, duration: 0.5 },
      { y: 0, rotation: 360, duration: 0.5 },
      { x: 0, duration: 0.5 },
    ],
    ease: "power2.inOut",
  });
<\/script>`,
  },

  {
    key: "blur-in",
    cat: "basic",
    label: { ja: "ぼかしから鮮明になる", en: "Blur to focus" },
    stage: `<div class="bl">FOCUS</div>`,
    css: `.fx-blur-in .bl {
  font-size: 2.1rem; font-weight: 700; letter-spacing: 0.06em; color: #0f172a;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".bl"), {
        filter: "blur(14px)",
        opacity: 0,
        scale: 1.15,
        duration: 1,
        ease: "power2.out",
      });
    },
    code: `${CDN}

<div class="bl">FOCUS</div>

<script>
  // filter も文字列のまま渡せる。ぼかしは重いので対象は小さく絞る
  gsap.from(".bl", {
    filter: "blur(14px)",
    opacity: 0,
    scale: 1.15,
    duration: 1,
    ease: "power2.out",
  });
<\/script>`,
  },

  {
    key: "skew-in",
    cat: "basic",
    label: { ja: "傾きながらスライドイン", en: "Skewed slide in" },
    stage: `<div class="sk-rows">
  <div class="sk-row">Skew 01</div>
  <div class="sk-row">Skew 02</div>
  <div class="sk-row">Skew 03</div>
</div>`,
    css: `.fx-skew-in .sk-rows { width: 100%; padding: 0 20px; display: grid; gap: 10px; }
.fx-skew-in .sk-row {
  padding: 12px 18px; border-radius: 9px; background: #6366f1; color: #fff; font-weight: 700;
}
.fx-skew-in .sk-row:nth-child(2) { background: #ec4899; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".sk-row"), {
        x: -90,
        skewX: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    code: `${CDN}

<div class="sk-row">Skew 01</div>
<div class="sk-row">Skew 02</div>

<script>
  // skewX を初期値だけに入れると「勢いで歪んで、止まると直る」ように見える
  gsap.from(".sk-row", {
    x: -90,
    skewX: 22,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.1,
  });
<\/script>`,
  },

  {
    key: "random-scatter",
    cat: "basic",
    label: { ja: "ランダムに散らばって整列", en: "Scatter then align" },
    stage: `<div class="rs-grid">${repeat(12, () => `<span class="rs-cell"></span>`)}</div>`,
    css: `.fx-random-scatter .rs-grid { display: grid; grid-template-columns: repeat(4, 34px); gap: 9px; }
.fx-random-scatter .rs-cell { width: 34px; height: 34px; border-radius: 9px; background: #6366f1; }
.fx-random-scatter .rs-cell:nth-child(3n) { background: #ec4899; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".rs-cell"), {
        x: () => gsap.utils.random(-140, 140),
        y: () => gsap.utils.random(-90, 90),
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.03,
      });
    },
    code: `${CDN}

<div class="rs-grid">
  <span class="rs-cell"></span><span class="rs-cell"></span>
</div>

<script>
  // 値を関数で渡すと要素ごとに評価される＝1件ずつ違う乱数を割り当てられる
  gsap.from(".rs-cell", {
    x: () => gsap.utils.random(-140, 140),
    y: () => gsap.utils.random(-90, 90),
    rotation: () => gsap.utils.random(-180, 180),
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.03,
  });
<\/script>`,
  },

  {
    key: "clip-reveal",
    cat: "basic",
    label: { ja: "クリップで開く", en: "Clip-path reveal" },
    stage: `<div class="cr">REVEAL</div>`,
    css: `.fx-clip-reveal .cr {
  width: 190px; height: 118px; border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: grid; place-items: center;
  font-weight: 700; letter-spacing: 0.14em;
}`,
    mount(stage) {
      gsap.from(stage.querySelector(".cr"), {
        clipPath: "inset(0 100% 0 0)",
        duration: 1,
        ease: "power3.inOut",
      });
    },
    code: `${CDN}

<div class="cr">REVEAL</div>

<script>
  // clip-path も補間できる。inset の4辺は「上 右 下 左」の順
  gsap.from(".cr", {
    clipPath: "inset(0 100% 0 0)",   // 右側を100%削った＝幅ゼロの状態から
    duration: 1,
    ease: "power3.inOut",
  });
<\/script>`,
  },

  {
    key: "arc-move",
    cat: "basic",
    label: { ja: "弧を描いて移動", en: "Move along an arc" },
    stage: `<div class="am-area"><span class="am-ball"></span></div>`,
    css: `.fx-arc-move .am-area { position: relative; width: 100%; height: 100%; }
.fx-arc-move .am-ball {
  position: absolute; left: 30px; bottom: 34px;
  width: 30px; height: 30px; border-radius: 50%; background: #ec4899;
}`,
    mount(stage) {
      const ball = stage.querySelector(".am-ball");
      const travel = stage.offsetWidth - 90;
      gsap.fromTo(ball, { x: 0 }, { x: travel, duration: 1.4, ease: "none" });
      gsap.fromTo(
        ball,
        { y: 0 },
        { y: -96, duration: 0.7, ease: "power2.out", yoyo: true, repeat: 1 },
      );
    },
    code: `${CDN}

<span class="am-ball"></span>

<script>
  // 横は等速、縦だけ上がって落ちる。2本重ねるだけで放物線になる
  gsap.fromTo(".am-ball", { x: 0 }, { x: 280, duration: 1.4, ease: "none" });

  gsap.fromTo(".am-ball",
    { y: 0 },
    { y: -96, duration: 0.7, ease: "power2.out", yoyo: true, repeat: 1 }
  );
<\/script>`,
  },

  {
    key: "stagger-edges",
    cat: "basic",
    label: { ja: "端から中央へ集まる", en: "Stagger from the edges" },
    stage: `<div class="se-row">${repeat(9, () => `<span class="se-bar"></span>`)}</div>`,
    css: `.fx-stagger-edges .se-row { display: flex; align-items: center; gap: 7px; height: 110px; }
.fx-stagger-edges .se-bar { width: 14px; height: 100%; border-radius: 7px; background: #6366f1; }
.fx-stagger-edges .se-bar:nth-child(2n) { background: #ec4899; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".se-bar"), {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "center center",
        duration: 0.6,
        ease: "back.out(2)",
        stagger: { each: 0.07, from: "edges" },
      });
    },
    code: `${CDN}

<span class="se-bar"></span><span class="se-bar"></span>

<script>
  gsap.from(".se-bar", {
    scaleY: 0, opacity: 0, transformOrigin: "center center",
    duration: 0.6, ease: "back.out(2)",
    // from には "start" "center" "end" "edges" "random" が指定できる
    stagger: { each: 0.07, from: "edges" },
  });
<\/script>`,
  },
];
