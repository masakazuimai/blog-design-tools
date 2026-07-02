// ============================================================
// ホワイトボード エンジン
// カメラ（パン・ズーム）/ 描画 / 付箋・図形・コネクタの操作
// ============================================================

import {
  state,
  nextId,
  getItem,
  addItem,
  updateItem,
  removeItem,
  addConnector,
  updateConnector,
  removeConnector,
  save,
} from "./store.js?v=20260702s";

// ---- モジュール内参照 ----
let els = {};
let itemEls = new Map(); // id -> element
let tool = "select";
let color = "#fde68a";
let selectedIds = new Set(); // 複数選択中のアイテムid
let selectedConnId = null;
let clipboard = null; // コピー内容 { items, conns }
let pasteShift = 0; // 連続ペーストのずらし量
let onChange = () => {};

const MIN_SCALE = 0.2;
const MAX_SCALE = 3;
const GRID = 24;

const DEFAULT_SIZE = {
  sticky: { w: 168, h: 168 },
  rect: { w: 168, h: 96 },
  ellipse: { w: 150, h: 110 },
  diamond: { w: 140, h: 140 },
  folder: { w: 196, h: 60 },
  file: { w: 184, h: 52 },
};

// フォルダ/ファイル（ディレクトリマップ用ノード）
const NODE_TYPES = new Set(["folder", "file"]);
const NODE_ICON = { folder: "📁", file: "📄" };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const cam = () => state.camera;

// ============================================================
// 初期化
// ============================================================
export function initBoard(refs, opts = {}) {
  els = refs;
  onChange = opts.onChange || (() => {});

  applyCamera();
  renderAll();

  els.canvas.addEventListener("pointerdown", onPointerDown);
  els.canvas.addEventListener("dblclick", onDblClick);
  els.canvas.addEventListener("wheel", onWheel, { passive: false });

  return {
    setTool,
    setColor,
    setWireStyle,
    setWireEnds,
    zoomBy,
    resetZoom,
    fitView,
    deleteSelected,
    clearSelection,
    selectAll,
    copySelection,
    pasteClipboard,
    duplicateSelection,
    cutSelection,
    renderAll,
    getState: () => state,
  };
}

// 矢印の形（直角エルボー / 直線）を切り替え（全コネクタに適用）
export function setWireStyle(style) {
  state.wireStyle = style === "straight" ? "straight" : "elbow";
  save();
  renderWires();
  onChange({ wireStyle: state.wireStyle });
}

// 矢印の端（片方向 / 双方向 / なし）。新規の既定を更新し、選択中コネクタにも即適用
export function setWireEnds(ends) {
  const val = ["end", "both", "none"].includes(ends) ? ends : "end";
  state.wireEnds = val;
  if (selectedConnId) updateConnector(selectedConnId, { ends: val });
  save();
  renderWires();
  onChange({ wireEnds: val });
}

// ============================================================
// ツール・色
// ============================================================
export function setTool(next) {
  tool = next;
  els.canvas.classList.remove(
    "tool-sticky",
    "tool-rect",
    "tool-ellipse",
    "tool-diamond",
    "tool-folder",
    "tool-file",
    "tool-connector"
  );
  if (next !== "select") els.canvas.classList.add(`tool-${next}`);
  onChange({ tool });
}

export function setColor(hex) {
  color = hex;
  // 選択中アイテムすべてに即反映
  selectedIds.forEach((id) => {
    updateItem(id, { color: hex });
    renderItem(getItem(id));
  });
  onChange({ color });
}

// ============================================================
// カメラ（パン・ズーム）
// ============================================================
function applyCamera() {
  const { x, y, scale } = cam();
  els.world.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  els.canvas.style.backgroundSize = `${GRID * scale}px ${GRID * scale}px`;
  els.canvas.style.backgroundPosition = `${x}px ${y}px`;
  if (els.zoomVal) els.zoomVal.textContent = `${Math.round(scale * 100)}%`;
}

function zoomAt(clientX, clientY, factor) {
  const rect = els.canvas.getBoundingClientRect();
  const sx = clientX - rect.left;
  const sy = clientY - rect.top;
  const wx = (sx - cam().x) / cam().scale;
  const wy = (sy - cam().y) / cam().scale;
  const scale = clamp(cam().scale * factor, MIN_SCALE, MAX_SCALE);
  cam().scale = scale;
  cam().x = sx - wx * scale;
  cam().y = sy - wy * scale;
  applyCamera();
}

