// インタラクション（マウス追従・クリック・開閉）。イベントのたびにトゥイーンを作り直さないのが共通のコツ。
import { CDN, CDN_DRAG, repeat } from "./_shared.js?v=20260811a";

export const INTERACTION = [
  {
    key: "ix-magnetic",
    cat: "interaction",
    label: { ja: "マグネットボタン（追従）", en: "Magnetic button" },
    stage: `<div class="mg-area"><button class="mg-btn" type="button">Hover me</button></div>`,
    css: `.fx-ix-magnetic .mg-area { width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-magnetic .mg-btn {
  border: none; background: #6366f1; color: #fff;
  font-family: inherit; font-size: 1rem; font-weight: 700;
  padding: 14px 30px; border-radius: 999px; cursor: pointer;
}`,
    mount(stage) {
      const btn = stage.querySelector(".mg-btn");
      const area = stage.querySelector(".mg-area");
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });

      area.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.4);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      area.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    },
    code: `${CDN}

<div class="mg-area">
  <button class="mg-btn" type="button">Hover me</button>
</div>

<script>
  const btn = document.querySelector(".mg-btn");
  const area = document.querySelector(".mg-area");

  // quickTo は毎フレーム呼んでも軽い、追従アニメ専用のショートカット
  const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });

  area.addEventListener("pointermove", (e) => {
    const r = btn.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * 0.4);   // 0.4 = 引っ張られる強さ
    yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
  });
  area.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
<\/script>`,
  },

  {
    key: "ix-cursor",
    cat: "interaction",
    label: { ja: "カスタムカーソル追従", en: "Custom cursor follower" },
    stage: `<div class="cu-area">
  <span class="cu-hint">この中でマウスを動かす</span>
  <span class="cu-dot"></span>
  <span class="cu-ring"></span>
</div>`,
    css: `.fx-ix-cursor .cu-area { position: relative; width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; cursor: none; }
.fx-ix-cursor .cu-hint { color: #64748b; font-size: 1rem; pointer-events: none; }
.fx-ix-cursor .cu-dot, .fx-ix-cursor .cu-ring { position: absolute; top: 0; left: 0; border-radius: 50%; pointer-events: none; }
.fx-ix-cursor .cu-dot { width: 10px; height: 10px; margin: -5px 0 0 -5px; background: #ec4899; }
.fx-ix-cursor .cu-ring { width: 40px; height: 40px; margin: -20px 0 0 -20px; border: 2px solid #6366f1; }`,
    mount(stage) {
      const area = stage.querySelector(".cu-area");
      const dot = stage.querySelector(".cu-dot");
      const ring = stage.querySelector(".cu-ring");

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });

      area.addEventListener("pointermove", (e) => {
        const r = area.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        dotX(x);
        dotY(y);
        ringX(x);
        ringY(y);
      });
    },
    code: `${CDN}

<span class="cu-dot"></span>
<span class="cu-ring"></span>

<style>
body { cursor: none; }
.cu-dot, .cu-ring { position: fixed; top: 0; left: 0; border-radius: 50%; pointer-events: none; z-index: 9999; }
</style>

<script>
  // 追従速度に差をつけると、リングが遅れて付いてくる質感が出る
  const dotX  = gsap.quickTo(".cu-dot", "x",  { duration: 0.12, ease: "power2" });
  const dotY  = gsap.quickTo(".cu-dot", "y",  { duration: 0.12, ease: "power2" });
  const ringX = gsap.quickTo(".cu-ring", "x", { duration: 0.55, ease: "power3" });
  const ringY = gsap.quickTo(".cu-ring", "y", { duration: 0.55, ease: "power3" });

  window.addEventListener("pointermove", (e) => {
    dotX(e.clientX);  dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
  });
<\/script>`,
  },

  {
    key: "ix-tilt",
    cat: "interaction",
    label: { ja: "傾くカード（3Dチルト）", en: "3D tilt card" },
    stage: `<div class="tl-scene"><div class="tl-card3">TILT</div></div>`,
    css: `.fx-ix-tilt .tl-scene { perspective: 700px; width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-tilt .tl-card3 {
  width: 170px; height: 118px; border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: #fff; display: grid; place-items: center;
  font-weight: 700; letter-spacing: 0.14em; cursor: pointer;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.18);
}`,
    mount(stage) {
      const scene = stage.querySelector(".tl-scene");
      const card = stage.querySelector(".tl-card3");
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });

      scene.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - (r.top + r.height / 2)) / r.height) * -34);
        ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 34);
      });
      scene.addEventListener("pointerleave", () => {
        rx(0);
        ry(0);
      });
    },
    code: `${CDN}

<div class="tl-scene"><div class="tl-card3">TILT</div></div>

<style>
.tl-scene { perspective: 700px; }   /* 3D回転には親の perspective が必要 */
</style>

<script>
  const scene = document.querySelector(".tl-scene");
  const card = document.querySelector(".tl-card3");

  const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });

  scene.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    // カード中心からのズレを -1〜1 に正規化して、最大34度まで傾ける
    rx(((e.clientY - (r.top + r.height / 2)) / r.height) * -34);
    ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 34);
  });
  scene.addEventListener("pointerleave", () => { rx(0); ry(0); });
<\/script>`,
  },

  {
    key: "ix-ripple",
    cat: "interaction",
    label: { ja: "クリックで波紋", en: "Click ripple" },
    stage: `<button class="rp-btn" type="button">クリックしてみる</button>`,
    css: `.fx-ix-ripple .rp-btn {
  position: relative; overflow: hidden;
  border: none; background: #0f172a; color: #fff;
  font-family: inherit; font-size: 1rem; font-weight: 700;
  padding: 16px 34px; border-radius: 12px; cursor: pointer;
}
.fx-ix-ripple .rp-wave {
  position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
  border-radius: 50%; background: rgba(255, 255, 255, 0.55); pointer-events: none;
}`,
    mount(stage) {
      const btn = stage.querySelector(".rp-btn");
      btn.addEventListener("click", (e) => {
        const r = btn.getBoundingClientRect();
        const wave = document.createElement("span");
        wave.className = "rp-wave";
        wave.style.left = `${e.clientX - r.left}px`;
        wave.style.top = `${e.clientY - r.top}px`;
        btn.appendChild(wave);

        gsap.to(wave, {
          scale: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => wave.remove(),
        });
      });
    },
    code: `${CDN}

<button class="rp-btn" type="button">クリックしてみる</button>

<style>
.rp-btn { position: relative; overflow: hidden; }
.rp-wave { position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
           border-radius: 50%; background: rgba(255,255,255,0.55); pointer-events: none; }
</style>

<script>
  const btn = document.querySelector(".rp-btn");

  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const wave = document.createElement("span");
    wave.className = "rp-wave";
    wave.style.left = (e.clientX - r.left) + "px";   // クリックした位置から広がる
    wave.style.top  = (e.clientY - r.top) + "px";
    btn.appendChild(wave);

    // 使い終わった要素は onComplete で必ず削除する（放置するとDOMが増え続ける）
    gsap.to(wave, { scale: 26, opacity: 0, duration: 0.7, ease: "power2.out",
                    onComplete: () => wave.remove() });
  });
<\/script>`,
  },

  {
    key: "ix-drag",
    cat: "interaction",
    label: { ja: "ドラッグで動かす（Draggable）", en: "Draggable with inertia" },
    stage: `<div class="dg-area">
  <div class="dg-item">DRAG</div>
  <span class="dg-hint">つかんで動かせます</span>
</div>`,
    css: `.fx-ix-drag .dg-area { position: relative; width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-drag .dg-item {
  width: 92px; height: 92px; border-radius: 20px;
  background: #6366f1; color: #fff; display: grid; place-items: center;
  font-weight: 700; cursor: grab; touch-action: none;
}
.fx-ix-drag .dg-item:active { cursor: grabbing; }
.fx-ix-drag .dg-hint { position: absolute; bottom: 10px; color: #94a3b8; font-size: 1rem; }`,
    mount(stage) {
      Draggable.create(stage.querySelector(".dg-item"), {
        type: "x,y",
        bounds: stage.querySelector(".dg-area"),
        onPress() {
          gsap.to(this.target, { scale: 1.1, duration: 0.2 });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.3, ease: "back.out(2)" });
        },
      });
    },
    code: `${CDN_DRAG}

<div class="dg-area"><div class="dg-item">DRAG</div></div>

<style>
.dg-item { cursor: grab; touch-action: none; }   /* スマホでスクロールに奪われないように */
</style>

<script>
  gsap.registerPlugin(Draggable);

  Draggable.create(".dg-item", {
    type: "x,y",
    bounds: ".dg-area",          // 親からはみ出さないように制限する
    onPress()   { gsap.to(this.target, { scale: 1.1, duration: 0.2 }); },
    onRelease() { gsap.to(this.target, { scale: 1, duration: 0.3, ease: "back.out(2)" }); },
  });
<\/script>`,
  },

  {
    key: "ix-accordion",
    cat: "interaction",
    label: { ja: "アコーディオン開閉", en: "Accordion open/close" },
    stage: `<div class="ac-list">
  ${repeat(3, (i) => `<div class="ac-item">
    <button class="ac-head" type="button">質問 ${i + 1}<span class="ac-mark">＋</span></button>
    <div class="ac-body"><p>高さを直接アニメーションさせず、autoの実寸を測ってから動かします。</p></div>
  </div>`)}
</div>`,
    css: `.fx-ix-accordion .ac-list { width: 100%; padding: 0 18px; display: grid; gap: 8px; }
.fx-ix-accordion .ac-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
.fx-ix-accordion .ac-head {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  border: none; background: none; font-family: inherit; font-size: 1rem; font-weight: 700;
  padding: 10px 14px; cursor: pointer; color: #0f172a;
}
.fx-ix-accordion .ac-mark { color: #6366f1; }
.fx-ix-accordion .ac-body { height: 0; overflow: hidden; }
.fx-ix-accordion .ac-body p { padding: 0 14px 12px; font-size: 1rem; color: #64748b; line-height: 1.5; }`,
    mount(stage) {
      stage.querySelectorAll(".ac-item").forEach((item) => {
        const body = item.querySelector(".ac-body");
        const mark = item.querySelector(".ac-mark");
        let open = false;

        item.querySelector(".ac-head").addEventListener("click", () => {
          open = !open;
          gsap.to(body, { height: open ? "auto" : 0, duration: 0.4, ease: "power2.inOut" });
          gsap.to(mark, { rotation: open ? 135 : 0, duration: 0.4, ease: "power2.inOut" });
        });
      });
    },
    code: `${CDN}

<div class="ac-item">
  <button class="ac-head" type="button">質問<span class="ac-mark">＋</span></button>
  <div class="ac-body"><p>本文</p></div>
</div>

<style>
.ac-body { height: 0; overflow: hidden; }
</style>

<script>
  document.querySelectorAll(".ac-item").forEach((item) => {
    const body = item.querySelector(".ac-body");
    let open = false;

    item.querySelector(".ac-head").addEventListener("click", () => {
      open = !open;
      // GSAPは height: "auto" を扱える（実寸を測ってから数値でアニメーションしてくれる）
      gsap.to(body, { height: open ? "auto" : 0, duration: 0.4, ease: "power2.inOut" });
      gsap.to(item.querySelector(".ac-mark"), { rotation: open ? 135 : 0, duration: 0.4 });
    });
  });
<\/script>`,
  },

  {
    key: "ix-modal",
    cat: "interaction",
    label: { ja: "モーダルの出入り", en: "Modal enter/leave" },
    stage: `<div class="md-area">
  <button class="md-open" type="button">モーダルを開く</button>
  <div class="md-overlay">
    <div class="md-panel">
      <p>閉じる時は reverse() で<br />同じ動きを巻き戻します</p>
      <button class="md-close" type="button">閉じる</button>
    </div>
  </div>
</div>`,
    css: `.fx-ix-modal .md-area { position: relative; width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-modal .md-open, .fx-ix-modal .md-close {
  border: none; background: #6366f1; color: #fff; font-family: inherit;
  font-size: 1rem; font-weight: 700; padding: 10px 22px; border-radius: 9px; cursor: pointer;
}
.fx-ix-modal .md-overlay {
  position: absolute; inset: 0; display: grid; place-items: center;
  background: rgba(15, 23, 42, 0.55); opacity: 0; visibility: hidden;
}
.fx-ix-modal .md-panel {
  background: #fff; border-radius: 14px; padding: 18px; text-align: center;
  width: 78%; font-size: 1rem; color: #475569; line-height: 1.5;
}
.fx-ix-modal .md-panel .md-close { margin-top: 12px; background: #0f172a; }`,
    mount(stage) {
      const overlay = stage.querySelector(".md-overlay");
      const tl = gsap
        .timeline({ paused: true })
        .set(overlay, { visibility: "visible" })
        .to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" })
        .from(stage.querySelector(".md-panel"), { y: 24, scale: 0.94, duration: 0.35, ease: "back.out(1.5)" }, "<");

      stage.querySelector(".md-open").addEventListener("click", () => tl.play());
      stage.querySelector(".md-close").addEventListener("click", () => tl.reverse());
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) tl.reverse();
      });
    },
    code: `${CDN}

<button class="md-open" type="button">モーダルを開く</button>
<div class="md-overlay"><div class="md-panel"> ... </div></div>

<style>
.md-overlay { position: fixed; inset: 0; opacity: 0; visibility: hidden; }
</style>

<script>
  const overlay = document.querySelector(".md-overlay");

  // 開閉で2本作らず、1本を play / reverse する。visibility は set() で先に切り替える
  const tl = gsap.timeline({ paused: true })
    .set(overlay, { visibility: "visible" })
    .to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" })
    .from(".md-panel", { y: 24, scale: 0.94, duration: 0.35, ease: "back.out(1.5)" }, "<");

  document.querySelector(".md-open").addEventListener("click", () => tl.play());
  document.querySelector(".md-close").addEventListener("click", () => tl.reverse());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) tl.reverse(); });
<\/script>`,
  },

  {
    key: "ix-menu",
    cat: "interaction",
    label: { ja: "メニューが順に開く", en: "Menu opens in sequence" },
    stage: `<div class="mn-area">
  <button class="mn-btn" type="button">MENU</button>
  <nav class="mn-panel">
    ${repeat(4, (i) => `<span class="mn-item">Item ${i + 1}</span>`)}
  </nav>
</div>`,
    css: `.fx-ix-menu .mn-area { position: relative; width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-menu .mn-btn {
  border: none; background: #0f172a; color: #fff; font-family: inherit;
  font-size: 1rem; font-weight: 700; padding: 10px 26px; border-radius: 9px; cursor: pointer;
}
.fx-ix-menu .mn-panel {
  position: absolute; inset: 0; background: #6366f1;
  display: grid; align-content: center; gap: 6px; padding: 0 26px;
  clip-path: inset(0 0 100% 0);
}
.fx-ix-menu .mn-item { color: #fff; font-weight: 700; font-size: 1.1rem; }`,
    mount(stage) {
      const tl = gsap
        .timeline({ paused: true })
        .to(stage.querySelector(".mn-panel"), { clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "power3.inOut" })
        .from(stage.querySelectorAll(".mn-item"), { x: -24, opacity: 0, duration: 0.35, stagger: 0.07 }, "-=0.15");

      let open = false;
      stage.querySelector(".mn-btn").addEventListener("click", () => {
        open = !open;
        open ? tl.play() : tl.reverse();
      });
      stage.querySelector(".mn-panel").addEventListener("click", () => {
        open = false;
        tl.reverse();
      });
    },
    code: `${CDN}

<button class="mn-btn" type="button">MENU</button>
<nav class="mn-panel">
  <span class="mn-item">Item 1</span>
  <span class="mn-item">Item 2</span>
</nav>

<style>
.mn-panel { position: fixed; inset: 0; clip-path: inset(0 0 100% 0); }
</style>

<script>
  const tl = gsap.timeline({ paused: true })
    .to(".mn-panel", { clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "power3.inOut" })
    // 面が開ききる少し前から項目を出すと、待たされる感じが消える
    .from(".mn-item", { x: -24, opacity: 0, duration: 0.35, stagger: 0.07 }, "-=0.15");

  let open = false;
  document.querySelector(".mn-btn").addEventListener("click", () => {
    open = !open;
    open ? tl.play() : tl.reverse();
  });
<\/script>`,
  },

  {
    key: "ix-compare",
    cat: "interaction",
    label: { ja: "画像比較スライダー", en: "Before / after slider" },
    stage: `<div class="cp2-area">
  <div class="cp2-after"><span class="cp2-tag cp2-tag-r">AFTER</span></div>
  <div class="cp2-before"><span class="cp2-tag cp2-tag-l">BEFORE</span></div>
  <div class="cp2-handle"><span class="cp2-bar"></span><span class="cp2-grip">⟷</span></div>
</div>`,
    css: `.fx-ix-compare .cp2-area { position: relative; width: 100%; height: 100%; overflow: hidden; }
.fx-ix-compare .cp2-after, .fx-ix-compare .cp2-before { position: absolute; inset: 0; }
/* AFTERは彩度あり、BEFOREは無彩色。ひと目で違いが分かる素材にする */
.fx-ix-compare .cp2-after { background: linear-gradient(135deg, #6366f1, #ec4899 70%, #f59e0b); }
.fx-ix-compare .cp2-before { background: linear-gradient(135deg, #94a3b8, #64748b 70%, #334155); clip-path: inset(0 50% 0 0); }
/* ラベルは中央に置かない。境界線がラベルを分断して読めなくなるため左右の端へ寄せる */
.fx-ix-compare .cp2-tag {
  position: absolute; top: 10px;
  background: rgba(15, 23, 42, 0.72); color: #fff;
  border-radius: 999px; padding: 2px 12px; font-size: 1rem; font-weight: 700; letter-spacing: 0.08em;
}
.fx-ix-compare .cp2-tag-l { left: 10px; }
.fx-ix-compare .cp2-tag-r { right: 10px; }
.fx-ix-compare .cp2-handle {
  position: absolute; top: 0; bottom: 0; left: 50%; width: 40px; margin-left: -20px;
  cursor: ew-resize; display: grid; place-items: center; touch-action: none;
}
.fx-ix-compare .cp2-bar { position: absolute; width: 4px; height: 100%; background: #fff; }
.fx-ix-compare .cp2-grip {
  position: relative; width: 38px; height: 38px; border-radius: 50%;
  background: #fff; color: #0f172a; display: grid; place-items: center;
  font-size: 1rem; font-weight: 700; box-shadow: 0 3px 10px rgba(15, 23, 42, 0.3);
}`,
    mount(stage) {
      const area = stage.querySelector(".cp2-area");
      const before = stage.querySelector(".cp2-before");
      const handle = stage.querySelector(".cp2-handle");

      const applyClip = () => {
        const ratio = (gsap.getProperty(handle, "x") + area.offsetWidth / 2) / area.offsetWidth;
        gsap.set(before, { clipPath: `inset(0 ${(1 - ratio) * 100}% 0 0)` });
      };

      // ドラッグしないと何も起きず静止画に見えるので、最初に一度だけ自動で往復させて操作を示す
      const intro = gsap
        .timeline({ defaults: { duration: 0.9, ease: "power2.inOut", onUpdate: applyClip } })
        .to(handle, { x: -area.offsetWidth * 0.3 })
        .to(handle, { x: area.offsetWidth * 0.3 })
        .to(handle, { x: 0 });

      Draggable.create(handle, {
        type: "x",
        bounds: area,
        onPress: () => intro.kill(),
        onDrag: applyClip,
      });
    },
    code: `${CDN_DRAG}

<div class="cp2-area">
  <img class="cp2-after" src="after.jpg" alt="" />
  <img class="cp2-before" src="before.jpg" alt="" />
  <div class="cp2-handle"><span></span></div>
</div>

<style>
.cp2-area { position: relative; overflow: hidden; }
.cp2-before { position: absolute; inset: 0; clip-path: inset(0 50% 0 0); }
.cp2-handle { position: absolute; top: 0; bottom: 0; left: 50%; cursor: ew-resize; touch-action: none; }
/* ラベルは中央に置かない。境界線がラベルを分断して読めなくなるため左右の端へ寄せる */
.cp2-tag-l { position: absolute; left: 10px; }
.cp2-tag-r { position: absolute; right: 10px; }
</style>

<script>
  gsap.registerPlugin(Draggable);

  const area = document.querySelector(".cp2-area");
  const handle = document.querySelector(".cp2-handle");

  const applyClip = () => {
    // ハンドルの x は中心を0とした相対値。0〜1の比率に直して clip-path に渡す
    const ratio = (gsap.getProperty(handle, "x") + area.offsetWidth / 2) / area.offsetWidth;
    gsap.set(".cp2-before", { clipPath: \`inset(0 \${(1 - ratio) * 100}% 0 0)\` });
  };

  Draggable.create(handle, { type: "x", bounds: area, onDrag: applyClip });
<\/script>`,
  },

  {
    key: "ix-shake",
    cat: "interaction",
    label: { ja: "エラー時のシェイク", en: "Shake on error" },
    stage: `<form class="sh-form" novalidate>
  <input class="sh-input" type="text" placeholder="空のまま送信してみる" aria-label="入力欄" />
  <button class="sh-btn" type="submit">送信</button>
</form>`,
    css: `.fx-ix-shake .sh-form { width: 100%; padding: 0 22px; display: grid; gap: 10px; }
.fx-ix-shake .sh-input {
  border: 2px solid #cbd5e1; border-radius: 9px; padding: 10px 14px;
  font-size: 1rem; font-family: inherit; color: #1e293b;
}
.fx-ix-shake .sh-input.is-error { border-color: #ec4899; }
.fx-ix-shake .sh-btn {
  border: none; background: #6366f1; color: #fff; font-family: inherit;
  font-size: 1rem; font-weight: 700; padding: 10px; border-radius: 9px; cursor: pointer;
}`,
    mount(stage) {
      const form = stage.querySelector(".sh-form");
      const input = stage.querySelector(".sh-input");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value.trim()) {
          input.classList.remove("is-error");
          gsap.fromTo(input, { scale: 1 }, { scale: 1.03, duration: 0.15, yoyo: true, repeat: 1 });
          return;
        }
        input.classList.add("is-error");
        gsap.fromTo(input, { x: 0 }, { x: 10, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" });
      });
    },
    code: `${CDN}

<form class="sh-form">
  <input class="sh-input" type="text" />
  <button class="sh-btn" type="submit">送信</button>
</form>

<script>
  const form = document.querySelector(".sh-form");
  const input = document.querySelector(".sh-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) return;

    // repeat + yoyo の短いトゥイーンでシェイクになる。
    // clearProps でインラインの transform を消しておくと、後続のCSSと衝突しない
    gsap.fromTo(input, { x: 0 },
      { x: 10, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" });
  });
<\/script>`,
  },

  {
    key: "ix-copy",
    cat: "interaction",
    label: { ja: "コピー完了のフィードバック", en: "Copy success feedback" },
    stage: `<div class="cy-area">
  <button class="cy-btn" type="button">
    <span class="cy-label">📋 コピー</span>
    <span class="cy-done">✓ コピーしました</span>
  </button>
</div>`,
    css: `.fx-ix-copy .cy-area { width: 100%; height: 100%; display: grid; place-items: center; }
.fx-ix-copy .cy-btn {
  position: relative; overflow: hidden;
  border: none; background: #6366f1; color: #fff; font-family: inherit;
  font-size: 1rem; font-weight: 700; padding: 13px 28px; border-radius: 10px; cursor: pointer;
  min-width: 180px; height: 48px;
}
.fx-ix-copy .cy-label, .fx-ix-copy .cy-done {
  position: absolute; inset: 0; display: grid; place-items: center;
}
.fx-ix-copy .cy-done { background: #10b981; }`,
    mount(stage) {
      const btn = stage.querySelector(".cy-btn");
      const done = stage.querySelector(".cy-done");
      gsap.set(done, { yPercent: 100 });

      const tl = gsap
        .timeline({ paused: true })
        .to(stage.querySelector(".cy-label"), { yPercent: -100, duration: 0.3, ease: "power2.in" })
        .to(done, { yPercent: 0, duration: 0.3, ease: "power2.out" }, "<")
        .to({}, { duration: 1.2 })
        .to(done, { yPercent: 100, duration: 0.3, ease: "power2.in" })
        .to(stage.querySelector(".cy-label"), { yPercent: 0, duration: 0.3, ease: "power2.out" }, "<");

      btn.addEventListener("click", () => {
        tl.restart();
      });
    },
    code: `${CDN}

<button class="cy-btn" type="button">
  <span class="cy-label">📋 コピー</span>
  <span class="cy-done">✓ コピーしました</span>
</button>

<style>
.cy-btn { position: relative; overflow: hidden; }
.cy-label, .cy-done { position: absolute; inset: 0; display: grid; place-items: center; }
</style>

<script>
  gsap.set(".cy-done", { yPercent: 100 });

  const tl = gsap.timeline({ paused: true })
    .to(".cy-label", { yPercent: -100, duration: 0.3, ease: "power2.in" })
    .to(".cy-done", { yPercent: 0, duration: 0.3, ease: "power2.out" }, "<")
    // 空のトゥイーンは「何もしない間」を作るための定番の書き方
    .to({}, { duration: 1.2 })
    .to(".cy-done", { yPercent: 100, duration: 0.3, ease: "power2.in" })
    .to(".cy-label", { yPercent: 0, duration: 0.3, ease: "power2.out" }, "<");

  document.querySelector(".cy-btn").addEventListener("click", async () => {
    await navigator.clipboard.writeText("コピーしたい文字列");
    tl.restart();
  });
<\/script>`,
  },
];
