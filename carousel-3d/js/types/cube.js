/*
 * テンプレート5：キューブ
 * カードを正立方体の6面（前後左右＋天面・底面）として配置し、回す。
 * 各面の法線をrotateY(回転)→rotateX(見下ろし)で回し、正面ほど明るく＋前面化（z-index）する。
 * 構造・CSSは共通（scene>tilt>stage>.c3-card）。tilt=rotateX(見下ろし)／stage=rotateY(回転)。
 */
const SENS = 0.22;
const GSAP_VER = "3.13.0";
const CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VER}/dist`;

// 6面：自分の向き(transform)と、その面の外向き法線ベクトル(回転前)
const FACES = [
  { rot: "rotateY(0deg)", n: [0, 0, 1] }, // 前
  { rot: "rotateY(90deg)", n: [1, 0, 0] }, // 右
  { rot: "rotateY(180deg)", n: [0, 0, -1] }, // 後
  { rot: "rotateY(270deg)", n: [-1, 0, 0] }, // 左
  { rot: "rotateX(-90deg)", n: [0, 1, 0] }, // 天面
  { rot: "rotateX(90deg)", n: [0, -1, 0] }, // 底面
];

const fields = [
  { key: "size", min: 120, max: 360, step: 10, def: 200 },
  { key: "perspective", min: 600, max: 2200, step: 50, def: 1000 },
  { key: "tilt", min: -40, max: 40, step: 1, def: 18, label: { ja: "見下ろし", en: "look down" } },
  { key: "speed", min: 4, max: 40, step: 1, def: 14 },
  { key: "hue", min: 0, max: 360, step: 5, def: 25, hue: true },
];

function mount(host, state, autoOn) {
  host.innerHTML =
    '<div class="c3-scene"><div class="c3-tilt"><div class="c3-stage"></div></div></div>';
  const scene = host.querySelector(".c3-scene");
  const tilt = host.querySelector(".c3-tilt");
  const stage = host.querySelector(".c3-stage");

  const s = { ...state, auto: autoOn, rotation: 0, active: false };
  const cards = [];

  for (let i = 0; i < FACES.length; i++) {
    const card = document.createElement("div");
    card.className = "c3-card";
    card.innerHTML = `<span>${i + 1}</span>`;
    stage.appendChild(card);
    cards.push(card);
  }

  function layout() {
    const half = s.size / 2;
    scene.style.perspective = `${s.perspective}px`;
    scene.style.setProperty("--c3-hue", s.hue);
    tilt.style.transform = `rotateX(${s.tilt}deg)`;
    cards.forEach((card, i) => {
      card.style.width = `${s.size}px`;
      card.style.height = `${s.size}px`;
      card.style.marginLeft = `${-half}px`;
      card.style.marginTop = `${-half}px`;
      card.style.transform = `${FACES[i].rot} translateZ(${half}px)`;
    });
  }

  function tick(time, deltaTime) {
    if (s.auto && !s.active && s.speed > 0) {
      s.rotation += (deltaTime / 1000) * (360 / s.speed);
    }
    stage.style.transform = `rotateY(${s.rotation}deg)`;
    const rr = (s.rotation * Math.PI) / 180;
    const tr = (s.tilt * Math.PI) / 180;
    for (let i = 0; i < cards.length; i++) {
      const n = FACES[i].n;
      // rotateY(rotation)
      const x = n[0] * Math.cos(rr) + n[2] * Math.sin(rr);
      const z1 = -n[0] * Math.sin(rr) + n[2] * Math.cos(rr);
      // rotateX(tilt)
      const z = n[1] * Math.sin(tr) + z1 * Math.cos(tr);
      cards[i].style.filter = `brightness(${(0.38 + 0.62 * (z * 0.5 + 0.5)).toFixed(3)})`;
      cards[i].style.zIndex = String(Math.round(z * 100));
    }
  }

  let drag = null;
  function initDrag() {
    if (typeof Draggable === "undefined") return;
    if (typeof InertiaPlugin !== "undefined") gsap.registerPlugin(InertiaPlugin);
    const proxy = document.createElement("div");
    const apply = (self) => (s.rotation += self.deltaX * SENS);
    drag = Draggable.create(proxy, {
      trigger: scene,
      type: "x",
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

  layout();
  gsap.ticker.add(tick);
  initDrag();

  return {
    update(opts) {
      Object.assign(s, opts);
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
function cardsHTML() {
  let out = "";
  for (let i = 0; i < FACES.length; i++) {
    out += `      <div class="c3-card"><span>${i + 1}</span></div>\n`;
  }
  return out;
}

function styleBlock(p) {
  const h = Math.round(p.size * 1.7 + 100);
  return `<style>