export function zoomBy(factor) {
  const rect = els.canvas.getBoundingClientRect();
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
}

export function resetZoom() {
  cam().scale = 1;
  applyCamera();
}

// 全アイテムがビューポート中央に収まるようカメラを合わせる
export function fitView(padding = 60) {
  if (!state.items.length) return;
  const rect = els.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  state.items.forEach((it) => {
    minX = Math.min(minX, it.x);
    minY = Math.min(minY, it.y);
    maxX = Math.max(maxX, it.x + it.w);
    maxY = Math.max(maxY, it.y + it.h);
  });
  const bw = Math.max(1, maxX - minX);
  const bh = Math.max(1, maxY - minY);
  const scale = clamp(
    Math.min((rect.width - padding * 2) / bw, (rect.height - padding * 2) / bh, 1),
    MIN_SCALE,
    MAX_SCALE
  );
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  cam().scale = scale;
  cam().x = rect.width / 2 - cx * scale;
  cam().y = rect.height / 2 - cy * scale;
  applyCamera();
}

function onWheel(e) {
  e.preventDefault();
  // ⌘（Mac）/ Ctrl を押しながらのときだけズーム。単体ホイールはスクロール（パン）
  if (e.metaKey || e.ctrlKey) {
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoomAt(e.clientX, e.clientY, factor);
  } else {
    cam().x -= e.deltaX;
    cam().y -= e.deltaY;
    applyCamera();
  }
}

// 画面座標 → ワールド座標
function screenToWorld(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - cam().x) / cam().scale,
    y: (clientY - rect.top - cam().y) / cam().scale,
  };
}

// ============================================================
// ポインタ操作の入口
// ============================================================
function onPointerDown(e) {
  if (e.button !== 0) return;
  const rz = e.target.closest(".rz");
  if (rz) {
    const id = rz.parentElement.dataset.id;
    startResize(id, e);
    return;
  }

  const itemEl = e.target.closest(".item");
  if (itemEl) {
    const id = itemEl.dataset.id;
    if (tool === "connector") {
      startConnector(id, e);
      return;
    }
    if (itemEl.classList.contains("editing")) return; // テキスト編集中はキャレット優先
    if (e.shiftKey) {
      selectItem(id, true); // Shiftクリックで選択に追加/解除（移動はしない）
      return;
    }
    if (!selectedIds.has(id)) selectItem(id, false); // 未選択ならこれだけ選択
    startMoveSelection(e); // 選択中すべてをまとめて移動
    return;
  }

  // 空きスペース
  if (isCreationTool(tool)) {
    createItemAt(e.clientX, e.clientY);
    return;
  }
  // パンは廃止 → 空きドラッグは範囲選択（マーキー）
  startMarquee(e);
}

function isCreationTool(t) {
  return (
    t === "sticky" ||
    t === "rect" ||
    t === "ellipse" ||
    t === "diamond" ||
    t === "folder" ||
    t === "file"
  );
}

// ---- 汎用ジェスチャ ----
// pointer captureは「実際に動き始めてから」engageする。pointerdown即時にcaptureすると
// クリック/ダブルクリックのイベント合成を妨げ、ダブルクリック編集が効かなくなるため。
// 一度動き出せばcaptureされ、広告iframe等を跨いでもpointermove/upを取りこぼさない。
const DRAG_THRESHOLD = 3; // px
function beginGesture(e, onMove, onUp) {
  const target = els.canvas;
  const pid = e.pointerId;
  const startX = e.clientX;
  const startY = e.clientY;
  let captured = false;
  const move = (ev) => {
    if (!captured) {
      if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < DRAG_THRESHOLD) return;
      captured = true;
      try {
        if (pid != null) target.setPointerCapture(pid);
      } catch (_) {
        /* 非対応でも通常のバブリングで概ね動く */
      }
    }
    onMove(ev);
  };
  const end = (ev) => {
    target.removeEventListener("pointermove", move);
    target.removeEventListener("pointerup", end);
    target.removeEventListener("pointercancel", end);
    if (captured) {
      try {
        if (pid != null) target.releasePointerCapture(pid);
      } catch (_) {
        /* noop */
      }
    }
    if (onUp) onUp(ev);
  };
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", end);
}

