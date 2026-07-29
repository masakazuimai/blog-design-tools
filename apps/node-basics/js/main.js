// アプリロジック v2拡張「仮想Node環境」（問題データは js/data.js の PROBLEMS / LEVELS を参照）
// コードはiframe内で実行され、fs / path / process / require / Buffer / setImmediate をモックで提供する。
// fsは問題ごとの仮想ファイルシステム（実行のたびに初期状態へリセット）に対して読み書きし、
// 変更はファイルパネルにライブ反映される。console.logはライブ追記・エラーはconsole欄に表示。
const STORE_KEY = 'cqNodeBasicsQuizV1';
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

// ============================================================
// 仮想Node環境
// ============================================================
const VCWD = '/app';
const te = new TextEncoder();
const td = new TextDecoder();

function normPath(p) {
  const abs = String(p).startsWith('/') ? String(p) : VCWD + '/' + String(p);
  const parts = [];
  for (const seg of abs.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop(); else parts.push(seg);
  }
  return '/' + parts.join('/');
}

// ---- Buffer（最小限のモック） ----
function makeBuffer(v) {
  const bytes = typeof v === 'string' ? te.encode(v) : (v && v.__isBuffer ? v.bytes : new Uint8Array(v));
  return {
    __isBuffer: true,
    bytes,
    length: bytes.length,
    toString: () => td.decode(bytes),
    slice: (a, b) => makeBuffer(bytes.slice(a, b)),
  };
}
const BufferMock = {
  from: v => makeBuffer(v),
  byteLength: s => (s && s.__isBuffer) ? s.length : te.encode(String(s)).length,
  isBuffer: v => !!(v && v.__isBuffer),
  concat: arr => {
    const total = arr.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const b of arr) { out.set(b.bytes, o); o += b.length; }
    return makeBuffer(out);
  },
};

// ---- path（POSIX形式のモック） ----
function makePathModule() {
  const join = (...parts) => {
    const joined = parts.filter(s => s !== '' && s != null).join('/');
    const isAbs = joined.startsWith('/');
    const out = [];
    for (const seg of joined.split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') {
        if (out.length && out[out.length - 1] !== '..') out.pop(); else out.push('..');
      } else out.push(seg);
    }
    return (isAbs ? '/' : '') + out.join('/') || '.';
  };
  const basename = (p, ext) => {
    let b = String(p).split('/').filter(Boolean).pop() || '';
    if (ext && b !== ext && b.endsWith(ext)) b = b.slice(0, -ext.length);
    return b;
  };
  const dirname = p => {
    const s = String(p).replace(/\/+$/, '');
    const i = s.lastIndexOf('/');
    if (i < 0) return '.';
    if (i === 0) return '/';
    return s.slice(0, i);
  };
  const extname = p => {
    const b = String(p).split('/').pop();
    const i = b.lastIndexOf('.');
    return i > 0 ? b.slice(i) : '';
  };
  const resolve = (...parts) => {
    let out = VCWD;
    for (const p of parts) out = String(p).startsWith('/') ? String(p) : out + '/' + p;
    return normPath(out);
  };
  return { join, basename, dirname, extname, resolve, sep: '/', isAbsolute: p => String(p).startsWith('/') };
}

