import { GUARD, HIDE_JS, hideCss, ease, TRACK_JS } from "./_shared.js?v=20261112a";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";

const HTML = `<canvas class="stalker" aria-hidden="true"></canvas>`;

function css(o, fade = true) {
  return `.stalker {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;${
    fade
      ? `
  opacity: 0;
  transition: opacity 0.4s;
}
.stalker.is-active {
  opacity: 1;`
      : ""
  }
}
${hideCss(o)}`;
}

function wrap(o, body) {
  return `(async () => {
${GUARD}
  const el = document.querySelector(".stalker");
${o.hide ? HIDE_JS + "\n" : ""}  const THREE = await import("${THREE_URL}");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10);
  let W = 1, H = 1;
  const fit = () => {
    W = document.documentElement.clientWidth;
    H = document.documentElement.clientHeight;
    renderer.setSize(W, H);
    camera.right = W;
    camera.bottom = -H;
    camera.updateProjectionMatrix();
  };
  fit();
  addEventListener("resize", fit);
${TRACK_JS}
${body}
})();`;
}

const COVER_GLSL = [
  "vec2 cover(vec2 uv) { return clamp((uv - 0.5) * uCover + 0.5, 0.0, 1.0); }",
  "bool outside(vec2 px) {",
  "  vec2 q = abs(px - uClip.xy - uClip.zw * 0.5) - uClip.zw * 0.5 + uRad;",
  "  return length(max(q, 0.0)) - uRad > 0.0;",
  "}",
];

const IMAGES_JS = `  const loader = new THREE.TextureLoader();
  const load = async (src) => {
    const tex = await loader.loadAsync(src).catch(() => null);
    if (tex) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };
  const items = [];
  for (const t of document.querySelectorAll("img, [data-stalker-gl]")) {
    const bg = getComputedStyle(t).backgroundImage.match(/url\\(["']?(.*?)["']?\\)/);
    const src = t.tagName === "IMG" ? t.currentSrc || t.src : bg && bg[1];
    const tex = src && (await load(src));
    if (!tex) continue;
    let clip = t;
    for (let k = 0; k < 3 && clip && getComputedStyle(clip).overflow === "visible"; k++) clip = clip.parentElement;
    if (!clip || getComputedStyle(clip).overflow === "visible") clip = t;
    const u = {
      uTex: { value: tex },
      uRect: { value: new THREE.Vector4() },
      uClip: { value: new THREE.Vector4() },
      uRad: { value: parseFloat(getComputedStyle(clip).borderTopLeftRadius) || 0 },
      uCover: { value: new THREE.Vector2(1, 1) },
    };
    items.push({ t, clip, u, aspect: tex.image.width / tex.image.height });
  }
  const place = (it) => {
    const r = it.t.getBoundingClientRect();
    const c = it.clip.getBoundingClientRect();
    it.u.uRect.value.set(r.left, r.top, r.width, r.height);
    it.u.uClip.value.set(c.left, c.top, c.width, c.height);
    const ra = r.width / r.height;
    it.u.uCover.value.set(Math.min(1, ra / it.aspect), Math.min(1, it.aspect / ra));
  };
  const PLANE_VS = "varying vec2 vUv;\\nvoid main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
  const plane = (it, uniforms, fs) => {
    const mat = new THREE.ShaderMaterial({ uniforms: { ...it.u, ...uniforms }, vertexShader: PLANE_VS, fragmentShader: fs, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    scene.add(mesh);
    return mesh;
  };
  const fitPlane = (it, mesh) => {
    const r = it.u.uRect.value;
    mesh.position.set(r.x + r.z / 2, -(r.y + r.w / 2), 0);
    mesh.scale.set(r.z, r.w, 1);
  };`;

function glsl(lines) {
  return `[\n${lines.map((l) => `    ${JSON.stringify(l)},`).join("\n")}\n  ].join("\\n")`;
}

