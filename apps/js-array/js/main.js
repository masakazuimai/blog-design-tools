// アプリロジック（問題データは js/data.js の PROBLEMS / LEVELS を参照）
const STORE_KEY = 'cqJsArrayQuizV1';
let state = { level: 'all', current: 1, status: {}, drafts: {} };
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY));
  if (saved && saved.status) state = { ...state, ...saved };
} catch (e) { /* 破損時は初期状態で続行 */ }

const $ = id => document.getElementById(id);

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
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
  $('progressText').textContent = `${done} / ${ps.length} クリア`;
}

function renderProblem() {
  const p = problem(state.current);
  if (!p) return;
  $('quizArea').style.display = '';
  $('clearArea').style.display = 'none';
  $('qNum').textContent = `Q${p.id}.`;
  $('qTitle').textContent = p.title;
  $('qText').innerHTML = p.questionHtml;
  // 下書きがなければ問題のデータ（starter）をプリセット
  $('editor').value = state.drafts[p.id] || p.starter || '';
  $('answerCode').textContent = p.answer;
  $('answerBox').open = false;
  $('console').classList.remove('show');
  $('consoleOut').textContent = '';
  const st = state.status[p.id];
  $('okBtn').classList.toggle('on', st === 'done');
  $('ngBtn').classList.toggle('on', st === 'review');
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
    : done === ps.length ? '全問クリア！次のレベルに進みましょう。' : '未回答の問題があります。チップから戻れます。';
  $('reviewBtn').style.display = review.length ? '' : 'none';
}

function renderAll() { renderTabs(); renderChips(); renderProgress(); renderProblem(); }

// コード実行（console.logを捕捉して表示）
$('runBtn').onclick = () => {
  const code = $('editor').value;
  state = { ...state, drafts: { ...state.drafts, [state.current]: code } };
  save();
  const lines = [];
  const fake = {
    log: (...a) => lines.push(a.map(fmt).join(' ')),
    error: (...a) => lines.push('Error: ' + a.map(fmt).join(' ')),
    warn: (...a) => lines.push('Warn: ' + a.map(fmt).join(' ')),
  };
  function fmt(v) {
    if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }
  const out = $('consoleOut');
  out.className = '';
  try {
    new Function('console', code)(fake);
    out.textContent = lines.length ? lines.join('\n') : '(出力なし — console.log で表示できます)';
  } catch (err) {
    out.className = 'err';
    out.textContent = err.name + ': ' + err.message;
  }
  $('console').classList.add('show');
};

// リセット＝下書きを破棄して問題のデータ（starter）に戻す
$('clearBtn').onclick = () => {
  const p = problem(state.current);
  $('editor').value = p.starter || '';
  const drafts = { ...state.drafts };
  delete drafts[state.current];
  state = { ...state, drafts };
  save();
};

// Tabキーでスペース2つ挿入
$('editor').addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 2;
  }
});

function setStatus(st) {
  // 同じ判定をもう一度押したら解除（その場に留まる）
  if (state.status[state.current] === st) {
    const status = { ...state.status };
    delete status[state.current];
    state = { ...state, status };
    save(); renderChips(); renderProgress(); renderProblem();
    return;
  }
  state = { ...state, status: { ...state.status, [state.current]: st } };
  save();
  const [, b] = levelRange();
  if (state.current < b) {
    state = { ...state, current: state.current + 1 };
    save(); renderAll();
  } else {
    renderChips(); renderProgress(); renderClear();
  }
}
$('okBtn').onclick = () => setStatus('done');
$('ngBtn').onclick = () => setStatus('review');

$('prevBtn').onclick = () => { state = { ...state, current: state.current - 1 }; save(); renderAll(); };
$('nextBtn').onclick = () => {
  const [, b] = levelRange();
  if (state.current >= b) { renderClear(); }
  else { state = { ...state, current: state.current + 1 }; save(); renderAll(); }
};

$('reviewBtn').onclick = () => {
  const first = levelProblems().find(p => state.status[p.id] === 'review');
  if (first) { state = { ...state, current: first.id }; save(); renderAll(); }
};

// 表示中レベルの判定（できた/復習）を全解除。現在の問題位置は維持
$('resetProgressBtn').onclick = () => {
  const status = { ...state.status };
  levelProblems().forEach(p => delete status[p.id]);
  state = { ...state, status };
  save(); renderAll();
};

$('restartBtn').onclick = () => {
  const ps = levelProblems();
  const status = { ...state.status };
  ps.forEach(p => delete status[p.id]);
  state = { ...state, status, current: levelRange()[0] };
  save(); renderAll();
};

renderAll();