// ---- fs（仮想FSに対するモック。onChangeでパネルへライブ反映） ----
function makeFsModule(files, onChange) {
  const delay = fn => new Promise((res, rej) => setTimeout(() => {
    try { res(fn()); } catch (e) { rej(e); }
  }, 0));
  const enoent = (op, p) => {
    const e = new Error("ENOENT: no such file or directory, " + op + " '" + p + "'");
    e.code = 'ENOENT';
    return e;
  };
  const readRaw = p => {
    const k = normPath(p);
    if (!(k in files)) throw enoent('open', p);
    return files[k];
  };
  const toWritable = data => {
    if (typeof data === 'string') return data;
    if (data && data.__isBuffer) return data.toString();
    const e = new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.' +
      (data && typeof data.then === 'function' ? ' Received an instance of Promise' : ' Received ' + typeof data));
    e.code = 'ERR_INVALID_ARG_TYPE';
    throw e;
  };
  const listDir = p => {
    const dir = normPath(p);
    const prefix = dir === '/' ? '/' : dir + '/';
    const names = new Set();
    let found = false;
    for (const k of Object.keys(files)) {
      if (k.startsWith(prefix)) { found = true; names.add(k.slice(prefix.length).split('/')[0]); }
    }
    if (!found) throw enoent('scandir', p);
    return [...names].sort();
  };
  const promises = {
    readFile: (p, enc) => delay(() => { const v = readRaw(p); return enc ? v : makeBuffer(v); }),
    writeFile: (p, data) => delay(() => { const s = toWritable(data); files[normPath(p)] = s; onChange(normPath(p)); }),
    appendFile: (p, data) => delay(() => {
      const s = toWritable(data);
      const k = normPath(p);
      files[k] = (files[k] || '') + s;
      onChange(k);
    }),
    readdir: p => delay(() => listDir(p)),
    rm: p => delay(() => { const k = normPath(p); if (!(k in files)) throw enoent('unlink', p); delete files[k]; onChange(k); }),
    rename: (a, b) => delay(() => {
      const ka = normPath(a);
      if (!(ka in files)) throw enoent('rename', a);
      files[normPath(b)] = files[ka];
      delete files[ka];
      onChange(normPath(b));
    }),
    stat: p => delay(() => {
      const k = normPath(p);
      if (k in files) return { isFile: () => true, isDirectory: () => false, size: te.encode(files[k]).length };
      try { listDir(p); return { isFile: () => false, isDirectory: () => true, size: 0 }; }
      catch (e) { throw enoent('stat', p); }
    }),
  };
  function createReadStream(p, opts) {
    const hwm = (opts && opts.highWaterMark) || 65536;
    const listeners = {};
    const stream = { on: (ev, cb) => { (listeners[ev] = listeners[ev] || []).push(cb); return stream; } };
    setTimeout(() => {
      let bytes;
      try { bytes = te.encode(readRaw(p)); }
      catch (e) { (listeners.error || []).forEach(cb => cb(e)); return; }
      let i = 0;
      (function next() {
        if (i >= bytes.length) { (listeners.end || []).forEach(cb => cb()); return; }
        const chunk = makeBuffer(bytes.slice(i, i + hwm));
        i += hwm;
        (listeners.data || []).forEach(cb => cb(chunk));
        setTimeout(next, 0);
      })();
    }, 0);
    return stream;
  }
  const fsFull = {
    promises,
    createReadStream,
    readFileSync: (p, enc) => { const v = readRaw(p); return enc ? v : makeBuffer(v); },
    writeFileSync: (p, d) => { files[normPath(p)] = toWritable(d); onChange(normPath(p)); },
    existsSync: p => (normPath(p) in files),
  };
  return { promises, fsFull };
}

// ---- process（nextTickはCJS/ESMで順序が変わる。CJSは実行前にdrainを先行予約） ----
function makeProcessModule(p, win) {
  const tickQueue = [];
  let drainScheduled = false;
  const drain = () => {
    drainScheduled = false;
    while (tickQueue.length) tickQueue.shift()();
  };
  const preSchedule = () => {
    // CJS: 同期コード完了直後（ユーザーのPromiseコールバックより先）にnextTickキューを処理する
    if (p.moduleFormat !== 'esm') {
      drainScheduled = true;
      win.queueMicrotask(drain);
    }
  };
  const proc = {
    argv: ['/usr/local/bin/node', VCWD + '/' + (p.filename || 'index.js'), ...(p.argv || [])],
    env: { ...(p.env || {}) },
    cwd: () => VCWD,
    platform: 'linux',
    versions: { node: '24.18.0' },
    nextTick: cb => {
      tickQueue.push(cb);
      if (!drainScheduled) { drainScheduled = true; win.queueMicrotask(drain); }
    },
    exit: code => {
      const e = new Error('__cq_exit__');
      e.__cqExit = code == null ? 0 : code;
      throw e;
    },
  };
  return { proc, preSchedule };
}

// ---- タイマー（Node準拠: 同時にキューされたsetImmediateはsetTimeoutより先に実行する） ----
function makeTimers(win) {
  const immQ = [];
  const mc = new win.MessageChannel();
  mc.port1.onmessage = () => { const cb = immQ.shift(); if (cb) cb(); };
  const setImmediateMock = cb => { immQ.push(cb); mc.port2.postMessage(0); };
  const setTimeoutMock = (cb, ms, ...args) => win.setTimeout(() => {
    // タイマー発火時、先にキュー済みのimmediateをすべて処理してから本体を実行
    while (immQ.length) immQ.shift()();
    cb(...args);
  }, ms);
  return { setImmediateMock, setTimeoutMock };
}