const ink = {
  id: "ink-trail",
  label: "フルイド（流体）",
  aka: "インクの残像",
  desc: "色のインクが煙のように尾を引いて広がり、ゆっくり溶けて消えます。ページの頭の大きな背景の上で映えます。",
  uses: ["color", "size", "hide"],
  defaults: { size: 70, color: "#6366f1" },
  range: { size: [20, 200] },
  three: true,
  build(o) {
    return {
      html: HTML,
      css: css(o, false),
      js: wrap(
        o,
        `  const quad = new THREE.PlaneGeometry(2, 2);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const VS = "varying vec2 vUv;\\nvoid main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
  const opts = { type: THREE.HalfFloatType };
  let rtA = new THREE.WebGLRenderTarget(1, 1, opts);
  let rtB = new THREE.WebGLRenderTarget(1, 1, opts);
  const sizeTargets = () => {
    rtA.setSize(W >> 1, H >> 1);
    rtB.setSize(W >> 1, H >> 1);
  };
  sizeTargets();
  addEventListener("resize", sizeTargets);
  const base = new THREE.Color("${o.color}");
  const feed = new THREE.ShaderMaterial({
    uniforms: {
      uPrev: { value: null },
      uMouse: { value: new THREE.Vector2(-1, -1) },
      uVel: { value: 0 },
      uRadius: { value: 0.001 },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
    },
    vertexShader: VS,
    fragmentShader: ${glsl([
      "uniform sampler2D uPrev;",
      "uniform vec2 uMouse;",
      "uniform float uVel;",
      "uniform float uRadius;",
      "uniform float uAspect;",
      "uniform float uTime;",
      "uniform vec3 uColor;",
      "varying vec2 vUv;",
      "void main() {",
      "  vec2 n = vec2(sin(vUv.y * 9.0 + uTime * 0.8), cos(vUv.x * 9.0 - uTime * 0.7)) * 0.0016;",
      "  vec4 c = texture2D(uPrev, vUv - n) * 0.99;",
      "  vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);",
      "  float s = exp(-dot(d, d) / uRadius) * uVel;",
      "  c = mix(c, vec4(uColor, 1.0), clamp(s * 0.55, 0.0, 1.0));",
      "  gl_FragColor = clamp(c, 0.0, 1.0);",
      "}",
    ])},
  });
  const show = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null } },
    vertexShader: VS,
    fragmentShader: "uniform sampler2D uTex;\\nvarying vec2 vUv;\\nvoid main() { vec4 c = texture2D(uTex, vUv); gl_FragColor = vec4(c.rgb, c.a) * 0.8; }",
    transparent: true,
    premultipliedAlpha: true,
  });
  const feedScene = new THREE.Scene();
  feedScene.add(new THREE.Mesh(quad, feed));
  const showScene = new THREE.Scene();
  showScene.add(new THREE.Mesh(quad, show));
  const clock = new THREE.Clock();
  let px = -1, py = -1;
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    const ux = mx / W;
    const uy = 1 - my / H;
    const step = px < 0 ? 0 : Math.hypot(ux - px, uy - py);
    const v = step > 0.0005 ? Math.min(0.3 + step * 80, 1) : 0;
    px = ux;
    py = uy;
    const f = feed.uniforms;
    f.uPrev.value = rtA.texture;
    f.uMouse.value.set(ux, uy);
    f.uVel.value = active ? v : 0;
    f.uRadius.value = Math.pow((${o.size} * 1.4) / H, 2);
    f.uAspect.value = W / H;
    f.uTime.value = t;
    f.uColor.value.copy(base).offsetHSL(Math.sin(t * 0.35) * 0.02, 0, 0);
    renderer.setRenderTarget(rtB);
    renderer.render(feedScene, cam);
    [rtA, rtB] = [rtB, rtA];
    renderer.setRenderTarget(null);
    show.uniforms.uTex.value = rtA.texture;
    renderer.render(showScene, cam);
  });`
      ),
    };
  },
};

