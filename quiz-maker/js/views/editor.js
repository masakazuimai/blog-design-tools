// ③-A 新規追加 ／ ③-B 編集（左に問題一覧、右に入力フォーム）
import { h, uid, shortDate, track, toast } from '../util.js?v=20261003a';
import { getState, setState, updateQuestions } from '../store.js?v=20261003a';
import { MAX_LEVEL } from '../srs.js?v=20261003a';

let searchText = '';

function levelBadge(q) {
  const max = q.level >= MAX_LEVEL;
  return h('span', { class: `lv${max ? ' lv--max' : ''}`, text: max ? `Lv${q.level}✅` : `Lv${q.level}` });
}

function renderList(state, listEl) {
  const keyword = searchText.trim().toLowerCase();
  const items = state.questions
    .map((q, i) => ({ q, no: i + 1 }))
    .filter(({ q }) => !keyword || [q.q, q.correct, ...q.wrong, q.explain].some(t => t.toLowerCase().includes(keyword)));
  listEl.replaceChildren(...(items.length
    ? items.map(({ q, no }) => h('li', {},
      h('button', {
        type: 'button', class: q.id === state.editId ? 'is-current' : '',
        onclick: () => setState({ editId: q.id }),
      },
        h('span', { class: 't', text: `${no}. ${q.q}` }),
        levelBadge(q),
      )))
    : [h('li', { class: 'qlist__empty', text: state.questions.length ? '該当する問題がありません' : 'まだ問題がありません' })]));
}

function field(label, mod, control) {
  return h('div', { class: `field ${mod}` }, h('label', {}, h('span', { text: label }), control));
}

// フォームの値を検証して { values } か { error } を返す
function readForm(inputs) {
  const values = {
    q: inputs.q.value.trim(),
    correct: inputs.correct.value.trim(),
    wrong: inputs.wrong.map(w => w.value.trim()),
    explain: inputs.explain.value.trim(),
  };
  if (!values.q) return { error: '問題を入力してください' };
  if (!values.correct) return { error: '正解を入力してください' };
  if (values.wrong.some(w => !w)) return { error: '誤答を3つとも入力してください' };
  const choices = [values.correct, ...values.wrong];
  if (new Set(choices).size !== choices.length) return { error: '選択肢に同じ内容が重複しています' };
  return { values };
}

