// ============================================================
// エントリ：初期化・ツールバー配線・ショートカット
// ============================================================

import { state, load, hasSaved, clearAll, replaceAll, nextId, addItem, addConnector } from "./store.js?v=20260702s";
import {
  initBoard,
  setTool,
  setColor,
  zoomBy,
  resetZoom,
  deleteSelected,
  clearSelection,
} from "./board.js?v=20260702u";
import { exportPng, exportJson, readJsonFile } from "./export.js?v=20260702f";

// 色相ありの色を先頭に、無彩色（白/灰/黒）は末尾。初期色は色相のある #fde68a
const SWATCHES = [
  "#fde68a", "#fcd34d", "#fed7aa", "#fdba74", "#fecaca", "#fca5a5", "#fbcfe8", "#f9a8d4",
  "#ddd6fe", "#c4b5fd", "#bfdbfe", "#93c5fd", "#a5f3fc", "#99f6e4", "#bbf7d0", "#86efac",
  "#bef264", "#d9f99d", "#ffffff", "#e5e7eb", "#cbd5e1", "#94a3b8", "#475569", "#1e293b",
];

const KEY_TO_TOOL = {
  v: "select",
  f: "folder",
  g: "file",
  s: "sticky",
  r: "rect",
  o: "ellipse",
  d: "diamond",
  c: "connector",
};

// ---- i18n（同一JSで /en/ と出し分け。document.documentElement.lang で判定）----
const LANG = document.documentElement.lang === "en" ? "en" : "ja";
const STR = {
  ja: {
    needNodes: "先にノードや図形を置いてください",
    pngDone: "PNGを書き出しました",
    jsonSaved: "JSONを保存しました",
    jsonLoaded: "JSONを読み込みました",
    jsonError: "読み込みに失敗しました（JSON形式を確認してください）",
    confirmSample: "現在の内容を消して、ディレクトリマップの例を読み込みます。よろしいですか？",
    sampleLoaded: "ディレクトリマップの例を読み込みました",
    confirmClear: "ボードのすべての内容を消去します。よろしいですか？",
    cleared: "すべて消去しました",
    copied: "コピーしました",
    cut: "切り取りました",
    pasted: (n) => `${n}件貼り付けました`,
    duplicated: (n) => `${n}件複製しました`,
  },
  en: {
    needNodes: "Add a node or shape first",
    pngDone: "Exported PNG",
    jsonSaved: "Saved JSON",
    jsonLoaded: "Loaded JSON",
    jsonError: "Import failed (check the JSON format)",
    confirmSample: "Replace the current board with the sample directory map?",
    sampleLoaded: "Loaded the sample directory map",
    confirmClear: "Erase everything on the board?",
    cleared: "Cleared the board",
    copied: "Copied",
    cut: "Cut",
    pasted: (n) => `Pasted ${n} item${n > 1 ? "s" : ""}`,
    duplicated: (n) => `Duplicated ${n} item${n > 1 ? "s" : ""}`,
  },
}[LANG];

const $ = (id) => document.getElementById(id);

