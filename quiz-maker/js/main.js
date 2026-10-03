// 自分だけの問題集：起動・画面の切り替え・ファイルバー
import { h, toast } from './util.js?v=20261003a';
import { getState, subscribe, resetState } from './store.js?v=20261003a';
import { loadBackup } from './backup.js?v=20261003a';
import { canOverwrite } from './file.js?v=20261003a';
import { newDeck, openDeck, saveDeck, saveDeckAs, openDroppedFile } from './actions.js?v=20261003a';
import { renderStart, renderHome } from './views/home.js?v=20261003a';
import { renderEditor } from './views/editor.js?v=20261003a';
import { renderQuiz, renderResult, ensureChoices, handleQuizKey } from './views/quiz.js?v=20261003a';

const fileBarEl = document.getElementById('filebar');
const appEl = document.getElementById('app');

function renderFileBar(state) {
  const opened = Boolean(state.questions);
  let status;
  if (!opened) status = h('span', { class: 'saved', text: 'ファイル未選択' });
  else if (state.dirty) status = h('span', { class: 'dirty', text: '● 未保存の変更あり' });
  else if (!state.fileName) status = h('span', { class: 'saved', text: 'まだファイルに保存していません' });
  else status = h('span', { class: 'saved', text: '保存済み' });

  const name = opened ? `📄 ${state.fileName || '（まだ保存していない問題集）'}` : '';
  const saveLabel = state.fileName ? '上書き保存' : '保存';
  const hint = canOverwrite
    ? '💡 PCの故障に備えて Googleドライブのフォルダ に保存しておくのがおすすめです。新しいPCでも同じファイルを開けば、問題も学習記録もそのまま続きから使えます。'
    : '💡 このブラウザでは保存するとファイルがダウンロードされます。Googleドライブのフォルダへ移しておけば、新しいPCでも続きから使えます（Chrome / Edge なら元のファイルへ直接上書き保存できます）。';

  fileBarEl.replaceChildren(
    h('div', { class: 'filebar__name' }, name, status),
    h('div', { class: 'btns' },
      h('button', { class: 'btn', type: 'button', onclick: newDeck, text: '新規作成' }),
      h('button', { class: 'btn', type: 'button', onclick: openDeck, text: 'ファイルを開く' }),
      opened ? h('button', { class: 'btn btn--white', type: 'button', onclick: saveDeck, text: saveLabel }) : null,
      opened ? h('button', { class: 'btn', type: 'button', onclick: saveDeckAs, text: '別名で保存' }) : null,
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
  if (backup.dirty) toast('前回の作業を復元しました（未保存の変更があります）');
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

