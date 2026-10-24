// プレビュー再生：画像＋字幕＋BGMを秒数どおりに流す
import { withTimes, totalDuration } from "./store.js?v=20261024a";
import { fmtTime } from "./prompt.js?v=20261024a";
import { MOVES } from "./vocab.js?v=20261024a";
import { T, label } from "./i18n.js?v=20261024a";

const FADE_SEC = 0.5;

// カメラの動きの見本（Blenderの粘土風ループ）。画像がまだ無いシーンだけ枠に仮表示する
const DEMO_MOVES = new Set(["pan", "tilt", "in", "out", "track", "orbit", "hand", "drone"]);
const DEMO_VER = "20261024a";
const demoUrl = (file) => new URL(`../video/${file}?v=${DEMO_VER}`, import.meta.url).href;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Blob → objectURL を使い回す（同じBlobに何度もURLを発行しない）
const urls = new WeakMap();
export const blobUrl = (blob) => {
  if (!blob) return "";
  if (!urls.has(blob)) urls.set(blob, URL.createObjectURL(blob));
  return urls.get(blob);
};

export const createPlayer = (el, { onScene, onTime } = {}) => {
  let project = null;
  let scenes = [];
  let total = 0;
  let time = 0;
  let playing = false;
  let startedAt = 0;
  let startTime = 0;
  let raf = 0;
  let current = -1;
  const audio = new Audio();

  const sceneAt = (t) => {
    const i = scenes.findIndex((s) => t < s.end);
    return i < 0 ? scenes.length - 1 : i;
  };

  // move が空なら見本を隠す。同じ動きのまま次のシーンへ移った時は読み込み直さない
  const showDemo = (move) => {
    const v = el.demo;
    el.demoTag.hidden = !move;
    if (!move) {
      v.pause();
      v.hidden = true;
      return;
    }
    if (v.dataset.move !== move) {
      v.dataset.move = move;
      v.poster = demoUrl(`move-${move}-poster.webp`);
      // Safari 等で webm が再生できない場合に備えて mp4 も並べる
      v.innerHTML = `<source src="${demoUrl(`move-${move}.webm`)}" type="video/webm"><source src="${demoUrl(`move-${move}.mp4`)}" type="video/mp4">`;
      v.load();
      el.demoTag.textContent = T.moveDemo(label(MOVES.find((m) => m.v === move)));
    }
    v.hidden = false;
    v.play().catch((error) => console.error("カメラの動きの見本を再生できませんでした", error));
  };

  const renderFrame = () => {
    el.time.textContent = `${fmtTime(time)} / ${fmtTime(total)}`;
    onTime?.(time);
    if (!scenes.length) {
      el.img.hidden = true;
      el.caption.hidden = true;
      el.empty.hidden = false;
      showDemo("");
      return;
    }
    const i = sceneAt(time);
    const s = scenes[i];
    if (i !== current) {
      current = i;
      const src = blobUrl(s.image);
      el.img.hidden = !src;
      if (src) el.img.src = src;
      const demo = !src && DEMO_MOVES.has(s.move) && !reducedMotion() ? s.move : "";
      showDemo(demo);
      el.empty.hidden = Boolean(src) || Boolean(demo);
      el.empty.textContent = T.noImage(i + 1);
      el.caption.hidden = !s.line;
      el.caption.textContent = s.line;
      el.speaker.textContent = s.speaker;
      el.speaker.hidden = !s.speaker;
      onScene?.(s.id);
    }
    // フェード／ディゾルブ指定のシーンは終わり際に暗転させる（最後のシーンは除く）
    const remain = s.end - time;
    const fades = s.trans !== "cut" && i < scenes.length - 1 && remain < FADE_SEC;
    el.frame.style.opacity = fades ? String(Math.max(0, remain / FADE_SEC)) : "1";
  };

  const tick = () => {
    time = Math.min(total, startTime + (performance.now() - startedAt) / 1000);
    renderFrame();
    if (time >= total) {
      pause();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const syncAudio = () => {
    const b = project?.bgm;
    if (!b?.file) return;
    const src = blobUrl(b.file);
    if (audio.src !== src) audio.src = src;
    audio.volume = b.volume;
    audio.currentTime = b.offset + time;
    audio.play().catch((error) => console.error("BGMを再生できませんでした", error));
  };

  function play() {
    if (!scenes.length) return;
    if (time >= total) time = 0;
    playing = true;
    startTime = time;
    startedAt = performance.now();
    el.play.textContent = "❚❚";
    el.play.setAttribute("aria-pressed", "true");
    el.play.setAttribute("aria-label", T.pause);
    syncAudio();
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    cancelAnimationFrame(raf);
    audio.pause();
    el.play.textContent = "▶";
    el.play.setAttribute("aria-pressed", "false");
    el.play.setAttribute("aria-label", T.play);
  }

  const seek = (t) => {
    time = Math.max(0, Math.min(total, t));
    current = -1;
    if (playing) {
      startTime = time;
      startedAt = performance.now();
      syncAudio();
    }
    renderFrame();
  };

  el.play.addEventListener("click", () => (playing ? pause() : play()));
  el.toStart.addEventListener("click", () => seek(0));
  // スペースキーで再生／停止（入力欄での操作は除く）
  document.addEventListener("keydown", (e) => {
    if (e.code !== "Space" || e.target.closest("input, textarea, select, button, [contenteditable]")) return;
    e.preventDefault();
    playing ? pause() : play();
  });

  return {
    setProject(p) {
      project = p;
      scenes = withTimes(p.scenes);
      total = totalDuration(p.scenes);
      el.stage.dataset.aspect = p.aspect;
      if (!p.bgm.file) audio.removeAttribute("src");
      else if (playing) audio.volume = p.bgm.volume;
      if (time > total) time = total;
      current = -1;
      renderFrame();
    },
    seek,
    seekToScene(id) {
      const s = scenes.find((x) => x.id === id);
      if (s) seek(s.start);
    },
    pause,
  };
};
