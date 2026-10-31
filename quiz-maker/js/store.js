import { saveBackup } from './backup.js?v=20261003b';

const initial = {
  questions: null,
  fileName: '',
  handle: null,
  dirty: false,
  view: 'start',
  editId: null,
  addedCount: 0,
  search: '',
  quiz: null,
  result: null,
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

export function updateQuestions(updater) {
  setState({ questions: updater(state.questions || []), dirty: true });
}

export function resetState(patch = {}) {
  state = { ...initial, ...patch };
  scheduleBackup();
  listeners.forEach(fn => fn(state, initial));
}
