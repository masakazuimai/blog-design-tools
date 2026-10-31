
const STRUCTURE_TYPES = new Set(["folder", "file"]);

function pickNodes(items, includeShapes) {
  return (items || []).filter((it) => includeShapes || STRUCTURE_TYPES.has(it.type));
}

const PLACEHOLDER = { ja: "(名称未設定)", en: "(untitled)" };

function nodeLabel(item, lang) {
  const raw = String(item.text || "").replace(/\s*\n\s*/g, " ").trim();
  const name = raw || PLACEHOLDER[lang] || PLACEHOLDER.ja;
  if (item.type !== "folder") return name;
  return name.endsWith("/") ? name : `${name}/`;
}

function byTopLeft(a, b) {
  return a.y - b.y || a.x - b.x;
}

function byLeftTop(a, b) {
  return a.x - b.x || a.y - b.y;
}

function buildParentMap(nodes, connectors) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const parentOf = new Map();

  const isDescendant = (ancestorId, nodeId) => {
    let cur = nodeId;
    const seen = new Set();
    while (cur && !seen.has(cur)) {
      if (cur === ancestorId) return true;
      seen.add(cur);
      cur = parentOf.get(cur);
    }
    return false;
  };

  for (const c of connectors) {
    const a = byId.get(c.from);
    const b = byId.get(c.to);
    if (!a || !b) continue;

    let parent = a;
    let child = b;
    if (c.ends !== "end") {
      const ordered = [a, b].sort(byTopLeft);
      parent = ordered[0];
      child = ordered[1];
    }

    if (parentOf.has(child.id)) continue;
    if (isDescendant(child.id, parent.id)) continue;
    parentOf.set(child.id, parent.id);
  }

  return parentOf;
}

export function buildTrees(state, includeShapes = true) {
  const nodes = pickNodes(state.items, includeShapes);
  if (!nodes.length) return [];

  const parentOf = buildParentMap(nodes, state.connectors || []);
  const childrenOf = new Map(nodes.map((n) => [n.id, []]));
  const roots = [];

  for (const node of nodes) {
    const parentId = parentOf.get(node.id);
    if (parentId) childrenOf.get(parentId).push(node);
    else roots.push(node);
  }

  const toTree = (node) => ({
    node,
    children: childrenOf.get(node.id).sort(byLeftTop).map(toTree),
  });

  return roots.sort(byTopLeft).map(toTree);
}

function renderTree(tree, lang) {
  const lines = [nodeLabel(tree.node, lang)];

  const walk = (children, prefix) => {
    children.forEach((child, i) => {
      const last = i === children.length - 1;
      lines.push(`${prefix}${last ? "└─ " : "├─ "}${nodeLabel(child.node, lang)}`);
      walk(child.children, `${prefix}${last ? "   " : "│  "}`);
    });
  };

  walk(tree.children, "");
  return lines.join("\n");
}

function fenceFor(body) {
  const longest = (body.match(/`+/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
  return "`".repeat(Math.max(3, longest + 1));
}

export function toMarkdown(state, lang = "ja", includeShapes = true) {
  const trees = buildTrees(state, includeShapes);
  if (!trees.length) return null;

  const body = trees.map((t) => renderTree(t, lang)).join("\n\n");
  const fence = fenceFor(body);
  return `${fence}text\n${body}\n${fence}\n`;
}

export function downloadMarkdown(text, filename = "directory-map.md") {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export async function copyMarkdown(text, fallbackEl = null) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("クリップボードへのコピーに失敗:", err);
    if (fallbackEl) {
      const range = document.createRange();
      range.selectNodeContents(fallbackEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return false;
  }
}


const FOLDER_SIZE = { w: 196, h: 60 };
const FILE_SIZE = { w: 184, h: 52 };
const X_STEP = 240;
const Y_STEP = 170;
const MARGIN = 40;

function cleanName(raw) {
  return raw
    .replace(/^\*\*(.*)\*\*$/, "$1")
    .replace(/^__(.*)__$/, "$1")
    .replace(/^`(.*)`$/, "$1")
    .trim();
}

function parseLine(raw) {
  const line = raw.replace(/\t/g, "    ").replace(/\s+$/, "");
  if (!line.trim()) return null;
  if (/^\s*`{3,}/.test(line)) return null;
  if (/^\s*#{1,6}\s/.test(line)) return null;

  const branch = line.search(/[├└]/);
  if (branch >= 0) {
    const name = cleanName(line.slice(branch).replace(/^[├└][─—–-]*\s*/, ""));
    return name ? { indent: branch + 1, name } : null;
  }

  const marker = line.match(/^(\s*)(?:[-*+]|\|--+|\+--+)\s+(.*)$/);
  if (marker) {
    const name = cleanName(marker[2]);
    return name ? { indent: marker[1].length, name } : null;
  }

  const plain = line.match(/^(\s*)(.*)$/);
  const name = cleanName(plain[2]);
  return name ? { indent: plain[1].length, name } : null;
}

function toDepths(rows) {
  const widths = [...new Set(rows.map((r) => r.indent))].sort((a, b) => a - b);
  const depthOf = new Map(widths.map((w, i) => [w, i]));
  return rows.map((r) => ({ ...r, depth: depthOf.get(r.indent) }));
}

function buildForest(rows) {
  const roots = [];
  const stack = [];

  for (const row of rows) {
    const depth = Math.min(row.depth, stack.length);
    const node = { name: row.name, children: [] };
    if (depth === 0) roots.push(node);
    else stack[depth - 1].children.push(node);
    stack[depth] = node;
    stack.length = depth + 1;
  }

  return roots;
}

function assignSlots(roots) {
  let cursor = 0;
  const place = (node, depth) => {
    node.depth = depth;
    if (!node.children.length) {
      node.slot = cursor;
      cursor += 1;
      return;
    }
    node.children.forEach((child) => place(child, depth + 1));
    const first = node.children[0].slot;
    const last = node.children[node.children.length - 1].slot;
    node.slot = (first + last) / 2;
  };

  roots.forEach((root) => {
    place(root, 0);
    cursor += 1;
  });
}

export function parseMarkdown(text) {
  const rows = String(text || "")
    .split(/\r?\n/)
    .map(parseLine)
    .filter(Boolean);
  if (!rows.length) return null;

  const roots = buildForest(toDepths(rows));
  if (!roots.length) return null;
  assignSlots(roots);

  const items = [];
  const connectors = [];
  let seq = 0;

  const emit = (node, parentId) => {
    const isFolder = node.name.endsWith("/") || node.children.length > 0;
    const size = isFolder ? FOLDER_SIZE : FILE_SIZE;
    const id = `n_${(seq += 1)}`;
    items.push({
      id,
      type: isFolder ? "folder" : "file",
      x: node.slot * X_STEP - size.w / 2,
      y: node.depth * Y_STEP,
      w: size.w,
      h: size.h,
      text: node.name.replace(/\/+$/, ""),
      color: "auto",
    });
    if (parentId) connectors.push({ id: `c_${(seq += 1)}`, from: parentId, to: id, ends: "end" });
    node.children.forEach((child) => emit(child, id));
  };

  roots.forEach((root) => emit(root, null));

  const minX = Math.min(...items.map((it) => it.x));
  const shift = MARGIN - minX;
  return {
    items: items.map((it) => ({ ...it, x: it.x + shift, y: it.y + MARGIN })),
    connectors,
  };
}

export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