// ---- require（node:コアのモック＋仮想FS内のローカルモジュール/JSON） ----
function makeRequire(ctx) {
  const cache = {};
  const req = spec => {
    const bare = String(spec).replace(/^node:/, '');
    if (bare === 'fs/promises') return ctx.fsPromises;
    if (bare === 'fs') return ctx.fsFull;
    if (bare === 'path') return ctx.path;
    if (bare === 'process') return ctx.proc;
    if (spec.startsWith('./') || spec.startsWith('../') || spec.startsWith('/')) {
      let k = normPath(spec);
      if (!(k in ctx.files) && (k + '.js') in ctx.files) k = k + '.js';
      if (!(k in ctx.files)) {
        const e = new Error("Cannot find module '" + spec + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      }
      if (cache[k]) return cache[k].exports;
      if (k.endsWith('.json')) {
        const m = { exports: JSON.parse(ctx.files[k]) };
        cache[k] = m;
        return m.exports;
      }
      const module = { exports: {} };
      cache[k] = module;
      new ctx.win.Function('module', 'exports', 'require', 'process', 'Buffer', 'console', 'setImmediate',
        '"use strict";\n' + ctx.files[k])(module, module.exports, req, ctx.proc, BufferMock, ctx.console, ctx.setImmediate);
      return module.exports;
    }
    const e = new Error("Cannot find module '" + spec + "'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
  };
  return req;
}

// ---- ESM importの簡易トランスフォーム（トップレベルの静的import3形式のみ対応） ----
function transformImports(code) {
  return code
    .replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+(['"][^'"]+['"]);?\s*$/gm, 'const $1 = require($2);')
    .replace(/^\s*import\s+\{([^}]+)\}\s+from\s+(['"][^'"]+['"]);?\s*$/gm,
      (m, names, mod) => 'const {' + names.replace(/\s+as\s+/g, ': ') + '} = require(' + mod + ');')
    .replace(/^\s*import\s+(\w+)\s+from\s+(['"][^'"]+['"]);?\s*$/gm, 'const $1 = require($2);');
}

// ============================================================
// ステージ（仮想Node環境パネル＋隠しiframe実行環境）
// ============================================================
let stageWin = null;
let runFiles = null;     // 実行中の仮想FS（実行のたびにvfsから複製）
let changedKeys = null;  // 実行中に書き込まれたファイル

function initialFiles(p) {
  const files = {};
  for (const [k, v] of Object.entries(p.vfs || {})) files[normPath(k)] = v;
  return files;
}

function buildStage(p) {
  const holder = $('stageHolder');
  holder.innerHTML = '';
  const f = document.createElement('iframe');
  f.className = 'exec-frame';
  f.title = '実行環境';
  f.setAttribute('aria-hidden', 'true');
  holder.appendChild(f);
  const d = f.contentDocument;
  d.open();
  d.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
  d.close();
  stageWin = f.contentWindow;
}

function renderCmd(p) {
  const envStr = Object.entries(p.env || {}).map(([k, v]) => k + '=' + v).join(' ');
  const argvStr = (p.argv || []).join(' ');
  $('runCmd').textContent = '$ ' + (envStr ? envStr + ' ' : '') + 'node ' + (p.filename || 'index.js') + (argvStr ? ' ' + argvStr : '');
}

function renderVfs(p, files, changed) {
  const list = $('vfsList');
  const keys = Object.keys(files).sort();
  if (!keys.length) {
    list.innerHTML = '<p class="vfs-empty">（この問題ではファイルを使いません）</p>';
    return;
  }
  list.innerHTML = keys.map(k => {
    const rel = k.startsWith(VCWD + '/') ? k.slice(VCWD.length + 1) : k;
    const initial = initialFiles(p);
    const badge = changed && changed.has(k)
      ? (k in initial ? '<span class="badge mod">更新</span>' : '<span class="badge new">NEW</span>')
      : '';
    const esc = files[k].replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return '<details class="vfs-file"><summary>&#128196; ' + rel + badge + '</summary><pre>' + esc + '</pre></details>';
  }).join('');
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
  $('editorLabel').textContent = (p.filename || 'index.js') + ' — 仮想Node環境で実行されます';
  $('editor').value = state.drafts[p.id] || p.starter || '';
  $('answerCode').textContent = p.answer;
  $('answerBox').open = false;
  $('console').classList.remove('show');
  $('consoleOut').textContent = '';
  renderCmd(p);
  renderVfs(p, initialFiles(p), null);
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
    : done === ps.length ? '全問クリア！記事版のローカル実行課題（httpサーバーとExpress）に進みましょう。' : '未回答の問題があります。チップから戻れます。';
  $('reviewBtn').style.display = review.length ? '' : 'none';
}

