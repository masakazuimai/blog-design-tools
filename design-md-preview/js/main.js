/* 起動とイベント配線 */
import { PRESETS } from './presets.js?v=20260910a';
import { parseDesignMd, resolveRef } from './parser.js?v=20260910a';
import { loadFonts, reportFonts } from './fonts.js?v=20260910a';
import { applyToLp, renderSpecimen, renderTokens } from './render.js?v=20260910a';
import { buildPrompt } from './prompt.js?v=20260910a';

function show(preset){
  const ds = parseDesignMd(preset.text);
  reportFonts(loadFonts(ds));
  applyToLp(ds);
  renderSpecimen(ds);
  renderTokens(ds);
  document.getElementById('stageName').textContent = ds.top.name || '（name未設定）';
  document.getElementById('stageMeta').textContent = preset.path;
  document.getElementById('prompt').value = buildPrompt(preset);
  document.getElementById('copied').textContent = '';
  for(const b of document.querySelectorAll('.theme-btn'))
    b.setAttribute('aria-pressed', String(b.dataset.id === preset.id));
}

function initThemes(){
  const wrap = document.getElementById('themes');
  const groups = [
    {key:'examples', label:'公式サンプル', note:'examples/'},
    {key:'fixtures', label:'公式リンター素材', note:'packages/cli/.../fixtures/'},
    {key:'codequest', label:'CodeQuest製', note:'日本語書体つき・自作'}
  ];
  for(const g of groups){
    const items = PRESETS.filter(p => p.group === g.key);
    if(!items.length) continue;
    const h = document.createElement('p');
    h.className = 'grp';
    h.innerHTML = `${g.label} <small>${g.note}</small>`;
    wrap.appendChild(h);
    const box = document.createElement('div');
    box.className = 'themes';
    for(const p of items){
      const ds = parseDesignMd(p.text);
      const gg = {colors:ds.colors};
      const sw = ['surface','primary','secondary','tertiary','on-surface'].map(k=>{
        const v = resolveRef(gg, ds.colors[k]);
        return v ? `<i style="background:${v}"></i>` : '';
      }).join('');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'theme-btn'; b.dataset.id = p.id;
      b.setAttribute('aria-pressed','false');
      b.title = p.path;
      b.innerHTML = `<span class="swatches">${sw}</span><span>${p.name}</span>`;
      b.addEventListener('click', ()=> show(p));
      box.appendChild(b);
    }
    wrap.appendChild(box);
  }
}

document.getElementById('copy').addEventListener('click', async ()=>{
  const ta = document.getElementById('prompt');
  try{
    await navigator.clipboard.writeText(ta.value);
  }catch(e){
    ta.removeAttribute('readonly'); ta.select(); document.execCommand('copy'); ta.setAttribute('readonly','');
  }
  const c = document.getElementById('copied');
  c.textContent = 'コピーしました';
  setTimeout(()=>{ c.textContent=''; }, 2000);
});

document.getElementById('yr').textContent = new Date().getFullYear();
initThemes();
if(PRESETS.length) show(PRESETS[0]);
