// インスペクター：選択中のシーン1件を編集する。入力中は作り直さず値だけ差し替える
import { SHOTS, ANGLES, MOVES, LIGHTS, TRANSITIONS } from "./vocab.js?v=20260928b";
import { withTimes } from "./store.js?v=20260928b";
import { fmtTime } from "./prompt.js?v=20260928b";
import { blobUrl } from "./preview.js?v=20260928b";
import { T, label } from "./i18n.js?v=20260928b";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const $ = (id) => document.getElementById(id);

const SELECTS = { fShot: SHOTS, fAngle: ANGLES, fMove: MOVES, fLight: LIGHTS, fTrans: TRANSITIONS };
const TEXTS = { fDesc: "desc", fSpeaker: "speaker", fLine: "line", fSfx: "sfx" };
const SELECT_FIELDS = { fShot: "shot", fAngle: "angle", fMove: "move", fLight: "light", fTrans: "trans" };

Object.entries(SELECTS).forEach(([id, list]) => {
  $(id).replaceChildren(...list.map((o) => new Option(label(o), o.v)));
});

// フォーカス中の欄は上書きしない（入力中のカーソル位置を守る）
const setValue = (node, v) => {
  if (document.activeElement !== node && node.value !== v) node.value = v;
};

export const renderInspector = (project, selectedId) => {
  const scenes = withTimes(project.scenes);
  const i = Math.max(0, scenes.findIndex((s) => s.id === selectedId));
  const s = scenes[i];
  $("insTitle").textContent = T.sceneOf(i + 1, scenes.length);
  $("insTime").textContent = `${fmtTime(s.start)} – ${fmtTime(s.end)}`;
  setValue($("fDur"), String(s.dur));
  Object.entries(TEXTS).forEach(([id, key]) => setValue($(id), s[key]));
  Object.entries(SELECT_FIELDS).forEach(([id, key]) => setValue($(id), s[key]));
  const src = blobUrl(s.image);
  $("fImgPreview").hidden = !src;
  if (src) $("fImgPreview").src = src;
  $("fImgEmpty").hidden = Boolean(src);
  $("fImgClear").hidden = !src;
  document.querySelector('[data-act="up"]').disabled = i === 0;
  document.querySelector('[data-act="down"]').disabled = i === scenes.length - 1;
  document.querySelector('[data-act="del"]').disabled = scenes.length === 1;
};

export const bindInspector = ({ onField, onAction, onError }) => {
  $("fDur").addEventListener("input", (e) => {
    const n = Number(e.target.value);
    if (Number.isFinite(n) && n >= 0.5 && n <= 60) onField({ dur: Math.round(n * 10) / 10 });
  });
  Object.entries(TEXTS).forEach(([id, key]) => {
    $(id).addEventListener("input", (e) => onField({ [key]: e.target.value }));
  });
  Object.entries(SELECT_FIELDS).forEach(([id, key]) => {
    $(id).addEventListener("change", (e) => onField({ [key]: e.target.value }));
  });
  $("fImage").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError(T.notImage);
    if (file.size > MAX_IMAGE_BYTES) return onError(T.imageTooBig);
    onField({ image: file, imageName: file.name });
  });
  $("fImgClear").addEventListener("click", () => onField({ image: null, imageName: "" }));
  document.querySelector(".ins-tools").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (b) onAction(b.dataset.act);
  });
};