.c3-scene { --c3-hue: ${p.hue}; position: relative; width: 100%; height: ${h}px; margin: 0 auto; display: flex; align-items: center; justify-content: center; perspective: ${p.perspective}px; overflow: hidden; touch-action: pan-y; user-select: none; }
.c3-tilt { position: relative; width: 1px; height: 1px; transform-style: preserve-3d; }
.c3-stage { position: absolute; top: 0; left: 0; transform-style: preserve-3d; }
.c3-card { position: absolute; top: 50%; left: 50%; display: flex; align-items: center; justify-content: center; border-radius: 14px; background: linear-gradient(160deg, hsl(var(--c3-hue), 42%, 36%), hsl(var(--c3-hue), 48%, 14%)); border: 1px solid hsla(var(--c3-hue), 50%, 80%, 0.25); box-shadow: 0 18px 40px rgba(0,0,0,0.45); color: hsl(var(--c3-hue), 45%, 88%); font-size: 32px; font-weight: 700; overflow: hidden; }
.c3-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>`;
}

function scriptBody(p, speed) {
  return `  gsap.registerPlugin(Draggable, InertiaPlugin);
  var S = { size: ${p.size}, tilt: ${p.tilt}, speed: ${speed}, perspective: ${p.perspective} };
  var FACES = [
    { rot: "rotateY(0deg)", n: [0, 0, 1] }, { rot: "rotateY(90deg)", n: [1, 0, 0] },
    { rot: "rotateY(180deg)", n: [0, 0, -1] }, { rot: "rotateY(270deg)", n: [-1, 0, 0] },
    { rot: "rotateX(-90deg)", n: [0, 1, 0] }, { rot: "rotateX(90deg)", n: [0, -1, 0] }
  ];
  var scene = document.querySelector(".c3-scene"),
      tilt = scene.querySelector(".c3-tilt"),
      stage = scene.querySelector(".c3-stage"),
      cards = Array.prototype.slice.call(stage.children);
  var rotation = 0, active = false, SENS = ${SENS}, half = S.size / 2;
  scene.style.perspective = S.perspective + "px";
  tilt.style.transform = "rotateX(" + S.tilt + "deg)";
  cards.forEach(function (card, i) {
    card.style.width = S.size + "px"; card.style.height = S.size + "px";
    card.style.marginLeft = -half + "px"; card.style.marginTop = -half + "px";
    card.style.transform = FACES[i].rot + " translateZ(" + half + "px)";
  });
  gsap.ticker.add(function (time, dt) {
    if (!active && S.speed > 0) rotation += (dt / 1000) * (360 / S.speed);
    stage.style.transform = "rotateY(" + rotation + "deg)";
    var rr = rotation * Math.PI / 180, tr = S.tilt * Math.PI / 180;
    for (var i = 0; i < cards.length; i++) {
      var n = FACES[i].n;
      var z1 = -n[0] * Math.sin(rr) + n[2] * Math.cos(rr);
      var z = n[1] * Math.sin(tr) + z1 * Math.cos(tr);
      cards[i].style.filter = "brightness(" + (0.38 + 0.62 * (z * 0.5 + 0.5)).toFixed(3) + ")";
      cards[i].style.zIndex = Math.round(z * 100);
    }
  });
  var proxy = document.createElement("div");
  Draggable.create(proxy, {
    trigger: scene, type: "x", inertia: true,
    onPressInit: function () { active = true; },
    onDrag: function () { rotation += this.deltaX * SENS; },
    onThrowUpdate: function () { rotation += this.deltaX * SENS; },
    onThrowComplete: function () { active = false; }
  });
  scene.style.cursor = "grab";`;
}

function fullCode(p, autoOn, isEn) {
  const speed = autoOn ? p.speed : 0;
  const note = isEn
    ? "3D cube carousel (6 faces) | GSAP | replace each .c3-card content with your own <img>"
    : "3Dキューブカルーセル（6面）| GSAP製 | 各 .c3-card の中身は自由に <img> 等へ差し替え";
  return `<!-- ${note} -->
<div class="c3-scene">
  <div class="c3-tilt">
    <div class="c3-stage">
${cardsHTML()}    </div>
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

export const cubeType = {
  id: "cube",
  label: { ja: "キューブ", en: "Cube" },
  hasAuto: true,
  autoLabel: { ja: "自動回転", en: "Auto-rotate" },
  fields,
  mount,
  fullCode,
  meta(p, autoOn) {
    return `立方体6面 / ${p.size}px / 見下ろし${p.tilt} / ${autoOn ? p.speed + "s" : "停止"}`;
  },
};