// ============================================================
// 範囲選択（マーキー）
// ============================================================
function startMarquee(e) {
  const box = document.createElement("div");
  box.className = "marquee";
  els.canvas.appendChild(box);
  const additive = e.shiftKey;
  const base = additive ? new Set(selectedIds) : new Set();
  if (!additive) applySelectionSet(new Set()); // 既存選択をいったん解除
  const rect = els.canvas.getBoundingClientRect();
  const sx0 = e.clientX - rect.left;
  const sy0 = e.clientY - rect.top;
  let moved = false;

  beginGesture(
    e,
    (ev) => {
      moved = true;
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      box.style.left = `${Math.min(sx0, sx)}px`;
      box.style.top = `${Math.min(sy0, sy)}px`;
      box.style.width = `${Math.abs(sx - sx0)}px`;
      box.style.height = `${Math.abs(sy - sy0)}px`;
      const p1 = screenToWorld(Math.min(e.clientX, ev.clientX), Math.min(e.clientY, ev.clientY));
      const p2 = screenToWorld(Math.max(e.clientX, ev.clientX), Math.max(e.clientY, ev.clientY));
      const next = new Set(base);
      itemsInRect(p1.x, p1.y, p2.x, p2.y).forEach((id) => next.add(id));
      applySelectionSet(next);
    },
    () => {
      box.remove();
      if (!moved && !additive) clearSelection(); // 単なるクリック＝選択解除
      onChange({ selected: selectedIds.size > 0 });
    }
  );
}

// 矩形（ワールド座標）と交差するアイテムid
function itemsInRect(x1, y1, x2, y2) {
  return state.items
    .filter((it) => it.x < x2 && it.x + it.w > x1 && it.y < y2 && it.y + it.h > y1)
    .map((it) => it.id);
}

// ============================================================
// アイテム生成
// ============================================================
function createItemAt(clientX, clientY) {
  const type = tool;
  const size = DEFAULT_SIZE[type];
  const w = screenToWorld(clientX, clientY);
  const item = {
    id: nextId("n"),
    type,
    x: Math.round(w.x - size.w / 2),
    y: Math.round(w.y - size.h / 2),
    w: size.w,
    h: size.h,
    text: "",
    color,
  };
  addItem(item);
  renderItem(item);
  updateEmptyHint();
  setTool("select");
  selectItem(item.id);
  startEdit(item.id);
}

// ============================================================
// アイテム移動（選択中すべてをまとめて）
// ============================================================
function startMoveSelection(e) {
  const ids = [...selectedIds];
  if (!ids.length) return;
  const start = screenToWorld(e.clientX, e.clientY);
  const targets = ids
    .map((id) => {
      const item = getItem(id);
      const el = itemEls.get(id);
      return item && el ? { id, item, el, x0: item.x, y0: item.y } : null;
    })
    .filter(Boolean);
  targets.forEach((t) => t.el.classList.add("is-dragging"));
  let moved = false;

  beginGesture(
    e,
    (ev) => {
      const now = screenToWorld(ev.clientX, ev.clientY);
      const dx = now.x - start.x;
      const dy = now.y - start.y;
      targets.forEach((t) => {
        t.item.x = Math.round(t.x0 + dx);
        t.item.y = Math.round(t.y0 + dy);
        applyItemPosition(t.el, t.item);
      });
      renderWires();
      moved = true;
    },
    () => {
      targets.forEach((t) => t.el.classList.remove("is-dragging"));
      if (moved) targets.forEach((t) => updateItem(t.id, { x: t.item.x, y: t.item.y }));
    }
  );
}

// ============================================================
// アイテムのリサイズ
// ============================================================
function startResize(id, e) {
  const item = getItem(id);
  if (!item) return;
  const startW = item.w;
  const startH = item.h;
  const start = screenToWorld(e.clientX, e.clientY);
  const el = itemEls.get(id);
  e.stopPropagation();

  beginGesture(
    e,
    (ev) => {
      const now = screenToWorld(ev.clientX, ev.clientY);
      item.w = Math.max(56, Math.round(startW + (now.x - start.x)));
      item.h = Math.max(44, Math.round(startH + (now.y - start.y)));
      applyItemSize(el, item);
      renderWires();
    },
    () => {
      updateItem(id, { w: item.w, h: item.h });
    }
  );
}

