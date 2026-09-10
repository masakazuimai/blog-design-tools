/* テーマのトークンをLPプレビュー・書体見本・トークン一覧へ流し込む */
import { resolveRef } from './parser.js?v=20260910a';
import { cssFamily } from './fonts.js?v=20260910a';

function pick(obj, names){
  for(const n of names) if(n in obj && obj[n]) return obj[n];
  return null;
}

/* 仕様上トークン名は自由に付けられる（`Any descriptive string key is valid`）ため、
   名前で決め打ちせず、実際の値から見出し/本文/ラベルを選ぶ */
function toPx(v){
  const m = String(v || '').match(/^([\d.]+)(px|rem|em)$/);
  if(!m) return null;
  return m[2] === 'px' ? parseFloat(m[1]) : parseFloat(m[1]) * 16;
}
function pickType(typo){
  const rows = Object.entries(typo)
    .filter(([,v]) => v && typeof v === 'object')
    .map(([name, v]) => ({name, v, px: toPx(v.fontSize)}))
    .filter(r => r.v.fontFamily);
  if(!rows.length) return {head:{}, body:{}, label:{}};

  const sized = rows.filter(r => r.px !== null);
  const head = (sized.length ? sized.reduce((a,b)=> b.px > a.px ? b : a) : rows[0]);

  const isBody = r => /body|paragraph|text|main|journal/i.test(r.name);
  const bodyCand = rows.filter(r => r !== head);
  const body = bodyCand.find(isBody)
    || (bodyCand.filter(r=>r.px!==null).sort((a,b)=>Math.abs(a.px-17)-Math.abs(b.px-17))[0])
    || head;

  const isLabel = r => /label|caps|mono|meta|small|telemetry|coordinate|numeral/i.test(r.name);
  const labelCand = rows.filter(r => r !== head && r !== body);
  const label = labelCand.find(isLabel)
    || labelCand.find(r => r.v.letterSpacing)
    || (labelCand.filter(r=>r.px!==null).sort((a,b)=>a.px-b.px)[0])
    || body;

  return {head: head.v, body: body.v, label: label.v};
}
export function applyToLp(ds){
  const g = {colors:ds.colors, typography:ds.typography, spacing:ds.spacing, rounded:ds.rounded, components:ds.components};
  const C = k => resolveRef(g, ds.colors[k]);
  const lp = document.getElementById('lp');
  lp.style.cssText = '';   /* 前のテーマの値を残さない（トークンが欠けている場合の混在を防ぐ） */
  const set = (k,v) => { if(v) lp.style.setProperty(k, v); };

  const bg      = pick(ds.colors, ['surface','background','neutral','surface-container-lowest']);
  const text    = pick(ds.colors, ['on-surface','on-background','primary']);
  const muted   = pick(ds.colors, ['on-surface-variant','secondary','outline']);
  const card    = pick(ds.colors, ['surface-container','surface-container-low','surface-variant','surface-bright']);
  const line    = pick(ds.colors, ['outline-variant','outline','surface-container-high']);
  const accent  = pick(ds.colors, ['primary','tertiary','accent']);
  const onAcc   = pick(ds.colors, ['on-primary','on-tertiary','surface']);
  const acc2    = pick(ds.colors, ['secondary','tertiary','primary-container']);
  const onAcc2  = pick(ds.colors, ['on-secondary','on-tertiary','on-primary-container']);

  set('--lp-bg', bg); set('--lp-text', text); set('--lp-muted', muted || text);
  set('--lp-card', card || bg); set('--lp-line', line || muted);
  set('--lp-accent', accent); set('--lp-on-accent', onAcc || bg);
  set('--lp-accent2', acc2 || accent); set('--lp-on-accent2', onAcc2 || bg);

  const {head, body, label} = pickType(ds.typography);
  if(head.fontFamily)   set('--lp-h-font', cssFamily(head.fontFamily, 'system-ui, sans-serif'));
  if(head.fontSize)     set('--lp-h-size', `clamp(26px, 5.2cqi, ${head.fontSize})`);
  if(head.fontWeight)   set('--lp-h-weight', head.fontWeight);
  if(head.letterSpacing)set('--lp-h-ls', head.letterSpacing);
  if(head.lineHeight)   set('--lp-h-lh', head.lineHeight);
  if(body.fontFamily)   set('--lp-b-font', cssFamily(body.fontFamily, 'system-ui, sans-serif'));
  if(body.fontSize)     set('--lp-b-size', body.fontSize);
  if(body.lineHeight)   set('--lp-b-lh', body.lineHeight);
  if(label.fontFamily)  set('--lp-l-font', cssFamily(label.fontFamily, 'system-ui, sans-serif'));
  if(label.letterSpacing) set('--lp-l-ls', label.letterSpacing);

  set('--lp-radius', pick(ds.rounded, ['md','DEFAULT','lg','sm']));
  set('--lp-gap',    pick(ds.spacing, ['card-gap','md','unit','sm']));
  set('--lp-pad',    pick(ds.spacing, ['container-padding','lg','section-margin','md']));

  const name = ds.top.name || '（name未設定）';
  document.getElementById('lpLogo').textContent = name;
  document.getElementById('lpFoot').textContent = '© ' + name;
  document.getElementById('lpEyebrow').textContent = (ds.top.version ? 'version ' + ds.top.version : 'design tokens');
}

