
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

let els = {};
let itemEls = new Map();
let tool = "select";
let color = "#fde68a";
let selectedIds = new Set();
let selectedConnId = null;
let clipboard = null;
let pasteShift = 0;
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

const NODE_TYPES = new Set(["folder", "file"]);
const NODE_ICON = { folder: "📁", file: "📄" };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const cam = () => state.camera;

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

export function setWireStyle(style) {
  state.wireStyle = style === "straight" ? "straight" : "elbow";
  save();
  renderWires();
  onChange({ wireStyle: state.wireStyle });
}

export function setWireEnds(ends) {
  const val = ["end", "both", "none"].includes(ends) ? ends : "end";
  state.wireEnds = val;
  if (selectedConnId) updateConnector(selectedConnId, { ends: val });
  save();
  renderWires();
  onChange({ wireEnds: val });
}

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
  selectedIds.forEach((id) => {
    updateItem(id, { color: hex });
    renderItem(getItem(id));
  });
  onChange({ color });
}

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
  if (e.metaKey || e.ctrlKey) {
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoomAt(e.clientX, e.clientY, factor);
  } else {
    cam().x -= e.deltaX;
    cam().y -= e.deltaY;
    applyCamera();
  }
}

function screenToWorld(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - cam().x) / cam().scale,
    y: (clientY - rect.top - cam().y) / cam().scale,
  };
}

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
    if (itemEl.classList.contains("editing")) return;
    if (e.shiftKey) {
      selectItem(id, true);
      return;
    }
    if (!selectedIds.has(id)) selectItem(id, false);
    startMoveSelection(e);
    return;
  }

  if (isCreationTool(tool)) {
    createItemAt(e.clientX, e.clientY);
    return;
  }
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

const DRAG_THRESHOLD = 3;
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
      }
    }
    if (onUp) onUp(ev);
  };
  target.addEventListener("pointermove", move);
  target.addEventListener("pointerup", end);
  target.addEventListener("pointercancel", end);
}

function startMarquee(e) {
  const box = document.createElement("div");
  box.className = "marquee";
  els.canvas.appendChild(box);
  const additive = e.shiftKey;
  const base = additive ? new Set(selectedIds) : new Set();
  if (!additive) applySelectionSet(new Set());
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
      if (!moved && !additive) clearSelection();
      onChange({ selected: selectedIds.size > 0 });
    }
  );
}

function itemsInRect(x1, y1, x2, y2) {
  return state.items
    .filter((it) => it.x < x2 && it.x + it.w > x1 && it.y < y2 && it.y + it.h > y1)
    .map((it) => it.id);
}

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

function startConnector(fromId, e) {
  const from = getItem(fromId);
  if (!from) return;
  const preview = document.createElementNS("http://www.w3.org/2000/svg", "path");
  preview.setAttribute("class", "wire-preview");
  preview.setAttribute("marker-end", "url(#arrow)");
  preview.style.pointerEvents = "none";
  els.wires.appendChild(preview);
  let targetEl = null;

  beginGesture(
    e,
    (ev) => {
      const w = screenToWorld(ev.clientX, ev.clientY);
      const p1 = rectEdge(from, w.x, w.y);
      preview.setAttribute("d", `M ${p1.x} ${p1.y} L ${w.x} ${w.y}`);
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

export function deleteSelected() {
  if (selectedIds.size) {
    selectedIds.forEach((id) => {
      const el = itemEls.get(id);
      if (el) el.remove();
      itemEls.delete(id);
      removeItem(id);
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

function collectSelection() {
  const items = state.items.filter((it) => selectedIds.has(it.id)).map((it) => ({ ...it }));
  const idset = new Set(items.map((it) => it.id));
  const conns = state.connectors
    .filter((c) => idset.has(c.from) && idset.has(c.to))
    .map((c) => ({ ...c }));
  return { items, conns };
}

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

function renderAll() {
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
  const themed = !item.color || item.color === "auto";
  const val = themed ? "" : item.color;
  if (item.type === "diamond") {
    const bg = el.querySelector(".shape-bg");
    if (bg) bg.style.background = val;
  } else {
    el.style.background = val;
  }
}

function renderWires() {
  [...els.wires.querySelectorAll(".wire, .wire-hit")].forEach((n) => n.remove());
  const NS = "http://www.w3.org/2000/svg";

  state.connectors.forEach((conn) => {
    const a = getItem(conn.from);
    const b = getItem(conn.to);
    if (!a || !b) return;
    const d = wireD(a, b);

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

function wireD(a, b) {
  if (state.wireStyle === "straight") {
    const p1 = rectEdge(a, b.x + b.w / 2, b.y + b.h / 2);
    const p2 = rectEdge(b, a.x + a.w / 2, a.y + a.h / 2);
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }
  return elbowD(a, b);
}

const BUS_GAP = 22;
const ALIGN_SNAP = 16;

function elbowD(a, b) {
  const acx = a.x + a.w / 2;
  const bcx = b.x + b.w / 2;
  const acy = a.y + a.h / 2;
  const bcy = b.y + b.h / 2;
  const bottom = a.y + a.h;
  if (b.y > bottom + BUS_GAP + 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return `M ${bcx} ${bottom} V ${b.y}`;
    const busY = bottom + BUS_GAP;
    return `M ${acx} ${bottom} V ${busY} H ${bcx} V ${b.y}`;
  }
  if (b.y + b.h < a.y - BUS_GAP - 2) {
    if (Math.abs(acx - bcx) <= ALIGN_SNAP) return `M ${bcx} ${a.y} V ${b.y + b.h}`;
    const busY = a.y - BUS_GAP;
    return `M ${acx} ${a.y} V ${busY} H ${bcx} V ${b.y + b.h}`;
  }
  if (b.x > a.x + a.w) {
    const x1 = a.x + a.w;
    const x2 = b.x;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return `M ${x1} ${bcy} H ${x2}`;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${acy} H ${mx} V ${bcy} H ${x2}`;
  }
  if (b.x + b.w < a.x) {
    const x1 = a.x;
    const x2 = b.x + b.w;
    if (Math.abs(acy - bcy) <= ALIGN_SNAP) return `M ${x1} ${bcy} H ${x2}`;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${acy} H ${mx} V ${bcy} H ${x2}`;
  }
  const p1 = rectEdge(a, bcx, bcy);
  const p2 = rectEdge(b, acx, acy);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
}

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
