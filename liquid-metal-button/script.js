/*
 * リキッドメタルボタン – 自作WebGLシェーダー（MIT License / CodeQuest.work）
 * 外部ライブラリ非依存。rep（うねりの細かさ）と angle（光の角度）で質感を変える。
 */

// --- シェーダーソース（ランタイムと生成コードで共有する単一の真実）---------
const VERT_SRC = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG_SRC = `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_rep;
uniform float u_angle;
uniform float u_speed;
uniform float u_hue;
uniform float u_sat;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec3 hue2rgb(float h) {
  h = fract(h / 360.0) * 6.0;
  return clamp(abs(mod(h + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.02 + 11.0; a *= 0.5; }
  return v;
}
void main() {
  vec2 p = gl_FragCoord.xy / u_res - 0.5;
  p.x *= u_res.x / u_res.y;
  p *= rot(radians(u_angle));
  float tm = u_time * u_speed;
  float t = tm * 0.18;
  float scale = 0.28 + u_rep * 0.5;
  float w1 = fbm(p * scale + vec2(t, t * 0.7));
  float w2 = fbm(p * scale * 1.5 - vec2(t * 0.8, t));
  float warp = (w1 + w2) * u_rep * 2.4; // repが0なら歪みゼロ＝うねり無しのなめらかな金属
  float bands = sin((p.x + p.y) * (0.6 + u_rep * 1.4) + warp + tm * 2.0);
  float m = smoothstep(0.0, 1.0, abs(bands));
  float spec = pow(1.0 - abs(bands), 7.0);
  vec3 col = mix(vec3(0.04, 0.05, 0.07), vec3(0.55, 0.58, 0.62), m);
  col = mix(col, vec3(0.97, 0.98, 1.0), spec);
  col *= mix(vec3(1.0), hue2rgb(u_hue), u_sat); // u_sat=0で白（無色）、上げるとu_hueの色がのる
  gl_FragColor = vec4(col, 1.0);
}`;

// --- WebGLレンダラー -------------------------------------------------
function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("シェーダーのコンパイルに失敗: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createLiquidMetal(container, options) {
  let rep = options && options.repetition != null ? options.repetition : 0.4;
  let ang = options && options.angle != null ? options.angle : 0;
  let spd = options && options.speed != null ? options.speed : 1;
  let hue = options && options.hue != null ? options.hue : 210;
  let sat = options && options.tint != null ? options.tint : 0;

  const canvas = document.createElement("canvas");
  canvas.className = "lm-canvas";
  container.insertBefore(canvas, container.firstChild);

  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) throw new Error("WebGLに未対応のブラウザです");

  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("プログラムのリンクに失敗: " + gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  // 画面いっぱいの三角形1枚
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uRep = gl.getUniformLocation(program, "u_rep");
  const uAngle = gl.getUniformLocation(program, "u_angle");
  const uSpeed = gl.getUniformLocation(program, "u_speed");
  const uHue = gl.getUniformLocation(program, "u_hue");
  const uSat = gl.getUniformLocation(program, "u_sat");

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(container.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(container.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  const start = performance.now();
  let raf = 0;
  function frame(now) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform1f(uRep, rep);
    gl.uniform1f(uAngle, ang);
    gl.uniform1f(uSpeed, spd);
    gl.uniform1f(uHue, hue);
    gl.uniform1f(uSat, sat);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    setParams(p) {
      if (p.repetition != null) rep = p.repetition;
      if (p.angle != null) ang = p.angle;
      if (p.speed != null) spd = p.speed;
      if (p.hue != null) hue = p.hue;
      if (p.tint != null) sat = p.tint;
    },
    dispose() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.remove();
    },
  };
}

// --- コード生成 -------------------------------------------------
// ページ言語（生成コードのコメントを日本語/英語で切替）
const IS_EN = document.documentElement.lang === "en";