function renderAll() { renderTabs(); renderChips(); renderProgress(); renderProblem(); }

// ---- コンソール（非同期のログもライブ追記） ----
let hasOutput = false;
function fmt(v) {
  if (v && v.__isBuffer) return '<Buffer ' + v.length + ' bytes>';
  if (v !== null && typeof v === 'object' && typeof v.then === 'function') return 'Promise { <pending> }';
  if (typeof v === 'object' && v !== null) { try { return JSON.stringify(v); } catch (e) { return String(v); } }
  return String(v);
}
function logLine(text) {
  hasOutput = true;
  const out = $('consoleOut');
  if (out.dataset.hint === '1') { out.textContent = ''; out.dataset.hint = ''; }
  out.textContent += (out.textContent ? '\n' : '') + text;
}
function showHint() {
  if (hasOutput) return;
  const out = $('consoleOut');
  out.dataset.hint = '1';
  out.textContent = '(出力なし — console.log で表示できます)';
}

// コード実行（仮想Node環境を作り直してからiframe内で実行）
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

  runFiles = initialFiles(p);
  changedKeys = new Set();
  const onChange = k => { changedKeys.add(k); renderVfs(p, runFiles, changedKeys); };

  const fakeConsole = {
    log: (...a) => logLine(a.map(fmt).join(' ')),
    error: (...a) => logLine('Error: ' + a.map(fmt).join(' ')),
    warn: (...a) => logLine('Warn: ' + a.map(fmt).join(' ')),
  };
  const { promises: fsPromises, fsFull } = makeFsModule(runFiles, onChange);
  const pathModule = makePathModule();
  const { proc, preSchedule } = makeProcessModule(p, win);
  const { setImmediateMock, setTimeoutMock } = makeTimers(win);
  const requireMock = makeRequire({
    win, files: runFiles, fsPromises, fsFull, path: pathModule, proc,
    console: fakeConsole, setImmediate: setImmediateMock,
  });

  win.addEventListener('error', e => logLine('Error: ' + e.message));
  win.addEventListener('unhandledrejection', e => {
    const r = e.reason;
    if (r && r.__cqExit !== undefined) { logLine('[process.exit(' + r.__cqExit + ') で終了]'); return; }
    logLine(r && r.name ? r.name + ': ' + r.message : 'Error: ' + fmt(r));
  });

  const execCode = transformImports(code);

  // "type": "module" のプロジェクトで require を使った場合の実機エラーを再現
  // （import変換後でなく、ユーザーが書いた元コードで判定する）
  if (p.esmGuard && /(^|[^.\w])require\s*\(/.test(code)) {
    out.className = 'err';
    out.textContent = 'ReferenceError: require is not defined in ES module scope, you can use import instead';
    return;
  }

  preSchedule();
  try {
    const ret = new win.Function('console', 'require', 'process', 'Buffer', 'setImmediate', 'setTimeout',
      '"use strict";\nreturn (async () => {\n' + execCode + '\n})();')(
      fakeConsole, requireMock, proc, BufferMock, setImmediateMock, setTimeoutMock);
    ret.then(() => { showHint(); renderVfs(p, runFiles, changedKeys); })
       .catch(err => {
         if (err && err.__cqExit !== undefined) { logLine('[process.exit(' + err.__cqExit + ') で終了]'); return; }
         logLine(err && err.name ? err.name + ': ' + err.message : String(err));
       });
  } catch (err) {
    if (err && err.__cqExit !== undefined) { logLine('[process.exit(' + err.__cqExit + ') で終了]'); return; }
    out.className = 'err';
    out.textContent = err.name + ': ' + err.message;
  }
};

// リセット＝下書きを破棄してstarterに戻し、仮想FSも初期状態に戻す
$('clearBtn').onclick = () => {
  const p = problem(state.current);
  $('editor').value = p.starter || '';
  const drafts = { ...state.drafts };
  delete drafts[state.current];
  state = { ...state, drafts };
  save();
  buildStage(p);
  renderVfs(p, initialFiles(p), null);
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