function init() {
  load();

  const refs = {
    canvas: $("canvas"),
    world: $("world"),
    wires: $("wires"),
    emptyHint: $("empty-hint"),
    zoomVal: $("zoom-val"),
  };

  let currentTool = "select";
  const board = initBoard(refs, {
    onChange: (payload) => {
      if (payload.tool) {
        currentTool = payload.tool;
        syncToolButtons(currentTool);
      }
    },
  });

  // ---- ツールボタン ----
  const toolBtns = [...document.querySelectorAll(".tool[data-tool]")];
  toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTool = btn.dataset.tool;
      board.setTool(currentTool);
      syncToolButtons(currentTool);
    });
  });
  function syncToolButtons(tool) {
    toolBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.tool === tool));
  }

  // ---- 色ピッカー（色相環トリガー＋ドロワー）----
  const colorTrigger = $("color-trigger");
  const colorDrawer = $("color-drawer");
  let currentColor = "auto"; // 既定はテーマ既定色（ライト/ダークに追従）。色は色相環ドロワーで選ぶ

  SWATCHES.forEach((hex) => {
    const btn = document.createElement("button");
    btn.className = "swatch" + (hex === currentColor ? " is-active" : "");
    btn.type = "button";
    btn.style.background = hex;
    btn.title = hex;
    btn.setAttribute("aria-label", `色 ${hex}`);
    btn.addEventListener("click", () => {
      currentColor = hex;
      board.setColor(hex);
      [...colorDrawer.children].forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      closeColorDrawer();
    });
    colorDrawer.appendChild(btn);
  });

  const openColorDrawer = () => {
    colorDrawer.hidden = false;
    colorTrigger.setAttribute("aria-expanded", "true");
  };
  const closeColorDrawer = () => {
    colorDrawer.hidden = true;
    colorTrigger.setAttribute("aria-expanded", "false");
  };
  colorTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (colorDrawer.hidden) openColorDrawer();
    else closeColorDrawer();
  });
  // ドロワー外クリック / Escで閉じる
  document.addEventListener("click", (e) => {
    if (!colorDrawer.hidden && !e.target.closest("#color-picker")) closeColorDrawer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !colorDrawer.hidden) closeColorDrawer();
  });

  // ---- テーマ切替（ライト/ダーク・既定ダーク・localStorage保存）----
  const THEME_KEY = "dirmap:theme";
  const themeToggle = $("theme-toggle");
  const curTheme = () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  const syncThemeLabel = () => {
    if (!themeToggle) return;
    const dark = curTheme() === "dark";
    themeToggle.setAttribute("aria-label", dark ? (LANG === "en" ? "Switch to light mode" : "ライトモードに切替") : LANG === "en" ? "Switch to dark mode" : "ダークモードに切替");
    themeToggle.setAttribute("title", themeToggle.getAttribute("aria-label"));
  };
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = curTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (_) {
        /* noop */
      }
      syncThemeLabel();
    });
    syncThemeLabel();
  }

  // ---- 矢印の設定（形＝直線/直角、端＝片方向/双方向/なし）をアイコンで ----
  const wtStraight = $("wt-straight");
  const wtElbow = $("wt-elbow");
  const wtEnd = $("wt-end");
  const wtBoth = $("wt-both");
  const wtNone = $("wt-none");
  const syncWireTools = () => {
    wtStraight.classList.toggle("is-active", state.wireStyle === "straight");
    wtElbow.classList.toggle("is-active", state.wireStyle === "elbow");
    wtEnd.classList.toggle("is-active", state.wireEnds === "end");
    wtBoth.classList.toggle("is-active", state.wireEnds === "both");
    wtNone.classList.toggle("is-active", state.wireEnds === "none");
  };
  wtStraight.addEventListener("click", () => {
    board.setWireStyle("straight");
    syncWireTools();
  });
  wtElbow.addEventListener("click", () => {
    board.setWireStyle("elbow");
    syncWireTools();
  });
  wtEnd.addEventListener("click", () => {
    board.setWireEnds("end");
    syncWireTools();
  });
  wtBoth.addEventListener("click", () => {
    board.setWireEnds("both");
    syncWireTools();
  });
  wtNone.addEventListener("click", () => {
    board.setWireEnds("none");
    syncWireTools();
  });
  syncWireTools();

  // ---- ズーム ----
  $("zoom-in").addEventListener("click", () => zoomBy(1.2));
  $("zoom-out").addEventListener("click", () => zoomBy(1 / 1.2));
  $("zoom-reset").addEventListener("click", () => resetZoom());

  // ---- アクション ----
  $("btn-delete").addEventListener("click", () => deleteSelected());
  $("btn-png").addEventListener("click", () => {
    const ok = exportPng(state, "directory-map.png");
    toast(ok ? STR.pngDone : STR.needNodes);
  });
  $("btn-save").addEventListener("click", () => {
    if (!state.items.length) return toast(STR.needNodes);
    exportJson(state, "directory-map.json");
    toast(STR.jsonSaved);
  });

  const fileInput = $("file-input");
  $("btn-load").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      replaceAll(data);
      board.renderAll();
      toast(STR.jsonLoaded);
    } catch (err) {
      console.error("JSON読み込みエラー:", err);
      toast(STR.jsonError);
    }
    fileInput.value = "";
  });

  // ---- テンプレ（ディレクトリツリーの例）----
  $("btn-template").addEventListener("click", () => {
    if (state.items.length || state.connectors.length) {
      if (!confirm(STR.confirmSample)) return;
    }
    loadDirectoryTemplate();
    board.renderAll();
    board.fitView();
    toast(STR.sampleLoaded);
  });

  $("btn-clear").addEventListener("click", () => {
    if (!state.items.length && !state.connectors.length) return;
    if (!confirm(STR.confirmClear)) return;
    clearAll();
    board.renderAll();
    toast(STR.cleared);
  });

  // ---- キーボードショートカット ----
  window.addEventListener("keydown", (e) => {
    // テキスト編集中・入力欄では無効化
    const editing =
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName));
    if (editing) return;

    // コピー / 切り取り / 貼り付け / 複製 / 全選択（⌘ or Ctrl）
    if (e.metaKey || e.ctrlKey) {
      const mk = e.key.toLowerCase();
      if (mk === "c") {
        if (board.copySelection()) {
          e.preventDefault();
          toast(STR.copied);
        }
        return;
      }
      if (mk === "x") {
        if (board.cutSelection()) {
          e.preventDefault();
          toast(STR.cut);
        }
        return;
      }
      if (mk === "v") {
        const n = board.pasteClipboard();
        if (n) {
          e.preventDefault();
          toast(STR.pasted(n));
        }
        return;
      }
      if (mk === "d") {
        const n = board.duplicateSelection();
        if (n) {
          e.preventDefault();
          toast(STR.duplicated(n));
        }
        return;
      }
      if (mk === "a") {
        e.preventDefault();
        board.selectAll();
        return;
      }
      return; // その他の⌘/Ctrl系はツール切替させない
    }

    const key = e.key.toLowerCase();
    if (KEY_TO_TOOL[key]) {
      currentTool = KEY_TO_TOOL[key];
      board.setTool(currentTool);
      syncToolButtons(currentTool);
      return;
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteSelected();
      return;
    }
    if (e.key === "Escape") {
      clearSelection();
      currentTool = "select";
      board.setTool("select");
      syncToolButtons("select");
    }
  });

  // 初期ツール表示
  board.setTool("select");
  syncToolButtons("select");

  // 初回訪問（保存データなし）は、サンプルを画面中央に表示
  if (!hasSaved()) {
    loadDirectoryTemplate();
    board.renderAll();
    requestAnimationFrame(() => board.fitView());
  }
}

