// ScrollTrigger の基本形（トリガー・scrub・toggleActions・batch・snap など）
// デモはカード内の独立したスクロール領域で動かすため、すべて scroller に stage を渡している。
// コピー用コードではページ全体をスクローラーにする（= scroller 指定なし）。
// 登場演出・奥行き系は scrolltrigger-reveal.js に分けてある。
import { CDN_ST, repeat } from "./_shared.js?v=20260811a";

export const SCROLLTRIGGER = [
  {
    key: "st-fade",
    cat: "scrolltrigger",
    label: { ja: "スクロールでフェードイン", en: "Fade in on scroll" },
    scroll: true,
    stage: `<div class="st-inner">
  <p class="st-lead">下にスクロール</p>
  ${repeat(4, (i) => `<div class="st-item">Item ${i + 1}</div>`)}
  <div class="st-tail"></div>
</div>`,
    css: `.fx-st-fade .st-inner { padding: 16px; }
.fx-st-fade .st-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-fade .st-item {
  height: 74px; margin-bottom: 16px; border-radius: 10px;
  background: #6366f1; color: #fff; display: grid; place-items: center; font-weight: 700;
}
.fx-st-fade .st-item:nth-child(2n) { background: #ec4899; }
.fx-st-fade .st-tail { height: 30px; }`,
    mount(stage) {
      stage.querySelectorAll(".st-item").forEach((item) => {
        gsap.from(item, {
          y: 44,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: item, scroller: stage, start: "top bottom", end: "top 55%", scrub: true },
        });
      });
    },
    code: `${CDN_ST}

<div class="st-item">Item 1</div>
<div class="st-item">Item 2</div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".st-item").forEach((item) => {
    gsap.from(item, {
      y: 44, opacity: 0, ease: "none",
      scrollTrigger: {
        trigger: item,
        // scrub でスクロール位置に直結させると、スクロールを止めた分だけ途中で止まる
        start: "top bottom",   // 要素の上端が画面下端に来たら開始
        end: "top 55%",        // 上端が画面の55%位置まで来たら完了
        scrub: true,
      },
    });
  });
<\/script>`,
  },

  {
    key: "st-stagger",
    cat: "scrolltrigger",
    label: { ja: "画面に入ったら順に表示", en: "Stagger when section enters" },
    scroll: true,
    stage: `<div class="sg-inner">
  <p class="sg-lead">下にスクロール</p>
  <div class="sg-grid">${repeat(6, () => `<span class="sg-cell"></span>`)}</div>
  <div class="sg-tail"></div>
</div>`,
    css: `.fx-st-stagger .sg-inner { padding: 16px; }
.fx-st-stagger .sg-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-stagger .sg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.fx-st-stagger .sg-cell { height: 62px; border-radius: 10px; background: #6366f1; }
.fx-st-stagger .sg-cell:nth-child(2n) { background: #ec4899; }
.fx-st-stagger .sg-tail { height: 120px; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".sg-cell"), {
        y: 34,
        opacity: 0,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: { trigger: stage.querySelector(".sg-grid"), scroller: stage, start: "top bottom", end: "top 40%", scrub: true },
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  // トリガーは「まとまり」に1つだけ置き、中身は stagger でずらす
  gsap.from(".sg-cell", {
    y: 34, opacity: 0, ease: "none",
    // scrub と併用するとき、stagger は秒数ではなくスクロール範囲の配分として効く
    stagger: 0.5,
    scrollTrigger: { trigger: ".sg-grid", start: "top bottom", end: "top 40%", scrub: true },
  });
<\/script>`,
  },

  {
    key: "st-once",
    cat: "scrolltrigger",
    label: { ja: "1回だけ再生する（once）", en: "Play once only" },
    scroll: true,
    stage: `<div class="on-inner">
  <p class="on-lead">下にスクロール<br />（戻っても再生されません）</p>
  <div class="on-box">ONCE</div>
  <div class="on-tail"></div>
</div>`,
    css: `.fx-st-once .on-inner { padding: 16px; }
.fx-st-once .on-lead { height: 190px; display: grid; place-items: center; color: #64748b; text-align: center; line-height: 1.5; }
.fx-st-once .on-box {
  height: 100px; border-radius: 12px; background: #0f172a; color: #fff;
  display: grid; place-items: center; font-weight: 700; letter-spacing: 0.12em;
}
.fx-st-once .on-tail { height: 160px; }`,
    mount(stage) {
      gsap.from(stage.querySelector(".on-box"), {
        scale: 0.7,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: stage.querySelector(".on-box"), scroller: stage, start: "top 85%", once: true },
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".on-box", {
    scale: 0.7, opacity: 0, duration: 0.8, ease: "back.out(1.6)",
    scrollTrigger: {
      trigger: ".on-box",
      start: "top 85%",
      once: true,   // 一度再生したらトリガーを破棄する（登場演出はこれが基本）
    },
  });
<\/script>`,
  },

  {
    key: "st-toggle",
    cat: "scrolltrigger",
    label: { ja: "出入りで再生と巻き戻し", en: "toggleActions on enter/leave" },
    scroll: true,
    stage: `<div class="tg-inner">
  <p class="tg-lead">上下にスクロール<br />出入りのたびに動きます</p>
  <div class="tg-box">TOGGLE</div>
  <div class="tg-tail"></div>
</div>`,
    css: `.fx-st-toggle .tg-inner { padding: 16px; }
.fx-st-toggle .tg-lead { height: 190px; display: grid; place-items: center; color: #64748b; text-align: center; line-height: 1.5; }
.fx-st-toggle .tg-box {
  height: 100px; border-radius: 12px; background: #ec4899; color: #fff;
  display: grid; place-items: center; font-weight: 700; letter-spacing: 0.12em;
}
.fx-st-toggle .tg-tail { height: 200px; }`,
    mount(stage) {
      gsap.from(stage.querySelector(".tg-box"), {
        x: -80,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stage.querySelector(".tg-box"),
          scroller: stage,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".tg-box", {
    x: -80, opacity: 0, duration: 0.7, ease: "power3.out",
    scrollTrigger: {
      trigger: ".tg-box",
      start: "top 85%",
      end: "bottom 20%",
      // 順に onEnter / onLeave / onEnterBack / onLeaveBack の挙動を指定する
      // 指定できる値: play, pause, resume, reverse, restart, reset, complete, none
      toggleActions: "play reverse play reverse",
    },
  });
<\/script>`,
  },

  {
    key: "st-scrub",
    cat: "scrolltrigger",
    label: { ja: "スクロール量に固定（scrub）", en: "Tie animation to scroll (scrub)" },
    scroll: true,
    stage: `<div class="sc-inner">
  <div class="sc-sticky"><div class="sc-box">SCRUB</div></div>
</div>`,
    css: `.fx-st-scrub .sc-inner { height: 560px; }
.fx-st-scrub .sc-sticky { position: sticky; top: 0; height: 190px; display: grid; place-items: center; }
.fx-st-scrub .sc-box {
  width: 96px; height: 96px; border-radius: 18px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 1rem;
}`,
    mount(stage) {
      gsap.to(stage.querySelector(".sc-box"), {
        rotation: 360,
        scale: 1.5,
        borderRadius: "50%",
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".sc-inner"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  // scrub を付けると「再生」ではなく「スクロール位置＝再生位置」になる
  gsap.to(".sc-box", {
    rotation: 360, scale: 1.5, borderRadius: "50%",
    ease: "none",            // scrub では none にしないと二重に緩急がつく
    scrollTrigger: {
      trigger: ".sc-inner",
      start: "top top",
      end: "bottom bottom",
      scrub: true,           // 数値(例: 0.5)にすると少し遅れて追従して滑らかになる
    },
  });
<\/script>`,
  },

  {
    key: "st-progress",
    cat: "scrolltrigger",
    label: { ja: "読了プログレスバー", en: "Reading progress bar" },
    scroll: true,
    stage: `<div class="pg-inner">
  <div class="pg-bar-wrap"><div class="pg-bar"></div></div>
  <div class="pg-body">
    <p>スクロール量に合わせて</p><p>上のバーが伸びます</p>
    <p>記事ページの読了率表示に</p><p>そのまま使えます</p>
  </div>
</div>`,
    css: `.fx-st-progress .pg-bar-wrap { position: sticky; top: 0; z-index: 3; height: 6px; background: #e2e8f0; }
.fx-st-progress .pg-bar { height: 100%; width: 100%; transform: scaleX(0); transform-origin: left center; background: linear-gradient(90deg, #6366f1, #ec4899); }
.fx-st-progress .pg-body { padding: 24px 18px 40px; color: #475569; text-align: center; }
.fx-st-progress .pg-body p { margin-bottom: 42px; }`,
    mount(stage) {
      gsap.to(stage.querySelector(".pg-bar"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".pg-body"),
          scroller: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    code: `${CDN_ST}

<div class="pg-bar-wrap"><div class="pg-bar"></div></div>
<article class="pg-body"> ... 記事本文 ... </article>

<style>
.pg-bar-wrap { position: sticky; top: 0; z-index: 100; height: 6px; background: #e2e8f0; }
.pg-bar { height: 100%; width: 100%; transform: scaleX(0); transform-origin: left center;
          background: linear-gradient(90deg, #6366f1, #ec4899); }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  // width ではなく scaleX を動かすとレイアウト計算が走らず滑らかに動く
  gsap.to(".pg-bar", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: ".pg-body", start: "top top", end: "bottom bottom", scrub: true },
  });
<\/script>`,
  },

  {
    key: "st-batch",
    cat: "scrolltrigger",
    label: { ja: "まとめて管理（batch）", en: "ScrollTrigger.batch" },
    scroll: true,
    stage: `<div class="bt-inner">
  <p class="bt-lead">下にスクロール</p>
  <div class="bt-grid">${repeat(8, () => `<span class="bt-cell"></span>`)}</div>
  <div class="bt-tail"></div>
</div>`,
    css: `.fx-st-batch .bt-inner { padding: 16px; }
.fx-st-batch .bt-lead { height: 190px; display: grid; place-items: center; color: #64748b; }
.fx-st-batch .bt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.fx-st-batch .bt-cell { height: 58px; border-radius: 10px; background: #6366f1; }
.fx-st-batch .bt-cell:nth-child(2n) { background: #ec4899; }
.fx-st-batch .bt-tail { height: 140px; }`,
    mount(stage) {
      gsap.set(stage.querySelectorAll(".bt-cell"), { opacity: 0, y: 30 });
      ScrollTrigger.batch(stage.querySelectorAll(".bt-cell"), {
        scroller: stage,
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1, overwrite: true }),
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  // 要素数が多いとき、1件ずつトリガーを作らず「同時に入ってきた分をまとめて」動かす
  gsap.set(".bt-cell", { opacity: 0, y: 30 });

  ScrollTrigger.batch(".bt-cell", {
    start: "top 90%",
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1, overwrite: true }),
    // onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 30, overwrite: true }),
  });
<\/script>`,
  },

  {
    key: "st-header",
    cat: "scrolltrigger",
    label: { ja: "追従ヘッダーの出し入れ", en: "Hide/show sticky header" },
    scroll: true,
    stage: `<div class="hd-inner">
  <div class="hd-bar">下スクロールで隠れる ↑</div>
  <div class="hd-body">${repeat(6, (i) => `<p>セクション ${i + 1}</p>`)}</div>
</div>`,
    css: `.fx-st-header .hd-bar {
  position: sticky; top: 0; z-index: 4; height: 42px;
  background: #0f172a; color: #fff; display: grid; place-items: center; font-size: 1rem;
}
.fx-st-header .hd-body { padding: 20px; color: #475569; }
.fx-st-header .hd-body p { margin-bottom: 46px; }`,
    mount(stage) {
      const bar = stage.querySelector(".hd-bar");
      ScrollTrigger.create({
        scroller: stage,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          gsap.to(bar, {
            yPercent: self.direction === 1 && self.scroll() > 40 ? -100 : 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });
    },
    code: `${CDN_ST}

<header class="hd-bar"> ... </header>

<style>
.hd-bar { position: sticky; top: 0; z-index: 100; }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      // self.direction は下スクロールで 1、上スクロールで -1
      gsap.to(".hd-bar", {
        yPercent: self.direction === 1 && self.scroll() > 40 ? -100 : 0,
        duration: 0.3, ease: "power2.out", overwrite: true,
      });
    },
  });
<\/script>`,
  },

  {
    key: "st-markers",
    cat: "scrolltrigger",
    label: { ja: "位置をデバッグする（markers）", en: "Debug with markers" },
    scroll: true,
    stage: `<div class="mr-inner">
  <p class="mr-lead">start / end の線が見えます</p>
  <div class="mr-box">TRIGGER</div>
  <div class="mr-tail"></div>
</div>`,
    css: `.fx-st-markers .mr-inner { padding: 16px; }
.fx-st-markers .mr-lead { height: 190px; display: grid; place-items: center; color: #64748b; text-align: center; }
.fx-st-markers .mr-box {
  height: 96px; border-radius: 12px; background: #6366f1; color: #fff;
  display: grid; place-items: center; font-weight: 700; letter-spacing: 0.1em;
}
.fx-st-markers .mr-tail { height: 200px; }`,
    mount(stage) {
      gsap.from(stage.querySelector(".mr-box"), {
        opacity: 0,
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: stage.querySelector(".mr-box"),
          scroller: stage,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
          markers: { startColor: "#6366f1", endColor: "#ec4899" },
        },
      });
    },
    code: `${CDN_ST}

<script>
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".mr-box", {
    opacity: 0, y: 40, ease: "none",
    scrollTrigger: {
      trigger: ".mr-box",
      start: "top 80%",
      end: "top 40%",
      scrub: true,
      markers: true,   // 開発中だけ true にして start/end の位置を目視で確認する
    },
  });
<\/script>`,
  },

  {
    key: "st-classes",
    cat: "scrolltrigger",
    label: { ja: "クラスを付け外しする", en: "Toggle a class" },
    scroll: true,
    stage: `<div class="tc-inner">
  <p class="tc-lead">範囲に入るとクラスが付きます</p>
  <div class="tc-box">状態: <b class="tc-state">out</b></div>
  <div class="tc-tail"></div>
</div>`,
    css: `.fx-st-classes .tc-inner { padding: 16px; }
.fx-st-classes .tc-lead { height: 190px; display: grid; place-items: center; color: #64748b; text-align: center; }
.fx-st-classes .tc-box {
  height: 100px; border-radius: 12px; background: #e2e8f0; color: #475569;
  display: grid; place-items: center; font-weight: 700;
  transition: background 0.4s, color 0.4s, transform 0.4s;
}
.fx-st-classes .tc-box.is-active { background: #6366f1; color: #fff; transform: scale(1.04); }
.fx-st-classes .tc-tail { height: 220px; }`,
    mount(stage) {
      const box = stage.querySelector(".tc-box");
      const state = stage.querySelector(".tc-state");
      ScrollTrigger.create({
        trigger: box,
        scroller: stage,
        start: "top 80%",
        end: "bottom 30%",
        toggleClass: { targets: box, className: "is-active" },
        onToggle: (self) => (state.textContent = self.isActive ? "in" : "out"),
      });
    },
    code: `${CDN_ST}

<style>
.tc-box { transition: background 0.4s, transform 0.4s; }
.tc-box.is-active { background: #6366f1; color: #fff; transform: scale(1.04); }
</style>

<script>
  gsap.registerPlugin(ScrollTrigger);

  // アニメーションをGSAPで書かず、CSSのtransitionに任せたい時はこれが一番手軽
  ScrollTrigger.create({
    trigger: ".tc-box",
    start: "top 80%",
    end: "bottom 30%",
    toggleClass: { targets: ".tc-box", className: "is-active" },
  });
<\/script>`,
  },

  {
    key: "st-snap",
    cat: "scrolltrigger",
    label: { ja: "セクションに吸い付く（snap）", en: "Snap to sections" },
    scroll: true,
    stage: `<div class="sn-inner">
  <div class="sn-hud">
    <span class="sn-dots">${repeat(3, () => `<i></i>`)}</span>
    <span class="sn-val">0.00</span>
  </div>
  ${repeat(3, (i) => `<section class="sn-sec sn-${i + 1}"><span class="sn-num">0${i + 1}</span></section>`)}
</div>`,
    css: `.fx-st-snap .sn-hud {
  position: sticky; top: 0; z-index: 4; height: 34px;
  display: flex; align-items: center; justify-content: space-between; padding: 0 12px;
  background: rgba(15, 23, 42, 0.86); color: #fff;
}
.fx-st-snap .sn-dots { display: flex; gap: 6px; }
.fx-st-snap .sn-dots i {
  width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.35);
  transition: background 0.2s, transform 0.2s;
}
.fx-st-snap .sn-dots i.is-on { background: #fff; transform: scale(1.35); }
.fx-st-snap .sn-val { font-size: 1rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.fx-st-snap .sn-sec {
  height: 190px; margin-top: -34px; padding-top: 34px;
  display: grid; place-items: center;
}
.fx-st-snap .sn-num { color: #fff; font-size: 2.4rem; font-weight: 700; }
.fx-st-snap .sn-1 { background: #6366f1; }
.fx-st-snap .sn-2 { background: #ec4899; }
.fx-st-snap .sn-3 { background: #0f172a; }`,
    mount(stage) {
      const val = stage.querySelector(".sn-val");
      const dots = stage.querySelectorAll(".sn-dots i");

      const render = (progress) => {
        val.textContent = progress.toFixed(2);
        const current = Math.round(progress * 2);
        dots.forEach((d, i) => d.classList.toggle("is-on", i === current));
      };
      render(0); // onUpdate は初回に呼ばれないので、初期状態を先に描いておく

      // 数値と現在地の表示をスクロール位置に直結させる。
      // 指を離した瞬間に 0.00 / 0.50 / 1.00 のどれかへ跳ぶので、吸着が目で分かる
      ScrollTrigger.create({
        trigger: stage.querySelector(".sn-inner"),
        scroller: stage,
        start: "top top",
        end: "bottom bottom",
        snap: { snapTo: 1 / 2, duration: 0.4, ease: "power2.inOut" },
        onUpdate: (self) => render(self.progress),
      });

      // 各セクションの数字もスクロール連動で動かし、止まっていないことを分かるようにする
      stage.querySelectorAll(".sn-sec").forEach((sec) => {
        gsap.fromTo(
          sec.querySelector(".sn-num"),
          { scale: 0.55, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: sec, scroller: stage, start: "top bottom", end: "center center", scrub: true },
          },
        );
      });
    },
    code: `${CDN_ST}

<section class="sn-sec">01</section>
<section class="sn-sec">02</section>
<section class="sn-sec">03</section>

<script>
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".sn-inner",
    start: "top top",
    end: "bottom bottom",
    // snapTo は「進捗のどの間隔で止めるか」。3セクションなら 1/2（区切りは2つ）
    snap: { snapTo: 1 / 2, duration: 0.4, ease: "power2.inOut" },
  });
<\/script>`,
  },
];
