// リムの光ジェネレーター
// 状態(state)を単一の真実の源とし、選択中の光パターンに応じてSVGフィルタを再構築する。
// ライブ描画と出力コードは同じ buildSvgInner() を使うため、見た目と出力は常に一致する。

const VIEW_H = 120; // ボタンの高さ（viewBox単位・固定）
const MARGIN = 14; // リム矩形の左右上下マージン

const panel = document.querySelector(".panel");
const btnEl = document.querySelector(".rim-btn");
const svgEl = document.querySelector(".rim-btn__svg");
const labelEl = document.querySelector(".rim-btn__label");
const outHtmlArea = document.getElementById("outHtml");
const outCssArea = document.getElementById("outCss");
const spinBtn = document.getElementById("spin");

// ── 状態 ──────────────────────────────────────────────
// 初期値はHTML側のコントロール(value/selected)から読み取る（既定値の二重管理を避ける）
let state = {};
document.querySelectorAll("[data-key]").forEach((el) => {
  state[el.dataset.key] = el.type === "range" ? Number(el.value) : el.value;
});

// ラベルのHTMLエスケープ（出力コードにそのまま貼れる形へ）
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── SVGフィルタ生成（パターン別）─────────────────────────
// feSpecularLighting 共通属性
const specAttrs = (s) =>
  `surfaceScale="${s.surfaceScale}" specularConstant="${s.constant}" specularExponent="${s.exponent}"`;

// 光源位置（%指定→viewBox座標へ換算。幅変更に強い）
const lightX = (s, w) => (s.pointXPct / 100 * w).toFixed(1);
const lightY = (s) => (s.pointYPct / 100 * VIEW_H).toFixed(1);

function buildFilterMarkup(s, w) {
  switch (s.pattern) {
    // 方向ライト：縁の片側を照らすスイープ
    case "distant":
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.lightColor}" result="spec">
          <feDistantLight class="rim-btn__light" azimuth="${Math.round(s.azimuth)}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" />`;

    // スポット：中央へ向けて絞った集光（コーン角で広がりを調整）
    case "spot":
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.lightColor}" result="spec">
          <feSpotLight class="rim-btn__light" x="${lightX(s, w)}" y="${lightY(s)}" z="${s.spotZ}"
            pointsAtX="${w / 2}" pointsAtY="${VIEW_H / 2}" pointsAtZ="0"
            specularExponent="1" limitingConeAngle="${s.coneAngle}" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" />`;

    // ネオン：光源なし。小・中・大の3段ブラーで縁全体を発光。
    // 細いリムだと広ブラーは薄くなるため、各層のアルファを feComponentTransfer で増幅して
    // 外側まで強くにじませる。増幅率は強度スライダーに比例。
    case "neon": {
      const b = s.blur;
      const gi = s.glowIntensity;
      const slope = (m) => (gi * m).toFixed(2);
      return `<feFlood flood-color="${s.glowColor}" result="tint" />
        <feGaussianBlur class="rim-btn__pulse" in="SourceAlpha" stdDeviation="${b}" result="bl1" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="${(b * 2 + 2).toFixed(2)}" result="bl2" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="${(b * 4 + 4).toFixed(2)}" result="bl3" />
        <feComposite in="tint" in2="bl1" operator="in" result="c1" />
        <feComposite in="tint" in2="bl2" operator="in" result="c2" />
        <feComposite in="tint" in2="bl3" operator="in" result="c3" />
        <feComponentTransfer in="c1" result="g1"><feFuncA type="linear" slope="${slope(2)}" /></feComponentTransfer>
        <feComponentTransfer in="c2" result="g2"><feFuncA type="linear" slope="${slope(4)}" /></feComponentTransfer>
        <feComponentTransfer in="c3" result="g3"><feFuncA type="linear" slope="${slope(6)}" /></feComponentTransfer>
        <feFlood flood-color="${s.glowColor}" result="coreFlood" />
        <feComposite in="coreFlood" in2="SourceAlpha" operator="in" result="core" />
        <feMerge>
          <feMergeNode in="g3" />
          <feMergeNode in="g2" />
          <feMergeNode in="g1" />
          <feMergeNode in="core" />
        </feMerge>`;
    }

    // デュアル：対向2灯（左右で別色）を合成
    case "dual":
      return `<feGaussianBlur in="SourceAlpha" stdDeviation="${s.blur}" result="height" />
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.leftColor}" result="spec1">
          <feDistantLight class="rim-btn__light rim-btn__light--a" azimuth="${Math.round(s.azimuth)}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feSpecularLighting in="height" ${specAttrs(s)} lighting-color="${s.rightColor}" result="spec2">
          <feDistantLight class="rim-btn__light rim-btn__light--b" azimuth="${Math.round(s.azimuth + 180) % 360}" elevation="${s.elevation}" />
        </feSpecularLighting>
        <feComposite in="spec1" in2="SourceAlpha" operator="in" result="r1" />
        <feComposite in="spec2" in2="SourceAlpha" operator="in" result="r2" />
        <feMerge>
          <feMergeNode in="r1" />
          <feMergeNode in="r2" />
        </feMerge>`;

    default:
      return "";
  }
}

