import { TYPES, CATS } from "./types/index.js?v=20261116j";
import { UI } from "./i18n.js?v=20261116h";
import { previewDoc, combined } from "./preview.js?v=20261116j";
import { howText } from "./how.js?v=20261116j";

const LANG = document.documentElement.lang === "en" ? "en" : "ja";
const T = UI[LANG];
const $ = (id) => document.getElementById(id);

const els = {
  chips: $("catChips"),
  grid: $("typeGrid"),
  stage: $("stageFrame"),
  name: $("typeName"),
  method: $("typeMethod"),
  how: $("typeHow"),
  desc: $("typeDesc"),
  support: $("typeSupport"),
  fields: $("fields"),
  reset: $("resetOpts"),
  tabs: $("codeTabs"),
  code: $("codeOut"),
  copy: $("copyCode"),
  pasteNote: $("pasteNote"),
  toast: $("toast"),
  viewer: $("viewer"),
  close: $("viewerClose"),
};

let opener = null;

const state = { type: TYPES[0], opts: { ...TYPES[0].defaults }, cat: "all", tab: "all" };

const track = (event, extra) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, carousel_type: state.type.id, ...extra });
};

const code = () => state.type.build(state.opts, LANG);

const langBadges = (t) =>
  (t.method === "css" ? ["css"] : ["css", "js"]).map((l) => `<small class="badge badge-${l}">${l.toUpperCase()}</small>`).join("");

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
  <button type="button" class="type-card" data-type="${t.id}" aria-haspopup="dialog">
    <span class="type-thumb"><iframe tabindex="-1" aria-hidden="true" loading="lazy" data-type="${t.id}"></iframe></span>
    <span class="type-meta"><strong>${t.label[LANG]}</strong><span class="langs">${langBadges(t)}</span></span>
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
  els.method.innerHTML = langBadges(t);
  els.desc.textContent = t.desc[LANG];
  els.how.textContent = howText(t, LANG);
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
  if (stage && els.viewer.open) {
    clearTimeout(stageTimer);
    stageTimer = setTimeout(() => {
      els.stage.srcdoc = previewDoc(state.type, c, LANG);
    }, 120);
  }
}

function open(type, from) {
  state.type = type;
  state.opts = { ...type.defaults };
  opener = from || els.grid.querySelector(`.type-card[data-type="${type.id}"]`);
  history.replaceState(null, "", `#type=${type.id}`);
  if (!els.viewer.open) els.viewer.showModal();
  els.viewer.scrollTop = 0;
  renderInfo();
  renderFields();
  renderCode();
  track("carousel_gallery_select");
}

els.viewer.addEventListener("close", () => {
  if (els.viewer.open) return;
  clearTimeout(stageTimer);
  els.stage.removeAttribute("srcdoc");
  history.replaceState(null, "", location.pathname + location.search);
  if (opener && opener.isConnected) opener.focus();
});

els.viewer.addEventListener("click", (e) => {
  if (e.target === els.viewer) els.viewer.close();
});

els.close.addEventListener("click", () => els.viewer.close());

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
  open(TYPES.find((t) => t.id === b.dataset.type), b);
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
  if (t && !(els.viewer.open && t === state.type)) open(t);
});

const cardTable = document.querySelector(".card-table");
const narrow = matchMedia("(max-width: 768px)");

function foldRow(tr) {
  const [nameCell, langCell] = tr.cells;
  const button = nameCell.querySelector(".row-toggle");
  if (narrow.matches && !button) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "row-toggle";
    b.setAttribute("aria-expanded", "false");
    const name = document.createElement("span");
    name.className = "row-name";
    name.textContent = nameCell.textContent;
    const lang = document.createElement("span");
    lang.className = "row-lang";
    lang.textContent = langCell.textContent;
    b.append(name, lang);
    nameCell.replaceChildren(b);
  } else if (!narrow.matches && button) {
    nameCell.textContent = button.querySelector(".row-name").textContent;
    tr.classList.remove("open");
  }
}

function foldTable() {
  if (cardTable) cardTable.querySelectorAll("tbody tr").forEach(foldRow);
}

if (cardTable) {
  cardTable.addEventListener("click", (e) => {
    const b = e.target.closest(".row-toggle");
    if (!b) return;
    const opened = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(opened));
    b.closest("tr").classList.toggle("open", opened);
  });
  narrow.addEventListener("change", foldTable);
  foldTable();
}

renderChips();
renderGrid();
const initial = fromHash();
if (initial) open(initial);