const rgb = {
  id: "rgb-shift",
  label: "グリッチ",
  aka: "画像の色ずれ RGBずれ",
  desc: "画像の上でマウスを動かすと、動かした向きに赤・緑・青がずれて画像が波打ち、止めると元に戻ります。",
  uses: ["size", "hide"],
  defaults: { size: 160 },
  range: { size: [60, 320] },
  three: true,
  build(o) {
    return {
      html: HTML,
      css: css(o, false),
      js: wrap(
        o,
        `${IMAGES_JS}
  const shared = { uMouse: { value: new THREE.Vector2(-999, -999) }, uVel: { value: new THREE.Vector2() }, uR: { value: ${o.size} } };
  const FS = ${glsl([
    "uniform sampler2D uTex;",
    "uniform vec4 uRect;",
    "uniform vec4 uClip;",
    "uniform float uRad;",
    "uniform vec2 uCover;",
    "uniform vec2 uMouse;",
    "uniform vec2 uVel;",
    "uniform float uR;",
    "varying vec2 vUv;",
    ...COVER_GLSL,
    "void main() {",
    "  vec2 px = vec2(uRect.x + vUv.x * uRect.z, uRect.y + (1.0 - vUv.y) * uRect.w);",
    "  if (outside(px)) discard;",
    "  float f = smoothstep(uR, 0.0, length(px - uMouse));",
    "  vec2 sh = uVel * f * 1.6;",
    "  vec2 wave = vec2(sin(px.y * 0.04 + length(uVel) * 0.15), sin(px.x * 0.05 + length(uVel) * 0.2)) * f * length(uVel) * 0.3;",
    "  vec2 o1 = vec2(sh.x, -sh.y) / uRect.zw;",
    "  vec2 o0 = vec2(wave.x, -wave.y) / uRect.zw;",
    "  float r = texture2D(uTex, cover(vUv + o0 + o1)).r;",
    "  float g = texture2D(uTex, cover(vUv + o0)).g;",
    "  float b = texture2D(uTex, cover(vUv + o0 - o1)).b;",
    "  gl_FragColor = vec4(r, g, b, 1.0);",
    "  #include <colorspace_fragment>",
    "}",
  ])};
  const meshes = items.map((it) => plane(it, shared, FS));
  let lx = mx, ly = my;
  renderer.setAnimationLoop(() => {
    const vx = mx - lx;
    const vy = my - ly;
    lx = mx;
    ly = my;
    const v = shared.uVel.value;
    v.set(v.x + (Math.max(-60, Math.min(60, vx * 1.6)) - v.x) * 0.2, v.y + (Math.max(-60, Math.min(60, vy * 1.6)) - v.y) * 0.2);
    shared.uMouse.value.set(mx, my);
    items.forEach((it, i) => {
      place(it);
      fitPlane(it, meshes[i]);
    });
    renderer.render(scene, camera);
  });`
      ),
    };
  },
};