// ポイント専用：放射状グラデーションで塗ったストローク＝光源位置だけが強く光る1点。
// （細いリムではspecularがどこも均一に反射し局所化できないため、グラデ方式で点を作る）
function buildPointRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  const cx = (s.pointXPct / 100 * w).toFixed(1);
  const cy = (s.pointYPct / 100 * VIEW_H).toFixed(1);
  const r = (s.pointZ * 2 + s.thickness).toFixed(1); // 光の広がり（高さスライダーで調整）
  return `
      <defs>
        <radialGradient id="rimPtGrad" class="rim-btn__ptgrad" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
          <stop offset="0" stop-color="${s.lightColor}" stop-opacity="1" />
          <stop offset="0.5" stop-color="${s.lightColor}" stop-opacity="0.35" />
          <stop offset="1" stop-color="${s.lightColor}" stop-opacity="0" />
        </radialGradient>
        <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="linearRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${s.blur}" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="url(#rimPtGrad)" stroke-width="${s.thickness}" />
      </g>`;
}

// specular方式（方向/スポット/デュアル）＋ネオン：フィルタで縁を発光させる
function buildSpecularRim(s) {
  const w = s.width;
  const rectW = w - MARGIN * 2;
  // ネオンの大きなブルームが切れないよう、ネオンだけフィルタ領域を広げる
  const region =
    s.pattern === "neon"
      ? `x="-120%" y="-120%" width="340%" height="340%"`
      : `x="-50%" y="-50%" width="200%" height="200%"`;
  return `
      <defs>
        <filter id="rimGlow" ${region} color-interpolation-filters="linearRGB">
        ${buildFilterMarkup(s, w)}
        </filter>
      </defs>
      <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="${s.fillColor}" fill-opacity="${s.fillOpacity}" />
      <g filter="url(#rimGlow)">
        <rect x="${MARGIN}" y="14" width="${rectW}" height="92" rx="${s.radius}" fill="none" stroke="#ffffff" stroke-width="${s.thickness}" />
      </g>`;
}

// defs＋リム矩形のSVG中身を返す（ライブ・出力で共用）
function buildSvgInner(s) {
  return s.pattern === "point" ? buildPointRim(s) : buildSpecularRim(s);
}

