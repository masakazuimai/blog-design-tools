// ③-A 新規追加 ／ ③-B 編集（左に問題一覧、右に入力フォーム）
import { h, uid, shortDate, track, toast } from '../util.js?v=20261003b';
import { getState, setState, updateQuestions } from '../store.js?v=20261003b';
import { MAX_LEVEL } from '../srs.js?v=20261003b';
import { t } from '../i18n.js?v=20261003b';

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
    : [h('li', { class: 'qlist__empty', text: state.questions.length ? t('noMatch') : t('noQuestions') })]));
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
  if (!values.q) return { error: t('errNoQuestion') };
  if (!values.correct) return { error: t('errNoCorrect') };
  if (values.wrong.some(w => !w)) return { error: t('errNoWrong') };
  const choices = [values.correct, ...values.wrong];
  if (new Set(choices).size !== choices.length) return { error: t('errDuplicate') };
  return { values };
}

function renderForm(state) {
  const isNew = state.editId === 'new';
  const current = isNew ? null : state.questions.find(q => q.id === state.editId);
  if (!isNew && !current) {
    return h('div', { class: 'card qform' }, h('p', { class: 'muted', text: t('pickFromList') }));
  }
  const ph = isNew
    ? { q: t('phQuestion'), correct: t('phCorrect'), wrong: t('phWrong'), explain: t('phExplain') }
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
        toast(t('addedNext'));
        requestAnimationFrame(() => document.querySelector('.qform textarea')?.focus());
      } else {
        setState({ addedCount: 0, view: 'home', editId: null });
        toast(t('added'));
      }
      return;
    }
    updateQuestions(list => list.map(q => (q.id === current.id ? { ...q, ...values } : q)));
    toast(t('changesSaved'));
  };

  const onKeydown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit(true); // 編集時は stay を見ないので保存だけ行う
    }
  };

  let armed = false;
  const deleteBtn = h('button', {
    class: 'btn btn--danger', type: 'button', text: t('deleteQuestion'),
    onclick: () => {
      if (!armed) {
        armed = true;
        deleteBtn.classList.add('is-armed');
        deleteBtn.textContent = t('deleteConfirm');
        return;
      }
      updateQuestions(list => list.filter(q => q.id !== current.id));
      setState({ editId: null });
      toast(t('deleted'));
    },
  });

  const title = isNew
    ? h('h2', {}, t('titleNew'), state.addedCount ? h('span', { class: 'muted small', text: t('addedThisTime', { n: state.addedCount }) }) : null)
    : h('h2', {}, t('titleEdit'), h('span', { class: 'muted small', text: `#${state.questions.indexOf(current) + 1}` }));

  const actions = isNew
    ? h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary', type: 'button', onclick: () => submit(true), text: t('addAndNext') }),
      h('button', { class: 'btn', type: 'button', onclick: () => submit(false), text: t('addAndClose') }),
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', editId: null, addedCount: 0 }), text: t('cancel') }))
    : h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary', type: 'button', onclick: () => submit(false), text: t('saveEdit') }),
      deleteBtn);

  const meta = isNew ? null : h('div', { class: 'form-meta' },
    h('span', { text: `Lv${current.level}${current.next ? t('metaNext', { date: shortDate(current.next) }) : t('metaNow')}` }),
    h('span', { text: t('metaCounts', { ok: current.ok, ng: current.ng }) }),
    h('button', {
      class: 'btn', type: 'button', text: t('resetLevel'),
      onclick: () => {
        updateQuestions(list => list.map(q => (q.id === current.id ? { ...q, level: 0, next: '' } : q)));
        toast(t('levelReset'));
      },
    }));

  return h('div', { class: 'card qform', onkeydown: onKeydown },
    h('button', { class: 'btn editor-back', type: 'button', onclick: () => setState({ editId: null }), text: t('backToList') }),
    title,
    field(t('fieldQuestion'), '', inputs.q),
    field(t('fieldCorrect'), 'field--ok', inputs.correct),
    ...inputs.wrong.map((input, i) => field(t('fieldWrong', { n: i + 1 }), 'field--ng', input)),
    field(t('fieldExplain'), '', inputs.explain),
    meta,
    errorEl,
    actions,
  );
}

export function renderEditor(state) {
  const listEl = h('ul', { class: 'qlist__items' });
  renderList(state, listEl);
  const search = h('input', {
    type: 'search', placeholder: t('searchPlaceholder'), value: searchText, 'aria-label': t('searchLabel'),
    oninput: (e) => { searchText = e.target.value; renderList(getState(), listEl); },
  });
  const editing = state.editId !== null;
  return h('div', {},
    h('div', { class: 'editor-top' },
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', editId: null, addedCount: 0 }), text: t('backHome') }),
    ),
    h('div', { class: `editor${editing ? ' is-editing' : ''}` },
      h('div', { class: 'qlist' },
        h('div', { class: 'qlist__head' },
          search,
          h('button', { class: 'btn btn--primary', type: 'button', onclick: () => setState({ editId: 'new', addedCount: 0 }), text: t('addQuestion') }),
        ),
        listEl,
      ),
      renderForm(state),
    ),
  );
}
