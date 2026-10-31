import { CATEGORIES, SELECTORS, DEMO_HTML } from "./selectors.js?v=20260731l";

const $ = (id) => document.getElementById(id);

const els = {
  filters: $("filters"),
  search: $("search"),
  list: $("selectorList"),
  count: $("listCount"),
  name: $("detailName"),
  desc: $("detailDesc"),
  note: $("detailNote"),
  code: $("cssCode"),
  copy: $("copyBtn"),
  hit: $("hitCount"),
  frame: $("demoFrame"),
  toast: $("toast"),
};

const PSEUDO_ELEMENT = /::(before|after|first-letter|first-line|marker|placeholder|selection)/g;
const STATE_PSEUDO = /:(link|visited|hover|active|focus-visible|focus-within|focus)\b/g;

const toHighlightQuery = (selector) => selector.replace(PSEUDO_ELEMENT, "").replace(STATE_PSEUDO, "").trim();

let currentCat = "all";
let currentSel = null;
let frameReady = false;
let initialApplyDone = false;


const frameDoc = () => els.frame.contentDocument;

function scrollToFirstHit(doc, el) {
  if (!el || el === doc.documentElement || el === doc.body) return;
  const scroller = doc.scrollingElement || doc.documentElement;
  const rect = el.getBoundingClientRect();
  const top = scroller.scrollTop + rect.top - (scroller.clientHeight - rect.height) / 2;
  scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function syncHeaderHeight() {
  const header = document.querySelector(".header");
  if (!header) return;
  document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
}

function initFrame() {
  els.frame.addEventListener("load", () => {
    const doc = frameDoc();
    if (!doc) return;
    const hl = doc.getElementById("hl");
    if (hl) {
      hl.textContent = ".__hit { outline: 2px solid #f59e0b; outline-offset: 1px; }";
    }
    frameReady = true;
    if (currentSel) {
      const hits = applyToFrame(currentSel.sel, currentSel.css);
      els.hit.textContent = hits === null ? "—" : String(hits);
    }
  });
  els.frame.srcdoc = DEMO_HTML;
}

function clearFrame() {
  const doc = frameDoc();
  if (!doc) return;
  doc.querySelectorAll(".__hit").forEach((el) => el.classList.remove("__hit"));
  const live = doc.getElementById("live");
  if (live) live.textContent = "";
}

function applyToFrame(selector, css) {
  const doc = frameDoc();
  if (!doc || !frameReady) return null;

  const query = toHighlightQuery(selector);
  try {
    doc.querySelector(query);
  } catch {
    return null;
  }

  clearFrame();
  const nodes = Array.from(doc.querySelectorAll(query));
  nodes.forEach((el) => el.classList.add("__hit"));
  const live = doc.getElementById("live");
  if (live) live.textContent = css;
  if (initialApplyDone) scrollToFirstHit(doc, nodes[0]);
  initialApplyDone = true;
  return nodes.length;
}


function renderFilters() {
  els.filters.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip${cat.id === currentCat ? " is-active" : ""}`;
    btn.textContent = cat.id === "all" ? cat.label : `${cat.label}（${SELECTORS.filter((s) => s.cat === cat.id).length}）`;
    btn.addEventListener("click", () => {
      currentCat = cat.id;
      renderFilters();
      renderList();
    });
    els.filters.appendChild(btn);
  });
}

function matchesQuery(item, query) {
  if (!query) return true;
  return `${item.sel} ${item.label} ${item.desc}`.toLowerCase().includes(query);
}

function renderList() {
  const query = els.search.value.trim().toLowerCase();
  const items = SELECTORS.filter((s) => (currentCat === "all" || s.cat === currentCat) && matchesQuery(s, query));

  els.list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `sel-btn${currentSel && currentSel.sel === item.sel ? " is-active" : ""}`;
    btn.innerHTML = `<code class="sel-code"></code><span class="sel-label"></span>`;
    btn.querySelector(".sel-code").textContent = item.sel;
    btn.querySelector(".sel-label").textContent = item.label;
    btn.addEventListener("click", () => select(item));
    li.appendChild(btn);
    els.list.appendChild(li);
  });

  els.count.textContent = `${items.length} / ${SELECTORS.length} 件`;
  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-msg";
    li.textContent = "該当するセレクタがありません";
    els.list.appendChild(li);
  }
}


function select(item) {
  currentSel = item;
  els.name.textContent = item.sel;
  els.desc.textContent = item.desc;
  els.note.textContent = item.note || "";
  els.note.hidden = !item.note;
  els.code.textContent = item.css;
  els.copy.disabled = false;

  const hits = applyToFrame(item.sel, item.css);
  els.hit.textContent = hits === null ? "—" : String(hits);
  renderList();
}

function resetDetail() {
  currentSel = null;
  els.name.textContent = "セレクタを選んでください";
  els.desc.textContent = "一覧から選ぶと、解説とサンプルCSSが表示され、デモにその場で適用されます。";
  els.note.hidden = true;
  els.code.textContent = "";
  els.copy.disabled = true;
  els.hit.textContent = "0";
  clearFrame();
  renderList();
}


let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

async function copyCss() {
  const text = els.code.textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast("CSSをコピーしました");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    showToast(ok ? "CSSをコピーしました" : "コピーできませんでした");
  }
}


function init() {
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  initFrame();
  renderFilters();
  resetDetail();

  els.search.addEventListener("input", renderList);
  els.copy.addEventListener("click", copyCss);

  select(SELECTORS.find((s) => s.sel === "#header") || SELECTORS[0]);
}

init();
