// アプリロジック v4（問題データは js/data.js の PROBLEMS / LEVELS を参照）
// v4: マークアップ描画型。エディタのHTMLをiframeへライブ描画し、「自分のコード」と
// 「お手本」をタブで切り替えて見比べる。スクリプトは走らせない（sandbox属性で無効化）
const STORE_KEY = 'cqHtmlBasicsQuizV1';
let state = { level: 'all', current: 1, status: {}, drafts: {} };
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY));
  if (saved && saved.status) state = { ...state, ...saved };
} catch (e) { /* 破損時は初期状態で続行 */ }

let previewMode = 'mine'; // 'mine' | 'answer'

const $ = id => document.getElementById(id);

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function levelRange() { return LEVELS.find(l => l.key === state.level).range; }
function levelProblems() {
  const [a, b] = levelRange();
  return PROBLEMS.filter(p => p.id >= a && p.id <= b);
}
function problem(id) { return PROBLEMS.find(p => p.id === id); }

// ---- プレビュー（srcdocへ流し込むだけ。sandbox="" でスクリプトは実行されない） ----
function renderPreview() {
  const p = problem(state.current);
  if (!p) return;
  $('previewFrame').srcdoc = previewMode === 'answer' ? p.answer : $('editor').value;
}

function renderPreviewTabs() {
  $('pvMine').classList.toggle('on', previewMode === 'mine');
  $('pvAnswer').classList.toggle('on', previewMode === 'answer');
  $('pvNote').textContent = previewMode === 'answer'
    ? 'お手本の表示です。自分のコードに戻して見比べてください'
    : '入力すると自動で反映されます';
}

function setPreviewMode(mode) {
  previewMode = mode;
  renderPreviewTabs();
  renderPreview();
}

// エディタの高さを中身に合わせる（min-height 380px 〜 上限 640px。以降はスクロール）
function autoGrow() {
  const ed = $('editor');
  ed.style.height = 'auto';
  ed.style.height = Math.min(ed.scrollHeight + 2, 640) + 'px';
}

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
  $('editor').value = state.drafts[p.id] !== undefined ? state.drafts[p.id] : p.starter;
  autoGrow();
  $('answerCode').textContent = p.answer;
  $('answerBox').open = false;
  setPreviewMode('mine');
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

// ---- エディタ（入力のたびに下書き保存＋プレビュー更新。連打を抑えるため遅延させる） ----
let timer = null;
$('editor').addEventListener('input', () => {
  autoGrow();
  clearTimeout(timer);
  timer = setTimeout(() => {
    state = { ...state, drafts: { ...state.drafts, [state.current]: $('editor').value } };
    save();
    if (previewMode === 'mine') renderPreview();
  }, 250);
});

// Tabキーでスペース2つ挿入
$('editor').addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 2;
  }
});

$('pvMine').onclick = () => setPreviewMode('mine');
$('pvAnswer').onclick = () => setPreviewMode('answer');

// リセット＝下書きを破棄してひな形に戻す
$('resetCodeBtn').onclick = () => {
  const p = problem(state.current);
  $('editor').value = p.starter;
  autoGrow();
  const drafts = { ...state.drafts };
  delete drafts[state.current];
  state = { ...state, drafts };
  save();
  setPreviewMode('mine');
};

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