// ---- ディレクトリツリーのスターターテンプレ ----
function loadDirectoryTemplate() {
  clearAll();
  // ツリーは親→子の片方向が自然。現在の既定に関わらず片方向で生成する
  const prevEnds = state.wireEnds;
  state.wireEnds = "end";
  const FOLDER = "auto"; // テーマ既定色（ライト/ダーク追従）
  const FILE = "auto";
  const mk = (type, x, y, text, color) => {
    const size = type === "folder" ? { w: 196, h: 60 } : { w: 184, h: 52 };
    const id = nextId("n");
    addItem({ id, type, x, y, w: size.w, h: size.h, text, color });
    return id;
  };
  // root
  const root = mk("folder", 360, 40, "my-app", FOLDER);
  // 第1階層
  const src = mk("folder", 150, 200, "src", FOLDER);
  const pub = mk("folder", 420, 200, "public", FOLDER);
  const pkg = mk("file", 680, 204, "package.json", FILE);
  // 第2階層
  const indexTsx = mk("file", 30, 360, "index.tsx", FILE);
  const components = mk("folder", 250, 356, "components", FOLDER);
  // 第3階層
  const button = mk("file", 250, 500, "Button.tsx", FILE);

  addConnector(root, src);
  addConnector(root, pub);
  addConnector(root, pkg);
  addConnector(src, indexTsx);
  addConnector(src, components);
  addConnector(components, button);
  state.wireEnds = prevEnds; // 既定を元に戻す
}

// ---- トースト ----
let toastTimer = null;
function toast(msg) {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
