// 共通ユーティリティ（DOM生成・日付・シャッフル）

// DOM要素を組み立てる。テキストは必ず textContent で入れる（ユーザー入力をHTMLとして解釈させない）
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else if (key === 'value') el.value = value; // textarea は属性では中身が入らないためプロパティで設定
    else if (key in el && typeof value !== 'string') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  });
  children.flat().forEach(child => {
    if (child === undefined || child === null || child === false) return;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return el;
}

// ローカル日付（JST等の端末時刻）を YYYY-MM-DD で返す
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function today() {
  return formatDate(new Date());
}

export function addDays(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number);
  return formatDate(new Date(y, m - 1, d + days));
}

// 表示用の短い日付（10/17）
export function shortDate(ymd) {
  if (!ymd) return '';
  const [, m, d] = ymd.split('-').map(Number);
  return `${m}/${d}`;
}

// Fisher–Yates で偏りなくシャッフル（元の配列は変更しない）
export function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let idSeq = 0;
export function uid() {
  idSeq += 1;
  return `q${Date.now().toString(36)}${idSeq.toString(36)}`;
}

let toastTimer = null;
export function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2600);
}

// GA4計測：GTM の dataLayer へイベントを送る（GTM側でカスタムイベントとしてGA4へ転送）
export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: `quiz_maker_${event}`, ...params });
}
