/* DESIGN.md パーサ（仕様のスキーマに絞った最小実装） */
const SCHEMA_KEYS = ['version','name','description','omitted','colors','typography','rounded','spacing','components'];

function unquote(v){
  v = v.trim();
  if(v.endsWith(',')) v = v.slice(0,-1).trim();
  const m = v.match(/^(['"])([\s\S]*)\1$/);
  return m ? m[2] : v;
}

export function parseDesignMd(text){
  const src = text.replace(/\r\n?/g,'\n');
  let front = '', body = src;
  if(src.startsWith('---\n')){
    const end = src.indexOf('\n---', 3);
    if(end > -1){ front = src.slice(4, end+1); body = src.slice(end+4); }
  }

  const out = {raw:src, front, body, top:{}, colors:{}, typography:{}, spacing:{}, rounded:{}, components:{}, unknownTop:[]};

  // --- フロントマター ---
  let group = null, sub = null;
  for(const line of front.split('\n')){
    if(!line.trim() || /^\s*#/.test(line)) continue;
    const top = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/);
    if(top){
      const key = top[1], val = top[2].replace(/\s+#.*$/,'').trim();
      group = null; sub = null;
      if(val === ''){
        if(['colors','typography','spacing','rounded','components'].includes(key)) group = key;
        else if(!SCHEMA_KEYS.includes(key)){ out.unknownTop.push(key); group = '__unknown__:'+key; }
        else group = null;
      }else{
        if(SCHEMA_KEYS.includes(key)) out.top[key] = unquote(val);
        else out.unknownTop.push(key);
      }
      continue;
    }
    const lvl1 = line.match(/^\s{2}([A-Za-z0-9_\-.]+):\s*(.*)$/);
    if(lvl1 && group){
      const key = lvl1[1], val = lvl1[2].replace(/\s+#.*$/,'').trim();
      if(group.startsWith('__unknown__')) { sub = null; continue; }
      if(val === ''){ sub = key; if(group==='typography'||group==='components') out[group][key] = {}; }
      else { out[group][key] = unquote(val); sub = null; }
      continue;
    }
    const lvl2 = line.match(/^\s{4}([A-Za-z0-9_\-.]+):\s*(.*)$/);
    if(lvl2 && group && sub && out[group][sub] && typeof out[group][sub] === 'object'){
      out[group][sub][lvl2[1]] = unquote(lvl2[2].replace(/\s+#.*$/,'').trim());
    }
  }

  return out;
}

/* --- トークン参照 {colors.primary} を解決 --- */
export function resolveRef(ds, value, depth){
  if(typeof value !== 'string') return value;
  const m = value.match(/^\{([A-Za-z0-9_\-.]+)\}$/);
  if(!m) return value;
  if((depth||0) > 5) return null;
  const path = m[1].split('.');
  let cur = ds;
  for(const p of path){
    if(cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return null;
  }
  return resolveRef(ds, cur, (depth||0)+1);
}