const BRUSHES = {
  ink: {
    post: "m = smoothstep(0.15, 0.6, m + (noise(px) - 0.5) * 0.2);",
    draw: `    const steps = Math.max(1, Math.ceil(dist / 6));
    for (let k = 1; k <= steps; k++) {
      const x = lx + ((mx - lx) * k) / steps;
      const y = ly + ((my - ly) * k) / steps;
      const g = mc.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, "rgba(0, 0, 0, 0.5)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      mc.fillStyle = g;
      mc.fillRect(x - R, y - R, R * 2, R * 2);
    }`,
  },
  pen: {
    post: "m = smoothstep(0.12, 0.4, m);",
    draw: `    mc.lineCap = "round";
    mc.lineWidth = Math.max(3, R * 0.16);
    mc.beginPath();
    mc.moveTo(lx, ly);
    mc.lineTo(mx, my);
    mc.stroke();`,
  },
  art: {
    post: "m = smoothstep(0.02, 0.25, m);",
    setup: `  const tip = new Image();
  tip.src = "images/stalker-brush.webp";
  let lastAng = 0;`,
    draw: `    if (tip.naturalWidth) {
      const TW = tip.naturalWidth;
      const TH = tip.naturalHeight;
      const w = R * 1.4;
      const k = TH / w;
      const ang = Math.atan2(my - ly, mx - lx);
      if (!travel) lastAng = ang;
      let da = ang - lastAng;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      const head = TW * 0.14;
      const steps = Math.max(1, Math.ceil(dist / 2));
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const seg = dist / steps;
        const pos = travel * k;
        const sx = pos < head ? pos : head + ((pos - head) % (TW * 0.7));
        const sw = Math.max(1, Math.min(seg * k, TW - sx));
        mc.save();
        mc.translate(lx + (mx - lx) * t, ly + (my - ly) * t);
        mc.rotate(lastAng + da * t);
        mc.drawImage(tip, sx, 0, sw, TH, -1, -w / 2, sw / k + 2, w);
        mc.restore();
        travel += seg;
      }
      lastAng = ang;
    }`,
    end: `      if (travel > 0 && tip.naturalWidth) {
        const TW = tip.naturalWidth;
        const TH = tip.naturalHeight;
        const w = R * 1.4;
        const k = TH / w;
        const tl = TW * 0.16;
        mc.save();
        mc.translate(lx, ly);
        mc.rotate(lastAng);
        mc.drawImage(tip, TW - tl, 0, tl, TH, -2, -w / 2, tl / k, w);
        mc.restore();
      }`,
  },
  spray: {
    post: "m = smoothstep(0.1, 0.3, m);",
    draw: `    const steps = Math.max(1, Math.ceil(dist / 6));
    for (let k = 1; k <= steps; k++) {
      const x = lx + ((mx - lx) * k) / steps;
      const y = ly + ((my - ly) * k) / steps;
      for (let j = 0; j < 160; j++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 1.4) * R;
        mc.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 2.5, 2.5);
      }
    }`,
  },
};

