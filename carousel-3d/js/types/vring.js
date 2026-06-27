/*
 * テンプレート3：縦回転リング（観覧車／ロロデックス型）
 * メリーゴーランドの回転軸を縦(X軸)にしたもの。カードが上下に回り、前面のカードが正面を向く。
 * 構造・CSSはメリーゴーランドと共通（scene > tilt > stage > .c3-card）。tiltは横傾き(rotateY)。
 */
const SENS = 0.22;
const GSAP_VER = "3.13.0";
const CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VER}/dist`;

const fields = [
  { key: "count", min: 3, max: 12, step: 1, def: 7 },
  { key: "radius", min: 160, max: 600, step: 10, def: 300 },
  { key: "perspective", min: 600, max: 2400, step: 50, def: 1200 },
  { key: "cardW", min: 140, max: 360, step: 10, def: 300 },
  { key: "cardH", min: 100, max: 320, step: 10, def: 180 },
  { key: "tilt", min: -35, max: 35, step: 1, def: 0 },
  { key: "speed", min: 4, max: 40, step: 1, def: 18 },
  { key: "hue", min: 0, max: 360, step: 5, def: 150, hue: true },
];

function mount(host, state, autoOn) {
  host.innerHTML =
    '<div class="c3-scene"><div class="c3-tilt"><div class="c3-stage"></div></div></div>';
  const scene = host.querySelector(".c3-scene");
  const tilt = host.querySelector(".c3-tilt");
  const stage = host.querySelector(".c3-stage");

  const s = { ...state, auto: autoOn, rotation: 0, active: false };
  let cards = [];

  function build() {
    stage.innerHTML = "";
    cards = [];
    for (let i = 0; i < s.count; i++) {
      const card = document.createElement("div");
      card.className = "c3-card";
      card.innerHTML = `<span>${i + 1}</span>`;
      stage.appendChild(card);
      cards.push(card);
    }
  }

  function layout() {
    const step = 360 / s.count;
    scene.style.perspective = `${s.perspective}px`;
    scene.style.setProperty("--c3-hue", s.hue);
    tilt.style.transform = `rotateY(${s.tilt}deg)`;
    cards.forEach((card, i) => {
      card.style.width = `${s.cardW}px`;
      card.style.height = `${s.cardH}px`;
      card.style.marginLeft = `${-s.cardW / 2}px`;
      card.style.marginTop = `${-s.cardH / 2}px`;
      card.style.transform = `rotateX(${i * step}deg) translateZ(${s.radius}px)`;
    });
  }

  function tick(time, deltaTime) {
    if (s.auto && !s.active && s.speed > 0) {
      s.rotation += (deltaTime / 1000) * (360 / s.speed);
    }
    stage.style.transform = `rotateX(${s.rotation}deg)`;
    const step = 360 / s.count;
    for (let i = 0; i < cards.length; i++) {
      const a = ((s.rotation + i * step) * Math.PI) / 180;
      const face = Math.cos(a);
      cards[i].style.filter = `brightness(${(0.42 + 0.58 * (face * 0.5 + 0.5)).toFixed(3)})`;
      cards[i].style.zIndex = String(Math.round(face * 100));
    }
  }

  let drag = null;
  function initDrag() {
    if (typeof Draggable === "undefined") return;
    if (typeof InertiaPlugin !== "undefined") gsap.registerPlugin(InertiaPlugin);
    const proxy = document.createElement("div");
    const apply = (self) => (s.rotation += self.deltaY * SENS);
    drag = Draggable.create(proxy, {
      trigger: scene,
      type: "y",
      inertia: typeof InertiaPlugin !== "undefined",
      onPressInit() {
        s.active = true;
      },
      onDrag() {
        apply(this);
      },
      onThrowUpdate() {
        apply(this);
      },
      onThrowComplete() {
        s.active = false;
      },
      onDragEnd() {
        if (typeof InertiaPlugin === "undefined") s.active = false;
      },
    })[0];
    scene.style.cursor = "grab";
  }

  build();
  layout();
  gsap.ticker.add(tick);
  initDrag();

  return {
    update(opts) {
      const rebuild = opts.count != null && opts.count !== s.count;
      Object.assign(s, opts);
      if (rebuild) build();
      layout();
    },
    setAuto(on) {
      s.auto = on;
    },
    destroy() {
      gsap.ticker.remove(tick);
      if (drag) drag.kill();
      host.innerHTML = "";
    },
  };
}

// --- コード生成 ---------------------------------------------------------
function cardsHTML(count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += `      <div class="c3-card"><span>${i + 1}</span></div>\n`;
  }
  return out;
}

function styleBlock(p) {
  const h = Math.round(p.radius * 2 + p.cardH * 0.5 + 80);
  return `<style>
