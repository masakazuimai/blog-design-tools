// 声タブ：シーンに登場する話者ごとに性別・年代・雰囲気・速さを設定する
import { VOICE_GENDERS, VOICE_AGES, VOICE_TONES, VOICE_SPEEDS } from "./vocab.js?v=20260928a";
import { speakersOf, createVoice } from "./store.js?v=20260928a";

const FIELDS = [
  { key: "gender", label: "性別", list: VOICE_GENDERS },
  { key: "age", label: "年代", list: VOICE_AGES },
  { key: "tone", label: "雰囲気", list: VOICE_TONES },
  { key: "speed", label: "話す速さ", list: VOICE_SPEEDS },
];

let shownKey = null; // 表示中の話者一覧（変わった時だけ描き直す＝入力中のフォーカスを守る）

const card = (name, voice) => {
  const wrap = document.createElement("div");
  wrap.className = "voice-card";
  wrap.dataset.name = name;
  const title = document.createElement("div");
  title.className = "voice-name";
  title.textContent = name || "ナレーション（話す人が空欄）";
  const grid = document.createElement("div");
  grid.className = "grid2";
  FIELDS.forEach(({ key, label, list }) => {
    const field = document.createElement("label");
    field.className = "field mini";
    const cap = document.createElement("span");
    cap.textContent = label;
    const sel = document.createElement("select");
    sel.dataset.key = key;
    sel.append(...list.map((o) => new Option(o.ja, o.v, false, o.v === voice[key])));
    field.append(cap, sel);
    grid.append(field);
  });
  const note = document.createElement("label");
  note.className = "field mini";
  const cap = document.createElement("span");
  cap.textContent = "補足（任意）";
  const input = document.createElement("input");
  input.type = "text";
  input.dataset.key = "note";
  input.value = voice.note;
  input.placeholder = "例: slight Kansai accent";
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
    p.textContent = "セリフのあるシーンがまだありません。シーンにセリフを入れると、話す人ごとに声を設定できます。";
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