const reveal = {
  id: "image-reveal-mask",
  label: "マスクリビール",
  aka: "もう1枚の画像が透ける",
  desc: "画像をなぞった所だけ、重ねた別の画像が現れ、少したつと元に戻ります。なぞる形はにじみ・ペン・筆・スプレーから選べます。",
  uses: ["size", "hide", "brush"],
  files: (o) => (o.brush === "art" ? ["stalker-brush.webp"] : []),
  defaults: { size: 90, brush: "ink" },
  range: { size: [30, 160] },
  three: true,
  build(o) {
    const b = BRUSHES[o.brush] || BRUSHES.ink;
    return {
      html: HTML,
      css: css(o, false),
      js: wrap(
        o,
        `${IMAGES_JS}
  const R = ${o.size};
  const mask = document.createElement("canvas");
  const mc = mask.getContext("2d");
  const sizeMask = () => {
    mask.width = W;
    mask.height = H;
  };
  sizeMask();
  addEventListener("resize", sizeMask);
  const maskTex = new THREE.CanvasTexture(mask);
  const shared = { uMask: { value: maskTex }, uView: { value: new THREE.Vector2(W, H) }, uTime: { value: 0 } };
  const FS = ${glsl([
    "uniform sampler2D uTex;",
    "uniform sampler2D uTex2;",
    "uniform float uHas2;",
    "uniform vec4 uRect;",
    "uniform vec4 uClip;",
    "uniform float uRad;",
    "uniform vec2 uCover;",
    "uniform vec2 uCover2;",
    "uniform sampler2D uMask;",
    "uniform vec2 uView;",
    "uniform float uTime;",
    "varying vec2 vUv;",
    ...COVER_GLSL,
    "float noise(vec2 p) { return sin(p.x * 0.11 + sin(p.y * 0.07)) * sin(p.y * 0.13 + uTime) * 0.5 + 0.5; }",
    "void main() {",
    "  vec2 px = vec2(uRect.x + vUv.x * uRect.z, uRect.y + (1.0 - vUv.y) * uRect.w);",
    "  if (outside(px)) discard;",
    "  float m = texture2D(uMask, vec2(px.x / uView.x, 1.0 - px.y / uView.y)).a;",
    `  ${b.post}`,
    "  vec4 a = texture2D(uTex, cover(vUv));",
    "  vec4 b = uHas2 > 0.5 ? texture2D(uTex2, clamp((vUv - 0.5) * uCover2 + 0.5, 0.0, 1.0)) : vec4(vec3(dot(a.rgb, vec3(0.3, 0.59, 0.11))), 1.0);",
    "  gl_FragColor = mix(a, b, m);",
    "  #include <colorspace_fragment>",
    "}",
  ])};
  const meshes = [];
  for (const it of items) {
    const src2 = it.t.dataset.stalkerReveal;
    const tex2 = src2 ? await load(src2) : null;
    const extra = { ...shared, uTex2: { value: tex2 }, uHas2: { value: tex2 ? 1 : 0 }, uCover2: { value: new THREE.Vector2(1, 1) } };
    it.aspect2 = tex2 ? tex2.image.width / tex2.image.height : 1;
    it.extra = extra;
    meshes.push(plane(it, extra, FS));
  }
  const clock = new THREE.Clock();
  let lx = -999, ly = -999, tick = 0, travel = 0, idle = 0;
${b.setup || ""}
  renderer.setAnimationLoop(() => {
    shared.uTime.value = clock.getElapsedTime();
    shared.uView.value.set(W, H);
    if (++tick % 3 === 0) {
      mc.globalCompositeOperation = "destination-out";
      mc.fillStyle = "rgba(0, 0, 0, 0.03)";
      mc.fillRect(0, 0, W, H);
      mc.globalCompositeOperation = "source-over";
    }
    mc.fillStyle = "#000";
    mc.strokeStyle = "#000";
    const dist = Math.hypot(mx - lx, my - ly);
    if (lx < -900 || dist > 300 || !active) {
      lx = mx;
      ly = my;
      travel = 0;
    } else if (dist > 2) {
      idle = 0;
${b.draw}
      lx = mx;
      ly = my;
    } else if (++idle === 24) {
${b.end || ""}
      travel = 0;
    }
    maskTex.needsUpdate = true;
    items.forEach((it, i) => {
      place(it);
      const r = it.u.uRect.value;
      const ra = r.z / r.w;
      it.extra.uCover2.value.set(Math.min(1, ra / it.aspect2), Math.min(1, it.aspect2 / ra));
      fitPlane(it, meshes[i]);
    });
    renderer.render(scene, camera);
  });`
      ),
    };
  },
};

