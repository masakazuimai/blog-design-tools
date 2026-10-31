
const KEY = "dirmap:v1";

export const state = {
  items: [],
  connectors: [],
  camera: { x: 0, y: 0, scale: 1 },
  seq: 1,
  wireStyle: "elbow",
  wireEnds: "end",
};

export function nextId(prefix) {
  const id = `${prefix}_${state.seq}`;
  state.seq += 1;
  return id;
}

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
  state.connectors = state.connectors.filter((c) => c.from !== id && c.to !== id);
  save();
}

export function addConnector(from, to) {
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
  const nums = [...state.items, ...state.connectors]
    .map((o) => Number(String(o.id).split("_")[1]))
    .filter((n) => !Number.isNaN(n));
  state.seq = (nums.length ? Math.max(...nums) : 0) + 1;
  save();
}

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

export function hasSaved() {
  try {
    return localStorage.getItem(KEY) != null;
  } catch (_) {
    return false;
  }
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