// 形・リム・テーマを反映した .lm 用のCSS（fullCode と cssJsBlock で共有）
function styleBlock(rim, shape, theme) {
  const circle = shape === "circle";
  const w = circle ? 160 : 300;
  const h = circle ? 160 : 100;
  const radius = circle ? "50%" : "30px";
  const innerRadius = circle ? "50%" : `${30 - rim}px`;
  const labelSize = circle ? 18 : 26;
  const labelSpacing = circle ? "0.1em" : "0.25em";
  const light = theme === "light";
  const faceGrad = light ? "linear-gradient(#fcfcfc, #d2d2d2)" : "linear-gradient(#444, #000)";
  const faceShadow = light ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.3)";
  const labelColor = light ? "#333333" : "#65615f";
  return `<style>
.lm { position: relative; width: ${w}px; height: ${h}px; border-radius: ${radius}; overflow: hidden; cursor: pointer; }
.lm canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.lm::before {
  content: ""; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: calc(100% - ${rim * 2}px); height: calc(100% - ${rim * 2}px);
  background: ${faceGrad}; border-radius: ${innerRadius};
  box-shadow: inset 0 2px 2px 2px ${faceShadow}; z-index: 1;
}
.lm .outline { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 2; }
.lm .label { font-size: ${labelSize}px; font-weight: 700; letter-spacing: ${labelSpacing}; text-indent: ${labelSpacing}; color: ${labelColor}; }
</style>`;
}

// CSS + 呼び出しのみ（createLiquidMetal ヘルパーを別途読み込み済みの人向け）
function cssJsBlock(rep, ang, spd, hue, sat, rim, shape, theme) {
  return `<!-- ${IS_EN ? "This button's CSS + call (load the createLiquidMetal helper separately; the all-in-one snippet is in the other tab)" : "このボタンのCSS + 呼び出し（createLiquidMetal ヘルパーは別途読み込んでおく / 全部入りは「一式」タブ）"} -->
<div class="lm">
  <div class="outline"><span class="label">BUTTON</span></div>
</div>

${styleBlock(rim, shape, theme)}

<script>
createLiquidMetal(document.querySelector(".lm"), {
  repetition: ${rep},
  angle: ${ang},
  speed: ${spd},
  hue: ${hue},
  tint: ${sat},
});
<\/script>`;
}

// 他サイトへ貼ってそのまま動く自己完結スニペット（MIT・外部依存なし）
function fullCode(rep, ang, spd, hue, sat, rim, shape, theme) {
  return `<!-- ${IS_EN ? "Liquid metal button" : "リキッドメタルボタン"} (${shape} / ${theme} / rep ${rep} / angle ${ang} / speed ${spd} / hue ${hue} / tint ${sat} / rim ${rim}px) | MIT License -->
<div class="lm">
  <div class="outline"><span class="label">BUTTON</span></div>
</div>

${styleBlock(rim, shape, theme)}

<script>
(function () {
  var VERT = \`${VERT_SRC}\`;
  var FRAG = \`${FRAG_SRC}\`;
  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var box = document.querySelector(".lm");
  var canvas = document.createElement("canvas");
  box.insertBefore(canvas, box.firstChild);
  var gl = canvas.getContext("webgl", { antialias: true });
  var prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog); gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(prog, "u_res"),
      uTime = gl.getUniformLocation(prog, "u_time"),
      uRep = gl.getUniformLocation(prog, "u_rep"),
      uAngle = gl.getUniformLocation(prog, "u_angle"),
      uSpeed = gl.getUniformLocation(prog, "u_speed"),
      uHue = gl.getUniformLocation(prog, "u_hue"),
      uSat = gl.getUniformLocation(prog, "u_sat");
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(box.clientWidth * dpr);
    canvas.height = Math.round(box.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize(); window.addEventListener("resize", resize);
  var start = performance.now();
  (function loop(now) {
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform1f(uRep, ${rep});
    gl.uniform1f(uAngle, ${ang});
    gl.uniform1f(uSpeed, ${spd});
    gl.uniform1f(uHue, ${hue});
    gl.uniform1f(uSat, ${sat});
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  })(start);
})();
<\/script>`;
}

