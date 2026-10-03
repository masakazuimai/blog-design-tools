// ④ 出題 ／ ⑤ 結果
import { h, shuffle, today, track } from '../util.js?v=20261003a';
import { getState, setState } from '../store.js?v=20261003a';
import { applyAnswer, describeDays, MAX_LEVEL } from '../srs.js?v=20261003a';
import { startQuiz } from '../actions.js?v=20261003a';

const MODE_LABEL = { due: '今日の復習', all: '全問から出題', retry: '間違えた問題をもう一度' };

function currentQuestion(state) {
  const { quiz, questions } = state;
  return questions.find(q => q.id === quiz.ids[quiz.index]);
}

// 選択肢は問題を表示するたびにシャッフルして quiz.choices に固定する
export function ensureChoices() {
  const state = getState();
  const { quiz } = state;
  if (state.view !== 'quiz' || !quiz || quiz.choices) return;
  const q = currentQuestion(state);
  if (!q) return;
  const choices = shuffle([{ text: q.correct, correct: true }, ...q.wrong.map(text => ({ text, correct: false }))]);
  setState({ quiz: { ...quiz, choices } });
}

export function answer(choiceIndex) {
  const state = getState();
  const { quiz } = state;
  if (!quiz?.choices || quiz.answered) return;
  const q = currentQuestion(state);
  const isCorrect = quiz.choices[choiceIndex].correct;
  const { question: updated, info } = applyAnswer(q, isCorrect, today());
  setState({
    questions: state.questions.map(item => (item.id === q.id ? updated : item)),
    dirty: true,
    quiz: {
      ...quiz,
      answered: { picked: choiceIndex, isCorrect, info },
      results: [...quiz.results, { id: q.id, isCorrect, mastered: info.advanced && info.to === MAX_LEVEL }],
    },
  });
}

export function next() {
  const { quiz } = getState();
  if (!quiz?.answered) return;
  if (quiz.index + 1 < quiz.ids.length) {
    setState({ quiz: { ...quiz, index: quiz.index + 1, choices: null, answered: null } });
    return;
  }
  const correctCount = quiz.results.filter(r => r.isCorrect).length;
  track('quiz_complete', { quiz_mode: quiz.mode, question_count: quiz.results.length, correct_count: correctCount });
  setState({ view: 'result', result: { mode: quiz.mode, results: quiz.results }, quiz: null });
}

// 出題中のキーボード操作：1〜4で回答、Enterで次へ
export function handleQuizKey(e) {
  const state = getState();
  if (state.view !== 'quiz' || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (!state.quiz.answered && /^[1-4]$/.test(e.key)) {
    e.preventDefault();
    answer(Number(e.key) - 1);
  } else if (state.quiz.answered && e.key === 'Enter') {
    e.preventDefault();
    next();
  }
}

function feedback(q, answered) {
  const { isCorrect, info } = answered;
  let lvText;
  if (!isCorrect) lvText = `${info.from ? `Lv${info.from} → Lv0` : 'Lv0のまま'}（明日もう一度出題）`;
  else if (info.advanced) lvText = `Lv${info.from} → Lv${info.to}（次回は${describeDays(info.days)}）${info.to === MAX_LEVEL ? ' ✅ 覚えた！' : ''}`;
  else lvText = `Lv${info.from}のまま（出題日前の問題なので習熟度は上げません）`;
  return h('div', { class: 'feedback' },
    h('div', { class: `feedback__head ${isCorrect ? 'ok' : 'ng'}`, text: isCorrect ? '⭕ 正解！' : `❌ 不正解 — 正解は「${q.correct}」` }),
    h('div', { class: 'feedback__lv', text: lvText }),
    q.explain ? h('div', { class: 'feedback__explain', text: q.explain }) : null,
    h('div', { class: 'btns' },
      h('button', { class: 'btn btn--primary', type: 'button', onclick: next, text: '次の問題へ →（Enter）' })),
  );
}

export function renderQuiz(state) {
  const { quiz } = state;
  const q = currentQuestion(state);
  if (!q || !quiz.choices) return h('div', {});
  const total = quiz.ids.length;
  const done = quiz.index + (quiz.answered ? 1 : 0);
  const choiceButtons = quiz.choices.map((c, i) => {
    let cls = 'choice';
    if (quiz.answered && c.correct) cls += ' is-correct';
    else if (quiz.answered && quiz.answered.picked === i) cls += ' is-wrong';
    return h('button', { class: cls, type: 'button', disabled: Boolean(quiz.answered), onclick: () => answer(i) },
      h('span', { class: 'choice__key', text: String(i + 1) }),
      h('span', { text: c.text }));
  });
  return h('div', {},
    h('div', { class: 'quiz-top' },
      h('span', { class: 'quiz-top__label', text: MODE_LABEL[quiz.mode] }),
      h('div', { class: 'bar' }, h('i', { style: `width:${(done / total) * 100}%` })),
      h('span', { class: 'quiz-top__count', text: `${quiz.index + 1} / ${total}` }),
    ),
    h('div', { class: 'card' },
      h('p', { class: 'qtext', text: q.q }),
      h('div', { class: 'choices' }, choiceButtons),
      quiz.answered ? feedback(q, quiz.answered) : null,
    ),
    h('p', { class: 'key-hint', text: 'キーボードの 1〜4 でも回答できます。選択肢の並びは毎回シャッフルされます。' }),
    h('div', { class: 'quiz-quit' },
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', quiz: null }), text: '中断してホームへ（ここまでの記録は残ります）' })),
  );
}

export function renderResult(state) {
  const { results } = state.result;
  const correct = results.filter(r => r.isCorrect).length;
  const wrongIds = [...new Set(results.filter(r => !r.isCorrect).map(r => r.id))];
  const mastered = results.filter(r => r.mastered).length;
  const byId = new Map(state.questions.map(q => [q.id, q]));
  const wrongList = wrongIds.map(id => byId.get(id)).filter(Boolean);
  return h('div', { class: 'card result' },
    h('div', { class: 'result__score', text: `${correct} / ${results.length} 問正解` }),
    h('p', { class: 'result__sub', text: `正答率 ${Math.round((correct / results.length) * 100)}%` }),
    mastered ? h('p', { class: 'result__mastered', text: `🎉 新しく「覚えた」に到達：${mastered}問` }) : null,
    wrongList.length
      ? h('div', { class: 'result__wrong' },
        h('h3', { text: '間違えた問題（明日もう一度出題されます）' }),
        h('ul', {}, wrongList.map(q => h('li', { text: q.q }))))
      : h('p', { class: 'result__sub', text: '全問正解です！' }),
    h('div', { class: 'btns' },
      wrongList.length
        ? h('button', { class: 'btn btn--primary', type: 'button', onclick: () => startQuiz('retry', { ids: wrongList.map(q => q.id) }), text: `間違えた${wrongList.length}問だけもう一度` })
        : null,
      h('button', { class: 'btn', type: 'button', onclick: () => setState({ view: 'home', result: null }), text: 'ホームへ' }),
    ),
    state.dirty ? h('p', { class: 'result__warn', text: '⚠ 学習記録を残すには「上書き保存」を押してください' }) : null,
  );
}