// ============================================================
// コネクタ生成（アイテム→アイテム）
// ============================================================
function startConnector(fromId, e) {
  const from = getItem(fromId);
  if (!from) return;
  const preview = document.createElementNS("http://www.w3.org/2000/svg", "path");
  preview.setAttribute("class", "wire-preview");
  preview.setAttribute("marker-end", "url(#arrow)");
  preview.style.pointerEvents = "none"; // elementFromPointで対象アイテムを妨げない
  els.wires.appendChild(preview);
  let targetEl = null;

  beginGesture(
    e,
    (ev) => {
      const w = screenToWorld(ev.clientX, ev.clientY);
      const p1 = rectEdge(from, w.x, w.y);
      preview.setAttribute("d", `M ${p1.x} ${p1.y} L ${w.x} ${w.y}`);
      // ホバー中のアイテムを強調
      const over = document.elementFromPoint(ev.clientX, ev.clientY);
      const overItem = over && over.closest(".item");
      if (targetEl && targetEl !== overItem) targetEl.classList.remove("is-connect-target");
      if (overItem && overItem.dataset.id !== fromId) {
        overItem.classList.add("is-connect-target");
        targetEl = overItem;
      } else {
        targetEl = null;
      }
    },
    (ev) => {
      preview.remove();
      // ドラッグ中に追跡した targetEl を優先し、無ければ離した位置で判定（取りこぼし防止）
      let overItem = targetEl;
      if (!overItem) {
        const over = document.elementFromPoint(ev.clientX, ev.clientY);
        overItem = over && over.closest(".item");
      }
      if (targetEl) targetEl.classList.remove("is-connect-target");
      if (overItem && overItem.dataset.id !== fromId) {
        addConnector(fromId, overItem.dataset.id);
        renderWires();
      }
    }
  );
}

// ============================================================
// テキスト編集
// ============================================================
function onDblClick(e) {
  const itemEl = e.target.closest(".item");
  if (!itemEl) return;
  startEdit(itemEl.dataset.id);
}

function startEdit(id) {
  const el = itemEls.get(id);
  if (!el) return;
  const txt = el.querySelector(".txt");
  el.classList.add("editing");
  txt.setAttribute("contenteditable", "true");
  txt.focus();
  // キャレットを末尾へ
  const range = document.createRange();
  range.selectNodeContents(txt);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  const finish = () => {
    txt.removeAttribute("contenteditable");
    el.classList.remove("editing");
    updateItem(id, { text: txt.textContent });
    txt.removeEventListener("blur", finish);
  };
  txt.addEventListener("blur", finish);
}

// ============================================================
// 選択（複数対応）
// ============================================================
// 選択集合をnextに揃え、DOMのis-selectedクラスとリサイズハンドルを反映
function applySelectionSet(next) {
  selectedIds.forEach((id) => {
    if (!next.has(id)) {
      const el = itemEls.get(id);
      if (el) el.classList.remove("is-selected");
    }
  });
  next.forEach((id) => {
    const el = itemEls.get(id);
    if (el) el.classList.add("is-selected");
  });
  selectedIds = next;
  updateResizeHandle();
}

// リサイズハンドルは「単一選択のとき」だけ表示
function updateResizeHandle() {
  itemEls.forEach((el) => {
    const h = el.querySelector(".rz");
    if (h) h.remove();
  });
  if (selectedIds.size === 1) {
    const el = itemEls.get([...selectedIds][0]);
    if (el) {
      const handle = document.createElement("div");
      handle.className = "rz";
      el.appendChild(handle);
    }
  }
}

function selectItem(id, additive) {
  selectedConnId = null;
  let next;
  if (additive) {
    next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
  } else {
    next = new Set([id]);
  }
  applySelectionSet(next);
  onChange({ selected: selectedIds.size > 0 });
}

export function selectAll() {
  applySelectionSet(new Set(state.items.map((it) => it.id)));
  selectedConnId = null;
  onChange({ selected: state.items.length > 0 });
}

export function clearSelection() {
  applySelectionSet(new Set());
  selectedConnId = null;
  renderWires();
  onChange({ selected: false });
}

