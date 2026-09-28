// プロジェクトの状態と保存（IndexedDB）。状態は常に新しいオブジェクトで置き換える

const DB_NAME = "video-scenario-maker";
const STORE = "project";
const KEY = "current";
const SAVE_DELAY = 400;

let seq = 0;
export const newId = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;

export const createScene = (patch = {}) => ({
  id: newId(),
  dur: 4,
  image: null,
  imageName: "",
  speaker: "",
  line: "",
  desc: "",
  shot: "",
  angle: "",
  move: "",
  light: "",
  sfx: "",
  trans: "cut",
  ...patch,
});

export const createProject = () => ({
  title: "",
  aspect: "9:16",
  style: "photo",
  mood: "",
  styleNote: "",
  speechLang: "ja",
  dialogue: "speak",
  noText: true,
  target: 30,
  // 声は話者名ごと（キー "" はナレーション＝話す人が空欄のセリフ）
  voices: {
    "": { gender: "male", age: "adult", tone: "calm", speed: "", note: "" },
    話し手A: { gender: "female", age: "young", tone: "bright", speed: "", note: "" },
  },
  bgm: {
    genres: ["acoustic"],
    moods: ["uplift"],
    bpm: 100,
    instruments: "",
    vocals: false,
    file: null,
    fileName: "",
    volume: 0.6,
    offset: 0,
  },
  scenes: [
    createScene({ dur: 3, desc: "A person walks toward the camera on a quiet street in the morning", shot: "ws", move: "in", light: "day" }),
    createScene({ dur: 4, speaker: "話し手A", line: "こんにちは。今日はこれを紹介します。", desc: "The person smiles and talks to the camera, holding a small item", shot: "ms", move: "static" }),
    createScene({ dur: 3, line: "詳しくは概要欄へ", desc: "Close-up of the item placed on a table", shot: "cu", angle: "high", light: "studio", trans: "fade" }),
  ],
});

// 開始秒を積み上げで計算（小数誤差を避けるため0.1秒単位で丸める）
export const withTimes = (scenes) =>
  scenes.reduce((acc, s) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const end = Math.round((start + s.dur) * 10) / 10;
    return [...acc, { ...s, start, end }];
  }, []);

export const totalDuration = (scenes) =>
  Math.round(scenes.reduce((sum, s) => sum + s.dur, 0) * 10) / 10;

// ── 並べ替え・追加・削除（すべて新しい配列を返す） ──
export const updateScene = (scenes, id, patch) =>
  scenes.map((s) => (s.id === id ? { ...s, ...patch } : s));

export const removeScene = (scenes, id) => scenes.filter((s) => s.id !== id);

export const moveScene = (scenes, id, delta) => {
  const i = scenes.findIndex((s) => s.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= scenes.length) return scenes;
  const next = [...scenes];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export const duplicateScene = (scenes, id) => {
  const i = scenes.findIndex((s) => s.id === id);
  if (i < 0) return scenes;
  return [...scenes.slice(0, i + 1), { ...scenes[i], id: newId() }, ...scenes.slice(i + 1)];
};

// ── IndexedDB（画像・音声のBlobも構造化複製でそのまま保存できる） ──
// 接続は1本だけ開いて使い回す（保存のたびに開くと接続が溜まる）
let dbPromise = null;
const openDb = () =>
  (dbPromise ||= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  }));

const tx = async (mode, fn) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
  });
};

export const loadProject = async () => {
  try {
    const saved = await tx("readonly", (s) => s.get(KEY));
    return saved ? normalize(saved) : null;
  } catch (error) {
    console.error("保存データの読み込みに失敗しました", error);
    return null;
  }
};

let timer = 0;
export const saveProject = (project, onError) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    tx("readwrite", (s) => s.put(project, KEY)).catch((error) => {
      console.error("保存に失敗しました", error);
      onError?.(error);
    });
  }, SAVE_DELAY);
};

export const createVoice = (patch = {}) => ({ gender: "", age: "", tone: "", speed: "", note: "", ...patch });

// 型が違う値（JSONの手編集・旧データ）は既定値に置き換える
const text = (v, fallback = "") => (typeof v === "string" ? v : fallback);
const bool = (v, fallback) => (typeof v === "boolean" ? v : fallback);
const texts = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

const normalizeVoices = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, v]) => v && typeof v === "object")
      .map(([name, v]) => [name, createVoice({
        gender: text(v.gender), age: text(v.age), tone: text(v.tone), speed: text(v.speed), note: text(v.note),
      })])
  );
};

// シーンに登場する話者（空欄＝ナレーション）を登場順に重複なしで返す
export const speakersOf = (scenes) => [
  ...new Set(scenes.filter((s) => String(s.line).trim()).map((s) => String(s.speaker).trim())),
];

const num = (v, min, max, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

// 読み込んだデータの欠けと型違いを既定値で埋める（JSON読み込み・旧データ互換）
// 項目は列挙したものだけ取り込む（未知のキーや壊れた値を保存しない）
export const normalize = (raw) => {
  const base = createProject();
  const src = raw && typeof raw === "object" ? raw : {};
  const rawScenes = Array.isArray(src.scenes) ? src.scenes.filter((x) => x && typeof x === "object") : [];
  const scenes = rawScenes.length ? rawScenes : base.scenes;
  const bgm = src.bgm && typeof src.bgm === "object" ? src.bgm : {};
  return {
    title: text(src.title),
    aspect: text(src.aspect, base.aspect),
    style: text(src.style, base.style),
    mood: text(src.mood),
    styleNote: text(src.styleNote),
    speechLang: text(src.speechLang, base.speechLang),
    dialogue: text(src.dialogue, base.dialogue),
    noText: bool(src.noText, base.noText),
    target: num(src.target, 0, 3600, base.target),
    voices: normalizeVoices(src.voices ?? base.voices),
    bgm: {
      genres: src.bgm ? texts(bgm.genres) : base.bgm.genres,
      moods: src.bgm ? texts(bgm.moods) : base.bgm.moods,
      bpm: num(bgm.bpm, 40, 200, base.bgm.bpm),
      instruments: text(bgm.instruments),
      vocals: bool(bgm.vocals, false),
      file: bgm.file instanceof Blob ? bgm.file : null,
      fileName: bgm.file instanceof Blob ? text(bgm.fileName) : "",
      volume: num(bgm.volume, 0, 1, base.bgm.volume),
      offset: num(bgm.offset, 0, 3600, 0),
    },
    scenes: scenes.map((sc, i) => {
      const image = sc.image instanceof Blob ? sc.image : null;
      // IDが無い・重複している場合は振り直す（選択や並べ替えがIDで動くため）
      const dupe = scenes.findIndex((x) => x.id === sc.id) !== i;
      return createScene({
        id: typeof sc.id === "string" && sc.id && !dupe ? sc.id : newId(),
        dur: num(sc.dur, 0.5, 60, 4),
        image,
        imageName: image ? text(sc.imageName) : "",
        speaker: text(sc.speaker),
        line: text(sc.line),
        desc: text(sc.desc),
        shot: text(sc.shot),
        angle: text(sc.angle),
        move: text(sc.move),
        light: text(sc.light),
        sfx: text(sc.sfx),
        trans: text(sc.trans, "cut"),
      });
    }),
  };
};
