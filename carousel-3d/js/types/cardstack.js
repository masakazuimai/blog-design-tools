/*
 * テンプレート2：カードスタック（縦・3D後退トランジション）
 * 元はスクロール連動（ScrollTrigger）の動きを、自動送り＋スワイプ＋ループのカルーセルに置き換えたもの。
 * 次のカードが下からせり上がり、今のカードは縮小→奥へ後退してフェードアウトする。
 */
const SCALE = 0.86; // 退出カードの縮小率
const SWIPE = 40; // スワイプ判定のしきい値(px)
const GSAP_VER = "3.13.0";
const CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VER}/dist`;

const fields = [
  { key: "count", min: 3, max: 7, step: 1, def: 5 },
  { key: "cardW", min: 320, max: 640, step: 10, def: 500 },
  { key: "cardH", min: 240, max: 520, step: 10, def: 400 },
  { key: "perspective", min: 600, max: 2000, step: 50, def: 1000 },
  { key: "interval", min: 2, max: 8, step: 0.5, def: 3.5 },
  { key: "depth", min: 200, max: 900, step: 20, def: 500 },
  { key: "hue", min: 0, max: 360, step: 5, def: 8, hue: true },
];

function mount(host, state, autoOn) {
  host.innerHTML = '<div class="cs-wrap"></div>';
  const wrap = host.querySelector(".cs-wrap");
  const s = { ...state, auto: autoOn };
  let cards = [];
  let active = 0;
  let busy = false;
  let timer = null;

  function build() {
    wrap.innerHTML = "";
    cards = [];
    for (let i = 0; i < s.count; i++) {
      const card = document.createElement("div");
      card.className = "cs-card";
      card.innerHTML =
        '<div class="cs-img"></div>' +
        `<div class="cs-text"><h3>Slide ${i + 1}</h3><p>スワイプ↑ / タップ</p></div>`;
      wrap.appendChild(card);
      cards.push(card);
    }
  }

  function layout() {
    wrap.style.setProperty("--cs-w", `${s.cardW}px`);
    wrap.style.setProperty("--cs-h", `${s.cardH}px`);
    wrap.style.setProperty("--cs-p", `${s.perspective}px`);
    wrap.style.setProperty("--cs-hue", s.hue);
  }

  function initStack() {
    active = 0;
    cards.forEach((card, i) => {
      gsap.set(card, {
        yPercent: i === 0 ? 0 : 120,
        z: 0,
        scale: 1,
        opacity: 1,
        zIndex: i === 0 ? 20 : 10,
      });
    });
  }

  function forward() {
    if (busy || cards.length < 2) return;
    busy = true;
    const cur = cards[active];
    const next = cards[(active + 1) % cards.length];
    const tl = gsap.timeline({ onComplete: () => (busy = false) });
    tl.set(next, { zIndex: 30 });
    tl.set(cur, { zIndex: 20 });
    tl.fromTo(next, { yPercent: 120, z: 0, scale: 1, opacity: 1 }, { yPercent: 0, duration: 0.7, ease: "power2.out" }, 0);
    tl.to(cur, { yPercent: -22, scale: SCALE, opacity: 0.6, duration: 0.3, ease: "power1.out" }, 0);
    tl.to(cur, { yPercent: 55, z: -s.depth, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.3);
    tl.set(cur, { yPercent: 120, z: 0, scale: 1, opacity: 1, zIndex: 10 });
    active = (active + 1) % cards.length;
  }

  function backward() {
    if (busy || cards.length < 2) return;
    busy = true;
    const cur = cards[active];
    const prev = cards[(active - 1 + cards.length) % cards.length];
    const tl = gsap.timeline({ onComplete: () => (busy = false) });
    tl.set(prev, { zIndex: 30, yPercent: 55, z: -s.depth, opacity: 0, scale: SCALE });
    tl.set(cur, { zIndex: 20 });
    tl.to(cur, { yPercent: 120, z: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.in" }, 0);
    tl.set(cur, { zIndex: 10 }, 0.5);
    tl.to(prev, { yPercent: 0, z: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.1);
    active = (active - 1 + cards.length) % cards.length;
  }

  function scheduleAuto() {
    if (timer) timer.kill();
    timer = null;
    if (s.auto && cards.length > 1) {
      timer = gsap.delayedCall(s.interval, () => {
        forward();
        scheduleAuto();
      });
    }
  }

  let drag = null;
  function initDrag() {
    if (typeof Draggable === "undefined") return;
    const proxy = document.createElement("div");
    drag = Draggable.create(proxy, {
      trigger: wrap,
      type: "y",
      onPressInit() {
        gsap.set(proxy, { y: 0 });
        if (timer) timer.kill();
      },
      onClick() {
        forward();
        scheduleAuto();
      },
      onDragEnd() {
        if (this.y < -SWIPE) forward();
        else if (this.y > SWIPE) backward();
        scheduleAuto();
      },
    })[0];
    wrap.style.cursor = "grab";
  }

  build();
  layout();
  initStack();
  initDrag();
  scheduleAuto();

  return {
    update(opts) {
      const rebuild = opts.count != null && opts.count !== s.count;
      Object.assign(s, opts);
      layout();
      if (rebuild) {
        build();
        initStack();
        scheduleAuto();
      }
    },
    setAuto(on) {
      s.auto = on;
      scheduleAuto();
    },
    destroy() {
      if (timer) timer.kill();
      if (drag) drag.kill();
      host.innerHTML = "";
    },
  };
}

// --- コード生成 ---------------------------------------------------------
function cardsHTML(count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out +=
      `    <div class="cs-card">\n` +
      `      <div class="cs-img"></div><!-- ここを <img class="cs-img" src="..." alt=""> に差し替え可 -->\n` +
      `      <div class="cs-text"><h3>Title ${i + 1}</h3><p>Subtitle</p></div>\n` +
      `    </div>\n`;
  }
  return out;
}

function styleBlock(p) {
  const wrapH = p.cardH + 120;
  return `<style>