// ── ライブ描画 ────────────────────────────────────────
// camelCase属性(specularExponent等)がHTMLパーサで小文字化されるのを防ぐため、
// SVGとしてパースしてから差し込む。
function applyLive() {
  const w = state.width;
  btnEl.style.width = `${w}px`;
  svgEl.setAttribute("viewBox", `0 0 ${w} ${VIEW_H}`);
  svgEl.setAttribute("width", String(w));
  svgEl.setAttribute("height", String(VIEW_H));

  const doc = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${buildSvgInner(state)}</svg>`,
    "image/svg+xml"
  );
  if (doc.querySelector("parsererror")) {
    console.error("SVGの解析に失敗しました");
    return;
  }
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  [...doc.documentElement.childNodes].forEach((n) =>
    svgEl.appendChild(document.importNode(n, true))
  );

  labelEl.textContent = state.label;
  if (spinning) cacheTargets(); // 再描画でノードが入れ替わるため、回転中は対象を取り直す
}

// ── コントロールの出し分け ────────────────────────────
function syncControlVisibility(pattern) {
  document.querySelectorAll(".field[data-pattern]").forEach((field) => {
    const patterns = field.dataset.pattern.split(/\s+/);
    field.hidden = !patterns.includes(pattern);
  });
}

// 値表示（data-out スパン）を更新
function updateReadout(key) {
  const out = document.querySelector(`[data-out="${key}"]`);
  if (!out) return;
  const el = document.querySelector(`[data-key="${key}"]`);
  const unit = el?.dataset.unit ?? "";
  const v = el?.dataset.round ? Math.round(Number(state[key])) : state[key];
  out.textContent = `${v}${unit}`;
}

// スライダーのつまみ＋表示を現在のstateへ追従（自動回転中に使用）
function syncSlider(key) {
  const el = document.querySelector(`[data-key="${key}"]`);
  if (el) el.value = state[key];
  updateReadout(key);
}

// ── 出力コード生成 ────────────────────────────────────
function buildSpinScript(s) {
  const w = s.width;
  if (s.pattern === "neon") {
    // 脈動：にじみ(stdDeviation)をsinで揺らす
    return `\n<script>
  // 縁の発光を脈動させる
  document.querySelectorAll(".rim-btn .rim-btn__pulse").forEach((blur) => {
    const base = ${s.blur}, amp = ${Math.max(1, s.blur * 0.6).toFixed(1)};
    let t = 0;
    const speed = ${(s.speed * 0.04).toFixed(4)};
    (function tick() {
      t += speed;
      blur.setAttribute("stdDeviation", (base + amp * (0.5 + 0.5 * Math.sin(t))).toFixed(2));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "point") {
    // 光の点(放射状グラデの中心)をリムに沿って周回
    return `\n<script>
  // 光の点をリムに沿って周回させる
  document.querySelectorAll(".rim-btn .rim-btn__ptgrad").forEach((grad) => {
    const cx = ${w / 2}, cy = ${VIEW_H / 2}, rx = ${(w * 0.4).toFixed(1)}, ry = 40;
    let t = ${pointStartT(s).toFixed(4)};
    const speed = ${(s.speed * Math.PI / 180).toFixed(4)};
    (function tick() {
      t += speed;
      grad.setAttribute("cx", (cx + rx * Math.cos(t)).toFixed(1));
      grad.setAttribute("cy", (cy + ry * Math.sin(t)).toFixed(1));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "spot") {
    // ホットスポット(光源位置x,y)をリムに沿って周回
    return `\n<script>
  // 光源(ホットスポット)をリムに沿って周回させる
  document.querySelectorAll(".rim-btn").forEach((btn) => {
    const light = btn.querySelector(".rim-btn__light");
    if (!light) return;
    const cx = ${w / 2}, cy = ${VIEW_H / 2}, rx = ${(w * 0.4).toFixed(1)}, ry = 40;
    let t = ${pointStartT(s).toFixed(4)};
    const speed = ${(s.speed * Math.PI / 180).toFixed(4)};
    (function tick() {
      t += speed;
      light.setAttribute("x", (cx + rx * Math.cos(t)).toFixed(1));
      light.setAttribute("y", (cy + ry * Math.sin(t)).toFixed(1));
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  if (s.pattern === "dual") {
    // 対向2灯のazimuthを180°差を保って回す
    return `\n<script>
  // 対向2灯を180°差で回転
  document.querySelectorAll(".rim-btn").forEach((btn) => {
    const a = btn.querySelector(".rim-btn__light--a");
    const b = btn.querySelector(".rim-btn__light--b");
    let deg = ${Math.round(s.azimuth)};
    const speed = ${s.speed};
    (function tick() {
      deg = (deg + speed) % 360;
      if (a) a.setAttribute("azimuth", deg);
      if (b) b.setAttribute("azimuth", (deg + 180) % 360);
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
  }
  // distant：azimuthを回す
  return `\n<script>
  // 縁の光源角度(azimuth)を回してリムを回転発光させる
  document.querySelectorAll(".rim-btn .rim-btn__light").forEach((light) => {
    let deg = ${Math.round(s.azimuth)};
    const speed = ${s.speed}; // 1フレームあたりの角度（大きいほど速い）
    (function tick() {
      deg = (deg + speed) % 360;
      light.setAttribute("azimuth", deg);
      requestAnimationFrame(tick);
    })();
  });
<\/script>`;
}

function buildCss(w) {
  return `.rim-btn {
  position: relative;
  width: ${w}px;
  height: ${VIEW_H}px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.rim-btn .rim-btn__svg {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  overflow: visible;
}

.rim-btn__label {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-indent: 0.28em;
  color: #cfd4de;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}`;
}

function updateOutput() {
  const w = state.width;
  const script = spinning ? buildSpinScript(state) : "";
  outHtmlArea.value = `<button class="rim-btn" type="button">
  <svg class="rim-btn__svg" viewBox="0 0 ${w} ${VIEW_H}" width="${w}" height="${VIEW_H}" aria-hidden="true">${buildSvgInner(state)}
  </svg>
  <span class="rim-btn__label">${escapeHtml(state.label)}</span>
</button>${script}`;
  outCssArea.value = buildCss(w);
}

// ── 自動回転（パターン別）─────────────────────────────
let spinning = false;
let rafId = 0;
let spinT = 0; // 軌道アニメ用の位相
let targets = {}; // ライブSVG内の更新対象要素

// ポイント/スポットの現在位置から軌道の開始位相を求める（回転開始時の連続性確保）
function pointStartT(s) {
  const w = s.width;
  const cx = w / 2, cy = VIEW_H / 2, rx = w * 0.4, ry = 40;
  const x = s.pointXPct / 100 * w, y = s.pointYPct / 100 * VIEW_H;
  return Math.atan2((y - cy) / ry, (x - cx) / rx);
}

function cacheTargets() {
  targets = {
    light: svgEl.querySelector(".rim-btn__light"),
    a: svgEl.querySelector(".rim-btn__light--a"),
    b: svgEl.querySelector(".rim-btn__light--b"),
    pulse: svgEl.querySelector(".rim-btn__pulse"),
    grad: svgEl.querySelector(".rim-btn__ptgrad"),
  };
}

function tick() {
  const sp = state.speed;
  switch (state.pattern) {
    case "distant": {
      state = { ...state, azimuth: (state.azimuth + sp) % 360 };
      targets.light?.setAttribute("azimuth", String(Math.round(state.azimuth)));
      syncSlider("azimuth");
      break;
    }
    case "dual": {
      state = { ...state, azimuth: (state.azimuth + sp) % 360 };
      const deg = Math.round(state.azimuth);
      targets.a?.setAttribute("azimuth", String(deg));
      targets.b?.setAttribute("azimuth", String((deg + 180) % 360));
      syncSlider("azimuth");
      break;
    }
    case "point":
    case "spot": {
      spinT += sp * Math.PI / 180;
      const w = state.width;
      const x = w / 2 + w * 0.4 * Math.cos(spinT);
      const y = VIEW_H / 2 + 40 * Math.sin(spinT);
      if (state.pattern === "point") {
        targets.grad?.setAttribute("cx", x.toFixed(1));
        targets.grad?.setAttribute("cy", y.toFixed(1));
      } else {
        targets.light?.setAttribute("x", x.toFixed(1));
        targets.light?.setAttribute("y", y.toFixed(1));
      }
      state = { ...state, pointXPct: +(x / w * 100).toFixed(1), pointYPct: +(y / VIEW_H * 100).toFixed(1) };
      syncSlider("pointXPct");
      syncSlider("pointYPct");
      break;
    }
    case "neon": {
      spinT += sp * 0.04;
      const base = state.blur, amp = Math.max(1, state.blur * 0.6);
      targets.pulse?.setAttribute("stdDeviation", (base + amp * (0.5 + 0.5 * Math.sin(spinT))).toFixed(2));
      break;
    }
  }
  rafId = requestAnimationFrame(tick);
}

function startSpin() {
  cancelAnimationFrame(rafId); // 既存ループを止めてから開始（二重tick防止）
  spinning = true;
  spinBtn.textContent = "自動回転：ON";
  spinBtn.setAttribute("aria-pressed", "true");
  applyLive(); // 最新ノードを生成してから対象をキャッシュ
  cacheTargets();
  spinT = state.pattern === "point" || state.pattern === "spot" ? pointStartT(state) : 0;
  updateOutput(); // 出力にアニメ用<script>を添付（回転中は再生成しないので安定）
  tick();
}

function stopSpin() {
  if (!spinning) return;
  spinning = false;
  spinBtn.textContent = "自動回転：OFF";
  spinBtn.setAttribute("aria-pressed", "false");
  cancelAnimationFrame(rafId);
  applyLive();
  updateOutput();
}

spinBtn.addEventListener("click", () => {
  if (spinning) stopSpin();
  else startSpin();
});

// パターン切替時に適用する既定値（そのパターンで見栄えの良い値へ寄せる）
const PATTERN_DEFAULTS = {
  point: { thickness: 1 }, // ポイントは細いリムの方が「1点」が際立つ
  neon: { thickness: 1 }, // ネオンも細いリムの方が発光が締まる
};

// 指定キーの値をstateとスライダー・表示に反映
function applyPatternDefaults(pattern) {
  const defs = PATTERN_DEFAULTS[pattern];
  if (!defs) return;
  state = { ...state, ...defs };
  Object.keys(defs).forEach((k) => {
    const inp = document.querySelector(`[data-key="${k}"]`);
    if (inp) inp.value = state[k];
    updateReadout(k);
  });
}

// ── コントロール入力 ──────────────────────────────────
panel.addEventListener("input", (e) => {
  const el = e.target;
  const key = el.dataset.key;
  if (!key) return;
  state = { ...state, [key]: el.type === "range" ? Number(el.value) : el.value };
  if (key === "pattern") {
    applyPatternDefaults(state.pattern);
    syncControlVisibility(state.pattern);
    if (spinning) startSpin(); // 回転を維持したまま新パターンへ切替（applyLive/updateOutputも内包）
    else {
      applyLive();
      updateOutput();
    }
    updateReadout(key);
    return;
  }
  applyLive();
  updateOutput();
  updateReadout(key);
});

// リセット：全コントロールを初期値へ戻す
document.getElementById("reset").addEventListener("click", () => {
  stopSpin();
  document.querySelectorAll("[data-key]").forEach((el) => {
    if (el.tagName === "SELECT") return; // パターンは維持（リセットしない）
    el.value = el.defaultValue;
    state[el.dataset.key] = el.type === "range" ? Number(el.value) : el.value;
  });
  state = { ...state };
  applyPatternDefaults(state.pattern); // ポイント/ネオンは太さ1など、パターン既定を再適用
  syncControlVisibility(state.pattern);
  applyLive();
  document.querySelectorAll("[data-out]").forEach((o) => updateReadout(o.dataset.out));
  startSpin(); // 既定の自動回転ONへ戻す
});

// ── コピー ────────────────────────────────────────────
const bindCopy = (btnId, area, label) => {
  const btn = document.getElementById(btnId);
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
    } catch {
      area.select();
      document.execCommand("copy");
    }
    btn.textContent = "コピーしました";
    setTimeout(() => (btn.textContent = label), 1400);
  });
};
bindCopy("copyHtml", outHtmlArea, "HTMLをコピー");
bindCopy("copyCss", outCssArea, "CSSをコピー");

// ── 初期化 ────────────────────────────────────────────
syncControlVisibility(state.pattern);
applyLive();
document.querySelectorAll("[data-out]").forEach((o) => updateReadout(o.dataset.out));
updateOutput();
startSpin(); // 既定で自動回転ON
