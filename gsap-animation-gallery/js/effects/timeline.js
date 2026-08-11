// タイムライン（順次再生・位置指定・入れ子・再生制御）
import { CDN } from "./_shared.js?v=20260811a";

export const TIMELINE = [
  {
    key: "tl-sequence",
    cat: "timeline",
    label: { ja: "順次再生（重ねて繋ぐ）", en: "Sequence with overlap" },
    stage: `<div class="tl-card">
  <div class="tl-thumb"></div>
  <div class="tl-title">Timeline</div>
  <div class="tl-text">要素を少し重ねて再生</div>
  <div class="tl-btn">詳しく見る</div>
</div>`,
    css: `.fx-tl-sequence .tl-card {
  width: 210px; background: #fff; border-radius: 14px;
  border: 1px solid #e2e8f0; padding: 14px; text-align: center;
}
.fx-tl-sequence .tl-thumb { height: 52px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #ec4899); }
.fx-tl-sequence .tl-title { margin-top: 10px; font-weight: 700; }
.fx-tl-sequence .tl-text { font-size: 1rem; color: #64748b; line-height: 1.4; }
.fx-tl-sequence .tl-btn {
  margin-top: 10px; background: #6366f1; color: #fff;
  border-radius: 8px; padding: 6px; font-size: 1rem; font-weight: 700;
}`,
    mount(stage) {
      const q = (s) => stage.querySelector(s);
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.6 } })
        .from(q(".tl-thumb"), { scaleY: 0, transformOrigin: "top center" })
        .from(q(".tl-title"), { y: 20, opacity: 0 }, "-=0.3")
        .from(q(".tl-text"), { y: 20, opacity: 0 }, "-=0.45")
        .from(q(".tl-btn"), { scale: 0.6, opacity: 0, ease: "back.out(2)" }, "-=0.3");
    },
    code: `${CDN}

<div class="tl-card">
  <div class="tl-thumb"></div>
  <div class="tl-title">Timeline</div>
  <div class="tl-text">要素を少し重ねて再生</div>
  <div class="tl-btn">詳しく見る</div>
</div>

<script>
  // timeline は「順番に並べる箱」。第3引数の位置指定で重ね方を調整する
  const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.6 } });

  tl.from(".tl-thumb", { scaleY: 0, transformOrigin: "top center" })
    .from(".tl-title", { y: 20, opacity: 0 }, "-=0.3")    // 0.3秒前倒しで重ねる
    .from(".tl-text",  { y: 20, opacity: 0 }, "-=0.45")
    .from(".tl-btn",   { scale: 0.6, opacity: 0, ease: "back.out(2)" }, "-=0.3");
<\/script>`,
  },

  {
    key: "tl-labels",
    cat: "timeline",
    label: { ja: "ラベルで位置を揃える", en: "Align with labels" },
    stage: `<div class="lb-wrap">
  <div class="lb-bar lb-a">A</div>
  <div class="lb-bar lb-b">B</div>
  <div class="lb-bar lb-c">C（Bと同時）</div>
</div>`,
    css: `.fx-tl-labels .lb-wrap { width: 100%; padding: 0 20px; display: grid; gap: 10px; }
.fx-tl-labels .lb-bar { padding: 10px 16px; border-radius: 9px; color: #fff; font-weight: 700; }
.fx-tl-labels .lb-a { background: #0f172a; }
.fx-tl-labels .lb-b { background: #6366f1; }
.fx-tl-labels .lb-c { background: #ec4899; }`,
    mount(stage) {
      const q = (s) => stage.querySelector(s);
      gsap
        .timeline({ defaults: { duration: 0.6, ease: "power2.out" } })
        .from(q(".lb-a"), { x: -60, opacity: 0 })
        .addLabel("together")
        .from(q(".lb-b"), { x: -60, opacity: 0 }, "together")
        .from(q(".lb-c"), { x: 60, opacity: 0 }, "together");
    },
    code: `${CDN}

<script>
  const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });

  tl.from(".lb-a", { x: -60, opacity: 0 })
    .addLabel("together")                          // この時点に名前を付ける
    .from(".lb-b", { x: -60, opacity: 0 }, "together")  // ラベル位置から開始
    .from(".lb-c", { x: 60,  opacity: 0 }, "together"); // Bと完全に同時

  // 位置指定の書き方: "together" / "together+=0.2" / "<"(直前と同時) / ">"(直前の直後)
<\/script>`,
  },

  {
    key: "tl-hero",
    cat: "timeline",
    label: { ja: "ヒーローの登場演出", en: "Hero intro" },
    stage: `<div class="hero">
  <span class="hero-tag">CodeQuest.work</span>
  <h4 class="hero-h">GSAPで動きをつける</h4>
  <p class="hero-p">コピペで試せるサンプル集</p>
  <div class="hero-cta">はじめる</div>
</div>`,
    css: `.fx-tl-hero .hero { text-align: center; padding: 0 18px; }
.fx-tl-hero .hero-tag {
  display: inline-block; background: #eef2ff; color: #4338ca;
  border-radius: 999px; padding: 2px 12px; font-size: 1rem;
}
.fx-tl-hero .hero-h { margin-top: 8px; font-size: 1.25rem; letter-spacing: -0.02em; }
.fx-tl-hero .hero-p { color: #64748b; font-size: 1rem; }
.fx-tl-hero .hero-cta {
  display: inline-block; margin-top: 10px; background: #6366f1; color: #fff;
  padding: 8px 22px; border-radius: 999px; font-weight: 700; font-size: 1rem;
}`,
    mount(stage) {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(stage.querySelector(".hero-tag"), { y: -16, opacity: 0, duration: 0.5 })
        .from(stage.querySelector(".hero-h"), { y: 28, opacity: 0, duration: 0.7 }, "<0.15")
        .from(stage.querySelector(".hero-p"), { y: 20, opacity: 0, duration: 0.7 }, "<0.15")
        .from(stage.querySelector(".hero-cta"), { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "<0.2");
    },
    code: `${CDN}

<script>
  // "<" は「直前のトゥイーンと同じ時刻」。"<0.15" で0.15秒だけ遅らせて重ねる
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero-tag", { y: -16, opacity: 0, duration: 0.5 })
    .from(".hero-h",   { y: 28,  opacity: 0, duration: 0.7 }, "<0.15")
    .from(".hero-p",   { y: 20,  opacity: 0, duration: 0.7 }, "<0.15")
    .from(".hero-cta", { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "<0.2");
<\/script>`,
  },

  {
    key: "tl-loop",
    cat: "timeline",
    label: { ja: "ループするタイムライン", en: "Looping timeline" },
    stage: `<div class="lp-track"><div class="lp-dot"></div></div>`,
    css: `.fx-tl-loop .lp-track {
  position: relative; width: 150px; height: 150px;
  border: 2px dashed #cbd5e1; border-radius: 50%;
}
.fx-tl-loop .lp-dot {
  position: absolute; top: -11px; left: 50%; margin-left: -11px;
  width: 22px; height: 22px; border-radius: 50%; background: #ec4899;
}`,
    mount(stage) {
      gsap
        .timeline({ repeat: -1, defaults: { duration: 1, ease: "none" } })
        .to(stage.querySelector(".lp-track"), { rotation: 360, transformOrigin: "center center", duration: 3 })
        .to(stage.querySelector(".lp-dot"), { scale: 1.6, duration: 0.75, yoyo: true, repeat: 3, ease: "power1.inOut" }, 0);
    },
    code: `${CDN}

<script>
  // timeline 側に repeat: -1 を書けば、中身をまとめて無限ループできる
  gsap.timeline({ repeat: -1 })
    .to(".lp-track", { rotation: 360, duration: 3, ease: "none", transformOrigin: "center center" })
    .to(".lp-dot", { scale: 1.6, duration: 0.75, yoyo: true, repeat: 3 }, 0); // 0 = 先頭から同時
<\/script>`,
  },

  {
    key: "tl-control",
    cat: "timeline",
    label: { ja: "再生・一時停止・逆再生", en: "Play / pause / reverse" },
    stage: `<div class="ctl">
  <div class="ctl-box">▦</div>
  <div class="ctl-btns">
    <button type="button" data-act="play">▶</button>
    <button type="button" data-act="pause">❚❚</button>
    <button type="button" data-act="reverse">◀</button>
    <button type="button" data-act="restart">↺</button>
  </div>
</div>`,
    css: `.fx-tl-control .ctl { text-align: center; }
.fx-tl-control .ctl-box {
  width: 76px; height: 76px; margin: 0 auto; border-radius: 16px;
  background: #6366f1; color: #fff; display: grid; place-items: center; font-size: 1.6rem;
}
.fx-tl-control .ctl-btns { margin-top: 16px; display: flex; gap: 8px; justify-content: center; }
.fx-tl-control .ctl-btns button {
  border: 1px solid #cbd5e1; background: #fff; border-radius: 8px;
  padding: 6px 12px; font-size: 1rem; cursor: pointer; font-family: inherit;
}
.fx-tl-control .ctl-btns button:hover { background: #f1f5f9; }`,
    mount(stage) {
      const tl = gsap
        .timeline({ paused: true, defaults: { duration: 0.7, ease: "power2.inOut" } })
        .to(stage.querySelector(".ctl-box"), { x: 70, rotation: 180 })
        .to(stage.querySelector(".ctl-box"), { x: -70, borderRadius: "50%" })
        .to(stage.querySelector(".ctl-box"), { x: 0, rotation: 360, borderRadius: "16px" });

      stage.querySelectorAll(".ctl-btns button").forEach((btn) => {
        btn.addEventListener("click", () => tl[btn.dataset.act]());
      });
      tl.play();
    },
    code: `${CDN}

<button data-act="play">▶</button>
<button data-act="pause">❚❚</button>
<button data-act="reverse">◀</button>

<script>
  // paused: true で作っておき、あとから好きなタイミングで操作する
  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.7 } })
    .to(".ctl-box", { x: 70, rotation: 180 })
    .to(".ctl-box", { x: -70, borderRadius: "50%" })
    .to(".ctl-box", { x: 0, rotation: 360, borderRadius: "16px" });

  // tl.play() / tl.pause() / tl.reverse() / tl.restart() / tl.seek(1.2)
  document.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => tl[btn.dataset.act]());
  });
<\/script>`,
  },

  {
    key: "tl-nested",
    cat: "timeline",
    label: { ja: "タイムラインの入れ子", en: "Nested timelines" },
    stage: `<div class="ns-wrap">
  <div class="ns-group ns-g1"><span></span><span></span><span></span></div>
  <div class="ns-group ns-g2"><span></span><span></span><span></span></div>
</div>`,
    css: `.fx-tl-nested .ns-wrap { display: grid; gap: 16px; }
.fx-tl-nested .ns-group { display: flex; gap: 10px; justify-content: center; }
.fx-tl-nested .ns-group span { width: 34px; height: 34px; border-radius: 9px; }
.fx-tl-nested .ns-g1 span { background: #6366f1; }
.fx-tl-nested .ns-g2 span { background: #ec4899; }`,
    mount(stage) {
      const makeGroup = (sel) =>
        gsap.timeline().from(stage.querySelectorAll(`${sel} span`), {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.1,
        });

      gsap.timeline().add(makeGroup(".ns-g1")).add(makeGroup(".ns-g2"), "-=0.2");
    },
    code: `${CDN}

<script>
  // 部品ごとに timeline を関数で作り、親 timeline に add() で組み込む
  const makeGroup = (sel) =>
    gsap.timeline().from(sel + " span", {
      scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.1,
    });

  gsap.timeline()
    .add(makeGroup(".ns-g1"))
    .add(makeGroup(".ns-g2"), "-=0.2");   // 前のグループに少し重ねる
<\/script>`,
  },

  {
    key: "tl-timescale",
    cat: "timeline",
    label: { ja: "速度を変える（timeScale）", en: "Change speed with timeScale" },
    stage: `<div class="ts">
  <div class="ts-bar"><span class="ts-fill"></span></div>
  <div class="ts-btns">
    <button type="button" data-scale="0.4">×0.4</button>
    <button type="button" data-scale="1">×1</button>
    <button type="button" data-scale="2.5">×2.5</button>
  </div>
</div>`,
    css: `.fx-tl-timescale .ts { width: 100%; padding: 0 22px; text-align: center; }
.fx-tl-timescale .ts-bar { height: 16px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.fx-tl-timescale .ts-fill {
  display: block; height: 100%; width: 100%; transform: scaleX(0); transform-origin: left center;
  background: linear-gradient(90deg, #6366f1, #ec4899);
}
.fx-tl-timescale .ts-btns { margin-top: 16px; display: flex; gap: 8px; justify-content: center; }
.fx-tl-timescale .ts-btns button {
  border: 1px solid #cbd5e1; background: #fff; border-radius: 8px;
  padding: 6px 14px; font-size: 1rem; cursor: pointer; font-family: inherit;
}`,
    mount(stage) {
      const tl = gsap.timeline({ repeat: -1 }).fromTo(
        stage.querySelector(".ts-fill"),
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "none" },
      );
      stage.querySelectorAll(".ts-btns button").forEach((btn) => {
        btn.addEventListener("click", () => tl.timeScale(Number(btn.dataset.scale)));
      });
    },
    code: `${CDN}

<script>
  const tl = gsap.timeline({ repeat: -1 })
    .fromTo(".ts-fill", { scaleX: 0 }, { scaleX: 1, duration: 2, ease: "none" });

  // timeScale は再生中でも即座に効く。1が等速、0.5で半分、2で倍速
  tl.timeScale(2.5);

  // gsap.globalTimeline.timeScale(0.2) にすればページ全体をスローにできる（デバッグ用）
<\/script>`,
  },

  {
    key: "tl-hover",
    cat: "timeline",
    label: { ja: "ホバー用タイムライン", en: "Hover-driven timeline" },
    stage: `<div class="hv-card">
  <div class="hv-img"></div>
  <div class="hv-body">
    <div class="hv-t">マウスを乗せる</div>
    <div class="hv-d">離すと巻き戻ります</div>
  </div>
</div>`,
    css: `.fx-tl-hover .hv-card {
  width: 200px; border-radius: 14px; overflow: hidden; cursor: pointer;
  background: #fff; border: 1px solid #e2e8f0;
}
.fx-tl-hover .hv-img { height: 88px; background: linear-gradient(135deg, #6366f1, #ec4899); }
.fx-tl-hover .hv-body { padding: 10px 14px; }
.fx-tl-hover .hv-t { font-weight: 700; font-size: 1rem; }
.fx-tl-hover .hv-d { font-size: 1rem; color: #64748b; opacity: 0; }`,
    mount(stage) {
      const card = stage.querySelector(".hv-card");
      const tl = gsap
        .timeline({ paused: true, defaults: { duration: 0.35, ease: "power2.out" } })
        .to(stage.querySelector(".hv-img"), { scale: 1.12 }, 0)
        .to(stage.querySelector(".hv-d"), { opacity: 1, y: -2 }, 0)
        .to(card, { y: -6, boxShadow: "0 12px 28px rgba(15,23,42,0.16)" }, 0);

      card.addEventListener("pointerenter", () => tl.play());
      card.addEventListener("pointerleave", () => tl.reverse());
    },
    code: `${CDN}

<script>
  // ホバーのたびに新しいトゥイーンを作らず、1本を play/reverse で使い回すのがコツ
  const card = document.querySelector(".hv-card");

  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.35, ease: "power2.out" } })
    .to(".hv-img", { scale: 1.12 }, 0)
    .to(".hv-d", { opacity: 1, y: -2 }, 0)
    .to(card, { y: -6, boxShadow: "0 12px 28px rgba(15,23,42,0.16)" }, 0);

  card.addEventListener("pointerenter", () => tl.play());
  card.addEventListener("pointerleave", () => tl.reverse());
<\/script>`,
  },

  {
    key: "tl-callbacks",
    cat: "timeline",
    label: { ja: "コールバックで状態を拾う", en: "Callbacks while playing" },
    stage: `<div class="cb">
  <div class="cb-box"></div>
  <div class="cb-log">待機中</div>
</div>`,
    css: `.fx-tl-callbacks .cb { text-align: center; }
.fx-tl-callbacks .cb-box { width: 72px; height: 72px; margin: 0 auto; border-radius: 16px; background: #6366f1; }
.fx-tl-callbacks .cb-log {
  margin-top: 14px; font-family: Consolas, Menlo, monospace;
  color: #475569; font-size: 1rem; min-height: 1.7em;
}`,
    mount(stage) {
      const log = stage.querySelector(".cb-log");
      gsap
        .timeline({
          onStart: () => (log.textContent = "onStart"),
          onComplete: () => (log.textContent = "onComplete"),
          onUpdate() {
            if (this.progress() < 0.98) log.textContent = `onUpdate ${Math.round(this.progress() * 100)}%`;
          },
        })
        .to(stage.querySelector(".cb-box"), { x: 80, rotation: 180, duration: 1, ease: "power2.inOut" })
        .to(stage.querySelector(".cb-box"), { x: 0, rotation: 360, duration: 1, ease: "power2.inOut" });
    },
    code: `${CDN}

<script>
  // コールバック内の this はそのタイムライン自身を指す（アロー関数だと this が変わるので注意）
  gsap.timeline({
    onStart: () => console.log("開始"),
    onComplete: () => console.log("完了"),
    onUpdate() {
      console.log(Math.round(this.progress() * 100) + "%");
    },
  })
    .to(".cb-box", { x: 80, rotation: 180, duration: 1 })
    .to(".cb-box", { x: 0, rotation: 360, duration: 1 });
<\/script>`,
  },

  {
    key: "tl-seek",
    cat: "timeline",
    label: { ja: "シークバーで頭出し", en: "Scrub with a seek bar" },
    stage: `<div class="sk2">
  <div class="sk2-box">◆</div>
  <input class="sk2-range" type="range" min="0" max="100" value="0" aria-label="再生位置" />
</div>`,
    css: `.fx-tl-seek .sk2 { width: 100%; padding: 0 22px; text-align: center; }
.fx-tl-seek .sk2-box {
  width: 74px; height: 74px; margin: 0 auto 16px; border-radius: 16px;
  background: #ec4899; color: #fff; display: grid; place-items: center; font-size: 1.7rem;
}
.fx-tl-seek .sk2-range { width: 100%; font-size: 1rem; accent-color: #6366f1; }`,
    mount(stage) {
      const range = stage.querySelector(".sk2-range");
      const tl = gsap
        .timeline({ paused: true })
        .to(stage.querySelector(".sk2-box"), { x: 70, rotation: 180, duration: 1, ease: "none" })
        .to(stage.querySelector(".sk2-box"), { x: -70, scale: 0.6, duration: 1, ease: "none" })
        .to(stage.querySelector(".sk2-box"), { x: 0, scale: 1, rotation: 360, duration: 1, ease: "none" });

      range.addEventListener("input", () => tl.progress(range.value / 100));
    },
    code: `${CDN}

<input class="sk2-range" type="range" min="0" max="100" value="0" />

<script>
  const tl = gsap.timeline({ paused: true })
    .to(".sk2-box", { x: 70, rotation: 180, duration: 1, ease: "none" })
    .to(".sk2-box", { x: -70, scale: 0.6, duration: 1, ease: "none" });

  // progress() は 0〜1。引数なしで呼ぶと現在位置の取得になる
  document.querySelector(".sk2-range").addEventListener("input", (e) => {
    tl.progress(e.target.value / 100);
  });
<\/script>`,
  },

  {
    key: "tl-marquee",
    cat: "timeline",
    label: { ja: "途切れないループ（マーキー）", en: "Seamless marquee loop" },
    stage: `<div class="mq"><div class="mq-track">
  <span class="mq-set">GSAP ・ ScrollTrigger ・ Timeline ・ Stagger ・</span>
  <span class="mq-set">GSAP ・ ScrollTrigger ・ Timeline ・ Stagger ・</span>
</div></div>`,
    css: `.fx-tl-marquee .mq { width: 100%; overflow: hidden; }
.fx-tl-marquee .mq-track { display: flex; width: max-content; }
.fx-tl-marquee .mq-set {
  padding-right: 18px; white-space: nowrap;
  font-size: 1.3rem; font-weight: 700; color: #6366f1; letter-spacing: 0.02em;
}`,
    mount(stage) {
      const set = stage.querySelector(".mq-set");
      gsap.to(stage.querySelector(".mq-track"), {
        x: -set.offsetWidth,
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    },
    code: `${CDN}

<div class="mq"><div class="mq-track">
  <span class="mq-set">GSAP ・ ScrollTrigger ・</span>
  <span class="mq-set">GSAP ・ ScrollTrigger ・</span>
</div></div>

<style>
.mq { overflow: hidden; }
.mq-track { display: flex; width: max-content; }
.mq-set { white-space: nowrap; }
</style>

<script>
  // 同じ内容を2つ並べ、1セット分ちょうど動かして戻す＝継ぎ目が見えない
  const set = document.querySelector(".mq-set");

  gsap.to(".mq-track", {
    x: -set.offsetWidth,
    duration: 8,
    ease: "none",
    repeat: -1,
  });
<\/script>`,
  },

  {
    key: "tl-repeat-delay",
    cat: "timeline",
    label: { ja: "間を置いて繰り返す", en: "Pause between repeats" },
    stage: `<div class="rd">
  <span class="rd-dot"></span>
  <span class="rd-ring"></span>
</div>`,
    css: `.fx-tl-repeat-delay .rd { position: relative; width: 90px; height: 90px; display: grid; place-items: center; }
.fx-tl-repeat-delay .rd-dot { width: 34px; height: 34px; border-radius: 50%; background: #ec4899; }
.fx-tl-repeat-delay .rd-ring {
  position: absolute; inset: 0; border-radius: 50%; border: 3px solid #6366f1; opacity: 0;
}`,
    mount(stage) {
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.1 })
        .to(stage.querySelector(".rd-dot"), { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" })
        .fromTo(
          stage.querySelector(".rd-ring"),
          { scale: 0.5, opacity: 0.9 },
          { scale: 1.35, opacity: 0, duration: 0.9, ease: "power2.out" },
          0,
        );
    },
    code: `${CDN}

<script>
  // repeatDelay を入れると「繰り返しの間に一拍置く」＝しつこさが消える
  gsap.timeline({ repeat: -1, repeatDelay: 1.1 })
    .to(".rd-dot", { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1 })
    .fromTo(".rd-ring",
      { scale: 0.5, opacity: 0.9 },
      { scale: 1.35, opacity: 0, duration: 0.9, ease: "power2.out" },
      0
    );
<\/script>`,
  },
];
