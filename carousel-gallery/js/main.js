import { TYPES, CATS } from "./types/index.js?v=20261116d";
import { UI } from "./i18n.js?v=20261116d";
import { previewDoc, combined } from "./preview.js?v=20261116a";

const LANG = document.documentElement.lang === "en" ? "en" : "ja";
const T = UI[LANG];
const $ = (id) => document.getElementById(id);

const els = {
  chips: $("catChips"),
  grid: $("typeGrid"),
  stage: $("stageFrame"),
  name: $("typeName"),
  method: $("typeMethod"),
  desc: $("typeDesc"),
  support: $("typeSupport"),
  fields: $("fields"),
  reset: $("resetOpts"),
  tabs: $("codeTabs"),
  code: $("codeOut"),
  copy: $("copyCode"),
  pasteNote: $("pasteNote"),
  toast: $("toast"),
  work: $("work"),
};

const state = { type: TYPES[0], opts: { ...TYPES[0].defaults }, cat: "all", tab: "all" };

const track = (event, extra) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, carousel_type: state.type.id, ...extra });
};

const code = () => state.type.build(state.opts, LANG);

function fromHash() {
  const id = new URLSearchParams(location.hash.slice(1)).get("type");
  return TYPES.find((t) => t.id === id);
}

function renderChips() {
  els.chips.innerHTML = CATS.map((c) => {
    const n = c === "all" ? TYPES.length : TYPES.filter((t) => t.cat === c).length;
    return `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === state.cat}">${T.cats[c]}<span>${n}</span></button>`;
  }).join("");
}

function renderGrid() {
  const list = state.cat === "all" ? TYPES : TYPES.filter((t) => t.cat === state.cat);
  els.grid.innerHTML = list
    .map(
      (t) => `<li>
  <button type="button" class="type-card" data-type="${t.id}" aria-pressed="${t.id === state.type.id}">
    <span class="type-thumb"><iframe tabindex="-1" aria-hidden="true" loading="lazy" data-type="${t.id}"></iframe></span>
    <span class="type-meta"><strong>${t.label[LANG]}</strong><small class="badge badge-${t.method}">${T.method[t.method]}</small></span>
  </button>
</li>`
    )
    .join("");
  observeThumbs();
}

let observer;
function observeThumbs() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const frame = entry.target;
        if (entry.isIntersecting && !frame.srcdoc) {
          const t = TYPES.find((x) => x.id === frame.dataset.type);
          frame.srcdoc = previewDoc(t, t.build(t.defaults, LANG), LANG, true);
        } else if (!entry.isIntersecting && frame.srcdoc) {
          frame.removeAttribute("srcdoc");
        }
      });
    },
    { rootMargin: "200px" }
  );
  els.grid.querySelectorAll("iframe").forEach((f) => observer.observe(f));
}

function renderFields() {
  els.fields.innerHTML = state.type.fields
    .map(
      (f) => `<div class="field">
  <label for="opt-${f.key}">${f.label[LANG]} <output id="out-${f.key}">${state.opts[f.key]}${f.unit}</output></label>
  <input type="range" id="opt-${f.key}" data-key="${f.key}" min="${f.min}" max="${f.max}" step="${f.step}" value="${state.opts[f.key]}" />
</div>`
    )
    .join("");
}

function renderInfo() {
  const t = state.type;
  els.name.textContent = t.label[LANG];
  els.method.textContent = T.method[t.method];
  els.method.className = `badge badge-${t.method}`;
  els.desc.textContent = t.desc[LANG];
  els.support.textContent = t.support ? t.support[LANG] : "";
  els.support.hidden = !t.support;
  els.stage.title = T.stageTitle(t.label[LANG]);
}

function renderTabs(c) {
  const tabs = ["all", "html", "css"].concat(c.js ? ["js"] : []);
  if (!tabs.includes(state.tab)) state.tab = "all";
  els.tabs.innerHTML = tabs
    .map((k) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === state.tab}">${T.tabs[k]}</button>`)
    .join("");
}

function currentCode(c) {
  return state.tab === "all" ? combined(c) : c[state.tab];
}

let stageTimer;
function renderCode({ stage = true } = {}) {
  const c = code();
  renderTabs(c);
  els.code.textContent = currentCode(c);
  els.pasteNote.textContent = state.tab === "all" ? T.pasteAll : T.pastePart;
  if (stage) {
    clearTimeout(stageTimer);
    stageTimer = setTimeout(() => {
      els.stage.srcdoc = previewDoc(state.type, c, LANG);
    }, 120);
  }
}

function select(type, { scroll = false, quiet = false } = {}) {
  state.type = type;
  state.opts = { ...type.defaults };
  history.replaceState(null, "", `#type=${type.id}`);
  els.grid.querySelectorAll(".type-card").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.type === type.id)));
  renderInfo();
  renderFields();
  renderCode();
  if (scroll) els.work.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  if (!quiet) track("carousel_gallery_select");
}

let toastTimer;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2000);
}

els.chips.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]");
  if (!b) return;
  state.cat = b.dataset.cat;
  renderChips();
  renderGrid();
});

els.grid.addEventListener("click", (e) => {
  const b = e.target.closest(".type-card");
  if (!b) return;
  select(TYPES.find((t) => t.id === b.dataset.type), { scroll: true });
});

els.fields.addEventListener("input", (e) => {
  const input = e.target.closest("input[data-key]");
  if (!input) return;
  const key = input.dataset.key;
  const field = state.type.fields.find((f) => f.key === key);
  state.opts = { ...state.opts, [key]: Number(input.value) };
  $(`out-${key}`).textContent = `${input.value}${field.unit}`;
  renderCode();
});

els.reset.addEventListener("click", () => {
  state.opts = { ...state.type.defaults };
  renderFields();
  renderCode();
});

els.tabs.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tab]");
  if (!b) return;
  state.tab = b.dataset.tab;
  renderCode({ stage: false });
});

els.copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(els.code.textContent);
    toast(T.copied);
    track("carousel_gallery_copy", { code_part: state.tab });
  } catch (error) {
    toast(T.copyFailed);
  }
});

addEventListener("hashchange", () => {
  const t = fromHash();
  if (t && t !== state.type) select(t);
});

const initial = fromHash() || TYPES[0];
renderChips();
renderGrid();
select(initial, { quiet: true });