// --- テンプレート定義（プリセット） ---------------------------
const TEMPLATES = [
  { id: "FLAT", rep: 0, ang: 0, spd: 0.6 },
  { id: "A", rep: 0.4, ang: 0, spd: 1 },
  { id: "B", rep: 0.8, ang: 0, spd: 1.4 },
  { id: "C", rep: 0.4, ang: 45, spd: 1 },
  { id: "D", rep: 0.8, ang: 45, spd: 0.7 },
  { id: "E", rep: 1.5, ang: 90, spd: 1.2 },
  { id: "F", rep: 0.2, ang: 0, spd: 0.5 },
  { id: "G", rep: 1.2, ang: 45, spd: 1.8 },
  { id: "H", rep: 0.6, ang: 90, spd: 1 },
];

// --- 要素参照 ---------------------------------------------
const lm = document.querySelector(".lm");
const repSld = document.getElementById("repSld");
const angSld = document.getElementById("angSld");
const spdSld = document.getElementById("spdSld");
const rimSld = document.getElementById("rimSld");
const hueSld = document.getElementById("hueSld");
const satSld = document.getElementById("satSld");
const repVal = document.getElementById("repVal");
const angVal = document.getElementById("angVal");
const spdVal = document.getElementById("spdVal");
const rimVal = document.getElementById("rimVal");
const hueVal = document.getElementById("hueVal");
const satVal = document.getElementById("satVal");
const tplGrid = document.getElementById("tplGrid");
const codeOut = document.getElementById("codeOut");
const codeMeta = document.getElementById("codeMeta");
const copyBtn = document.getElementById("copyBtn");

let activeTab = "full"; // "full" | "params"

// --- プレビュー（単一インスタンス） -----------------------------
let instance = null;
try {
  instance = createLiquidMetal(lm, {
    repetition: parseFloat(lm.dataset.rep),
    angle: parseFloat(lm.dataset.ang),
    speed: parseFloat(lm.dataset.spd),
    hue: parseFloat(lm.dataset.hue),
    tint: parseFloat(lm.dataset.sat),
  });
} catch (error) {
  console.error("リキッドメタルの初期化に失敗しました:", error);
}

// リム太さ（CSS変数）を初期値で反映
lm.style.setProperty("--rim", `${lm.dataset.rim}px`);

// スライダー表示をプレビューの初期値に同期（ブラウザのフォーム値復元対策）
repSld.value = lm.dataset.rep;
repVal.textContent = lm.dataset.rep;
angSld.value = lm.dataset.ang;
angVal.textContent = lm.dataset.ang;
spdSld.value = lm.dataset.spd;
spdVal.textContent = lm.dataset.spd;
rimSld.value = lm.dataset.rim;
rimVal.textContent = lm.dataset.rim;
hueSld.value = lm.dataset.hue;
hueVal.textContent = lm.dataset.hue;
satSld.value = lm.dataset.sat;
satVal.textContent = lm.dataset.sat;

// --- コード生成 ---------------------------------------------
function renderCode() {
  const d = lm.dataset;
  codeMeta.textContent = `${d.shape} / rep ${d.rep} / angle ${d.ang} / speed ${d.spd} / hue ${d.hue} / tint ${d.sat} / rim ${d.rim}px`;
  codeOut.textContent =
    activeTab === "full"
      ? fullCode(d.rep, d.ang, d.spd, d.hue, d.sat, parseFloat(d.rim), d.shape, d.theme)
      : cssJsBlock(d.rep, d.ang, d.spd, d.hue, d.sat, parseFloat(d.rim), d.shape, d.theme);
}