.cs-stage { position: relative; width: 100%; min-height: ${wrapH}px; display: flex; align-items: center; justify-content: center; }
.cs-wrap { --cs-hue: ${p.hue}; position: relative; width: 100%; max-width: ${p.cardW}px; height: ${p.cardH}px; margin: 0 auto; perspective: ${p.perspective}px; touch-action: pan-y; user-select: none; }
.cs-card { position: absolute; inset: 0; display: flex; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 36px hsla(var(--cs-hue), 85%, 55%, 0.55); transform-style: preserve-3d; will-change: transform, opacity; }
.cs-card:nth-child(even) { flex-direction: row-reverse; }
.cs-img { width: 56%; height: 100%; object-fit: cover; display: block; background: linear-gradient(150deg, hsl(var(--cs-hue), 72%, 62%), hsl(var(--cs-hue), 65%, 38%)); }
.cs-text { width: 44%; padding: 22px 24px; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.cs-text h3 { margin: 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
.cs-text p { margin: 0; font-size: 16px; color: #666; }
</style>`;
}

function scriptBody(p, autoFlag) {
  return `  gsap.registerPlugin(Draggable);
  var S = { interval: ${p.interval}, depth: ${p.depth}, auto: ${autoFlag} };
  var SCALE = ${SCALE}, SWIPE = ${SWIPE};
  var wrap = document.querySelector(".cs-wrap");
  var cards = Array.prototype.slice.call(wrap.querySelectorAll(".cs-card"));
  var active = 0, busy = false, timer = null;
  cards.forEach(function (card, i) {
    gsap.set(card, { yPercent: i === 0 ? 0 : 120, z: 0, scale: 1, opacity: 1, zIndex: i === 0 ? 20 : 10 });
  });
  function forward() {
    if (busy || cards.length < 2) return;
    busy = true;
    var cur = cards[active], next = cards[(active + 1) % cards.length];
    var tl = gsap.timeline({ onComplete: function () { busy = false; } });
    tl.set(next, { zIndex: 30 }); tl.set(cur, { zIndex: 20 });
    tl.fromTo(next, { yPercent: 120, z: 0, scale: 1, opacity: 1 }, { yPercent: 0, duration: 0.7, ease: "power2.out" }, 0);
    tl.to(cur, { yPercent: -22, scale: SCALE, opacity: 0.6, duration: 0.3, ease: "power1.out" }, 0);
    tl.to(cur, { yPercent: 55, z: -S.depth, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.3);
    tl.set(cur, { yPercent: 120, z: 0, scale: 1, opacity: 1, zIndex: 10 });
    active = (active + 1) % cards.length;
  }
  function backward() {
    if (busy || cards.length < 2) return;
    busy = true;
    var cur = cards[active], prev = cards[(active - 1 + cards.length) % cards.length];
    var tl = gsap.timeline({ onComplete: function () { busy = false; } });
    tl.set(prev, { zIndex: 30, yPercent: 55, z: -S.depth, opacity: 0, scale: SCALE }); tl.set(cur, { zIndex: 20 });
    tl.to(cur, { yPercent: 120, z: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.in" }, 0);
    tl.set(cur, { zIndex: 10 }, 0.5);
    tl.to(prev, { yPercent: 0, z: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.1);
    active = (active - 1 + cards.length) % cards.length;
  }
  function scheduleAuto() {
    if (timer) timer.kill();
    timer = null;
    if (S.auto && cards.length > 1) timer = gsap.delayedCall(S.interval, function () { forward(); scheduleAuto(); });
  }
  var proxy = document.createElement("div");
  Draggable.create(proxy, {
    trigger: wrap, type: "y",
    onPressInit: function () { gsap.set(proxy, { y: 0 }); if (timer) timer.kill(); },
    onClick: function () { forward(); scheduleAuto(); },
    onDragEnd: function () { if (this.y < -SWIPE) forward(); else if (this.y > SWIPE) backward(); scheduleAuto(); }
  });
  wrap.style.cursor = "grab";
  scheduleAuto();`;
}

function fullCode(p, autoOn, isEn) {
  const note = isEn
    ? "3D card-stack carousel | GSAP | swap each .cs-img / .cs-text with your own content"
    : "3Dカードスタック カルーセル | GSAP製 | 各 .cs-img / .cs-text を自分の内容へ差し替え";
  return `<!-- ${note} -->
<div class="cs-stage">
  <div class="cs-wrap">
${cardsHTML(p.count)}  </div>
</div>

${styleBlock(p)}

<script src="${CDN}/gsap.min.js"><\/script>
<script src="${CDN}/Draggable.min.js"><\/script>
<script>
(function () {
${scriptBody(p, autoOn)}
})();
<\/script>`;
}

export const cardStackType = {
  id: "cardstack",
  label: { ja: "カードスタック", en: "Card stack" },
  hasAuto: true,
  autoLabel: { ja: "自動送り", en: "Auto-play" },
  fields,
  mount,
  fullCode,
  meta(p, autoOn) {
    return `${p.count}枚 / ${p.cardW}×${p.cardH} / ${autoOn ? p.interval + "s送り" : "手動"}`;
  },
};
