// アプリロジック（問題データは js/data.js の PROBLEMS / LEVELS を参照）
// 読み解き型＝コードは実行せず、選んだ選択肢を answer と照合して自動採点する
const STORE_KEY = 'cqPhpBasicsQuizV1';
let state = { level: 'all', current: 1, status: {}, picks: {} };
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY));
  if (saved && saved.status) state = { ...state, ...saved };
} catch (e) { /* 破損時は初期状態で続行 */ }

const $ = id => document.getElementById(id);

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 保存不可でも続行 */ }
}
function levelRange() { return LEVELS.find(l => l.key === state.level).range; }
function levelProblems() {
  const [a, b] = levelRange();
  return PROBLEMS.filter(p => p.id >= a && p.id <= b);
}
function problem(id) { return PROBLEMS.find(p => p.id === id); }

function renderTabs() {
  $('tabs').innerHTML = LEVELS.map(l =>
    `<button data-level="${l.key}" class="${l.key === state.level ? 'active' : ''}">${l.label}</button>`
  ).join('');
  $('tabs').querySelectorAll('button').forEach(b => b.onclick = () => {
    state = { ...state, level: b.dataset.level, current: LEVELS.find(l => l.key === b.dataset.level).range[0] };
    save(); renderAll();
  });
}

function renderChips() {
  $('chips').innerHTML = levelProblems().map(p => {
    const st = state.status[p.id] || '';
    const cur = p.id === state.current ? 'current' : '';
    return `<button data-id="${p.id}" class="${st} ${cur}" title="${p.title}">${p.id}</button>`;
  }).join('');
  $('chips').querySelectorAll('button').forEach(b => b.onclick = () => {
    state = { ...state, current: Number(b.dataset.id) };
    save(); renderAll();
  });
}

function renderProgress() {
  const ps = levelProblems();
  const done = ps.filter(p => state.status[p.id] === 'done').length;
  $('barFill').style.width = (done / ps.length * 100) + '%';
  $('progressText').textContent = `${done} / ${ps.length} 正解`;
}

// 選択肢（出力は複数行があるため pre で表示。textContent で入れて文字参照をそのまま見せる）
function renderChoices(p) {
  const picked = state.picks[p.id];
  const answered = picked !== undefined;
  $('choices').innerHTML = '';
  p.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.disabled = answered;
    if (answered && i === p.answer) btn.classList.add('correct');
    if (answered && i === picked && picked !== p.answer) btn.classList.add('wrong');
    const mark = document.createElement('span');
    mark.className = 'mark';
    mark.textContent = String.fromCharCode(65 + i);
    const out = document.createElement('pre');
    out.textContent = c;
    btn.append(mark, out);
    btn.onclick = () => pick(i);
    $('choices').appendChild(btn);
  });
  $('feedback').classList.toggle('show', answered);
  if (answered) {
    const ok = picked === p.answer;
    $('verdict').className = 'verdict ' + (ok ? 'ok' : 'ng');
    $('verdict').textContent = ok ? '✓ 正解' : `✕ 不正解（正解は ${String.fromCharCode(65 + p.answer)}）`;
    $('explain').innerHTML = p.explainHtml;
  }
}

function renderProblem() {
  const p = problem(state.current);
  if (!p) return;
  $('quizArea').style.display = '';
  $('clearArea').style.display = 'none';
  $('qNum').textContent = `Q${p.id}.`;
  $('qTitle').textContent = p.title;
  $('qText').innerHTML = p.questionHtml;
  $('qCode').textContent = p.code;
  renderChoices(p);
  const [a, b] = levelRange();
  $('prevBtn').disabled = p.id <= a;
  $('nextBtn').textContent = p.id >= b ? '結果を見る →' : '次の問題 →';
}

function renderClear() {
  const ps = levelProblems();
  const done = ps.filter(p => state.status[p.id] === 'done').length;
  const review = ps.filter(p => state.status[p.id] === 'review');
  $('quizArea').style.display = 'none';
  $('clearArea').style.display = '';
  $('clearScore').textContent = `${done} / ${ps.length}`;
  $('clearMsg').textContent = review.length
    ? `復習リストが ${review.length} 問あります: ${review.map(p => 'Q' + p.id).join(', ')}`
    : done === ps.length ? '全問正解！次のレベルに進みましょう。' : '未回答の問題があります。チップから戻れます。';
  $('reviewBtn').style.display = review.length ? '' : 'none';
}

function renderAll() { renderTabs(); renderChips(); renderProgress(); renderProblem(); }

// 回答＝正解なら done、不正解なら review として記録（解説を読めるようその場に留まる）
function pick(i) {
  const p = problem(state.current);
  const st = i === p.answer ? 'done' : 'review';
  state = {
    ...state,
    picks: { ...state.picks, [p.id]: i },
    status: { ...state.status, [p.id]: st },
  };
  save(); renderChips(); renderProgress(); renderChoices(p);
}

// もう一度解く＝回答だけ消す（判定は次に選んだ結果で上書き）
$('retryBtn').onclick = () => {
  const picks = { ...state.picks };
  delete picks[state.current];
  state = { ...state, picks };
  save(); renderChoices(problem(state.current));
};

$('prevBtn').onclick = () => { state = { ...state, current: state.current - 1 }; save(); renderAll(); };
$('nextBtn').onclick = () => {
  const [, b] = levelRange();
  if (state.current >= b) { renderClear(); }
  else { state = { ...state, current: state.current + 1 }; save(); renderAll(); }
};

// 復習リストは回答を消してから解き直す
function clearPicks(ps) {
  const picks = { ...state.picks };
  ps.forEach(p => delete picks[p.id]);
  return picks;
}

$('reviewBtn').onclick = () => {
  const review = levelProblems().filter(p => state.status[p.id] === 'review');
  if (!review.length) return;
  state = { ...state, picks: clearPicks(review), current: review[0].id };
  save(); renderAll();
};

// 表示中レベルの判定と回答を全解除。現在の問題位置は維持
$('resetProgressBtn').onclick = () => {
  const ps = levelProblems();
  const status = { ...state.status };
  ps.forEach(p => delete status[p.id]);
  state = { ...state, status, picks: clearPicks(ps) };
  save(); renderAll();
};

$('restartBtn').onclick = () => {
  const ps = levelProblems();
  const status = { ...state.status };
  ps.forEach(p => delete status[p.id]);
  state = { ...state, status, picks: clearPicks(ps), current: levelRange()[0] };
  save(); renderAll();
};

renderAll();
