// 配線：状態の更新 → 保存 → プレビュー・タイムライン・インスペクター・出力の再描画
import {
  ASPECTS, STYLES, MOODS, SPEECH_LANGS, DIALOGUE_MODES, BGM_GENRES, BGM_MOODS, pick,
} from "./vocab.js?v=20260928b";
import {
  createProject, createScene, loadProject, saveProject, normalize, totalDuration,
  updateScene, removeScene, moveScene, duplicateScene,
} from "./store.js?v=20260928b";
import { createPlayer } from "./preview.js?v=20260928b";
import { createTimeline } from "./timeline.js?v=20260928b";
import { renderInspector, bindInspector } from "./inspector.js?v=20260928b";
import { renderOutput, bindOutput } from "./output.js?v=20260928b";
import { renderVoices, bindVoices } from "./voices.js?v=20260928b";
import { T, label } from "./i18n.js?v=20260928b";

const $ = (id) => document.getElementById(id);
const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

let project = createProject();
let selectedId = project.scenes[0].id;

// ── トースト ──
let toastTimer = 0;
const toast = (msg) => {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 2200);
};

const timeline = createTimeline(
  {
    inner: $("tlInner"), ruler: $("ruler"), video: $("laneVideo"), sub: $("laneSub"), audio: $("laneAudio"),
    target: $("targetLine"), playhead: $("playhead"), zoom: $("zoom"),
  },
  {
    onSelect: (id) => select(id, { seek: true }),
    onSeek: (t) => player.seek(t),
    onResize: (id, dur) => commit({ ...project, scenes: updateScene(project.scenes, id, { dur }) }),
  }
);

const player = createPlayer(
  {
    stage: $("stage"), frame: $("frame"), img: $("pvImg"), empty: $("pvEmpty"),
    caption: $("pvCaption"), speaker: $("pvSpeaker"), play: $("play"), toStart: $("toStart"), time: $("time"),
  },
  { onScene: (id) => timeline.markPlaying(id), onTime: (t) => timeline.setPlayhead(t) }
);

// ── 更新の入口 ──
const commit = (next) => {
  project = next;
  if (!project.scenes.some((s) => s.id === selectedId)) selectedId = project.scenes[0].id;
  saveProject(project, () => toast(T.saveFailed));
  player.setProject(project);
  timeline.update(project, selectedId);
  renderInspector(project, selectedId);
  renderStatus();
  renderVoices($("voices"), project);
  renderOutput(project);
};

function select(id, { seek = false } = {}) {
  selectedId = id;
  timeline.update(project, selectedId);
  renderInspector(project, selectedId);
  if (seek) player.seekToScene(id);
}

const setBgm = (patch) => commit({ ...project, bgm: { ...project.bgm, ...patch } });

bindVoices($("voices"), (name, patch) =>
  commit({ ...project, voices: { ...project.voices, [name]: { ...project.voices[name], ...patch } } })
);

const renderStatus = () => {
  const total = totalDuration(project.scenes);
  $("total").textContent = T.total(project.scenes.length, total, project.target);
  $("aspectTag").textContent = label(pick(ASPECTS, project.aspect));
  const over = project.target && total > project.target;
  const long = project.scenes.some((s) => s.dur > 10);
  const warn = [
    over ? T.over(project.target, Math.round((total - project.target) * 10) / 10) : "",
    long ? T.long : "",
  ].filter(Boolean).join(" ");
  $("warn").hidden = !warn;
  $("warn").textContent = warn;
};

// ── チップ（data-single があれば単一選択、なければ複数選択） ──
const mountChips = (el, list, get, set) => {
  const multi = !("single" in el.dataset);
  el.replaceChildren(
    ...list.map((o) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.dataset.v = o.v;
      b.textContent = label(o);
      return b;
    })
  );
  const paint = () => {
    const cur = get();
    el.querySelectorAll(".chip").forEach((b) => {
      const on = multi ? cur.includes(b.dataset.v) : cur === b.dataset.v;
      b.setAttribute("aria-pressed", String(on));
    });
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const v = b.dataset.v;
    if (!multi) set(v);
    else {
      const cur = get();
      set(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    }
    paint();
  });
  return paint;
};

const painters = [
  mountChips($("aspect"), ASPECTS, () => project.aspect, (v) => commit({ ...project, aspect: v })),
  mountChips($("style"), STYLES, () => project.style, (v) => commit({ ...project, style: v })),
  mountChips($("mood"), MOODS, () => project.mood, (v) => commit({ ...project, mood: v })),
  mountChips($("speechLang"), SPEECH_LANGS, () => project.speechLang, (v) => commit({ ...project, speechLang: v })),
  mountChips($("dialogue"), DIALOGUE_MODES, () => project.dialogue, (v) => commit({ ...project, dialogue: v })),
  mountChips($("bgmGenres"), BGM_GENRES, () => project.bgm.genres, (v) => setBgm({ genres: v })),
  mountChips($("bgmMoods"), BGM_MOODS, () => project.bgm.moods, (v) => setBgm({ moods: v })),
];

// ── 左ペインのタブ ──
document.querySelector('[data-group="left"]').addEventListener("click", (e) => {
  const b = e.target.closest("[data-pane]");
  if (!b) return;
  document.querySelectorAll('[data-group="left"] [data-pane]').forEach((x) => {
    x.setAttribute("aria-selected", String(x === b));
  });
  document.querySelectorAll("[data-pane-body]").forEach((x) => {
    x.hidden = x.dataset.paneBody !== b.dataset.pane;
  });
});

