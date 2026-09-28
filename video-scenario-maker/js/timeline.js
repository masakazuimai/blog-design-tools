// タイムライン：ルーラー／映像・字幕・BGMの3トラック／再生ヘッド。クリップ右端のドラッグで長さを変える
import { withTimes, totalDuration } from "./store.js?v=20260928b";
import { fmtTime } from "./prompt.js?v=20260928b";
import { blobUrl } from "./preview.js?v=20260928b";
import { BGM_GENRES, pick } from "./vocab.js?v=20260928b";
import { T, label } from "./i18n.js?v=20260928b";

const LABEL_MIN_PX = 64; // 目盛りラベル同士の最小間隔
const STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60];
const TAIL_SEC = 4; // 末尾に空ける余白（追加・延長の余地）
const snap = (sec) => Math.min(60, Math.max(0.5, Math.round(sec * 2) / 2));

const div = (cls, text) => {
  const n = document.createElement("div");
  n.className = cls;
  if (text) n.textContent = text;
  return n;
};

export const createTimeline = (el, { onSelect, onSeek, onResize }) => {
  let pps = 40; // 1秒あたりのpx
  let state = { project: null, selectedId: null };
  let drag = null;
  let head = 0;

  const renderRuler = (sec) => {
    const step = STEPS.find((s) => s * pps >= LABEL_MIN_PX) || 60;
    el.ruler.style.backgroundSize = `${pps * (step >= 1 ? 1 : 0.5)}px 100%`;
    const labels = [];
    for (let t = 0; t <= sec; t += step) {
      const l = div("tick", fmtTime(t));
      l.style.left = `${t * pps}px`;
      labels.push(l);
    }
    el.ruler.replaceChildren(...labels);
  };

  const videoClip = (s, i) => {
    const c = div("clip clip-video");
    c.dataset.id = s.id;
    c.style.left = `${s.start * pps}px`;
    c.style.width = `${s.dur * pps}px`;
    c.classList.toggle("is-selected", s.id === state.selectedId);
    const src = blobUrl(s.image);
    if (src) c.style.backgroundImage = `url("${src}")`;
    const label = div("clip-label");
    label.append(div("clip-no", String(i + 1)), div("clip-text", s.desc || T.sec(s.dur)));
    c.append(label, div("handle"));
    c.title = T.sceneTitle(i + 1, `${fmtTime(s.start)}–${fmtTime(s.end)}`);
    return c;
  };

  const subClip = (s) => {
    const c = div("clip clip-sub", s.line.replace(/\s*\n\s*/g, " "));
    c.dataset.id = s.id;
    c.style.left = `${s.start * pps}px`;
    c.style.width = `${s.dur * pps}px`;
    return c;
  };

  const audioClip = (p, total) => {
    const b = p.bgm;
    const name = b.fileName || b.genres.map((v) => label(pick(BGM_GENRES, v))).join(T.listSep);
    if (!name) return [];
    const c = div("clip clip-audio", `♪ ${name}`);
    c.style.left = "0px";
    c.style.width = `${total * pps}px`;
    return [c];
  };

  const render = () => {
    const p = state.project;
    if (!p) return;
    const scenes = withTimes(p.scenes);
    const total = totalDuration(p.scenes);
    const sec = Math.ceil(Math.max(total, p.target || 0) + TAIL_SEC);
    el.inner.style.width = `${sec * pps}px`;
    renderRuler(sec);
    el.video.replaceChildren(...scenes.map(videoClip));
    el.sub.replaceChildren(...scenes.filter((s) => s.line.trim()).map(subClip));
    el.audio.replaceChildren(...audioClip(p, total));
    el.target.hidden = !p.target;
    el.target.style.left = `${p.target * pps}px`;
    el.playhead.style.transform = `translateX(${head * pps}px)`;
  };

  const timeAt = (clientX) => {
    const rect = el.inner.getBoundingClientRect();
    return Math.max(0, (clientX - rect.left) / pps);
  };

  // クリック：クリップなら選択、空き地・ルーラーならその位置へシーク
  el.inner.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".handle");
    const clip = e.target.closest(".clip-video, .clip-sub");
    if (handle) {
      const id = handle.parentElement.dataset.id;
      const s = state.project.scenes.find((x) => x.id === id);
      drag = { id, x: e.clientX, dur: s.dur };
      if (id !== state.selectedId) onSelect(id);
      el.inner.setPointerCapture(e.pointerId); // 再描画でハンドルが作り直されてもドラッグを続ける
      e.preventDefault();
      return;
    }
    if (clip) {
      onSelect(clip.dataset.id);
      return;
    }
    onSeek(timeAt(e.clientX));
  });
  el.inner.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dur = snap(drag.dur + (e.clientX - drag.x) / pps);
    const s = state.project.scenes.find((x) => x.id === drag.id);
    if (s && s.dur !== dur) onResize(drag.id, dur);
  });
  const endDrag = () => { drag = null; };
  el.inner.addEventListener("pointerup", endDrag);
  el.inner.addEventListener("pointercancel", endDrag);

  el.zoom.addEventListener("input", () => {
    pps = Number(el.zoom.value);
    render();
  });

  return {
    update(project, selectedId) {
      state = { project, selectedId };
      render();
    },
    setPlayhead(t) {
      head = t;
      el.playhead.style.transform = `translateX(${t * pps}px)`;
    },
    markPlaying(id) {
      el.video.querySelectorAll(".clip").forEach((c) => c.classList.toggle("is-playing", c.dataset.id === id));
    },
    reveal(id) {
      const c = el.video.querySelector(`[data-id="${id}"]`);
      c?.scrollIntoView({ block: "nearest", inline: "nearest" });
    },
  };
};
