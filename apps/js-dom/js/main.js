// アプリロジック v2（問題データは js/data.js の PROBLEMS / LEVELS を参照）
// v2: ステージ（iframe実行環境）＋非同期対応コンソール。コードはiframe内で実行され、
// console.logはライブ追記・alert()は[alert]としてconsole欄に表示される
const STORE_KEY = 'cqJsDomQuizV1';
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

// ---- ステージ（毎回作り直してリスナー多重登録を防ぐ） ----
let stageWin = null;
function buildStage(p) {
  const holder = $('stageHolder');
  holder.innerHTML = '';
  const hasStage = !!(p.stageHtml && p.stageHtml.trim());
  $('stageCard').style.display = hasStage ? '' : 'none';
  if (hasStage) $('stageSrc').textContent = p.stageHtml;
  const f = document.createElement('iframe');
  f.className = 'stage-frame';
  f.title = 'プレビュー';
  holder.appendChild(f);
  const d = f.contentDocument;
  d.open();
  d.write('<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;font-family:"Noto Sans JP",sans-serif;font-size:16px;background:#fff;color:#222}button{font-size:16px;padding:6px 14px;cursor:pointer}input,textarea{font-size:16px;padding:6px 10px}li{margin:2px 0}</style></head><body>' + (p.stageHtml || '') + '</body></html>');
  d.close();
  stageWin = f.contentWindow;
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
  $('editor').value = state.drafts[p.id] || p.starter || '';
  $('answerCode').textContent = p.answer;
  $('answerBox').open = false;
  $('console').classList.remove('show');
  $('consoleOut').textContent = '';
  buildStage(p);
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

// ---- コンソール（非同期のログもライブ追記） ----
let hasOutput = false;
function fmt(v) {
  if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
  return String(v);
}
function logLine(text) {
  hasOutput = true;
  const out = $('consoleOut');
  if (out.dataset.hint === '1') { out.textContent = ''; out.dataset.hint = ''; }
  out.textContent += (out.textContent ? '\n' : '') + text;
}
function showHint(p) {
  if (hasOutput) return;
  const out = $('consoleOut');
  out.dataset.hint = '1';
  out.textContent = (p.stageHtml && p.stageHtml.trim())
    ? '(実行しました — 上のプレビューを操作して動作を確認できます)'
    : '(出力なし — console.log で表示できます)';
}

// コード実行（ステージを作り直してからiframe内で実行）
$('runBtn').onclick = () => {
  const code = $('editor').value;
  state = { ...state, drafts: { ...state.drafts, [state.current]: code } };
  save();
  const p = problem(state.current);
  const out = $('consoleOut');
  out.className = '';
  out.textContent = '';
  out.dataset.hint = '';
  hasOutput = false;
  $('console').classList.add('show');
  buildStage(p);
  const win = stageWin;
  win.alert = m => logLine('[alert] ' + m);
  win.addEventListener('error', e => logLine('Error: ' + e.message));
  win.addEventListener('unhandledrejection', e =>
    logLine('Error: ' + (e.reason && e.reason.message ? e.reason.message : fmt(e.reason))));
  const fake = {
    log: (...a) => logLine(a.map(fmt).join(' ')),
    error: (...a) => logLine('Error: ' + a.map(fmt).join(' ')),
    warn: (...a) => logLine('Warn: ' + a.map(fmt).join(' ')),
  };
  try {
    const ret = new win.Function('console', '"use strict";\nreturn (async () => {\n' + code + '\n})();')(fake);
    ret.then(() => showHint(p))
       .catch(err => logLine(err && err.name ? err.name + ': ' + err.message : String(err)));
  } catch (err) {
    out.className = 'err';
    out.textContent = err.name + ': ' + err.message;
  }
};

// リセット＝下書きを破棄してstarterに戻し、ステージも作り直す
$('clearBtn').onclick = () => {
  const p = problem(state.current);
  $('editor').value = p.starter || '';
  const drafts = { ...state.drafts };
  delete drafts[state.current];
  state = { ...state, drafts };
  save();
  buildStage(p);
  $('console').classList.remove('show');
  $('consoleOut').textContent = '';
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
