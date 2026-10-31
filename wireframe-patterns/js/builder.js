import { getPattern } from "./patterns/index.js?v=20261006h";

const KEY = "wfp:builder:v1";
const listeners = new Set();

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((item) => item && getPattern(item.id)) : [];
  } catch {
    return [];
  }
};

let items = load();

const commit = (next) => {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
  }
  listeners.forEach((fn) => fn(items));
};

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const getItems = () => items;
export const getBuilderPatterns = () => items.map((item) => getPattern(item.id));
export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const addItem = (id) => commit([...items, { uid: uid(), id }]);
export const removeItem = (key) => commit(items.filter((item) => item.uid !== key));
export const clearItems = () => commit([]);
export const replaceItems = (ids) => commit(ids.map((id) => ({ uid: uid(), id })));

export const moveItem = (key, delta) => {
  const from = items.findIndex((item) => item.uid === key);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= items.length) return;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  commit(next);
};

export const swapItem = (key, id) => commit(items.map((item) => (item.uid === key ? { ...item, id } : item)));
