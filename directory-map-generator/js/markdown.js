// ============================================================
// Markdown（ツリー図）書き出し
// 自由配置のボードから木構造を復元して README に貼れる形にする
// ============================================================

// 構造そのものを表すノード。includeShapes が false のときはこの2種だけを木に含める
const STRUCTURE_TYPES = new Set(["folder", "file"]);

// 木に載せる対象を絞る。既定は付箋・四角・円・ひし形も含める（注釈もツリーに残したいため）
function pickNodes(items, includeShapes) {
  return (items || []).filter((it) => includeShapes || STRUCTURE_TYPES.has(it.type));
}

const PLACEHOLDER = { ja: "(名称未設定)", en: "(untitled)" };

// ---- ノード名の整形（改行は1行に畳み、フォルダは末尾スラッシュを保証）----
function nodeLabel(item, lang) {
  const raw = String(item.text || "").replace(/\s*\n\s*/g, " ").trim();
  const name = raw || PLACEHOLDER[lang] || PLACEHOLDER.ja;
  if (item.type !== "folder") return name;
  return name.endsWith("/") ? name : `${name}/`;
}

// ---- 座標順（上→下、同じ高さなら左→右）----
function byTopLeft(a, b) {
  return a.y - b.y || a.x - b.x;
}

// ---- 兄弟の並び（左→右、同じ位置なら上→下）----
function byLeftTop(a, b) {
  return a.x - b.x || a.y - b.y;
}

/**
 * コネクタから親子関係を決める。
 * - 矢印が片方向（ends:'end'）なら from が親
 * - 双方向・線のみ（'both' / 'none'）は向きが確定しないので、y座標が上のほうを親とみなす
 * すでに親を持つノードと、循環を作る辺は無視する（1ノード1親・閉路なしを保証）。
 */
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
    if (!a || !b) continue; // 対象外のノードにつながる線は木に関係しない

    let parent = a;
    let child = b;
    if (c.ends !== "end") {
      const ordered = [a, b].sort(byTopLeft);
      parent = ordered[0];
      child = ordered[1];
    }

    if (parentOf.has(child.id)) continue; // 多重の親は先に決まったほうを残す
    if (isDescendant(child.id, parent.id)) continue; // 循環になる辺は張らない
    parentOf.set(child.id, parent.id);
  }

  return parentOf;
}

/** ボードの状態から木（ルート配列）を組み立てる。 */
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

// ---- 罫線ツリーへの整形 ----
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

// ノード名にバッククォートが含まれていてもフェンスが壊れないよう、必要なら長くする
function fenceFor(body) {
  const longest = (body.match(/`+/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
  return "`".repeat(Math.max(3, longest + 1));
}

/**
 * README にそのまま貼れる Markdown を返す。
 * 対象ノードが1つも無ければ null。
 */
export function toMarkdown(state, lang = "ja", includeShapes = true) {
  const trees = buildTrees(state, includeShapes);
  if (!trees.length) return null;

  const body = trees.map((t) => renderTree(t, lang)).join("\n\n");
  const fence = fenceFor(body);
  return `${fence}text\n${body}\n${fence}\n`;
}

/** .md ファイルとしてダウンロードさせる。 */
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

/**
 * クリップボードへコピーする。
 * Clipboard API は権限や非セキュアコンテキストで失敗するため、
 * 失敗時は選択範囲を作って手動コピーできる状態にしてから false を返す。
 */
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

// ============================================================
// Markdown（ツリー図）の読み込み
// 貼られたテキストから木を復元してボードの状態に戻す。
// 色・座標・付箋/図形の種別はテキストに残らないため復元できない（フォルダ/ファイルとして配置する）。
// ============================================================

const FOLDER_SIZE = { w: 196, h: 60 };
const FILE_SIZE = { w: 184, h: 52 };
const X_STEP = 240;
const Y_STEP = 170;
const MARGIN = 40;

// 太字・斜体・コードのMarkdown装飾を落とす
function cleanName(raw) {
  return raw
    .replace(/^\*\*(.*)\*\*$/, "$1")
    .replace(/^__(.*)__$/, "$1")
    .replace(/^`(.*)`$/, "$1")
    .trim();
}

/**
 * 1行から「インデント幅」と「名前」を取り出す。
 * 罫線ツリー（├─ └─ / ├── └──）、tree コマンドの |-- +--、箇条書き（- * +）、
 * 素のインデントのいずれにも対応する。対象外の行は null。
 */
function parseLine(raw) {
  const line = raw.replace(/\t/g, "    ").replace(/\s+$/, "");
  if (!line.trim()) return null;
  if (/^\s*`{3,}/.test(line)) return null; // コードフェンス
  if (/^\s*#{1,6}\s/.test(line)) return null; // 見出し

  const branch = line.search(/[├└]/);
  if (branch >= 0) {
    const name = cleanName(line.slice(branch).replace(/^[├└][─—–-]*\s*/, ""));
    // 行頭に罫線がある子（├─ src）は、装飾のないルート行と同じ列から始まる。
    // +1しておかないと同じ深さと見なされ、子が全部ルートに化ける。
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

/**
 * インデント幅の実測値を浅い順に並べて深さに読み替える。
 * ツリーの流儀（2/3/4スペース、罫線あり/なし）が混ざっても崩れないようにするため、
 * 固定幅で割らずに「出現した幅の順位」を深さとして使う。
 */
function toDepths(rows) {
  const widths = [...new Set(rows.map((r) => r.indent))].sort((a, b) => a - b);
  const depthOf = new Map(widths.map((w, i) => [w, i]));
  return rows.map((r) => ({ ...r, depth: depthOf.get(r.indent) }));
}

function buildForest(rows) {
  const roots = [];
  const stack = [];

  for (const row of rows) {
    const depth = Math.min(row.depth, stack.length); // 階層が飛んでいたら詰める
    const node = { name: row.name, children: [] };
    if (depth === 0) roots.push(node);
    else stack[depth - 1].children.push(node);
    stack[depth] = node;
    stack.length = depth + 1;
  }

  return roots;
}

// 葉から順に横位置を割り振り、親は子の中央に置く
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
    cursor += 1; // 木と木のあいだを1列空ける
  });
}

/**
 * Markdown（またはtreeコマンドの出力）をボードの状態へ変換する。
 * 木が1つも取れなければ null。
 */
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
    // 末尾スラッシュ、または子を持つことがフォルダの手がかり
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

  // 左端がマイナスにならないよう平行移動する
  const minX = Math.min(...items.map((it) => it.x));
  const shift = MARGIN - minX;
  return {
    items: items.map((it) => ({ ...it, x: it.x + shift, y: it.y + MARGIN })),
    connectors,
  };
}

/** ファイルをテキストとして読む（.md / .txt 用）。 */
export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
