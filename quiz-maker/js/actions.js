// 画面から呼ぶ操作（ファイル入出力・出題の開始）
import { getState, setState, resetState } from './store.js?v=20261003b';
import { openFile, saveFile, saveFileAs, downloadText, readFile } from './file.js?v=20261003b';
import { parseDeck, serializeDeck, decodeText, templateCsv, baseName } from './format.js?v=20261003b';
import { isDue } from './srs.js?v=20261003b';
import { SAMPLE_QUESTIONS } from './sample.js?v=20261003b';
import { shuffle, today, toast, uid, track } from './util.js?v=20261003b';
import { t } from './i18n.js?v=20261003b';

// 未保存の変更を捨ててよいか確認する
function confirmDiscard() {
  const { questions, dirty } = getState();
  if (!questions || !dirty) return true;
  return window.confirm(t('confirmDiscard'));
}

export function newDeck() {
  if (!confirmDiscard()) return;
  resetState({ questions: [], view: 'edit', editId: 'new' });
  toast(t('createdDeck'));
  track('new_deck');
}

export function loadSample() {
  if (!confirmDiscard()) return;
  const questions = SAMPLE_QUESTIONS.map(q => ({ ...q, id: uid(), level: 0, next: '', ok: 0, ng: 0 }));
  resetState({ questions, view: 'home', dirty: true });
  toast(t('sampleLoaded'));
  track('load_sample');
}

function applyLoaded({ name, buffer, handle }) {
  const { questions, errors } = parseDeck(name, decodeText(buffer));
  if (!questions.length && errors.length) {
    throw new Error(t('loadFailed', { error: errors[0] }));
  }
  resetState({ questions, fileName: name, handle, view: 'home' });
  const skipped = errors.length ? t('skipped', { count: errors.length, first: errors[0] }) : '';
  toast(t('loaded', { count: questions.length, skipped }));
  track('open_file', { question_count: questions.length, file_format: name.split('.').pop().toLowerCase() });
}

export async function openDeck() {
  if (!confirmDiscard()) return;
  try {
    const loaded = await openFile();
    if (loaded) applyLoaded(loaded);
  } catch (e) {
    console.error('ファイルを開けませんでした', e);
    toast(e.message || t('openFailed'));
  }
}

export async function openDroppedFile(file) {
  if (!/\.(csv|json)$/i.test(file.name)) {
    toast(t('chooseCsvJson'));
    return;
  }
  if (!confirmDiscard()) return;
  try {
    applyLoaded(await readFile(file));
  } catch (e) {
    console.error('ファイルを開けませんでした', e);
    toast(e.message || t('openFailed'));
  }
}

function buildText(format) {
  return serializeDeck(getState().questions || [], format);
}

function afterSave(saved) {
  if (!saved) return;
  setState({ fileName: saved.name, handle: saved.handle, dirty: false });
  track('save_file', { question_count: getState().questions.length, save_method: saved.downloaded ? 'download' : 'overwrite' });
  toast(saved.downloaded
    ? t('savedDownload', { name: saved.name })
    : t('savedOverwrite', { name: saved.name }));
}

export async function saveDeckAs() {
  const { fileName } = getState();
  try {
    afterSave(await saveFileAs({ suggestedName: fileName || t('defaultFileName'), buildText }));
  } catch (e) {
    console.error('保存に失敗しました', e);
    toast(e.message || t('saveFailed'));
  }
}

export async function saveDeck() {
  const { handle, fileName } = getState();
  if (!fileName) return saveDeckAs();
  try {
    afterSave(await saveFile({ handle, name: fileName, buildText }));
  } catch (e) {
    console.error('保存に失敗しました', e);
    toast(e.message || t('saveFailed'));
  }
}

export function downloadTemplate() {
  downloadText(t('templateFileName'), templateCsv());
  track('download_template');
}

export function deckTitle() {
  return baseName(getState().fileName);
}

// 出題を始める。mode: due（今日の復習）| all（全問）| retry（間違えた問題だけ）
export function startQuiz(mode, { count = 0, ids = [] } = {}) {
  const { questions } = getState();
  const now = today();
  let pool;
  if (mode === 'due') pool = questions.filter(q => isDue(q, now));
  else if (mode === 'retry') pool = questions.filter(q => ids.includes(q.id));
  else pool = questions;
  const order = shuffle(pool.map(q => q.id));
  const picked = count > 0 ? order.slice(0, count) : order;
  if (!picked.length) {
    toast(t('noQuestionsToAsk'));
    return;
  }
  setState({
    view: 'quiz',
    quiz: { mode, ids: picked, index: 0, choices: null, answered: null, results: [] },
  });
  track('quiz_start', { quiz_mode: mode, question_count: picked.length });
}
