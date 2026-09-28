// プレビュー再生：画像＋字幕＋BGMを秒数どおりに流す
import { withTimes, totalDuration } from "./store.js?v=20260928b";
import { fmtTime } from "./prompt.js?v=20260928b";
import { T } from "./i18n.js?v=20260928b";

const FADE_SEC = 0.5;

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

  const renderFrame = () => {
    el.time.textContent = `${fmtTime(time)} / ${fmtTime(total)}`;
    onTime?.(time);
    if (!scenes.length) {
      el.img.hidden = true;
      el.caption.hidden = true;
      el.empty.hidden = false;
      return;
    }
    const i = sceneAt(time);
    const s = scenes[i];
    if (i !== current) {
      current = i;
      const src = blobUrl(s.image);
      el.img.hidden = !src;
      if (src) el.img.src = src;
      el.empty.hidden = Boolean(src);
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
