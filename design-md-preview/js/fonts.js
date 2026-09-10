/* 書体の読み込み（Google Fonts） */
const fontLinks = new Map();   /* family -> <link> */

function familyList(v){
  return String(v || '').split(',').map(x=>x.trim()).filter(Boolean);
}
export function cssFamily(v, fallbackVar){
  const list = familyList(v).map(n=>`"${n}"`);
  return list.length ? list.join(', ') + ', ' + fallbackVar : null;
}
function titleCase(f){
  return f.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
function gfUrl(family, weights){
  const fam = titleCase(family).replace(/ /g,'+');
  const w = [...new Set(weights)].filter(x=>/^[1-9]00$/.test(String(x))).sort();
  return 'https://fonts.googleapis.com/css2?family=' + fam + (w.length ? ':wght@' + w.join(';') : '') + '&display=swap';
}
export function loadFonts(ds){
  /* トークンから family と weight を集める */
  const want = new Map();
  for(const t of Object.values(ds.typography)){
    if(!t || typeof t !== 'object' || !t.fontFamily) continue;
    for(const raw of familyList(t.fontFamily)){
      const fam = titleCase(raw);
      if(!want.has(fam)) want.set(fam, new Set());
      if(t.fontWeight) want.get(fam).add(String(t.fontWeight).trim());
    }
  }
  /* 使わなくなったlinkは残しても害がないので消さない（キャッシュが効く） */
  for(const [fam, weights] of want){
    if(fontLinks.has(fam)) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = gfUrl(fam, weights);
    link.dataset.family = fam;
    link.addEventListener('error', ()=>{
      /* weight指定が無い書体だと400になるので、素のURLで一度だけ再試行 */
      if(link.dataset.retried) return;
      link.dataset.retried = '1';
      link.href = gfUrl(fam, []);
    });
    document.head.appendChild(link);
    fontLinks.set(fam, link);
  }
  return [...want.keys()];
}
export async function reportFonts(families){
  const note = document.getElementById('fontnote');
  if(!note) return;
  note.textContent = '';
  if(!families.length) return;
  try{
    await Promise.all(families.map(f => document.fonts.load(`16px "${f}"`).catch(()=>{})));
    await document.fonts.ready;
  }catch(e){}
  const missing = families.filter(f => !document.fonts.check(`16px "${f}"`));
  note.textContent = missing.length
    ? '読み込めなかった書体: ' + missing.join(' / ') + '（代替書体で表示しています）'
    : '';
}
