import { scenePrompts, timelinePrompt, bgmPrompt, toSrt } from "./prompt.js?v=20261128a";
import { LANG, T } from "./i18n.js?v=20261128a";

let tab = "scene";
let lang = "en";
let current = null;
let deps = null;

const copy = async (text, label = T.copied) => {
  try {
    await navigator.clipboard.writeText(text);
    deps.toast(label);
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

const domoaiCta = (text, description, from) => {
  const box = document.createElement("div");
  box.className = "domoai-cta-box";
  const link = document.createElement("a");
  link.className = "btn primary domoai-cta";
  link.href = "https://www.domoai.app/create/text-to-video?via=cq-tool";
  link.target = "_blank";
  link.rel = "sponsored noopener noreferrer";
  link.textContent = T.domoaiCta;
  link.addEventListener("click", () => {
    if (text) copy(text, T.copiedForDomoai);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "video_scenario_maker_domoai_click", from });
  });
  const note = document.createElement("p");
  note.className = "domoai-note";
  note.textContent = description;
  box.append(link, note);
  return box;
};

const views = {
  scene: (p) => {
    const prompts = scenePrompts(p, lang);
    const all = prompts.join("\n\n---\n\n");
    return {
      blocks: [
        ...prompts.map((t, i) => block(T.sceneLabel(i + 1), t)),
        domoaiCta(prompts[0], T.domoaiSceneNote, "scene"),
      ],
      actions: [button(T.copyAll, () => copy(all))],
    };
  },
  timeline: (p) => {
    const text = timelinePrompt(p, lang);
    return {
      blocks: [block(T.timelineLabel, text), domoaiCta(p.scenes.length ? text : "", T.domoaiTimelineNote, "timeline")],
      actions: [],
    };
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
