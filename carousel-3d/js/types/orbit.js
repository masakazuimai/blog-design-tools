/*
 * テンプレート6：観覧車
 * カードを円周に並べて回すが、観覧車のゴンドラのように各カードは常に正面（水平・正立）を向く（ビルボード）。
 * 各カードを毎フレーム「円周上に配置 → 自分の角度ぶん逆回転 → 見下ろしtiltも打ち消す」ことで正面固定する。
 * 見下ろし=0で真正面の縦回転ホイール、上げるほど見下ろした楕円軌道になる。構造・CSSは共通（scene>tilt>stage>.c3-card）。
 */
const SENS = 0.22;
const GSAP_VER = "3.13.0";
const CDN = `https://cdn.jsdelivr.net/npm/gsap@${GSAP_VER}/dist`;

const fields = [
  { key: "count", min: 3, max: 14, step: 1, def: 6 },
  { key: "radius", min: 80, max: 420, step: 10, def: 210 },
  { key: "perspective", min: 600, max: 2200, step: 50, def: 1100 },
  { key: "cardW", min: 100, max: 260, step: 10, def: 160 },
  { key: "cardH", min: 120, max: 320, step: 10, def: 200 },
  { key: "tilt", min: 0, max: 80, step: 1, def: 28, label: { ja: "見下ろし", en: "look down" } },
  { key: "speed", min: 4, max: 40, step: 1, def: 16 },
  { key: "hue", min: 0, max: 360, step: 5, def: 200, hue: true },
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

  // 現在の回転で各カードを配置（初期表示と毎フレームで共用）
  function place() {
    const step = 360 / s.count;
    for (let i = 0; i < cards.length; i++) {
      const th = s.rotation + i * step;
      // 円周配置 → 自分の角度を逆回転 → 見下ろしtiltも打ち消して正面固定
      cards[i].style.transform =
        `rotateZ(${th}deg) translateY(${-s.radius}px) rotateZ(${-th}deg) rotateX(${-s.tilt}deg)`;
      const face = -Math.cos((th * Math.PI) / 180); // 手前(下)で1
      cards[i].style.filter = `brightness(${(0.5 + 0.5 * (face * 0.5 + 0.5)).toFixed(3)})`;
      cards[i].style.zIndex = String(Math.round(face * 100));
    }
  }

  function layout() {
    scene.style.perspective = `${s.perspective}px`;
    scene.style.setProperty("--c3-hue", s.hue);
    tilt.style.transform = `rotateX(${s.tilt}deg)`;
    cards.forEach((card) => {
      card.style.width = `${s.cardW}px`;
      card.style.height = `${s.cardH}px`;
      card.style.marginLeft = `${-s.cardW / 2}px`;
      card.style.marginTop = `${-s.cardH / 2}px`;
    });
    place();
  }

  function tick(time, deltaTime) {
    if (s.auto && !s.active && s.speed > 0) {
      s.rotation += (deltaTime / 1000) * (360 / s.speed);
    }
    place();
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
  const h = Math.round(p.radius * 1.6 + p.cardH + 60);
  return `<style>
.c3-scene { --c3-hue: ${p.hue}; position: relative; width: 100%; height: ${h}px; margin: 0 auto; display: flex; align-items: center; justify-content: center; perspective: ${p.perspective}px; overflow: hidden; touch-action: pan-y; user-select: none; }
.c3-tilt { position: relative; width: 1px; height: 1px; transform-style: preserve-3d; }
.c3-stage { position: absolute; top: 0; left: 0; transform-style: preserve-3d; }
.c3-card { position: absolute; top: 50%; left: 50%; display: flex; align-items: center; justify-content: center; border-radius: 16px; background: linear-gradient(160deg, hsl(var(--c3-hue), 44%, 38%), hsl(var(--c3-hue), 50%, 16%)); border: 1px solid hsla(var(--c3-hue), 55%, 82%, 0.28); box-shadow: 0 18px 40px rgba(0,0,0,0.42); color: hsl(var(--c3-hue), 50%, 90%); font-size: 30px; font-weight: 700; overflow: hidden; }
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
  tilt.style.transform = "rotateX(" + S.tilt + "deg)";
  cards.forEach(function (card) {
    card.style.width = S.cardW + "px"; card.style.height = S.cardH + "px";
    card.style.marginLeft = -S.cardW / 2 + "px"; card.style.marginTop = -S.cardH / 2 + "px";
  });
  function place() {
    for (var i = 0; i < cards.length; i++) {
      var th = rotation + i * step;
      cards[i].style.transform =
        "rotateZ(" + th + "deg) translateY(" + -S.radius + "px) rotateZ(" + -th + "deg) rotateX(" + -S.tilt + "deg)";
      var face = -Math.cos(th * Math.PI / 180);
      cards[i].style.filter = "brightness(" + (0.5 + 0.5 * (face * 0.5 + 0.5)).toFixed(3) + ")";
      cards[i].style.zIndex = Math.round(face * 100);
    }
  }
  place();
  gsap.ticker.add(function (time, dt) {
    if (!active && S.speed > 0) rotation += (dt / 1000) * (360 / S.speed);
    place();
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
    ? "3D ferris-wheel carousel (cards always upright/front) | GSAP | replace each .c3-card content with your own <img>"
    : "3D観覧車カルーセル（カードは常に正面・正立）| GSAP製 | 各 .c3-card の中身は自由に <img> 等へ差し替え";
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

export const orbitType = {
  id: "orbit",
  label: { ja: "観覧車", en: "Ferris wheel" },
  hasAuto: true,
  autoLabel: { ja: "自動回転", en: "Auto-rotate" },
  fields,
  mount,
  fullCode,
  meta(p, autoOn) {
    return `${p.count}枚 / r${p.radius} / 見下ろし${p.tilt} / ${autoOn ? p.speed + "s" : "停止"}`;
  },
};
