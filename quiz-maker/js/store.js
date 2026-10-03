// アプリの状態。更新は必ず新しいオブジェクトで置き換え、購読者（描画）へ通知する
import { saveBackup } from './backup.js?v=20261003b';

const initial = {
  questions: null,   // null＝未読み込み。配列＝問題集を開いている
  fileName: '',      // 例：色彩の勉強.csv（未保存の新規は空）
  handle: null,      // File System Access API のハンドル
  dirty: false,      // 未保存の変更あり
  view: 'start',     // start | home | edit | quiz | result
  editId: null,      // 編集中の問題ID。'new' は新規追加
  addedCount: 0,     // 新規追加画面で今回追加した数
  search: '',
  quiz: null,        // 出題セッション
  result: null,      // 直近の結果
};

let state = initial;
const listeners = new Set();
let backupTimer = null;

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function scheduleBackup() {
  clearTimeout(backupTimer);
  backupTimer = setTimeout(() => {
    if (!state.questions) return;
    saveBackup({
      questions: state.questions,
      fileName: state.fileName,
      handle: state.handle,
      dirty: state.dirty,
      savedAt: Date.now(),
    });
  }, 400);
}

export function setState(patch) {
  const prev = state;
  state = { ...state, ...patch };
  if (prev.questions !== state.questions || prev.dirty !== state.dirty || prev.fileName !== state.fileName) {
    scheduleBackup();
  }
  listeners.forEach(fn => fn(state, prev));
}

// 問題の配列を差し替え、未保存フラグを立てる
export function updateQuestions(updater) {
  setState({ questions: updater(state.questions || []), dirty: true });
}

export function resetState(patch = {}) {
  state = { ...initial, ...patch };
  scheduleBackup();
  listeners.forEach(fn => fn(state, initial));
}