// ============================================================
// 削除
// ============================================================
export function deleteSelected() {
  if (selectedIds.size) {
    selectedIds.forEach((id) => {
      const el = itemEls.get(id);
      if (el) el.remove();
      itemEls.delete(id);
      removeItem(id); // 付随コネクタも除去
    });
    selectedIds = new Set();
    renderWires();
    updateEmptyHint();
    onChange({ selected: false });
  } else if (selectedConnId) {
    removeConnector(selectedConnId);
    selectedConnId = null;
    renderWires();
  }
}

// ============================================================
// コピー / ペースト / 複製 / 切り取り
// ============================================================
function collectSelection() {
  const items = state.items.filter((it) => selectedIds.has(it.id)).map((it) => ({ ...it }));
  const idset = new Set(items.map((it) => it.id));
  const conns = state.connectors
    .filter((c) => idset.has(c.from) && idset.has(c.to))
    .map((c) => ({ ...c }));
  return { items, conns };
}

// items/connsをdx,dyずらして複製・追加し、複製分を選択状態にする
function addClones(items, conns, dx, dy) {
  if (!items.length) return 0;
  const idMap = new Map();
  const newItems = items.map((it) => {
    const nid = nextId("n");
    idMap.set(it.id, nid);
    return { ...it, id: nid, x: it.x + dx, y: it.y + dy };
  });
  const newConns = conns
    .filter((c) => idMap.has(c.from) && idMap.has(c.to))
    .map((c) => ({ ...c, id: nextId("c"), from: idMap.get(c.from), to: idMap.get(c.to) }));
  state.items = [...state.items, ...newItems];
  state.connectors = [...state.connectors, ...newConns];
  save();
  renderAll();
  applySelectionSet(new Set(newItems.map((it) => it.id)));
  onChange({ selected: true });
  return newItems.length;
}

export function copySelection() {
  if (!selectedIds.size) return 0;
  clipboard = collectSelection();
  pasteShift = 0;
  return clipboard.items.length;
}

export function pasteClipboard() {
  if (!clipboard || !clipboard.items.length) return 0;
  pasteShift += 24;
  return addClones(clipboard.items, clipboard.conns, pasteShift, pasteShift);
}

export function duplicateSelection() {
  if (!selectedIds.size) return 0;
  const { items, conns } = collectSelection();
  return addClones(items, conns, 24, 24);
}

export function cutSelection() {
  if (!selectedIds.size) return 0;
  const n = copySelection();
  deleteSelected();
  return n;
}

// ============================================================
// 描画
// ============================================================
function renderAll() {
  // 既存DOMを掃除（wires以外）
  itemEls.forEach((el) => el.remove());
  itemEls.clear();
  state.items.forEach((item) => renderItem(item));
  renderWires();
  updateEmptyHint();
}

function renderItem(item) {
  let el = itemEls.get(item.id);
  if (!el) {
    el = buildItemEl(item);
    els.world.appendChild(el);
    itemEls.set(item.id, el);
  }
  applyItemPosition(el, item);
  applyItemSize(el, item);
  applyItemColor(el, item);
  const txt = el.querySelector(".txt");
  if (txt.textContent !== item.text) txt.textContent = item.text;
}

function buildItemEl(item) {
  const el = document.createElement("div");
  const classes = ["item", item.type];
  if (item.type === "rect" || item.type === "ellipse" || item.type === "diamond") {
    classes.push("shape");
  }
  if (NODE_TYPES.has(item.type)) classes.push("node");
  el.className = classes.join(" ");
  el.dataset.id = item.id;

  if (item.type === "diamond") {
    const bg = document.createElement("div");
    bg.className = "shape-bg";
    el.appendChild(bg);
  }
  if (NODE_TYPES.has(item.type)) {
    const ico = document.createElement("span");
    ico.className = "node-ico";
    ico.textContent = NODE_ICON[item.type];
    el.appendChild(ico);
  }
  const txt = document.createElement("div");
  txt.className = "txt";
  txt.textContent = item.text || "";
  el.appendChild(txt);
  return el;
}

function applyItemPosition(el, item) {
  el.style.left = `${item.x}px`;
  el.style.top = `${item.y}px`;
}

function applyItemSize(el, item) {
  el.style.width = `${item.w}px`;
  el.style.height = `${item.h}px`;
}

function applyItemColor(el, item) {
  // 色未指定（auto/falsy）はインラインを空にしてCSSのテーマ既定色に委ねる
  const themed = !item.color || item.color === "auto";
  const val = themed ? "" : item.color;
  if (item.type === "diamond") {
    const bg = el.querySelector(".shape-bg");
    if (bg) bg.style.background = val;
  } else {
    el.style.background = val;
  }
}