export function renderSpecimen(ds){
  const box = document.getElementById('lpSpec');
  box.querySelectorAll('.spec-row').forEach(el=>el.remove());
  const entries = Object.entries(ds.typography).filter(([,v])=>v && typeof v === 'object');
  if(!entries.length){ box.hidden = true; return; }
  box.hidden = false;
  for(const [name, t] of entries.slice(0,8)){
    const row = document.createElement('div');
    row.className = 'spec-row';
    const meta = document.createElement('span');
    meta.className = 'spec-meta';
    meta.textContent = [name, t.fontFamily, t.fontSize, t.fontWeight, t.letterSpacing]
      .filter(Boolean).join(' · ');
    const p = document.createElement('p');
    p.className = 'spec-sample';
    p.textContent = 'Aa Bb Cc 0123 — Design tokens carry intent';
    if(t.fontFamily)    p.style.fontFamily = cssFamily(t.fontFamily, 'var(--lp-b-font)');
    if(t.fontSize)      p.style.fontSize = `clamp(16px, 3.4cqi, ${t.fontSize})`;
    if(t.fontWeight)    p.style.fontWeight = t.fontWeight;
    if(t.letterSpacing) p.style.letterSpacing = t.letterSpacing;
    if(t.lineHeight)    p.style.lineHeight = t.lineHeight;
    row.appendChild(meta); row.appendChild(p);
    box.appendChild(row);
  }
}

export function renderTokens(ds){
  const g = {colors:ds.colors, typography:ds.typography, spacing:ds.spacing, rounded:ds.rounded, components:ds.components};
  const cw = document.getElementById('tokColors');
  cw.innerHTML = '';
  for(const [k,v] of Object.entries(ds.colors)){
    const val = resolveRef(g, v) || v;
    const el = document.createElement('span');
    el.className = 'tok';
    el.innerHTML = `<i style="background:${String(val).replace(/"/g,'')}"></i>${k}`;
    el.title = k + ': ' + val;
    cw.appendChild(el);
  }
  const tw = document.getElementById('tokType');
  tw.innerHTML = '';
  for(const [k,v] of Object.entries(ds.typography)){
    const el = document.createElement('span'); el.className = 'tok';
    el.textContent = `${k} — ${v.fontFamily || '?'} ${v.fontSize || ''}`;
    tw.appendChild(el);
  }
  const sw = document.getElementById('tokSize');
  sw.innerHTML = '';
  for(const [label,obj] of [['spacing',ds.spacing],['rounded',ds.rounded]]){
    for(const [k,v] of Object.entries(obj)){
      const el = document.createElement('span'); el.className = 'tok';
      el.textContent = `${label}.${k} — ${v}`;
      sw.appendChild(el);
    }
  }
}