.c3-scene { --c3-hue: ${p.hue}; position: relative; width: 100%; height: ${h}px; margin: 0 auto; display: flex; align-items: center; justify-content: center; perspective: ${p.perspective}px; overflow: hidden; touch-action: pan-x; user-select: none; }
.c3-tilt { position: relative; width: 1px; height: 1px; transform-style: preserve-3d; }
.c3-stage { position: absolute; top: 0; left: 0; transform-style: preserve-3d; }
.c3-card { position: absolute; top: 50%; left: 50%; display: flex; align-items: center; justify-content: center; border-radius: 16px; background: linear-gradient(160deg, hsl(var(--c3-hue), 40%, 34%), hsl(var(--c3-hue), 46%, 12%)); border: 1px solid hsla(var(--c3-hue), 50%, 80%, 0.25); box-shadow: 0 18px 40px rgba(0,0,0,0.45); color: hsl(var(--c3-hue), 45%, 86%); font-size: 32px; font-weight: 700; overflow: hidden; }
.c3-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>`;
}

function scriptBody(p, speed) {
  return `  gsap.registerPlugin(Draggable, InertiaPlugin);
  var S = { count: ${p.count}, radius: ${p.radius}, cardW: ${p.cardW}, cardH: ${p.cardH}, tilt: ${p.tilt}, speed: ${speed}, perspective: ${p.perspective} };
  var scene = document.querySelector(".c3-scene"),
      tilt = scene.querySelector(".c3-tilt"),
      stage = scene.querySelector(".c3-stage"),
      cards = Array.prototype.slice.call(stage.children);
  var step = 360 / S.count, rotation = 0, active = false, SENS = ${SENS};
  scene.style.perspective = S.perspective + "px";
  tilt.style.transform = "rotateY(" + S.tilt + "deg)";
  cards.forEach(function (card, i) {
    card.style.width = S.cardW + "px";
    card.style.height = S.cardH + "px";
    card.style.marginLeft = -S.cardW / 2 + "px";
    card.style.marginTop = -S.cardH / 2 + "px";
    card.style.transform = "rotateX(" + i * step + "deg) translateZ(" + S.radius + "px)";
  });
  gsap.ticker.add(function (time, dt) {
    if (!active && S.speed > 0) rotation += (dt / 1000) * (360 / S.speed);
    stage.style.transform = "rotateX(" + rotation + "deg)";
    for (var i = 0; i < cards.length; i++) {
      var f = Math.cos((rotation + i * step) * Math.PI / 180);
      cards[i].style.filter = "brightness(" + (0.42 + 0.58 * (f * 0.5 + 0.5)).toFixed(3) + ")";
      cards[i].style.zIndex = Math.round(f * 100);
    }
  });
  var proxy = document.createElement("div");
  Draggable.create(proxy, {
    trigger: scene, type: "y", inertia: true,
    onPressInit: function () { active = true; },
    onDrag: function () { rotation += this.deltaY * SENS; },
    onThrowUpdate: function () { rotation += this.deltaY * SENS; },
    onThrowComplete: function () { active = false; }
  });
  scene.style.cursor = "grab";`;
}

function fullCode(p, autoOn, isEn) {
  const speed = autoOn ? p.speed : 0;
  const note = isEn
    ? "3D vertical wheel carousel | GSAP | replace each .c3-card content with your own <img>"
    : "3D縦回転カルーセル（観覧車型）| GSAP製 | 各 .c3-card の中身は自由に <img> 等へ差し替え";
  return `<!-- ${note} -->
<div class="c3-scene">
  <div class="c3-tilt">
    <div class="c3-stage">
${cardsHTML(p.count)}    </div>
  </div>
</div>

${styleBlock(p)}

<script src="${CDN}/gsap.min.js"><\/script>
<script src="${CDN}/Draggable.min.js"><\/script>
<script src="${CDN}/InertiaPlugin.min.js"><\/script>
<script>
(function () {
${scriptBody(p, speed)}
})();
<\/script>`;
}

export const vRingType = {
  id: "vring",
  label: { ja: "縦回転", en: "Vertical wheel" },
  hasAuto: true,
  autoLabel: { ja: "自動回転", en: "Auto-rotate" },
  fields,
  mount,
  fullCode,
  meta(p, autoOn) {
    return `${p.count}枚 / r${p.radius} / tilt${p.tilt} / ${autoOn ? p.speed + "s" : "停止"}`;
  },
};