// ---- コネクタ描画 ----
function renderWires() {
  // defs以外を除去
  [...els.wires.querySelectorAll(".wire, .wire-hit")].forEach((n) => n.remove());
  const NS = "http://www.w3.org/2000/svg";

  state.connectors.forEach((conn) => {
    const a = getItem(conn.from);
    const b = getItem(conn.to);
    if (!a || !b) return;
    const d = wireD(a, b);

    // 当たり判定用の太い透明線（クリックで選択）
    const hit = document.createElementNS(NS, "path");
    hit.setAttribute("class", "wire-hit");
    hit.setAttribute("d", d);
    hit.style.pointerEvents = "stroke";
    hit.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      selectConnector(conn.id);
    });

    const line = document.createElementNS(NS, "path");
    line.setAttribute("class", "wire" + (conn.id === selectedConnId ? " is-selected" : ""));
    line.setAttribute("d", d);
    // 矢印の端（片方向=end / 双方向=both / なし=none）。#arrowはorient="auto-start-reverse"なので両端共用
    const ends = conn.ends || "end";
    if (ends === "end" || ends === "both") line.setAttribute("marker-end", "url(#arrow)");
    if (ends === "both") line.setAttribute("marker-start", "url(#arrow)");

    els.wires.appendChild(hit);
    els.wires.appendChild(line);
  });
}

function selectConnector(id) {
  clearSelection();
  selectedConnId = id;
  renderWires();
  onChange({ selected: true });
}

// ---- コネクタのパス（スタイル別）----
// elbow: 直角ルーティング。子が下/上のときは「親中心から出る縦トランク＋共有バス」を
//        固定ギャップで描くため、同じ親から出た兄弟線が自然に枝分かれして見える。
function wireD(a, b) {
  if (state.wireStyle === "straight") {
    const p1 = rectEdge(a, b.x + b.w / 2, b.y + b.h / 2);
    const p2 = rectEdge(b, a.x + a.w / 2, a.y + a.h / 2);
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }
  return elbowD(a, b);
}

const BUS_GAP = 22; // 親の縁から共有バスまでの固定距離（兄弟で一致＝枝分かれ）
const ALIGN_SNAP = 16; // 中心のズレがこれ以下なら、カクつかせず真っ直ぐに整列させる

function elbowD(a, b) {
  const acx = a.x + a.w / 2;
  const bcx = b.x + b.w / 2;
  const acy = a.y + a.h / 2;
  const bcy = b.y + b.h / 2;
  const bottom = a.y + a.h;
  // 子が下：縦トランク→横バス→子へ降下（ただしほぼ真下なら真っ直ぐ）
  if (b.y > bottom + BUS_GAP + 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return `M ${bcx} ${bottom} V ${b.y}`;
    const busY = bottom + BUS_GAP;
    return `M ${acx} ${bottom} V ${busY} H ${bcx} V ${b.y}`;
  }
  // 子が上
  if (b.y + b.h < a.y - BUS_GAP - 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return `M ${bcx} ${a.y} V ${b.y + b.h}`;
    const busY = a.y - BUS_GAP;
    return `M ${acx} ${a.y} V ${busY} H ${bcx} V ${b.y + b.h}`;
  }
  // 子が右
  if (b.x > a.x + a.w) {
    const x1 = a.x + a.w;
    const x2 = b.x;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return `M ${x1} ${bcy} H ${x2}`;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${acy} H ${mx} V ${bcy} H ${x2}`;
  }
  // 子が左
  if (b.x + b.w < a.x) {
    const x1 = a.x;
    const x2 = b.x + b.w;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return `M ${x1} ${bcy} H ${x2}`;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${acy} H ${mx} V ${bcy} H ${x2}`;
  }
  // 近接・重なり：中心同士を直線
  const p1 = rectEdge(a, bcx, bcy);
  const p2 = rectEdge(b, acx, acy);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
}

// ---- 矩形の縁と、中心→対象方向の交点 ----
function rectEdge(item, tx, ty) {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const hw = item.w / 2;
  const hh = item.h / 2;
  const sx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

function updateEmptyHint() {
  if (!els.emptyHint) return;
  els.emptyHint.classList.toggle("is-hidden", state.items.length > 0);
}
