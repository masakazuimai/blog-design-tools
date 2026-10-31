import { merryType } from "./types/merry.js?v=20260710a";
import { cardStackType } from "./types/cardstack.js?v=20260710a";
import { vRingType } from "./types/vring.js?v=20260710a";
import { flowerType } from "./types/flower.js?v=20260710a";
import { cubeType } from "./types/cube.js?v=20260710a";
import { orbitType } from "./types/orbit.js?v=20260710a";

const TYPES = [merryType, vRingType, cardStackType, flowerType, cubeType, orbitType];
const IS_EN = document.documentElement.lang === "en";

const host = document.getElementById("host");
const ctrlWrap = document.getElementById("ctrlWrap");
const tplGrid = document.getElementById("tplGrid");
const autoBtn = document.getElementById("autoBtn");
const codeOut = document.getElementById("codeOut");
const codeMeta = document.getElementById("codeMeta");
const copyBtn = document.getElementById("copyBtn");
const preview = document.querySelector(".preview");

let type = TYPES[0];
let state = defaultsOf(type);
let autoOn = true;
let instance = null;
let sliders = {};
let vals = {};
let userTouched = false;

function defaultsOf(t) {
  const o = {};
  t.fields.forEach((f) => (o[f.key] = f.def));
  return o;
}

function autoText() {
  const label = IS_EN ? type.autoLabel.en : type.autoLabel.ja;
  return IS_EN ? `${label}: ${autoOn ? "ON" : "OFF"}` : `${label}：${autoOn ? "ON" : "OFF"}`;
}

function buildSliders() {
  ctrlWrap.innerHTML = "";
  sliders = {};
  vals = {};
  type.fields.forEach((f) => {
    const row = document.createElement("div");
    row.className = "ctrl-row";
    const labelText = f.label ? (typeof f.label === "string" ? f.label : IS_EN ? f.label.en : f.label.ja) : f.key;
    row.innerHTML =
      `<span class="ctrl-name">${labelText}</span>` +
      `<input type="range" class="sld${f.hue ? " sld-hue" : ""}" id="${f.key}Sld" min="${f.min}" max="${f.max}" step="${f.step}" value="${state[f.key]}" autocomplete="off" aria-label="${f.key}" />` +
      `<span class="ctrl-val" id="${f.key}Val">${state[f.key]}</span>`;
    ctrlWrap.appendChild(row);
    const input = row.querySelector("input");
    sliders[f.key] = input;
    vals[f.key] = row.querySelector(".ctrl-val");
    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      state[f.key] = v;
      vals[f.key].textContent = v;
      instance.update({ [f.key]: v });
      renderCode();
    });
  });
}

function mountType() {
  if (instance) instance.destroy();
  instance = type.mount(host, state, autoOn);
}

function switchType(t) {
  type = t;
  state = defaultsOf(t);
  autoOn = true;
  buildSliders();
  mountType();
  autoBtn.textContent = autoText();
  autoBtn.classList.add("is-active");
  tplGrid.querySelectorAll(".tpl-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.id === t.id));
  renderCode();
}

function renderCode() {
  codeMeta.textContent = type.meta(state, autoOn);
  codeOut.textContent = type.fullCode(state, autoOn, IS_EN);
}

function syncFromState() {
  type.fields.forEach((f) => {
    sliders[f.key].value = state[f.key];
    vals[f.key].textContent = state[f.key];
  });
  instance.update({ ...state });
  renderCode();
}

function resetToDefaults() {
  state = defaultsOf(type);
  syncFromState();
}

function guardedReset() {
  if (!userTouched) resetToDefaults();
}

TYPES.forEach((t, idx) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tpl-btn";
  btn.dataset.id = t.id;
  btn.innerHTML = `<span class="tpl-id">${IS_EN ? t.label.en : t.label.ja}</span>`;
  btn.addEventListener("click", () => {
    userTouched = true;
    switchType(t);
  });
  tplGrid.appendChild(btn);
  if (idx === 0) btn.classList.add("is-active");
});

autoBtn.addEventListener("click", () => {
  userTouched = true;
  autoOn = !autoOn;
  autoBtn.classList.toggle("is-active", autoOn);
  autoBtn.textContent = autoText();
  instance.setAuto(autoOn);
  renderCode();
});

document.querySelectorAll(".bg-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".bg-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    preview.dataset.bg = btn.dataset.bg;
  });
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(codeOut.textContent);
    copyBtn.textContent = IS_EN ? "Copied!" : "コピーしました";
    copyBtn.classList.add("is-copied");
    setTimeout(() => {
      copyBtn.textContent = IS_EN ? "Copy" : "コピー";
      copyBtn.classList.remove("is-copied");
    }, 1600);
  } catch (error) {
    console.error("クリップボードへのコピーに失敗しました:", error);
    copyBtn.textContent = IS_EN ? "Failed" : "コピー失敗";
    setTimeout(() => {
      copyBtn.textContent = IS_EN ? "Copy" : "コピー";
    }, 1600);
  }
});

document.querySelector(".c3-sidebar").addEventListener("pointerdown", () => (userTouched = true));
document.querySelector(".c3-sidebar").addEventListener("keydown", () => (userTouched = true));

buildSliders();
mountType();
autoBtn.textContent = autoText();
renderCode();

window.addEventListener("load", () => {
  requestAnimationFrame(guardedReset);
  setTimeout(guardedReset, 350);
  setTimeout(guardedReset, 900);
});
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    userTouched = false;
    requestAnimationFrame(guardedReset);
    setTimeout(guardedReset, 350);
  }
});
