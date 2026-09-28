// 設定からプロンプト（英語＝貼る用／日本語＝確認用）とSRTを組み立てる（汎用書式＝特定サービスの記法に依存しない）
import {
  ASPECTS, STYLES, MOODS, SHOTS, ANGLES, MOVES, LIGHTS, TRANSITIONS,
  SPEECH_LANGS, BGM_GENRES, BGM_MOODS, VOICE_GENDERS, VOICE_AGES, VOICE_TONES, VOICE_SPEEDS, pick,
} from "./vocab.js?v=20260928a";
import { withTimes, totalDuration } from "./store.js?v=20260928a";

const str = (v) => (typeof v === "string" ? v.trim() : "");
// 選択肢の語。「指定なし」（en が空）は出力しない。ja は確認用の表示ラベル
const word = (list, v, lang) => {
  const o = pick(list, v);
  return o.en ? o[lang] : "";
};
const joiner = (lang) => (arr) => arr.filter(Boolean).join(lang === "ja" ? "、" : ", ");
// 文末を補う（既に終止符があれば足さない。和文で終わる場合は句点）
const sentence = (t) => {
  if (!t || /[.!?。！？」』"]$/.test(t)) return t;
  return /[\u3000-\u9fff\uff00-\uffef]$/.test(t) ? `${t}。` : `${t}.`;
};
const oneLine = (t) => t.replace(/\s*\n\s*/g, " ");

// 0:03 / 0:03.5 形式
export const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  const whole = Math.floor(s);
  const frac = Math.round((s - whole) * 10);
  return `${m}:${String(whole).padStart(2, "0")}${frac ? `.${frac}` : ""}`;
};

const fmtNum = (sec) => (Number.isInteger(sec) ? String(sec) : sec.toFixed(1));

// 出力言語ごとの文型。語彙は vocab.js の en / ja を使う（ja は内容確認用）
const PHRASES = {
  en: {
    sec: (n) => `${fmtNum(n)} second${n === 1 ? "" : "s"}`,
    style: (w, note) => sentence([`Style: ${w}`, note].filter(Boolean).join(". ")),
    says: (who, voice, lang, line) => `${who || "A narrator"}${voice ? ` (${voice})` : ""} says in ${lang}: "${line}"`,
    // 例: a calm, middle-aged male voice, speaking slowly
    voice: ({ gender, age, tone, speed, note }) => {
      const core = [age, gender].filter(Boolean).join(" ");
      const main = [tone, core].filter(Boolean).join(", ");
      const head = main ? `${/^[aeiou]/i.test(main) ? "an" : "a"} ${main} voice` : "";
      return [head, speed, note].filter(Boolean).join(", ");
    },
    noText: "No subtitles, captions, or on-screen text.",
    sceneHead: (i, n, s) => `Scene ${i} of ${n} (${fmtTime(s.start)}–${fmtTime(s.end)}, ${PHRASES.en.sec(s.dur)}).`,
    format: (a) => `Format: ${a}.`,
    refScene: "Use the attached reference image as the visual reference for this shot.",
    camera: (c) => sentence(`Camera: ${c}`),
    light: (l) => sentence(`Lighting: ${l}`),
    action: (d) => sentence(`Action: ${d}`),
    sfx: (x) => sentence(`Sound effects: ${x}`),
    tlHead: (t, a) => `A ${fmtNum(t)}-second video, ${a}.`,
    consistent: "Keep the characters, setting, and visual style consistent across all shots.",
    tlCam: (c) => sentence(c.charAt(0).toUpperCase() + c.slice(1)),
    refShot: (i) => `Use the reference image for shot ${i}.`,
    tlSfx: (x) => sentence(`Sound: ${x}`),
    trans: (t) => `Transition: ${t}.`,
    shot: (range, i, body) => `[${range}] Shot ${i}: ${body}`,
    sep: " ",
    music: (m) => `Background music: ${m}.`,
    bpm: (n) => `around ${n} BPM`,
    inst: "instrumental",
    genre: (g) => `Genre: ${g}.`,
    mood: (m) => `Mood: ${m}.`,
    tempo: (n) => `Tempo: around ${n} BPM.`,
    instruments: (x) => sentence(`Instruments: ${x}`),
    length: (t) => `Length: about ${PHRASES.en.sec(t)}, written as background music for a video.`,
    cuts: (c) => `The video cuts at ${c.join(", ")}; place gentle accents or changes near these points.`,
    noVocals: "Instrumental only, no vocals.",
  },
  ja: {
    sec: (n) => `${fmtNum(n)}秒`,
    style: (w, note) => sentence([`画風: ${w}`, note].filter(Boolean).join("。")),
    says: (who, voice, lang, line) => `${who || "ナレーション"}${voice ? `（声: ${voice}）` : ""}のセリフ（${lang}）:「${line}」`,
    voice: ({ gender, age, tone, speed, note }) => [age, gender, tone, speed, note].filter(Boolean).join("・"),
    noText: "字幕・キャプション・画面上の文字は入れない。",
    sceneHead: (i, n, s) => `シーン${i} / ${n}（${fmtTime(s.start)}–${fmtTime(s.end)}、${PHRASES.ja.sec(s.dur)}）`,
    format: (a) => `画面比率: ${a}`,
    refScene: "添付の参照画像を、このカットの見た目の参考にする。",
    camera: (c) => sentence(`カメラ: ${c}`),
    light: (l) => sentence(`光: ${l}`),
    action: (d) => sentence(`映像: ${d}`),
    sfx: (x) => sentence(`効果音: ${x}`),
    tlHead: (t, a) => `${fmtNum(t)}秒の動画、${a}。`,
    consistent: "すべてのカットで人物・場所・画風をそろえる。",
    tlCam: (c) => sentence(`カメラ: ${c}`),
    refShot: (i) => `参照画像${i}を使う。`,
    tlSfx: (x) => sentence(`効果音: ${x}`),
    trans: (t) => `次への切替: ${t}。`,
    shot: (range, i, body) => `[${range}] カット${i}: ${body}`,
    sep: "",
    music: (m) => `BGM: ${m}。`,
    bpm: (n) => `テンポ約${n} BPM`,
    inst: "インストのみ",
    genre: (g) => `ジャンル: ${g}`,
    mood: (m) => `雰囲気: ${m}`,
    tempo: (n) => `テンポ: 約${n} BPM`,
    instruments: (x) => sentence(`楽器: ${x}`),
    length: (t) => `長さ: 約${PHRASES.ja.sec(t)}（動画のBGM）`,
    cuts: (c) => `カットの位置: ${c.join("、")}。この付近で軽いアクセントや展開を入れる。`,
    noVocals: "ボーカルなし（インストのみ）",
  },
};

const ctx = (p, lang = "en") => {
  const t = PHRASES[lang] ? lang : "en";
  const w = (list, v) => word(list, v, t);
  const join = joiner(t);
  const T = PHRASES[t];
  const styleLine = () => T.style(join([w(STYLES, p.style), w(MOODS, p.mood)]), str(p.styleNote));
  const camera = (s) => join([w(SHOTS, s.shot), w(ANGLES, s.angle), w(MOVES, s.move)]);
  const dialogue = (s) => {
    const line = str(s.line);
    if (!line || p.dialogue === "none") return "";
    const v = p.voices?.[str(s.speaker)];
    const voice = v
      ? T.voice({
          gender: w(VOICE_GENDERS, v.gender), age: w(VOICE_AGES, v.age), tone: w(VOICE_TONES, v.tone),
          speed: w(VOICE_SPEEDS, v.speed), note: str(v.note),
        })
      : "";
    return T.says(str(s.speaker), voice, w(SPEECH_LANGS, p.speechLang), oneLine(line));
  };
  const noText = () => (p.noText ? T.noText : "");
  const genres = () => join(p.bgm.genres.map((v) => w(BGM_GENRES, v)));
  const moods = () => join(p.bgm.moods.map((v) => w(BGM_MOODS, v)));
  return { T, w, join, styleLine, camera, dialogue, noText, genres, moods };
};

// ── シーン別（1カット＝1回の生成に貼る。単体で意味が通るよう共通設定も毎回含める） ──
export const scenePrompts = (p, lang) => {
  const c = ctx(p, lang);
  const scenes = withTimes(p.scenes);
  return scenes.map((s, i) => {
    const cam = c.camera(s);
    const light = c.w(LIGHTS, s.light);
    return [
      c.T.sceneHead(i + 1, scenes.length, s),
      c.T.format(c.w(ASPECTS, p.aspect)),
      c.styleLine(),
      s.image ? c.T.refScene : "",
      cam ? c.T.camera(cam) : "",
      light ? c.T.light(light) : "",
      str(s.desc) ? c.T.action(str(s.desc)) : "",
      c.dialogue(s),
      str(s.sfx) ? c.T.sfx(str(s.sfx)) : "",
      c.noText(),
    ].filter(Boolean).join("\n");
  });
};

// ── タイムライン一括（尺の長い生成や、タイムコード指定に対応するサービス向け） ──
export const timelinePrompt = (p, lang) => {
  const c = ctx(p, lang);
  const scenes = withTimes(p.scenes);
  const head = [
    c.T.tlHead(totalDuration(p.scenes), c.w(ASPECTS, p.aspect)),
    c.styleLine(),
    c.T.consistent,
  ];
  const shots = scenes.map((s, i) => {
    const cam = c.camera(s);
    const light = c.w(LIGHTS, s.light);
    const parts = [
      cam && c.T.tlCam(cam),
      light && c.T.light(light),
      s.image && c.T.refShot(i + 1),
      sentence(str(s.desc)),
      c.dialogue(s),
      str(s.sfx) && c.T.tlSfx(str(s.sfx)),
      i < scenes.length - 1 && s.trans !== "cut" && c.T.trans(c.w(TRANSITIONS, s.trans)),
    ].filter(Boolean);
    return c.T.shot(`${fmtTime(s.start)}–${fmtTime(s.end)}`, i + 1, parts.join(c.T.sep));
  });
  const genres = c.genres();
  const moods = c.moods();
  const music = genres || moods
    ? c.T.music(c.join([moods, genres, c.T.bpm(p.bgm.bpm), p.bgm.vocals ? "" : c.T.inst]))
    : "";
  const tail = [music, c.noText()].filter(Boolean);
  return [...head, "", ...shots, "", ...tail].join("\n").trim();
};

// ── BGM ──
export const bgmPrompt = (p, lang) => {
  const c = ctx(p, lang);
  const b = p.bgm;
  const cuts = withTimes(p.scenes).slice(0, -1).map((s) => fmtTime(s.end));
  const genres = c.genres();
  const moods = c.moods();
  return [
    genres ? c.T.genre(genres) : "",
    moods ? c.T.mood(moods) : "",
    c.T.tempo(b.bpm),
    str(b.instruments) ? c.T.instruments(str(b.instruments)) : "",
    c.T.length(totalDuration(p.scenes)),
    cuts.length ? c.T.cuts(cuts) : "",
    b.vocals ? "" : c.T.noVocals,
  ].filter(Boolean).join("\n");
};

// ── SRT（セリフのあるシーンだけ字幕にする） ──
const srtTime = (sec) => {
  const ms = Math.round(sec * 1000);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms % 1000, 3)}`;
};

export const toSrt = (p) =>
  withTimes(p.scenes)
    .filter((s) => str(s.line))
    .map((s, i) => `${i + 1}\n${srtTime(s.start)} --> ${srtTime(s.end)}\n${str(s.line)}\n`)
    .join("\n");
