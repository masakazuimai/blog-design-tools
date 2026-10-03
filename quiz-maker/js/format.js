// 問題集ファイルの読み書き（CSV / JSON）
import { uid } from './util.js?v=20261003b';
import { MAX_LEVEL } from './srs.js?v=20261003b';
import { t, LANG } from './i18n.js?v=20261003b';

const CSV_HEADERS = {
  ja: ['問題', '正解', '誤答1', '誤答2', '誤答3', '解説', '習熟度', '次回出題日', '正解回数', '不正解回数'],
  en: ['Question', 'Answer', 'Wrong 1', 'Wrong 2', 'Wrong 3', 'Explanation', 'Level', 'Next due', 'Correct count', 'Wrong count'],
};
const HEADER_FIRST_CELLS = [CSV_HEADERS.ja[0], CSV_HEADERS.en[0].toLowerCase()];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function formatOf(fileName) {
  return /\.json$/i.test(fileName || '') ? 'json' : 'csv';
}

export function baseName(fileName) {
  return (fileName || '').replace(/\.(csv|json)$/i, '') || t('defaultDeckName');
}

// RFC 4180 準拠のCSVパーサー（引用符内の改行・カンマ・"" エスケープに対応）
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toInt(value, min, max) {
  const n = parseInt(String(value ?? '').trim(), 10);
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

// 1問ぶんの生データを検証して正規化する。不備があれば error を返す
function normalizeQuestion(raw) {
  const q = String(raw.q ?? '').trim();
  const correct = String(raw.correct ?? '').trim();
  const wrong = (raw.wrong || []).map(w => String(w ?? '').trim());
  if (!q || !correct || wrong.length < 3 || wrong.slice(0, 3).some(w => !w)) {
    return { error: t('errBlank') };
  }
  const next = String(raw.next ?? '').trim();
  return {
    question: {
      id: uid(),
      q,
      correct,
      wrong: wrong.slice(0, 3),
      explain: String(raw.explain ?? '').trim(),
      level: toInt(raw.level, 0, MAX_LEVEL),
      next: DATE_RE.test(next) ? next : '',
      ok: toInt(raw.ok, 0, Number.MAX_SAFE_INTEGER),
      ng: toInt(raw.ng, 0, Number.MAX_SAFE_INTEGER),
    },
  };
}

function collect(rawList, lineOffset) {
  const questions = [];
  const errors = [];
  rawList.forEach((raw, i) => {
    const result = normalizeQuestion(raw);
    if (result.error) errors.push(t('errLine', { line: i + lineOffset, error: result.error }));
    else questions.push(result.question);
  });
  return { questions, errors };
}

function parseCsvDeck(text) {
  const rows = parseCSV(text.replace(/^﻿/, ''));
  // 日本語版・英語版どちらの見出し行でも読める
  const hasHeader = rows.length && HEADER_FIRST_CELLS.includes(rows[0][0]?.trim().toLowerCase());
  const body = (hasHeader ? rows.slice(1) : rows)
    .map((cells, i) => ({ cells, line: i + (hasHeader ? 2 : 1) }))
    .filter(({ cells }) => cells.some(c => c.trim() !== ''));
  const questions = [];
  const errors = [];
  body.forEach(({ cells, line }) => {
    const [q, correct, w1, w2, w3, explain, level, next, ok, ng] = cells;
    const result = normalizeQuestion({ q, correct, wrong: [w1, w2, w3], explain, level, next, ok, ng });
    if (result.error) errors.push(t('errLine', { line, error: result.error }));
    else questions.push(result.question);
  });
  return { questions, errors };
}

function parseJsonDeck(text) {
  let data;
  try {
    data = JSON.parse(text.replace(/^﻿/, ''));
  } catch (e) {
    throw new Error(t('errJson'));
  }
  const list = Array.isArray(data) ? data : data?.questions;
  if (!Array.isArray(list)) throw new Error(t('errJsonQuestions'));
  const raws = list.map(item => ({
    q: item.question, correct: item.correct, wrong: item.wrong, explain: item.explain,
    level: item.level, next: item.next, ok: item.ok, ng: item.ng,
  }));
  return collect(raws, 1);
}

// 文字コードは UTF-8 を優先し、失敗したら Shift_JIS（Excelの「CSV」保存）として読む
export function decodeText(buffer) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch (e) {
    return new TextDecoder('shift_jis').decode(buffer);
  }
}

export function parseDeck(fileName, text) {
  return formatOf(fileName) === 'json' ? parseJsonDeck(text) : parseCsvDeck(text);
}

export function serializeDeck(questions, format) {
  if (format === 'json') {
    const data = {
      app: 'codequest-quiz-maker',
      version: 1,
      questions: questions.map(({ q, correct, wrong, explain, level, next, ok, ng }) =>
        ({ question: q, correct, wrong, explain, level, next, ok, ng })),
    };
    return JSON.stringify(data, null, 2);
  }
  const lines = [CSV_HEADERS[LANG], ...questions.map(q =>
    [q.q, q.correct, ...q.wrong, q.explain, q.level, q.next, q.ok, q.ng])];
  // BOM付きUTF-8：Excelで開いても文字化けしない
  return '﻿' + lines.map(cells => cells.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

export function templateCsv() {
  return serializeDeck([], 'csv').replace(/\r\n$/, '') +
    (LANG === 'en'
      ? '\r\nWhich color is NOT an additive primary color of light?,Yellow,Red,Green,Blue,The additive primaries are red / green / blue (RGB),,,,\r\n'
      : '\r\n光の三原色に含まれない色は？,黄,赤,緑,青,光の三原色は赤・緑・青（RGB）,,,,\r\n');
}
