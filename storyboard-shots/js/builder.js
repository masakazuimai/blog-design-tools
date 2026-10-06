// 絵コンテ（ショットの並び）の状態。配列は毎回作り直し、変更のたびに保存して購読者へ通知する
import { getShot } from "./shots/index.js?v=20261006l";

const KEY = "sbs:board:v1";
const listeners = new Set();

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const fromShot = (id) => {
  const s = getShot(id);
  return { uid: uid(), id, dur: s.dur, desc: s.desc };
};

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.filter((it) => it && getShot(it.id)).map((it) => ({
        uid: String(it.uid || uid()),
        id: it.id,
        dur: Number.isFinite(Number(it.dur)) ? Math.min(60, Math.max(1, Number(it.dur))) : getShot(it.id).dur,
        desc: typeof it.desc === "string" ? it.desc : getShot(it.id).desc,
      }))
      : [];
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
    // 保存できない環境（プライベートモード等）でも、このタブ内では使えるようにする
  }
  listeners.forEach((fn) => fn(items));
};

export const getItems = () => items;
export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const addItem = (id) => commit([...items, fromShot(id)]);
export const removeItem = (key) => commit(items.filter((it) => it.uid !== key));
export const clearItems = () => commit([]);
export const replaceItems = (ids) => commit(ids.map(fromShot));

export const moveItem = (key, delta) => {
  const from = items.findIndex((it) => it.uid === key);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= items.length) return;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  commit(next);
};

// 別のショットに差し替える。秒数と場面の説明は、利用者が書き換えていなければ新しいショットの既定値にする
export const swapItem = (key, id) => commit(items.map((it) => {
  if (it.uid !== key) return it;
  const before = getShot(it.id);
  const after = getShot(id);
  return {
    ...it,
    id,
    dur: it.dur === before.dur ? after.dur : it.dur,
    desc: it.desc === before.desc ? after.desc : it.desc,
  };
}));

export const updateItem = (key, patch) => commit(items.map((it) => (it.uid === key ? { ...it, ...patch } : it)));
