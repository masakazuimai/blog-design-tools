/* CSSセレクタ辞典 メイン処理
   デモは iframe（srcdoc）に隔離してある。ライブCSS（* や a:hover など）は
   iframe の中だけで完結するので、ツール本体のUIは絶対に壊れない。 */
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
  custom: $("customInput"),
  customRun: $("customRun"),
  clear: $("clearBtn"),
  toast: $("toast"),
};

/* 疑似要素・状態系の疑似クラスは querySelectorAll で対象を数えられないため、
   ハイライト用のクエリからは取り除いて「どの要素が対象か」だけを示す */
const PSEUDO_ELEMENT = /::(before|after|first-letter|first-line|marker|placeholder|selection)/g;
const STATE_PSEUDO = /:(link|visited|hover|active|focus-visible|focus-within|focus)\b/g;

const toHighlightQuery = (selector) => selector.replace(PSEUDO_ELEMENT, "").replace(STATE_PSEUDO, "").trim();

let currentCat = "all";
let currentSel = null;
let frameReady = false;
// 初回表示の適用ではデモをスクロールさせない（開いた瞬間は先頭から見せる）
let initialApplyDone = false;

/* ========== iframe（デモ） ========== */

const frameDoc = () => els.frame.contentDocument;

/**
 * デモ内の最初のヒット要素が見えるところまで、iframe の中だけをスクロールする。
 * scrollIntoView は親ページまで巻き込んで動かすので使わない。
 */
function scrollToFirstHit(doc, el) {
  if (!el || el === doc.documentElement || el === doc.body) return;
  const scroller = doc.scrollingElement || doc.documentElement;
  const rect = el.getBoundingClientRect();
  const top = scroller.scrollTop + rect.top - (scroller.clientHeight - rect.height) / 2;
  scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

/** ヘッダーの実測高さをCSS変数に渡す（レイアウト高 = 画面高 - ヘッダー） */
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
    // 読み込み完了前に選ばれていた場合はここで適用し直す
    if (currentSel) {
      const hits = applyToFrame(currentSel.sel, currentSel.css);
      els.hit.textContent = hits === null ? "—" : String(hits);
    }
  });
  els.frame.srcdoc = DEMO_HTML;
}

/** デモ側のハイライトとライブCSSを消す */
function clearFrame() {
  const doc = frameDoc();
  if (!doc) return;
  doc.querySelectorAll(".__hit").forEach((el) => el.classList.remove("__hit"));
  const live = doc.getElementById("live");
  if (live) live.textContent = "";
}

/**
 * セレクタをデモに適用する
 * @returns {number|null} ヒット数。セレクタが無効なら null
 */
function applyToFrame(selector, css) {
  const doc = frameDoc();
  if (!doc || !frameReady) return null;

  const query = toHighlightQuery(selector);
  try {
    doc.querySelector(query); // 書き方が正しいかの検査だけ先に行う
  } catch {
    return null; // 無効なセレクタ。ハイライトは触らず呼び出し側で通知する
  }

  // ハイライト用クラスが検索結果に影響しないよう、消してから数える
  clearFrame();
  const nodes = Array.from(doc.querySelectorAll(query));
  nodes.forEach((el) => el.classList.add("__hit"));
  const live = doc.getElementById("live");
  if (live) live.textContent = css;
  if (initialApplyDone) scrollToFirstHit(doc, nodes[0]);
  initialApplyDone = true;
  return nodes.length;
}

/* ========== 一覧（絞り込み・検索） ========== */

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

/* ========== 詳細パネル ========== */

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

/* ========== カスタムセレクタ ========== */

function runCustom() {
  const selector = els.custom.value.trim();
  if (!selector) return;

  const css = `${selector} {\n  outline: 2px dashed #0ea5e9;\n}`;
  const hits = applyToFrame(selector, css);
  if (hits === null) {
    els.hit.textContent = "—";
    showToast("セレクタの書き方が正しくありません");
    return;
  }
  currentSel = null;
  els.name.textContent = selector;
  els.desc.textContent = "カスタムセレクタの実行結果です。デモ内で一致した要素をハイライトしています。";
  els.note.hidden = true;
  els.code.textContent = css;
  els.copy.disabled = false;
  els.hit.textContent = String(hits);
  renderList();
}

/* ========== コピー・トースト ========== */

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
    // clipboard API が使えない環境（古いブラウザ・非セキュアコンテキスト）向けの退避策
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

/* ========== 起動 ========== */

function init() {
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  initFrame();
  renderFilters();
  resetDetail();

  els.search.addEventListener("input", renderList);
  els.copy.addEventListener("click", copyCss);
  els.clear.addEventListener("click", resetDetail);
  els.customRun.addEventListener("click", runCustom);
  els.custom.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCustom();
    }
  });

  // 初期表示は #header を選んだ状態にする。
  // ヒットが1件だけで「どこに当たったか」が一目で分かるため（p だと14件光って伝わりにくい）
  select(SELECTORS.find((s) => s.sel === "#header") || SELECTORS[0]);
}

init();