function renderForm(state) {
  const isNew = state.editId === 'new';
  const current = isNew ? null : state.questions.find(q => q.id === state.editId);
  if (!isNew && !current) {
    return h('div', { class: 'card qform' }, h('p', { class: 'muted', text: '左の一覧から問題を選ぶか、「＋ 問題を追加」を押してください。' }));
  }
  const ph = isNew
    ? { q: '例：光の三原色に含まれない色は？', correct: '例：黄', wrong: ['例：赤', '例：緑', '例：青'], explain: '例：光の三原色は赤・緑・青（RGB）' }
    : { q: '', correct: '', wrong: ['', '', ''], explain: '' };
  const inputs = {
    q: h('textarea', { rows: '3', placeholder: ph.q, value: current?.q || '' }),
    correct: h('input', { type: 'text', placeholder: ph.correct, value: current?.correct || '' }),
    wrong: [0, 1, 2].map(i => h('input', { type: 'text', placeholder: ph.wrong[i], value: current?.wrong[i] || '' })),
    explain: h('textarea', { rows: '3', placeholder: ph.explain, value: current?.explain || '' }),
  };
  const errorEl = h('p', { class: 'form-error', role: 'alert', hidden: true });

  const submit = (stay) => {
    const { values, error } = readForm(inputs);
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      return;
    }
    if (isNew) {
      const created = { id: uid(), ...values, level: 0, next: '', ok: 0, ng: 0 };
      updateQuestions(list => [...list, created]);
      track('question_add', { question_count: getState().questions.length });
      if (stay) {
        setState({ addedCount: state.addedCount + 1, editId: 'new' });
        toast('追加しました。続けて次の問題をどうぞ');
        requestAnimationFrame(() => document.querySelector('.qform textarea')?.focus());
      } else {
        setState({ addedCount: 0, view: 'home', editId: null });
        toast('問題を追加しました');
      }
      return;
    }
    updateQuestions(list => list.map(q => (q.id === current.id ? { ...q, ...values } : q)));
    toast('変更を保存しました');
  };

  const onKeydown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit(true); // 編集時は stay を見ないので保存だけ行う
    }
  };

  let armed = false;
  const deleteBtn = h('button', {
    class: 'btn btn--danger', type: 'button', text: 'この問題を削除',
    onclick: () => {
      if (!armed) {
        armed = true;
        deleteBtn.classList.add('is-armed');
        deleteBtn.textContent = 'もう一度押すと削除します';
        return;
      }
      updateQuestions(list => list.filter(q => q.id !== current.id));
      setState({ editId: null });
      toast('問題を削除しました');
    },
  });

  const title = isNew
    ? h('h2', {}, '＋ 新しい問題を追加 ', state.addedCount ? h('span', { class: 'muted small', text: `（今回 ${state.addedCount}問追加）` }) : null)
    : h('h2', {}, '✏ 問題を編集 ', h('span', { class: 'muted small', text: `#${state.questions.indexOf(current) + 1}` }));

  const actions = isNew
    ? h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary', type: 'button', onclick: () => submit(true), text: '追加して次の問題へ（Ctrl+Enter）' }),
      h('button', { class: 'btn', type: 'button', onclick: () => submit(false), text: '追加して閉じる' }),
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', editId: null, addedCount: 0 }), text: 'キャンセル' }))
    : h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary', type: 'button', onclick: () => submit(false), text: '保存（Ctrl+Enter）' }),
      deleteBtn);

  const meta = isNew ? null : h('div', { class: 'form-meta' },
    h('span', { text: `Lv${current.level}${current.next ? ` ／ 次回 ${shortDate(current.next)}` : ' ／ すぐ出題'}` }),
    h('span', { text: `正解 ${current.ok}回・不正解 ${current.ng}回` }),
    h('button', {
      class: 'btn', type: 'button', text: '習熟度をリセット',
      onclick: () => {
        updateQuestions(list => list.map(q => (q.id === current.id ? { ...q, level: 0, next: '' } : q)));
        toast('習熟度をLv0に戻しました（すぐ出題されます）');
      },
    }));

  return h('div', { class: 'card qform', onkeydown: onKeydown },
    h('button', { class: 'btn editor-back', type: 'button', onclick: () => setState({ editId: null }), text: '← 一覧へ' }),
    title,
    field('問題', '', inputs.q),
    field('✅ 正解', 'field--ok', inputs.correct),
    ...inputs.wrong.map((input, i) => field(`❌ 誤答${i + 1}`, 'field--ng', input)),
    field('解説（任意）', '', inputs.explain),
    meta,
    errorEl,
    actions,
  );
}

export function renderEditor(state) {
  const listEl = h('ul', { class: 'qlist__items' });
  renderList(state, listEl);
  const search = h('input', {
    type: 'search', placeholder: '🔍 問題を検索', value: searchText, 'aria-label': '問題を検索',
    oninput: (e) => { searchText = e.target.value; renderList(getState(), listEl); },
  });
  const editing = state.editId !== null;
  return h('div', {},
    h('div', { class: 'editor-top' },
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', editId: null, addedCount: 0 }), text: '← ホームへ戻る' }),
    ),
    h('div', { class: `editor${editing ? ' is-editing' : ''}` },
      h('div', { class: 'qlist' },
        h('div', { class: 'qlist__head' },
          search,
          h('button', { class: 'btn btn--primary', type: 'button', onclick: () => setState({ editId: 'new', addedCount: 0 }), text: '＋ 問題を追加' }),
        ),
        listEl,
      ),
      renderForm(state),
    ),
  );
}
