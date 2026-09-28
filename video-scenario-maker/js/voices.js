// 声タブ：シーンに登場する話者ごとに性別・年代・雰囲気・速さを設定する
import { VOICE_GENDERS, VOICE_AGES, VOICE_TONES, VOICE_SPEEDS } from "./vocab.js?v=20260928b";
import { speakersOf, createVoice } from "./store.js?v=20260928b";
import { T, label as optLabel } from "./i18n.js?v=20260928b";

const FIELDS = [
  { key: "gender", label: T.voiceFields.gender, list: VOICE_GENDERS },
  { key: "age", label: T.voiceFields.age, list: VOICE_AGES },
  { key: "tone", label: T.voiceFields.tone, list: VOICE_TONES },
  { key: "speed", label: T.voiceFields.speed, list: VOICE_SPEEDS },
];

let shownKey = null; // 表示中の話者一覧（変わった時だけ描き直す＝入力中のフォーカスを守る）

const card = (name, voice) => {
  const wrap = document.createElement("div");
  wrap.className = "voice-card";
  wrap.dataset.name = name;
  const title = document.createElement("div");
  title.className = "voice-name";
  title.textContent = name || T.narrator;
  const grid = document.createElement("div");
  grid.className = "grid2";
  FIELDS.forEach(({ key, label, list }) => {
    const field = document.createElement("label");
    field.className = "field mini";
    const cap = document.createElement("span");
    cap.textContent = label;
    const sel = document.createElement("select");
    sel.dataset.key = key;
    sel.append(...list.map((o) => new Option(optLabel(o), o.v, false, o.v === voice[key])));
    field.append(cap, sel);
    grid.append(field);
  });
  const note = document.createElement("label");
  note.className = "field mini";
  const cap = document.createElement("span");
  cap.textContent = T.voiceNote;
  const input = document.createElement("input");
  input.type = "text";
  input.dataset.key = "note";
  input.value = voice.note;
  input.placeholder = T.voiceNotePh;
  note.append(cap, input);
  wrap.append(title, grid, note);
  return wrap;
};

export const renderVoices = (el, project, { force = false } = {}) => {
  const names = speakersOf(project.scenes);
  const key = JSON.stringify(names);
  // 入力欄の候補（インスペクターの「話す人」）も話者一覧に合わせる
  const list = document.getElementById("speakerList");
  list.replaceChildren(...names.filter(Boolean).map((n) => new Option(n)));
  if (!force && key === shownKey) return;
  shownKey = key;
  if (!names.length) {
    const p = document.createElement("p");
    p.className = "note";
    p.textContent = T.noSpeakers;
    el.replaceChildren(p);
    return;
  }
  el.replaceChildren(...names.map((n) => card(n, createVoice(project.voices[n]))));
};

export const bindVoices = (el, onVoice) => {
  const handle = (e) => {
    const key = e.target.dataset.key;
    const name = e.target.closest(".voice-card")?.dataset.name;
    if (key && name != null) onVoice(name, { [key]: e.target.value });
  };
  el.addEventListener("change", handle);
  el.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT") handle(e);
  });
};