// --- 値の反映（プレビュー + スライダー表示） ---------------------
function setRep(v) {
  lm.dataset.rep = v;
  repSld.value = v;
  repVal.textContent = v;
  if (instance) instance.setParams({ repetition: parseFloat(v) });
}
function setAng(v) {
  lm.dataset.ang = v;
  angSld.value = v;
  angVal.textContent = v;
  if (instance) instance.setParams({ angle: parseFloat(v) });
}
function setSpd(v) {
  lm.dataset.spd = v;
  spdSld.value = v;
  spdVal.textContent = v;
  if (instance) instance.setParams({ speed: parseFloat(v) });
}
function setRim(v) {
  lm.dataset.rim = v;
  rimSld.value = v;
  rimVal.textContent = v;
  lm.style.setProperty("--rim", `${v}px`);
}
function setHue(v) {
  lm.dataset.hue = v;
  hueSld.value = v;
  hueVal.textContent = v;
  if (instance) instance.setParams({ hue: parseFloat(v) });
}
function setSat(v) {
  lm.dataset.sat = v;
  satSld.value = v;
  satVal.textContent = v;
  if (instance) instance.setParams({ tint: parseFloat(v) });
}

function clearActiveTemplate() {
  tplGrid.querySelectorAll(".tpl-btn").forEach((b) => b.classList.remove("is-active"));
}

// スライダー手動操作 → 値更新（テンプレ選択は解除）
repSld.addEventListener("input", () => {
  setRep(repSld.value);
  clearActiveTemplate();
  renderCode();
});
angSld.addEventListener("input", () => {
  setAng(angSld.value);
  clearActiveTemplate();
  renderCode();
});
spdSld.addEventListener("input", () => {
  setSpd(spdSld.value);
  clearActiveTemplate();
  renderCode();
});
// リム太さ・色はテンプレ非依存のスタイル調整（テンプレ選択は維持）
rimSld.addEventListener("input", () => {
  setRim(rimSld.value);
  renderCode();
});
hueSld.addEventListener("input", () => {
  setHue(hueSld.value);
  renderCode();
});
satSld.addEventListener("input", () => {
  setSat(satSld.value);
  renderCode();
});

// --- テンプレートボタン生成 -----------------------------------
function applyTemplate(tpl, btn) {
  setRep(String(tpl.rep));
  setAng(String(tpl.ang));
  setSpd(String(tpl.spd));
  clearActiveTemplate();
  btn.classList.add("is-active");
  renderCode();
}

TEMPLATES.forEach((tpl) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tpl-btn";
  btn.innerHTML =
    `<span class="tpl-id">${tpl.id}</span>` +
    `<span class="tpl-meta">${tpl.rep}·${tpl.ang}·${tpl.spd}</span>`;
  btn.addEventListener("click", () => applyTemplate(tpl, btn));
  tplGrid.appendChild(btn);
  if (tpl.id === "FLAT") btn.classList.add("is-active"); // 初期はテンプレFLAT（プレビュー初期値と一致）
});

// --- 形セレクタ（長方形 / 丸）→ 生成コードにも反映 ----------------
document.querySelectorAll(".shape-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    lm.dataset.shape = btn.dataset.shape;
    renderCode();
  });
});

// --- 背景＝テーマ切替（プレビュー背景＋ボタン面/文字色を反転）-------
// 背景色自体はページ側なのでコードには含めないが、ボタンのテーマ（面/文字色）は反映する
const preview = document.querySelector(".preview");
document.querySelectorAll(".bg-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".bg-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    preview.dataset.bg = btn.dataset.bg;
    lm.dataset.theme = btn.dataset.bg === "light" ? "light" : "dark";
    renderCode();
  });
});

// 初期表示のコード生成
renderCode();

// --- タブ切替（一式 / パラメータのみ）---------------------------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    activeTab = tab.dataset.tab;
    renderCode();
  });
});

// --- コピー --------------------------------------------------
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = "コピーしました";
    copyBtn.classList.add("is-copied");
    setTimeout(() => {
      copyBtn.textContent = "コピー";
      copyBtn.classList.remove("is-copied");
    }, 1600);
  } catch (error) {
    console.error("クリップボードへのコピーに失敗しました:", error);
    copyBtn.textContent = "コピー失敗";
    setTimeout(() => {
      copyBtn.textContent = "コピー";
    }, 1600);
  }
});
