// テキスト・数値。有料の SplitText / ScrambleText を使わず、素のJSで同じ表現を作る。
import { CDN } from "./_shared.js?v=20260811a";

/** 文字列を1文字ずつ span に分解する（半角スペースは &nbsp; で潰さない） */
const splitChars = (el, text) => {
  el.innerHTML = [...text].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
  return el.querySelectorAll("span");
};

export const TEXT = [
  {
    key: "tx-chars",
    cat: "text",
    label: { ja: "1文字ずつ立ち上がる", en: "Reveal char by char" },
    stage: `<div class="tx" data-text="ANIMATION"></div>`,
    css: `.fx-tx-chars .tx { display: flex; gap: 2px; font-size: 1.7rem; font-weight: 700; color: #0f172a; }
.fx-tx-chars .tx span { display: inline-block; }
.fx-tx-chars .tx span:nth-child(3n) { color: #6366f1; }
.fx-tx-chars .tx span:nth-child(3n+1) { color: #ec4899; }`,
    mount(stage) {
      const el = stage.querySelector(".tx");
      const chars = splitChars(el, el.dataset.text);
      gsap.from(chars, { y: 40, opacity: 0, rotateX: -90, duration: 0.7, ease: "back.out(1.7)", stagger: 0.05 });
    },
    code: `${CDN}

<h2 class="tx">ANIMATION</h2>

<style>
.tx span { display: inline-block; }   /* transform を効かせるために必須 */
</style>

<script>
  // 1文字ずつ span に分解する（有料プラグイン SplitText なしでOK）
  const el = document.querySelector(".tx");
  el.innerHTML = [...el.textContent]
    .map((c) => \`<span>\${c === " " ? "&nbsp;" : c}</span>\`)
    .join("");

  gsap.from(el.querySelectorAll("span"), {
    y: 40, opacity: 0, rotateX: -90,
    duration: 0.7, ease: "back.out(1.7)",
    stagger: 0.05,
  });
<\/script>`,
  },

  {
    key: "tx-words",
    cat: "text",
    label: { ja: "単語ずつフェードイン", en: "Fade in word by word" },
    stage: `<p class="wd" data-text="小さな動きが 読み心地を 大きく変える"></p>`,
    css: `.fx-tx-words .wd { padding: 0 22px; text-align: center; font-size: 1.2rem; font-weight: 700; line-height: 1.8; color: #0f172a; }
.fx-tx-words .wd span { display: inline-block; margin-right: 0.4em; }`,
    mount(stage) {
      const el = stage.querySelector(".wd");
      el.innerHTML = el.dataset.text
        .split(" ")
        .map((w) => `<span>${w}</span>`)
        .join("");
      gsap.from(el.querySelectorAll("span"), {
        y: 24,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
      });
    },
    code: `${CDN}

<p class="wd">小さな動きが 読み心地を 大きく変える</p>

<style>
.wd span { display: inline-block; margin-right: 0.4em; }
</style>

<script>
  const el = document.querySelector(".wd");
  // 単語単位なら分解が軽く、日本語でも読みやすさを保てる
  el.innerHTML = el.textContent.split(" ").map((w) => \`<span>\${w}</span>\`).join("");

  gsap.from(el.querySelectorAll("span"), {
    y: 24, opacity: 0, filter: "blur(6px)",
    duration: 0.7, ease: "power2.out", stagger: 0.12,
  });
<\/script>`,
  },

  {
    key: "tx-typewriter",
    cat: "text",
    label: { ja: "タイプライター", en: "Typewriter" },
    stage: `<div class="tw"><span class="tw-out"></span><span class="tw-caret"></span></div>`,
    css: `.fx-tx-typewriter .tw { font-family: Consolas, Menlo, monospace; font-size: 1.15rem; color: #0f172a; display: flex; align-items: center; }
.fx-tx-typewriter .tw-caret { display: inline-block; width: 10px; height: 1.2em; margin-left: 3px; background: #6366f1; }`,
    mount(stage) {
      const out = stage.querySelector(".tw-out");
      const full = "gsap.to(el, { x: 100 });";
      const state = { n: 0 };

      gsap.to(state, {
        n: full.length,
        duration: 2.2,
        ease: "none",
        snap: { n: 1 },
        onUpdate: () => {
          out.textContent = full.slice(0, state.n);
        },
      });
      gsap.to(stage.querySelector(".tw-caret"), { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
    },
    code: `${CDN}

<span class="tw-out"></span><span class="tw-caret"></span>

<script>
  const out = document.querySelector(".tw-out");
  const full = "gsap.to(el, { x: 100 });";
  const state = { n: 0 };

  gsap.to(state, {
    n: full.length,
    duration: 2.2,
    ease: "none",
    snap: { n: 1 },     // 文字数は整数でないと1文字が半分だけ出る
    onUpdate: () => { out.textContent = full.slice(0, state.n); },
  });

  // カーソルの点滅は steps(1) で「パッと切り替わる」動きにする
  gsap.to(".tw-caret", { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
<\/script>`,
  },

  {
    key: "tx-wave",
    cat: "text",
    label: { ja: "波打つ文字", en: "Wavy text" },
    stage: `<div class="wv" data-text="WAVE TEXT"></div>`,
    css: `.fx-tx-wave .wv { display: flex; font-size: 1.6rem; font-weight: 700; color: #6366f1; }
.fx-tx-wave .wv span { display: inline-block; }`,
    mount(stage) {
      const el = stage.querySelector(".wv");
      const chars = splitChars(el, el.dataset.text);
      gsap.to(chars, {
        y: -16,
        duration: 0.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.07, repeat: -1, yoyo: true },
      });
    },
    code: `${CDN}

<div class="wv">WAVE TEXT</div>

<style>
.wv span { display: inline-block; }
</style>

<script>
  gsap.to(".wv span", {
    y: -16,
    duration: 0.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.07, repeat: -1, yoyo: true },   // stagger 側にも repeat を書くと波が途切れない
  });
<\/script>`,
  },

  {
    key: "tx-mask-lines",
    cat: "text",
    label: { ja: "行マスクでせり上がる", en: "Line mask reveal" },
    stage: `<div class="ml">
  <div class="ml-mask"><span>コピペで試せる</span></div>
  <div class="ml-mask"><span>GSAPサンプル集</span></div>
  <div class="ml-mask"><span>CodeQuest.work</span></div>
</div>`,
    css: `.fx-tx-mask-lines .ml { padding: 0 22px; }
.fx-tx-mask-lines .ml-mask { overflow: hidden; }
.fx-tx-mask-lines .ml-mask span { display: inline-block; font-size: 1.25rem; font-weight: 700; line-height: 1.5; color: #0f172a; }
.fx-tx-mask-lines .ml-mask:nth-child(2) span { color: #6366f1; }`,
    mount(stage) {
      gsap.from(stage.querySelectorAll(".ml-mask span"), {
        yPercent: 115,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.12,
      });
    },
    code: `${CDN}

<div class="ml-mask"><span>コピペで試せる</span></div>
<div class="ml-mask"><span>GSAPサンプル集</span></div>

<style>
/* 親で刈り取り、子を下から押し上げる。行単位の登場演出の定番 */
.ml-mask { overflow: hidden; }
.ml-mask span { display: inline-block; }
</style>

<script>
  gsap.from(".ml-mask span", {
    yPercent: 115,      // 100より少し大きくすると下端が見切れない
    duration: 0.9, ease: "power4.out", stagger: 0.12,
  });
<\/script>`,
  },

  {
    key: "tx-scramble",
    cat: "text",
    label: { ja: "文字がシャッフルして揃う", en: "Scramble into place" },
    stage: `<div class="sb" data-text="SCRAMBLE"></div>`,
    css: `.fx-tx-scramble .sb { font-family: Consolas, Menlo, monospace; font-size: 1.7rem; font-weight: 700; color: #0f172a; letter-spacing: 0.06em; }`,
    mount(stage) {
      const el = stage.querySelector(".sb");
      const full = el.dataset.text;
      const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
      const state = { n: 0 };

      gsap.to(state, {
        n: full.length,
        duration: 1.8,
        ease: "power1.inOut",
        onUpdate: () => {
          const fixed = Math.floor(state.n);
          const noise = [...full.slice(fixed)].map(() => pool[Math.floor(Math.random() * pool.length)]).join("");
          el.textContent = full.slice(0, fixed) + noise;
        },
        onComplete: () => {
          el.textContent = full;
        },
      });
    },
    code: `${CDN}

<div class="sb">SCRAMBLE</div>

<style>
.sb { font-family: Consolas, Menlo, monospace; }  /* 等幅にすると幅が暴れない */
</style>

<script>
  // 有料の ScrambleTextPlugin と同等の表現を、確定した文字数をトゥイーンして作る
  const el = document.querySelector(".sb");
  const full = el.textContent;
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
  const state = { n: 0 };

  gsap.to(state, {
    n: full.length,
    duration: 1.8,
    ease: "power1.inOut",
    onUpdate: () => {
      const fixed = Math.floor(state.n);
      const noise = [...full.slice(fixed)]
        .map(() => pool[Math.floor(Math.random() * pool.length)]).join("");
      el.textContent = full.slice(0, fixed) + noise;
    },
    onComplete: () => { el.textContent = full; },
  });
<\/script>`,
  },

  {
    key: "tx-counter",
    cat: "text",
    label: { ja: "数字カウントアップ", en: "Number count up" },
    stage: `<div class="ct-wrap">
  <div class="ct-num">0</div>
  <div class="ct-cap">月間ページビュー</div>
</div>`,
    css: `.fx-tx-counter .ct-wrap { text-align: center; }
.fx-tx-counter .ct-num { font-size: 2.6rem; font-weight: 700; color: #6366f1; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.fx-tx-counter .ct-cap { color: #64748b; font-size: 1rem; }`,
    mount(stage) {
      const el = stage.querySelector(".ct-num");
      const obj = { v: 0 };
      gsap.to(obj, {
        v: 128400,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString();
        },
      });
    },
    code: `${CDN}

<div class="ct-num">0</div>

<style>
/* 桁が動いても幅がガタつかないようにする */
.ct-num { font-variant-numeric: tabular-nums; }
</style>

<script>
  const el = document.querySelector(".ct-num");
  const obj = { v: 0 };   // ただの箱をトゥイーンして、その値を表示に反映する

  gsap.to(obj, {
    v: 128400,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
  });
<\/script>`,
  },

  {
    key: "tx-gradient",
    cat: "text",
    label: { ja: "グラデーションが流れる見出し", en: "Sweeping gradient heading" },
    stage: `<h4 class="gr">GRADIENT</h4>`,
    css: `.fx-tx-gradient .gr {
  font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
  background: linear-gradient(90deg, #6366f1, #ec4899, #6366f1);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}`,
    mount(stage) {
      gsap.to(stage.querySelector(".gr"), {
        backgroundPosition: "-200% 0",
        duration: 2.4,
        ease: "none",
        repeat: -1,
      });
    },
    code: `${CDN}

<h2 class="gr">GRADIENT</h2>

<style>
.gr {
  background: linear-gradient(90deg, #6366f1, #ec4899, #6366f1);
  background-size: 200% 100%;             /* 動かす分だけ横に伸ばしておく */
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
</style>

<script>
  // 文字に切り抜いた背景の位置をずらすことで、色が流れて見える
  gsap.to(".gr", {
    backgroundPosition: "-200% 0",
    duration: 2.4, ease: "none", repeat: -1,
  });
<\/script>`,
  },

  {
    key: "tx-blur-chars",
    cat: "text",
    label: { ja: "1文字ずつぼけて現れる", en: "Blur in per character" },
    stage: `<div class="bc2" data-text="SMOOTH"></div>`,
    css: `.fx-tx-blur-chars .bc2 { display: flex; gap: 3px; font-size: 1.9rem; font-weight: 700; color: #0f172a; }
.fx-tx-blur-chars .bc2 span { display: inline-block; }`,
    mount(stage) {
      const el = stage.querySelector(".bc2");
      const chars = splitChars(el, el.dataset.text);
      gsap.from(chars, {
        filter: "blur(12px)",
        opacity: 0,
        scale: 1.4,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.07,
      });
    },
    code: `${CDN}

<h2 class="bc2">SMOOTH</h2>

<style>
.bc2 span { display: inline-block; }
</style>

<script>
  const el = document.querySelector(".bc2");
  el.innerHTML = [...el.textContent].map((c) => \`<span>\${c}</span>\`).join("");

  gsap.from(el.querySelectorAll("span"), {
    filter: "blur(12px)", opacity: 0, scale: 1.4,
    duration: 0.8, ease: "power2.out", stagger: 0.07,
  });
<\/script>`,
  },

  {
    key: "tx-rotate-words",
    cat: "text",
    label: { ja: "単語が入れ替わり続ける", en: "Rotating words" },
    stage: `<div class="rw">
  <span class="rw-fixed">GSAPは</span>
  <span class="rw-slot">
    <span class="rw-word">速い</span>
    <span class="rw-word">軽い</span>
    <span class="rw-word">正確</span>
  </span>
</div>`,
    css: `.fx-tx-rotate-words .rw { display: flex; align-items: center; gap: 8px; font-size: 1.4rem; font-weight: 700; color: #0f172a; }
.fx-tx-rotate-words .rw-slot { position: relative; display: inline-block; width: 4.5em; height: 1.6em; overflow: hidden; }
.fx-tx-rotate-words .rw-word { position: absolute; inset: 0; color: #6366f1; }`,
    mount(stage) {
      const words = stage.querySelectorAll(".rw-word");
      gsap.set(words, { yPercent: 110 });
      gsap.set(words[0], { yPercent: 0 });

      const tl = gsap.timeline({ repeat: -1 });
      words.forEach((word, i) => {
        const next = words[(i + 1) % words.length];
        tl.to(word, { yPercent: -110, duration: 0.5, ease: "power2.in", delay: 1 }).fromTo(
          next,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, ease: "power2.out" },
          "<",
        );
      });
    },
    code: `${CDN}

<span class="rw-slot">
  <span class="rw-word">速い</span>
  <span class="rw-word">軽い</span>
</span>

<style>
.rw-slot { position: relative; display: inline-block; overflow: hidden; height: 1.6em; }
.rw-word { position: absolute; inset: 0; }
</style>

<script>
  const words = gsap.utils.toArray(".rw-word");
  gsap.set(words, { yPercent: 110 });
  gsap.set(words[0], { yPercent: 0 });

  const tl = gsap.timeline({ repeat: -1 });

  words.forEach((word, i) => {
    const next = words[(i + 1) % words.length];   // 最後は先頭に戻す
    tl.to(word, { yPercent: -110, duration: 0.5, ease: "power2.in", delay: 1 })
      .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: "power2.out" }, "<");
  });
<\/script>`,
  },

  {
    key: "tx-outline-fill",
    cat: "text",
    label: { ja: "輪郭文字が塗りつぶされる", en: "Outline fills in" },
    stage: `<div class="of"><span class="of-base">OUTLINE</span><span class="of-fill">OUTLINE</span></div>`,
    css: `.fx-tx-outline-fill .of { position: relative; font-size: 2rem; font-weight: 900; letter-spacing: 0.02em; }
.fx-tx-outline-fill .of-base {
  color: transparent; -webkit-text-stroke: 2px #6366f1;
}
.fx-tx-outline-fill .of-fill {
  position: absolute; left: 0; top: 0; color: #6366f1;
  clip-path: inset(100% 0 0 0);
}`,
    mount(stage) {
      gsap.fromTo(
        stage.querySelector(".of-fill"),
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power2.inOut", repeat: -1, repeatDelay: 0.8, yoyo: true },
      );
    },
    code: `${CDN}

<div class="of"><span class="of-base">OUTLINE</span><span class="of-fill">OUTLINE</span></div>

<style>
/* 同じ文字を2枚重ね、上の塗り版を clip-path で削っておく */
.of { position: relative; font-weight: 900; }
.of-base { color: transparent; -webkit-text-stroke: 2px #6366f1; }
.of-fill { position: absolute; left: 0; top: 0; color: #6366f1; clip-path: inset(100% 0 0 0); }
</style>

<script>
  gsap.fromTo(".of-fill",
    { clipPath: "inset(100% 0 0 0)" },
    { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power2.inOut", repeat: -1, repeatDelay: 0.8, yoyo: true }
  );
<\/script>`,
  },

  {
    key: "tx-currency",
    cat: "text",
    label: { ja: "金額のカウントアップ", en: "Currency count up" },
    stage: `<div class="cu2">
  <div class="cu2-num">¥0</div>
  <div class="cu2-cap">今月の売上</div>
</div>`,
    css: `.fx-tx-currency .cu2 { text-align: center; }
.fx-tx-currency .cu2-num { font-size: 2.3rem; font-weight: 700; color: #6366f1; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.fx-tx-currency .cu2-cap { color: #64748b; font-size: 1rem; }`,
    mount(stage) {
      const el = stage.querySelector(".cu2-num");
      const fmt = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
      const obj = { v: 0 };

      gsap.to(obj, {
        v: 4820000,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = fmt.format(Math.round(obj.v));
        },
      });
    },
    code: `${CDN}

<div class="cu2-num">¥0</div>

<script>
  // 桁区切りや通貨記号は Intl.NumberFormat に任せると、ロケール違いにも耐える
  const el = document.querySelector(".cu2-num");
  const fmt = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
  const obj = { v: 0 };

  gsap.to(obj, {
    v: 4820000,
    duration: 2.2,
    ease: "power3.out",
    onUpdate: () => { el.textContent = fmt.format(Math.round(obj.v)); },
  });
<\/script>`,
  },

  {
    key: "tx-marquee",
    cat: "text",
    label: { ja: "見出しの無限マーキー", en: "Endless heading marquee" },
    stage: `<div class="tm"><div class="tm-track">
  <span class="tm-set">COPY &amp; PASTE ・ GSAP ・</span>
  <span class="tm-set">COPY &amp; PASTE ・ GSAP ・</span>
</div></div>`,
    css: `.fx-tx-marquee .tm { width: 100%; overflow: hidden; }
.fx-tx-marquee .tm-track { display: flex; width: max-content; }
.fx-tx-marquee .tm-set {
  padding-right: 16px; white-space: nowrap;
  font-size: 1.9rem; font-weight: 900; letter-spacing: -0.02em;
  color: transparent; -webkit-text-stroke: 1.5px #6366f1;
}
.fx-tx-marquee .tm-set:nth-child(2n) { -webkit-text-stroke-color: #ec4899; }`,
    mount(stage) {
      const set = stage.querySelector(".tm-set");
      gsap.to(stage.querySelector(".tm-track"), {
        x: -set.offsetWidth,
        duration: 7,
        ease: "none",
        repeat: -1,
      });
    },
    code: `${CDN}

<div class="tm"><div class="tm-track">
  <span class="tm-set">COPY &amp; PASTE ・ GSAP ・</span>
  <span class="tm-set">COPY &amp; PASTE ・ GSAP ・</span>
</div></div>

<style>
.tm { overflow: hidden; }
.tm-track { display: flex; width: max-content; }
.tm-set { white-space: nowrap; color: transparent; -webkit-text-stroke: 1.5px #6366f1; }
</style>

<script>
  // 同じ内容を2つ並べ、1セット分ちょうど動かして戻す＝継ぎ目が見えない
  const set = document.querySelector(".tm-set");
  gsap.to(".tm-track", { x: -set.offsetWidth, duration: 7, ease: "none", repeat: -1 });
<\/script>`,
  },

  {
    key: "tx-glitch",
    cat: "text",
    label: { ja: "グリッチする文字", en: "Glitch text" },
    stage: `<div class="gl">
  <span class="gl-layer gl-r">GLITCH</span>
  <span class="gl-layer gl-b">GLITCH</span>
  <span class="gl-layer gl-main">GLITCH</span>
</div>`,
    css: `.fx-tx-glitch .gl { position: relative; font-size: 2rem; font-weight: 900; letter-spacing: 0.04em; }
.fx-tx-glitch .gl-layer { display: block; }
.fx-tx-glitch .gl-main { color: #0f172a; }
.fx-tx-glitch .gl-r, .fx-tx-glitch .gl-b { position: absolute; left: 0; top: 0; }
.fx-tx-glitch .gl-r { color: #ec4899; }
.fx-tx-glitch .gl-b { color: #6366f1; }`,
    mount(stage) {
      const jolt = (el, sign) =>
        gsap.to(el, {
          x: () => gsap.utils.random(-5, 5) * sign,
          y: () => gsap.utils.random(-3, 3),
          duration: 0.09,
          ease: "steps(1)",
          repeat: -1,
          repeatRefresh: true,
        });

      jolt(stage.querySelector(".gl-r"), 1);
      jolt(stage.querySelector(".gl-b"), -1);
      gsap.to(stage.querySelector(".gl-main"), {
        opacity: 0.75,
        duration: 0.07,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
        repeatDelay: 0.5,
      });
    },
    code: `${CDN}

<div class="gl">
  <span class="gl-layer gl-r">GLITCH</span>
  <span class="gl-layer gl-b">GLITCH</span>
  <span class="gl-layer gl-main">GLITCH</span>
</div>

<style>
/* 同じ文字を3枚重ね、色ズレした2枚だけを揺らす */
.gl { position: relative; }
.gl-r, .gl-b { position: absolute; left: 0; top: 0; }
.gl-r { color: #ec4899; } .gl-b { color: #6366f1; }
</style>

<script>
  const jolt = (sel, sign) => gsap.to(sel, {
    x: () => gsap.utils.random(-5, 5) * sign,
    y: () => gsap.utils.random(-3, 3),
    duration: 0.09,
    ease: "steps(1)",
    repeat: -1,
    repeatRefresh: true,   // 繰り返しのたびに関数を再評価する＝毎回違う乱数になる
  });

  jolt(".gl-r", 1);
  jolt(".gl-b", -1);
<\/script>`,
  },
];
