// ============================================================
// 状態管理と永続化（localStorage）
// ============================================================

const KEY = "dirmap:v1";

// アイテム: { id, type:'sticky'|'rect'|'ellipse'|'diamond', x, y, w, h, text, color }
// コネクタ: { id, from, to }
export const state = {
  items: [],
  connectors: [],
  camera: { x: 0, y: 0, scale: 1 },
  seq: 1,
  wireStyle: "elbow", // 'elbow'（直角・分岐）| 'straight'（直線）
  wireEnds: "end", // 新規コネクタの既定の矢印端: 'end'（片方向）| 'both'（双方向）| 'none'（線のみ）
};

// ---- ID採番（Math.random非依存で衝突しない連番）----
export function nextId(prefix) {
  const id = `${prefix}_${state.seq}`;
  state.seq += 1;
  return id;
}

// ---- 参照ヘルパー ----
export function getItem(id) {
  return state.items.find((it) => it.id === id) || null;
}

export function addItem(item) {
  state.items = [...state.items, item];
  save();
}

export function updateItem(id, patch) {
  state.items = state.items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  save();
}

export function removeItem(id) {
  state.items = state.items.filter((it) => it.id !== id);
  // 付随するコネクタも削除
  state.connectors = state.connectors.filter((c) => c.from !== id && c.to !== id);
  save();
}

export function addConnector(from, to) {
  // 同一ペアの重複・自己接続は無視
  if (from === to) return null;
  const dup = state.connectors.some(
    (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from)
  );
  if (dup) return null;
  const conn = { id: nextId("c"), from, to, ends: state.wireEnds || "end" };
  state.connectors = [...state.connectors, conn];
  save();
  return conn;
}

export function updateConnector(id, patch) {
  state.connectors = state.connectors.map((c) => (c.id === id ? { ...c, ...patch } : c));
  save();
}

export function removeConnector(id) {
  state.connectors = state.connectors.filter((c) => c.id !== id);
  save();
}

export function clearAll() {
  state.items = [];
  state.connectors = [];
  save();
}

export function replaceAll(data) {
  state.items = Array.isArray(data.items) ? data.items : [];
  state.connectors = Array.isArray(data.connectors) ? data.connectors : [];
  // seqは既存IDと衝突しないよう最大値+1へ
  const nums = [...state.items, ...state.connectors]
    .map((o) => Number(String(o.id).split("_")[1]))
    .filter((n) => !Number.isNaN(n));
  state.seq = (nums.length ? Math.max(...nums) : 0) + 1;
  save();
}

// ---- 永続化（デバウンス保存）----
let saveTimer = null;
export function save() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const payload = {
        items: state.items,
        connectors: state.connectors,
        camera: state.camera,
        seq: state.seq,
        wireStyle: state.wireStyle,
        wireEnds: state.wireEnds,
      };
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("ホワイトボードの保存に失敗しました:", err);
    }
  }, 250);
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.items)) state.items = data.items;
    if (Array.isArray(data.connectors)) state.connectors = data.connectors;
    if (data.camera && typeof data.camera.scale === "number") state.camera = data.camera;
    if (typeof data.seq === "number") state.seq = data.seq;
    if (data.wireStyle === "elbow" || data.wireStyle === "straight") state.wireStyle = data.wireStyle;
    if (["end", "both", "none"].includes(data.wireEnds)) state.wireEnds = data.wireEnds;
  } catch (err) {
    console.error("ホワイトボードの読み込みに失敗しました:", err);
  }
}
