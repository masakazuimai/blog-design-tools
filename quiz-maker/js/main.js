// 自分だけの問題集：起動・画面の切り替え・ファイルバー
import { h, toast } from './util.js?v=20261003b';
import { getState, subscribe, resetState } from './store.js?v=20261003b';
import { loadBackup } from './backup.js?v=20261003b';
import { canOverwrite } from './file.js?v=20261003b';
import { newDeck, openDeck, saveDeck, saveDeckAs, openDroppedFile } from './actions.js?v=20261003b';
import { renderStart, renderHome } from './views/home.js?v=20261003b';
import { renderEditor } from './views/editor.js?v=20261003b';
import { renderQuiz, renderResult, ensureChoices, handleQuizKey } from './views/quiz.js?v=20261003b';
import { t } from './i18n.js?v=20261003b';

const fileBarEl = document.getElementById('filebar');
const appEl = document.getElementById('app');

function renderFileBar(state) {
  const opened = Boolean(state.questions);
  let status;
  if (!opened) status = h('span', { class: 'saved', text: t('noFile') });
  else if (state.dirty) status = h('span', { class: 'dirty', text: t('dirty') });
  else if (!state.fileName) status = h('span', { class: 'saved', text: t('notSavedYet') });
  else status = h('span', { class: 'saved', text: t('saved') });

  const name = opened ? `📄 ${state.fileName || t('unsavedDeck')}` : '';
  const saveLabel = state.fileName ? t('overwrite') : t('save');
  const hint = canOverwrite ? t('hintOverwrite') : t('hintDownload');

  fileBarEl.replaceChildren(
    h('div', { class: 'filebar__name' }, name, status),
    h('div', { class: 'btns' },
      h('button', { class: 'btn', type: 'button', onclick: newDeck, text: t('newDeck') }),
      h('button', { class: 'btn', type: 'button', onclick: openDeck, text: t('openFile') }),
      opened ? h('button', { class: 'btn btn--white', type: 'button', onclick: saveDeck, text: saveLabel }) : null,
      opened ? h('button', { class: 'btn', type: 'button', onclick: saveDeckAs, text: t('saveAs') }) : null,
    ),
    h('p', { class: 'filebar__hint', text: hint }),
  );
}

const VIEWS = {
  start: renderStart,
  home: renderHome,
  edit: renderEditor,
  quiz: renderQuiz,
  result: renderResult,
};

function render(state, prev) {
  renderFileBar(state);
  const view = state.questions ? state.view : 'start';
  appEl.replaceChildren(VIEWS[view](state));
  if (view === 'quiz') ensureChoices();
  // 画面が切り替わったら上端へ（出題中の問題送りではスクロール位置を保つ）
  if (prev && prev.view !== state.view) appEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function setupDragDrop() {
  window.addEventListener('dragover', (e) => {
    if (e.dataTransfer?.types?.includes('Files')) e.preventDefault();
  });
  window.addEventListener('drop', (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    e.preventDefault();
    openDroppedFile(file);
  });
}

async function restore() {
  const backup = await loadBackup();
  if (!backup?.questions) return;
  resetState({
    questions: backup.questions,
    fileName: backup.fileName || '',
    handle: backup.handle || null,
    dirty: Boolean(backup.dirty),
    view: 'home',
  });
  if (backup.dirty) toast(t('restored'));
}

subscribe(render);
render(getState());
setupDragDrop();
document.addEventListener('keydown', handleQuizKey);
window.addEventListener('beforeunload', (e) => {
  if (!getState().dirty) return;
  e.preventDefault();
  e.returnValue = '';
});
restore();

