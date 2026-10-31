import { formatOf } from './format.js?v=20261003b';
import { t } from './i18n.js?v=20261003b';

export const canOverwrite = typeof window.showOpenFilePicker === 'function';

const PICKER_TYPES = [
  { description: t('pickerCsv'), accept: { 'text/csv': ['.csv'] } },
  { description: t('pickerJson'), accept: { 'application/json': ['.json'] } },
];

function isAbort(e) {
  return e && e.name === 'AbortError';
}

function pickWithInput() {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,text/csv,application/json';
    input.addEventListener('change', () => resolve(input.files?.[0] || null));
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

export async function openFile() {
  if (canOverwrite) {
    try {
      const [handle] = await window.showOpenFilePicker({ types: PICKER_TYPES, multiple: false });
      const file = await handle.getFile();
      return { name: file.name, buffer: await file.arrayBuffer(), handle };
    } catch (e) {
      if (isAbort(e)) return null;
      throw e;
    }
  }
  const file = await pickWithInput();
  if (!file) return null;
  return { name: file.name, buffer: await file.arrayBuffer(), handle: null };
}

export async function readFile(file) {
  return { name: file.name, buffer: await file.arrayBuffer(), handle: null };
}

async function ensureWritable(handle) {
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission?.(opts)) === 'granted') return true;
  return (await handle.requestPermission?.(opts)) === 'granted';
}

async function writeHandle(handle, text) {
  if (!(await ensureWritable(handle))) throw new Error(t('writeDenied'));
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
}

function mimeOf(format) {
  return format === 'json' ? 'application/json' : 'text/csv';
}

function download(name, text, format) {
  const blob = new Blob([text], { type: `${mimeOf(format)};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.append(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
}

export async function saveFile({ handle, name, buildText }) {
  if (handle) {
    await writeHandle(handle, buildText(formatOf(name)));
    return { name, handle, downloaded: false };
  }
  const fileName = name || t('defaultFileName');
  download(fileName, buildText(formatOf(fileName)), formatOf(fileName));
  return { name: fileName, handle: null, downloaded: true };
}

export async function saveFileAs({ suggestedName, buildText }) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName, types: PICKER_TYPES });
      await writeHandle(handle, buildText(formatOf(handle.name)));
      return { name: handle.name, handle, downloaded: false };
    } catch (e) {
      if (isAbort(e)) return null;
      throw e;
    }
  }
  download(suggestedName, buildText(formatOf(suggestedName)), formatOf(suggestedName));
  return { name: suggestedName, handle: null, downloaded: true };
}

export function downloadText(name, text) {
  download(name, text, formatOf(name));
}