const crumble = {
  id: "image-crumble",
  label: "ディゾルブ",
  aka: "画像が粒に崩れる",
  desc: "画像に乗ると、マウスの周りが細かい粒になって散り、離れるとまた画像に戻ります。",
  uses: ["size", "hide"],
  defaults: { size: 90 },
  range: { size: [40, 200] },
  three: true,
  build(o) {
    return {
      html: HTML,
      css: css(o, false),
      js: wrap(
        o,
        `${IMAGES_JS}
  const STEP = 2;
  const shared = { uMouse: { value: new THREE.Vector2(-999, -999) }, uR: { value: ${o.size} }, uStr: { value: 0 }, uSize: { value: STEP * renderer.getPixelRatio() + 0.6 } };
  const VS = ${glsl([
    "attribute vec2 aUv;",
    "uniform vec4 uRect;",
    "uniform vec2 uMouse;",
    "uniform float uR;",
    "uniform float uStr;",
    "uniform float uSize;",
    "varying vec2 vUv;",
    "varying vec2 vPx;",
    "varying float vF;",
    "void main() {",
    "  vUv = aUv;",
    "  vec2 px = uRect.xy + aUv * uRect.zw;",
    "  vPx = px;",
    "  vec2 d = px - uMouse;",
    "  float f = smoothstep(uR, 0.0, length(d)) * uStr;",
    "  vF = f;",
    "  float h = fract(sin(dot(aUv, vec2(12.9898, 78.233))) * 43758.5453);",
    "  float k = fract(h * 7.31);",
    "  px += normalize(d + 0.001) * f * uR * (0.4 + h) + vec2(h - 0.5, k - 0.5) * f * uR * 0.9;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(px.x, -px.y, 0.0, 1.0);",
    "  gl_PointSize = f < 0.04 ? 0.0 : uSize * (1.0 - f * 0.55);",
    "}",
  ])};
  const FS = ${glsl([
    "uniform sampler2D uTex;",
    "uniform vec4 uClip;",
    "uniform float uRad;",
    "uniform vec2 uCover;",
    "varying vec2 vUv;",
    "varying vec2 vPx;",
    "varying float vF;",
    ...COVER_GLSL,
    "void main() {",
    "  if (vF < 0.04 || outside(vPx)) discard;",
    "  gl_FragColor = vec4(texture2D(uTex, cover(vec2(vUv.x, 1.0 - vUv.y))).rgb, smoothstep(0.04, 0.22, vF));",
    "  #include <colorspace_fragment>",
    "}",
  ])};
  const BASE_FS = ${glsl([
    "uniform sampler2D uTex;",
    "uniform vec4 uRect;",
    "uniform vec4 uClip;",
    "uniform float uRad;",
    "uniform vec2 uCover;",
    "uniform vec2 uMouse;",
    "uniform float uR;",
    "uniform float uStr;",
    "varying vec2 vUv;",
    ...COVER_GLSL,
    "void main() {",
    "  vec2 px = vec2(uRect.x + vUv.x * uRect.z, uRect.y + (1.0 - vUv.y) * uRect.w);",
    "  if (outside(px)) discard;",
    "  float f = smoothstep(uR, 0.0, length(px - uMouse)) * uStr;",
    "  float a = 1.0 - smoothstep(0.04, 0.22, f);",
    "  if (a <= 0.0) discard;",
    "  gl_FragColor = vec4(texture2D(uTex, cover(vUv)).rgb, a);",
    "  #include <colorspace_fragment>",
    "}",
  ])};
  const bases = items.map((it) => plane(it, shared, BASE_FS));
  for (const it of items) {
    const r = it.t.getBoundingClientRect();
    const cols = Math.max(2, Math.round(r.width / STEP));
    const rows = Math.max(2, Math.round(r.height / STEP));
    const uv = new Float32Array(cols * rows * 2);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 2;
        uv[i] = (x + 0.5) / cols;
        uv[i + 1] = (y + 0.5) / rows;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(cols * rows * 3), 3));
    geo.setAttribute("aUv", new THREE.BufferAttribute(uv, 2));
    const pts = new THREE.Points(geo, new THREE.ShaderMaterial({ uniforms: { ...it.u, ...shared }, vertexShader: VS, fragmentShader: FS, transparent: true }));
    pts.frustumCulled = false;
    pts.renderOrder = 1;
    scene.add(pts);
    it.t.style.visibility = "hidden";
  }
  renderer.setAnimationLoop(() => {
    const over = items.some((it) => {
      const r = it.t.getBoundingClientRect();
      return mx > r.left - 40 && mx < r.right + 40 && my > r.top - 40 && my < r.bottom + 40;
    });
    shared.uStr.value += ((over && active ? 1 : 0) - shared.uStr.value) * 0.08;
    const m = shared.uMouse.value;
    m.set(m.x < -900 ? mx : m.x + (mx - m.x) * ${ease({ lag: 50 })}, m.y < -900 ? my : m.y + (my - m.y) * ${ease({ lag: 50 })});
    items.forEach((it, i) => {
      place(it);
      fitPlane(it, bases[i]);
    });
    renderer.render(scene, camera);
  });`
      ),
    };
  },
};

export const PRO_WEBGL = [ink, rgb, reveal, crumble];
