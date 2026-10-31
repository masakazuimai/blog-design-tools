import { scenePrompts, timelinePrompt, bgmPrompt, toSrt } from "./prompt.js?v=20261025b";
import { LANG, T } from "./i18n.js?v=20261025b";

let tab = "scene";
let lang = "en";
let current = null;
let deps = null;

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    deps.toast(T.copied);
  } catch (error) {
    console.error("クリップボードへのコピーに失敗しました", error);
    deps.toast(T.copyFailed);
  }
};

const block = (label, text) => {
  const wrap = document.createElement("div");
  wrap.className = "out-block";
  const head = document.createElement("div");
  head.className = "out-head";
  const name = document.createElement("span");
  name.textContent = label;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn small";
  btn.textContent = T.copy;
  btn.addEventListener("click", () => copy(text));
  head.append(name, btn);
  const pre = document.createElement("pre");
  pre.textContent = text || T.empty;
  wrap.append(head, pre);
  return wrap;
};

const button = (label, onClick) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn";
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
};

const views = {
  scene: (p) => {
    const prompts = scenePrompts(p, lang);
    const all = prompts.join("\n\n---\n\n");
    return {
      blocks: prompts.map((t, i) => block(T.sceneLabel(i + 1), t)),
      actions: [button(T.copyAll, () => copy(all))],
    };
  },
  timeline: (p) => {
    const text = timelinePrompt(p, lang);
    return { blocks: [block(T.timelineLabel, text)], actions: [] };
  },
  bgm: (p) => {
    const text = bgmPrompt(p, lang);
    return { blocks: [block("BGM", text)], actions: [] };
  },
  srt: (p) => {
    const text = toSrt(p);
    return {
      blocks: [block("SRT", text)],
      actions: text
        ? [button(T.saveSrt, () =>
            deps.download(new Blob([text], { type: "application/x-subrip" }), `${deps.fileBase()}.srt`))]
        : [],
    };
  },
};

const paint = () => {
  if (!current || !deps) return;
  const { blocks, actions } = views[tab](current);
  const langable = tab !== "srt" && LANG === "ja";
  document.getElementById("outLang").hidden = !langable;
  document.getElementById("tabNote").textContent = langable && lang === "ja" ? `${T.notes[tab]} ${T.jaNote}` : T.notes[tab];
  document.getElementById("out").replaceChildren(...blocks);
  document.getElementById("outActions").replaceChildren(...actions);
  document.querySelectorAll('[data-group="out"] [data-tab]').forEach((b) => {
    b.setAttribute("aria-selected", String(b.dataset.tab === tab));
  });
};

export const renderOutput = (project) => {
  current = project;
  paint();
};

export const bindOutput = (d) => {
  deps = d;
  document.querySelector('[data-group="out"]').addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    tab = b.dataset.tab;
    paint();
  });
  document.getElementById("outLang").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang]");
    if (!b) return;
    lang = b.dataset.lang;
    document.querySelectorAll("#outLang [data-lang]").forEach((x) => {
      x.setAttribute("aria-pressed", String(x === b));
    });
    paint();
  });
  paint();
};
