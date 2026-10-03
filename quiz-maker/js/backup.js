// 作業中の自動バックアップ（IndexedDB）。正本はPCのファイルで、こちらは保存し忘れの保険
const DB_NAME = 'cq-quiz-maker';
const STORE = 'kv';
const KEY = 'current';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(req?.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function loadBackup() {
  try {
    return (await run('readonly', store => store.get(KEY))) || null;
  } catch (e) {
    console.error('バックアップの読み込みに失敗しました', e);
    return null;
  }
}

// ファイルハンドルは保存できないブラウザがあるため、失敗したらハンドル抜きで保存し直す
export async function saveBackup(snapshot) {
  try {
    await run('readwrite', store => store.put(snapshot, KEY));
  } catch (e) {
    try {
      await run('readwrite', store => store.put({ ...snapshot, handle: null }, KEY));
    } catch (e2) {
      console.error('バックアップの保存に失敗しました', e2);
    }
  }
}