// ── 全体設定・BGMのフォーム ──
const fillForm = () => {
  $("title").value = project.title;
  $("styleNote").value = project.styleNote;
  $("noText").checked = project.noText;
  $("target").value = String(project.target);
  $("bpm").value = String(project.bgm.bpm);
  $("bpmV").textContent = `${project.bgm.bpm} BPM`;
  $("vocals").checked = project.bgm.vocals;
  $("instruments").value = project.bgm.instruments;
  $("bgmVol").value = String(Math.round(project.bgm.volume * 100));
  $("bgmVolV").textContent = `${Math.round(project.bgm.volume * 100)}%`;
  $("bgmOffset").value = String(project.bgm.offset);
  $("bgmName").textContent = project.bgm.fileName || T.noFile;
  $("bgmClear").hidden = !project.bgm.file;
  painters.forEach((p) => p());
};

const clampNum = (v, min, max) => Math.min(max, Math.max(min, Number(v) || 0));

$("title").addEventListener("input", (e) => commit({ ...project, title: e.target.value }));
$("styleNote").addEventListener("input", (e) => commit({ ...project, styleNote: e.target.value }));
$("noText").addEventListener("change", (e) => commit({ ...project, noText: e.target.checked }));
$("target").addEventListener("input", (e) => commit({ ...project, target: clampNum(e.target.value, 0, 3600) }));
$("bpm").addEventListener("input", (e) => {
  $("bpmV").textContent = `${e.target.value} BPM`;
  setBgm({ bpm: Number(e.target.value) });
});
$("vocals").addEventListener("change", (e) => setBgm({ vocals: e.target.checked }));
$("instruments").addEventListener("input", (e) => setBgm({ instruments: e.target.value }));
$("bgmVol").addEventListener("input", (e) => {
  $("bgmVolV").textContent = `${e.target.value}%`;
  setBgm({ volume: Number(e.target.value) / 100 });
});
$("bgmOffset").addEventListener("input", (e) => setBgm({ offset: clampNum(e.target.value, 0, 3600) }));

$("bgmFile").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("audio/")) return toast(T.notAudio);
  if (file.size > MAX_AUDIO_BYTES) return toast(T.audioTooBig);
  setBgm({ file, fileName: file.name });
  fillForm();
});
$("bgmClear").addEventListener("click", () => {
  player.pause();
  setBgm({ file: null, fileName: "" });
  fillForm();
});

// ── シーン（インスペクター） ──
bindInspector({
  onField: (patch) => commit({ ...project, scenes: updateScene(project.scenes, selectedId, patch) }),
  onError: toast,
  onAction: (act) => {
    const s = project.scenes;
    const i = s.findIndex((x) => x.id === selectedId);
    if (act === "del" && s.length > 1) {
      const neighbor = s[i + 1] || s[i - 1];
      commit({ ...project, scenes: removeScene(s, selectedId) });
      select(neighbor.id);
      return;
    }
    if (act === "dup") {
      const next = duplicateScene(s, selectedId);
      commit({ ...project, scenes: next });
      select(next[i + 1].id, { seek: true });
      return;
    }
    const delta = { up: -1, down: 1 }[act];
    if (delta) {
      commit({ ...project, scenes: moveScene(s, selectedId, delta) });
      timeline.reveal(selectedId);
    }
  },
});

$("addScene").addEventListener("click", () => {
  const last = project.scenes[project.scenes.length - 1];
  const scene = createScene({ dur: last?.dur ?? 4 });
  commit({ ...project, scenes: [...project.scenes, scene] });
  select(scene.id, { seek: true });
  timeline.reveal(scene.id);
  $("fDesc").focus();
});

// ── 保存・読み込み ──
const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 1000);
};
const fileBase = () => (project.title.trim() || "video-scenario").replace(/[\\/:*?"<>|]/g, "_");

$("saveJson").addEventListener("click", () => {
  const data = {
    ...project,
    bgm: { ...project.bgm, file: null, fileName: "" },
    scenes: project.scenes.map((s) => ({ ...s, image: null, imageName: "" })),
  };
  download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `${fileBase()}.json`);
});

$("loadJson").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  try {
    const raw = JSON.parse(await file.text());
    if (!Array.isArray(raw?.scenes) || !raw.scenes.length) throw new Error("scenes がありません");
    player.pause();
    player.seek(0);
    commit(normalize(raw));
    renderVoices($("voices"), project, { force: true });
    fillForm();
    toast(T.loaded);
  } catch (error) {
    console.error("JSONの読み込みに失敗しました", error);
    toast(T.badJson);
  }
});

// 誤操作防止：1回目で確認表示、3秒以内の2回目で実行
let resetArmed = 0;
$("reset").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  if (!resetArmed) {
    btn.textContent = T.resetConfirm;
    resetArmed = setTimeout(() => {
      resetArmed = 0;
      btn.textContent = T.reset;
    }, 3000);
    return;
  }
  clearTimeout(resetArmed);
  resetArmed = 0;
  btn.textContent = T.reset;
  player.pause();
  player.seek(0);
  commit(createProject());
  renderVoices($("voices"), project, { force: true });
  fillForm();
  toast(T.resetDone);
});

bindOutput({ toast, download, fileBase });

// ── 起動 ──
const saved = await loadProject();
if (saved?.scenes.length) project = saved;
selectedId = project.scenes[0].id;
fillForm();
commit(project);
