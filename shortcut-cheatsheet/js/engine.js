// ショートカット チートシート 共通エンジン
// アプリページから initApp({ appId, categories, templates }) で起動する。
// データ（categories）とテンプレ（templates）はアプリごとに差し替える。

const FAV = "__fav"; // お気に入り（マイ一覧）の擬似カテゴリID
const CLEAR = "__clear"; // テンプレ選択肢「空にする」のID
const CUSTOM = "custom"; // 自分で登録したショートカットの擬似カテゴリID
const CUSTOM_CAT = { id: CUSTOM, name: "カスタム" };

const MAC = { mod: "⌘", alt: "⌥", shift: "⇧", Delete: "⌫", Enter: "↩", Tab: "Tab", Space: "Space", Esc: "Esc", click: "Click" };
const WIN = { mod: "Ctrl", alt: "Alt", shift: "Shift", Delete: "Del", Enter: "Enter", Tab: "Tab", Space: "Space", Esc: "Esc", click: "Click" };

// UI文言（デフォルト日本語）。EN等はページから strings で上書きする。
const DEFAULT_STRINGS = {
  favRemove: "マイ一覧から外す",
  favAdd: "マイ一覧に追加",
  editTitle: "編集",
  delTitle: "削除",
  catCustomOption: "カスタム（自分で登録）",
  tplClearOption: "空にする（お気に入りをクリア）",
  emptySelect: '左メニューの「<span class="star">★</span> マイ一覧」かカテゴリを選ぶと、ここにショートカットが表示されます。',
  emptyCustom: "「＋ ショートカットを登録」から、このアプリの自分のショートカットを追加できます。",
  emptyFav: '各ショートカットの <span class="star">☆</span> を押すと、ここに自分専用のショートカット一覧ができます。追加後はドラッグで好きな順に並べ替えられます。',
  emptyGeneric: "項目がありません",
  noMatch: (q) => `「${q}」に一致するショートカットはありません`,
  modalTitleAdd: "ショートカットを登録",
  modalTitleEdit: "ショートカットを編集",
  modalLabelName: "機能名",
  modalNamePlaceholder: "例：選択範囲をぼかす",
  modalKeyLabel: "キー",
  modalCapture: "キーを押して取得",
  modalCapturing: "キーを押してください…",
  modalKeyEmpty: "（キー未設定）",
  modalKeyPlaceholder: "キー（例: K, F5, [ ）",
  modalCancel: "キャンセル",
  modalSave: "登録",
  emptyFavAlert: "マイ一覧が空です。★でショートカットを追加してから書き出してください。",
  exportTitleSuffix: "ショートカット マイ一覧",
  exportSubtitle: (count, os) => `${count} 件 ・ ${os === "mac" ? "Mac" : "Windows"} 表記`,
  exportFooter: "CodeQuest.work / shortcut-cheatsheet",
  tplOptionFormat: (name, desc) => `${name}（${desc}）`,
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const detectOS = () =>
  /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? "mac" : "win";

// 入力キーをトークンへ正規化
const normalizeKey = (k) => {
  if (k === " ") return "Space";
  const map = {
    ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓",
    Backspace: "Delete", Delete: "Delete", Enter: "Enter", Tab: "Tab",
  };
  if (map[k]) return map[k];
  return k.length === 1 ? k.toUpperCase() : k; // F5 などはそのまま
};

export function initApp({ appId, appName, categories, templates, strings }) {
  if (!appId || !Array.isArray(categories)) {
    console.error("initApp: appId と categories は必須です");
    return;
  }
  const displayName = appName || appId;
  const t = Object.assign({}, DEFAULT_STRINGS, strings || {});
  const tpls = Array.isArray(templates) ? templates : [];
  const STORAGE_KEY = `sc:${appId}:v1`;
  let customSeq = 0;

  // ---- 安定ID（キー組合せ）。'|'区切り（'|'はキートークンに存在しない）----
  // お気に入り/並び順はこの slug で保存するため、データの並べ替え・挿入・削除に強い。
  const slugOf = (item) => item.keys.join("|");

  // カテゴリ内で参照(slug or 旧index)から item を引く（slug優先・旧index形式も移行解決）
  const itemByRef = (cat, ref) => {
    const r = String(ref);
    const bySlug = cat.items.find((it) => slugOf(it) === r);
    if (bySlug) return bySlug;
    if (/^\d+$/.test(r)) {
      const idx = Number(r);
      if (idx >= 0 && idx < cat.items.length) return cat.items[idx]; // 旧 'catId:idx' 形式の移行
    }
    return null;
  };

  // ---- 複合キー解決：'catId:slug' / 'custom:id'（旧 'catId:idx' も移行）→ 該当アイテム ----
  const resolveKey = (key) => {
    if (typeof key !== "string") return null;
    if (key.startsWith("custom:")) {
      const id = key.slice(7);
      const item = state.custom.find((c) => c.id === id);
      return item ? { key, cat: CUSTOM_CAT, item, custom: true } : null;
    }
    const i = key.indexOf(":");
    if (i < 0) return null;
    const cat = categories.find((c) => c.id === key.slice(0, i));
    if (!cat) return null;
    const item = itemByRef(cat, key.slice(i + 1));
    if (!item) return null;
    return { key: `${cat.id}:${slugOf(item)}`, cat, item, custom: false }; // 正規化キーを返す
  };

  // ---- 状態管理（OS・並び順・お気に入り・カスタム）----
  const defaultOrder = () => {
    const order = {};
    for (const cat of categories) order[cat.id] = cat.items.map(slugOf);
    return order;
  };

  // 保存済みの並び順を slug へ正規化（旧index移行）＋新規項目を末尾追加
  const mergeOrder = (saved) => {
    const base = defaultOrder();
    if (!saved || typeof saved !== "object") return base;
    const merged = {};
    for (const cat of categories) {
      const savedArr = Array.isArray(saved[cat.id]) ? saved[cat.id] : [];
      const known = [];
      const seen = new Set();
      for (const ref of savedArr) {
        const item = itemByRef(cat, ref);
        if (!item) continue;
        const s = slugOf(item);
        if (!seen.has(s)) {
          seen.add(s);
          known.push(s);
        }
      }
      const missing = base[cat.id].filter((s) => !seen.has(s));
      merged[cat.id] = [...known, ...missing];
    }
    return merged;
  };

  // 保存済みカスタムを健全化（id/label/keys が揃ったものだけ）
  const validCustom = (arr) => {
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seen = new Set();
    for (const c of arr) {
      if (!c || typeof c.id !== "string" || seen.has(c.id)) continue;
      if (typeof c.label !== "string" || !c.label.trim()) continue;
      if (!Array.isArray(c.keys) || !c.keys.length) continue;
      seen.add(c.id);
      out.push({ id: c.id, label: c.label, keys: c.keys.map(String) });
    }
    return out;
  };

  // 保存済みお気に入りを slug へ正規化（旧index移行）し、現存するものだけ順序保持で残す
  const validFavorites = (favs, custom) => {
    if (!Array.isArray(favs)) return [];
    const customIds = new Set(custom.map((c) => c.id));
    const out = [];
    const seen = new Set();
    for (const k of favs) {
      if (typeof k !== "string") continue;
      let norm = null;
      if (k.startsWith("custom:")) {
        if (customIds.has(k.slice(7))) norm = k;
      } else {
        const i = k.indexOf(":");
        if (i >= 0) {
          const cat = categories.find((c) => c.id === k.slice(0, i));
          const item = cat && itemByRef(cat, k.slice(i + 1));
          if (item) norm = `${cat.id}:${slugOf(item)}`;
        }
      }
      if (norm && !seen.has(norm)) {
        seen.add(norm);
        out.push(norm);
      }
    }
    return out;
  };

  const loadState = () => {
    const fresh = () => ({ os: detectOS(), order: defaultOrder(), favorites: [], custom: [] });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fresh();
      const parsed = JSON.parse(raw);
      const custom = validCustom(parsed.custom);
      return {
        os: parsed.os === "mac" || parsed.os === "win" ? parsed.os : detectOS(),
        order: mergeOrder(parsed.order),
        custom,
        favorites: validFavorites(parsed.favorites, custom),
      };
    } catch (error) {
      console.error("状態の読み込みに失敗しました:", error);
      return fresh();
    }
  };

  const saveState = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("状態の保存に失敗しました:", error);
    }
  };

  let state = loadState();
  let activeCat = FAV; // 起動時はマイ一覧を表示（空ならガイドが出る）
  let query = "";

  // ---- キー表示の整形 ----
  const renderKeys = (keys) => {
    const map = state.os === "mac" ? MAC : WIN;
    return keys
      .map((k) => `<kbd class="key">${escapeHtml(map[k] ?? k)}</kbd>`)
      .join('<span class="plus">+</span>');
  };

  // ---- DOM参照 ----
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const favBtn = document.getElementById("favBtn");
  const favBadge = document.getElementById("favBadge");
  const catSelect = document.getElementById("catSelect");
  const tplSelect = document.getElementById("tplSelect");
  const osToggle = document.getElementById("osToggle");
  const resetBtn = document.getElementById("resetBtn");
  const addCustomBtn = document.getElementById("addCustomBtn");
  const printBtn = document.getElementById("printBtn");
  const pngBtn = document.getElementById("pngBtn");

  // ---- アクティブな並び替え対象リスト ----
  const getActiveList = () => {
    if (activeCat === FAV) return state.favorites;
    if (activeCat === CUSTOM) return state.custom.map((c) => `custom:${c.id}`);
    return state.order[activeCat];
  };
  const setActiveList = (list) => {
    if (activeCat === FAV) {
      state = { ...state, favorites: list };
    } else if (activeCat === CUSTOM) {
      const reordered = list.map((k) => state.custom.find((c) => `custom:${c.id}` === k)).filter(Boolean);
      state = { ...state, custom: reordered };
    } else {
      state = { ...state, order: { ...state.order, [activeCat]: list } };
    }
  };

  // ---- サイドナビの状態反映 ----
  const renderNav = () => {
    const favCount = state.favorites.length;
    favBtn.classList.toggle("is-active", activeCat === FAV);
    favBadge.textContent = favCount;
    favBadge.style.display = favCount ? "" : "none";
    catSelect.value = activeCat && activeCat !== FAV ? activeCat : "";
  };

  // 初期化：カテゴリ・テンプレのoptionを一度だけ生成
  const buildSidebar = () => {
    catSelect.insertAdjacentHTML(
      "beforeend",
      categories.map((cat) => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join("") +
        `<option value="${CUSTOM}">${escapeHtml(t.catCustomOption)}</option>`
    );
    tplSelect.insertAdjacentHTML(
      "beforeend",
      tpls
        .map((tpl) => `<option value="${tpl.id}">${escapeHtml(t.tplOptionFormat(tpl.name, tpl.desc))}</option>`)
        .join("") + `<option value="${CLEAR}">${escapeHtml(t.tplClearOption)}</option>`
    );
  };

  // ---- カード描画 ----
  const cardHtml = ({ key, item, dragId, custom }) => {
    const isFav = state.favorites.includes(key);
    const id = custom ? key.slice(7) : "";
    const actions = custom
      ? `<span class="card-actions">
           <button type="button" class="card-edit" data-edit="${escapeHtml(id)}" title="${t.editTitle}">✎</button>
           <button type="button" class="card-del" data-del="${escapeHtml(id)}" title="${t.delTitle}">×</button>
         </span>`
      : "";
    return `
      <li class="card${custom ? " is-custom" : ""}" draggable="true" data-id="${escapeHtml(dragId)}">
        <div class="card-top">
          <span class="drag-handle" aria-hidden="true">⋮⋮</span>
          <span class="combo">${renderKeys(item.keys)}</span>
          <span class="card-top-actions">
            <button type="button" class="fav-btn${isFav ? " is-fav" : ""}" data-fav="${escapeHtml(key)}" aria-pressed="${isFav}" title="${isFav ? t.favRemove : t.favAdd}">${isFav ? "★" : "☆"}</button>
            ${actions}
          </span>
        </div>
        <span class="label">${escapeHtml(item.label)}</span>
      </li>`;
  };

  const renderGrid = () => {
    const q = query.trim().toLowerCase();
    let entries;

    if (activeCat === FAV) {
      entries = state.favorites
        .map(resolveKey)
        .filter(Boolean)
        .map((r) => ({ key: r.key, item: r.item, dragId: r.key, custom: r.custom }));
    } else if (activeCat === CUSTOM) {
      entries = state.custom.map((c) => ({ key: `custom:${c.id}`, item: c, dragId: `custom:${c.id}`, custom: true }));
    } else {
      const cat = categories.find((c) => c.id === activeCat);
      if (!cat) {
        grid.innerHTML = `<li class="empty">${t.emptySelect}</li>`;
        return;
      }
      entries = state.order[cat.id]
        .map((slug) => {
          const item = cat.items.find((it) => slugOf(it) === slug);
          return item ? { key: `${cat.id}:${slug}`, item, dragId: slug, custom: false } : null;
        })
        .filter(Boolean);
    }

    const filtered = entries.filter(({ item }) => !q || item.label.toLowerCase().includes(q));

    if (!filtered.length) {
      let msg;
      if (q) msg = t.noMatch(escapeHtml(query));
      else if (activeCat === CUSTOM) msg = t.emptyCustom;
      else if (activeCat === FAV) msg = t.emptyFav;
      else msg = t.emptyGeneric;
      grid.innerHTML = `<li class="empty">${msg}</li>`;
      return;
    }
    grid.innerHTML = filtered.map(cardHtml).join("");
  };

  const render = () => {
    renderNav();
    renderGrid();
    osToggle.querySelectorAll(".os-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.os === state.os));
  };

  // ---- お気に入りトグル ----
  const toggleFav = (key) => {
    if (!resolveKey(key)) return;
    const has = state.favorites.includes(key);
    const favorites = has ? state.favorites.filter((k) => k !== key) : [...state.favorites, key];
    state = { ...state, favorites };
    saveState();
    renderNav();
    renderGrid();
  };

  // ---- テンプレ適用（マイ一覧に追加・重複スキップ）----
  const keyByLabel = (catId, label) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return null;
    const item = cat.items.find((it) => it.label === label);
    return item ? `${catId}:${slugOf(item)}` : null;
  };

  const applyTemplate = (tplId) => {
    const tpl = tpls.find((t) => t.id === tplId);
    if (!tpl) return;
    const keys = tpl.items.map((it) => keyByLabel(it.cat, it.label)).filter(Boolean);
    const merged = [...state.favorites];
    for (const k of keys) if (!merged.includes(k)) merged.push(k);
    state = { ...state, favorites: merged };
    activeCat = FAV;
    saveState();
    render();
  };

  const clearFavorites = () => {
    state = { ...state, favorites: [] };
    activeCat = FAV;
    saveState();
    render();
  };

  // ---- カスタムショートカット 登録/編集/削除 ----
  const genCustomId = () => `c${Date.now().toString(36)}${(customSeq++).toString(36)}`;

  const saveCustom = ({ id, label, keys }) => {
    if (id) {
      // 編集（マイ一覧への登録状態はそのまま維持）
      state = { ...state, custom: state.custom.map((c) => (c.id === id ? { ...c, label, keys } : c)) };
      activeCat = CUSTOM;
    } else {
      // 新規：自動でマイ一覧（お気に入り）にも登録する
      const newId = genCustomId();
      const favKey = `custom:${newId}`;
      state = {
        ...state,
        custom: [...state.custom, { id: newId, label, keys }],
        favorites: state.favorites.includes(favKey) ? state.favorites : [...state.favorites, favKey],
      };
      activeCat = FAV; // 登録結果をマイ一覧で確認
    }
    saveState();
    render();
  };

  const deleteCustom = (id) => {
    const favKey = `custom:${id}`;
    state = {
      ...state,
      custom: state.custom.filter((c) => c.id !== id),
      favorites: state.favorites.filter((k) => k !== favKey),
    };
    saveState();
    render();
  };

  // ---- 書き出し（マイ一覧のチートシート）----
  // マイ一覧を解決して {keys, label} の配列にする
  const favItems = () =>
    state.favorites
      .map(resolveKey)
      .filter(Boolean)
      .map((r) => ({ keys: r.item.keys, label: r.item.label }));

  const printEl = document.createElement("div");
  printEl.id = "scPrint";
  document.body.appendChild(printEl);

  // 印刷／PDF（印刷ダイアログから「PDFで保存」も可）
  const printFavorites = () => {
    const items = favItems();
    if (!items.length) {
      window.alert(t.emptyFavAlert);
      return;
    }
    const map = state.os === "mac" ? MAC : WIN;
    const rows = items
      .map(
        (it) =>
          `<div class="pr-row"><span class="pr-keys">${it.keys
            .map((k) => `<kbd class="pr-key">${escapeHtml(map[k] ?? k)}</kbd>`)
            .join('<span class="pr-plus">+</span>')}</span><span class="pr-label">${escapeHtml(it.label)}</span></div>`
      )
      .join("");
    printEl.innerHTML =
      `<h2 class="pr-title">${escapeHtml(displayName)} ${escapeHtml(t.exportTitleSuffix)}</h2>` +
      `<div class="pr-sub">${escapeHtml(t.exportSubtitle(items.length, state.os))}</div>` +
      `<div class="pr-list">${rows}</div>` +
      `<div class="pr-foot">${escapeHtml(t.exportFooter)}</div>`;
    window.print();
  };

  // 画像（PNG）— 自前 canvas 描画（外部ライブラリ不要）
  const exportPng = () => {
    const items = favItems();
    if (!items.length) {
      window.alert(t.emptyFavAlert);
      return;
    }
    const map = state.os === "mac" ? MAC : WIN;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = 760;
    const padX = 32;
    const padTop = 28;
    const titleH = 60;
    const rowH = 40;
    const keyH = 28;
    const footH = 36;
    const H = padTop + titleH + items.length * rowH + footH;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const fontSans = (w, s) => `${w} ${s}px -apple-system, "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif`;
    const fontKey = '700 14px ui-monospace, Menlo, Consolas, monospace';
    const keyText = (k) => map[k] ?? k;
    const plusW = 14;

    // 背景
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // タイトル
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#111827";
    ctx.font = fontSans(700, 22);
    ctx.fillText(`${displayName} ${t.exportTitleSuffix}`, padX, padTop + 22);
    ctx.fillStyle = "#6b7280";
    ctx.font = fontSans(400, 14);
    ctx.fillText(t.exportSubtitle(items.length, state.os), padX, padTop + 44);

    // キー列の幅を測ってラベル位置を揃える
    ctx.font = fontKey;
    const keyW = (k) => Math.max(keyH, ctx.measureText(keyText(k)).width + 16);
    const comboW = (keys) => keys.reduce((w, k, i) => w + keyW(k) + (i ? plusW : 0), 0);
    let keyCol = 0;
    for (const it of items) keyCol = Math.max(keyCol, comboW(it.keys));
    const labelX = padX + keyCol + 20;

    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    let y = padTop + titleH;
    for (const it of items) {
      const cy = y + rowH / 2;
      let x = padX;
      ctx.font = fontKey;
      it.keys.forEach((k, i) => {
        if (i) {
          ctx.fillStyle = "#9ca3af";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("+", x + plusW / 2, cy);
          x += plusW;
        }
        const w = keyW(k);
        ctx.fillStyle = "#f3f4f6";
        roundRect(x, cy - keyH / 2, w, keyH, 6);
        ctx.fill();
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 1;
        roundRect(x + 0.5, cy - keyH / 2 + 0.5, w - 1, keyH - 1, 6);
        ctx.stroke();
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(keyText(k), x + w / 2, cy);
        x += w;
      });
      ctx.fillStyle = "#111827";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = fontSans(400, 15);
      ctx.fillText(it.label, labelX, cy);

      ctx.strokeStyle = "#eef0f2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, y + rowH - 0.5);
      ctx.lineTo(W - padX, y + rowH - 0.5);
      ctx.stroke();
      y += rowH;
    }

    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = fontSans(400, 12);
    ctx.fillText(t.exportFooter, padX, H - 14);

    // 同期の toDataURL を使う（toBlob は非同期でユーザー操作の文脈が切れ、
    // 一部ブラウザでダウンロードがブロックされるため）。拡張子 .png は維持。
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appId}-my-shortcuts.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---- ドラッグ＆ドロップ並べ替え ----
  let dragId = null;

  grid.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    dragId = card.dataset.id;
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  grid.addEventListener("dragend", (e) => {
    e.target.closest(".card")?.classList.remove("dragging");
    grid.querySelectorAll(".card.over").forEach((c) => c.classList.remove("over"));
    dragId = null;
  });

  grid.addEventListener("dragover", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    grid.querySelectorAll(".card.over").forEach((c) => c.classList.remove("over"));
    if (card && card.dataset.id !== dragId) card.classList.add("over");
  });

  grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const target = e.target.closest(".card");
    if (!target || dragId === null || target.dataset.id === dragId) return;

    const list = [...getActiveList()];
    const from = list.findIndex((x) => String(x) === dragId);
    const to = list.findIndex((x) => String(x) === target.dataset.id);
    if (from < 0 || to < 0) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setActiveList(list);
    saveState();
    renderGrid();

    // ドロップ確定の軽いアニメーション
    const sel = window.CSS && CSS.escape ? CSS.escape(dragId) : dragId;
    const movedCard = grid.querySelector(`.card[data-id="${sel}"]`);
    if (movedCard) {
      movedCard.classList.add("just-dropped");
      movedCard.addEventListener("animationend", () => movedCard.classList.remove("just-dropped"), { once: true });
    }
  });

  // ---- イベント ----
  favBtn.addEventListener("click", () => {
    activeCat = FAV;
    render();
  });

  catSelect.addEventListener("change", (e) => {
    if (!e.target.value) return;
    activeCat = e.target.value;
    render();
  });

  tplSelect.addEventListener("change", (e) => {
    const id = e.target.value;
    if (!id) return;
    if (id === CLEAR) clearFavorites();
    else applyTemplate(id);
    e.target.value = "";
  });

  grid.addEventListener("click", (e) => {
    const del = e.target.closest(".card-del");
    if (del) {
      deleteCustom(del.dataset.del);
      return;
    }
    const edit = e.target.closest(".card-edit");
    if (edit) {
      const c = state.custom.find((x) => x.id === edit.dataset.edit);
      if (c) openModal(c);
      return;
    }
    const fav = e.target.closest(".fav-btn");
    if (fav) toggleFav(fav.dataset.fav);
  });

  osToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".os-btn");
    if (!btn) return;
    state = { ...state, os: btn.dataset.os };
    saveState();
    render();
  });

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderGrid();
  });

  resetBtn.addEventListener("click", () => {
    // 全初期値に戻す：並び順・お気に入りをクリア（カスタム登録とOS設定は維持）
    state = { ...state, order: defaultOrder(), favorites: [] };
    activeCat = null;
    saveState();
    render();
  });

  // ---- 登録モーダル ----
  const modal = buildModal();
  const elModalTitle = modal.querySelector("#scModalTitle");
  const elLabel = modal.querySelector("#scLabel");
  const elPreview = modal.querySelector("#scKeyPreview");
  const elCapture = modal.querySelector("#scCapture");
  const elKeyChar = modal.querySelector("#scKeyChar");

  let editingId = null;
  let capturing = false;
  const pending = { mod: false, alt: false, shift: false, key: "" };

  const pendingTokens = () => {
    const t = [];
    if (pending.mod) t.push("mod");
    if (pending.alt) t.push("alt");
    if (pending.shift) t.push("shift");
    if (pending.key) t.push(pending.key);
    return t;
  };

  const syncModalUI = () => {
    const tokens = pendingTokens();
    elPreview.innerHTML = tokens.length ? renderKeys(tokens) : `<span class="sc-key-empty">${escapeHtml(t.modalKeyEmpty)}</span>`;
    modal.querySelectorAll(".modk").forEach((b) => b.classList.toggle("is-active", pending[b.dataset.mod]));
    elKeyChar.value = pending.key;
    elCapture.classList.toggle("is-capturing", capturing);
    elCapture.textContent = capturing ? t.modalCapturing : t.modalCapture;
  };

  const resetPending = () => {
    pending.mod = pending.alt = pending.shift = false;
    pending.key = "";
    capturing = false;
  };

  const openModal = (custom) => {
    editingId = custom ? custom.id : null;
    resetPending();
    if (custom) {
      elLabel.value = custom.label;
      for (const k of custom.keys) {
        if (k === "mod" || k === "alt" || k === "shift") pending[k] = true;
        else pending.key = k;
      }
    } else {
      elLabel.value = "";
    }
    elModalTitle.textContent = custom ? t.modalTitleEdit : t.modalTitleAdd;
    modal.hidden = false;
    syncModalUI();
    elLabel.focus();
  };

  const closeModal = () => {
    capturing = false;
    modal.hidden = true;
  };

  const trySave = () => {
    const label = elLabel.value.trim();
    if (!label) {
      elLabel.focus();
      return;
    }
    if (!pending.key) {
      elKeyChar.focus();
      return;
    }
    saveCustom({ id: editingId, label, keys: pendingTokens() });
    closeModal();
  };

  if (addCustomBtn) addCustomBtn.addEventListener("click", () => openModal(null));
  if (printBtn) printBtn.addEventListener("click", printFavorites);
  if (pngBtn) pngBtn.addEventListener("click", exportPng);

  modal.querySelector("#scCancel").addEventListener("click", closeModal);
  modal.querySelector("#scSave").addEventListener("click", trySave);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  modal.querySelectorAll(".modk").forEach((b) =>
    b.addEventListener("click", () => {
      pending[b.dataset.mod] = !pending[b.dataset.mod];
      syncModalUI();
    })
  );

  elKeyChar.addEventListener("input", () => {
    const v = elKeyChar.value.trim();
    pending.key = v.length === 1 ? v.toUpperCase() : v;
    // プレビューだけ更新（入力欄の値は触らない）
    const tokens = pendingTokens();
    elPreview.innerHTML = tokens.length ? renderKeys(tokens) : `<span class="sc-key-empty">${escapeHtml(t.modalKeyEmpty)}</span>`;
  });

  elCapture.addEventListener("click", () => {
    capturing = !capturing;
    syncModalUI();
  });

  // キャプチャ：モーダル表示中にキー押下を捕捉
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (!capturing) {
      if (e.key === "Escape") closeModal();
      return;
    }
    e.preventDefault();
    if (e.key === "Escape") {
      capturing = false;
      syncModalUI();
      return;
    }
    if (["Meta", "Control", "Alt", "Shift"].includes(e.key)) return; // 修飾キー単体は待つ
    pending.mod = e.metaKey || e.ctrlKey;
    pending.alt = e.altKey;
    pending.shift = e.shiftKey;
    pending.key = normalizeKey(e.key);
    capturing = false;
    syncModalUI();
  });

  buildSidebar();
  render();
  saveState(); // 起動時に slug 正規化済みの状態を保存（旧index形式からの移行を確定）

  // モーダルDOMを生成して body に挿入
  function buildModal() {
    const el = document.createElement("div");
    el.className = "sc-modal";
    el.id = "scModal";
    el.hidden = true;
    el.innerHTML = `
      <div class="sc-modal-card" role="dialog" aria-modal="true" aria-labelledby="scModalTitle">
        <h3 id="scModalTitle">${escapeHtml(t.modalTitleAdd)}</h3>
        <label class="sc-field">
          <span>${escapeHtml(t.modalLabelName)}</span>
          <input id="scLabel" type="text" placeholder="${escapeHtml(t.modalNamePlaceholder)}" autocomplete="off" />
        </label>
        <div class="sc-field">
          <span>${escapeHtml(t.modalKeyLabel)}</span>
          <div id="scKeyPreview" class="sc-key-preview"></div>
          <button type="button" id="scCapture" class="sc-capture">${escapeHtml(t.modalCapture)}</button>
          <div class="sc-manual">
            <button type="button" class="modk" data-mod="mod">⌘ / Ctrl</button>
            <button type="button" class="modk" data-mod="alt">⌥ / Alt</button>
            <button type="button" class="modk" data-mod="shift">⇧ / Shift</button>
            <input id="scKeyChar" type="text" maxlength="6" placeholder="${escapeHtml(t.modalKeyPlaceholder)}" autocomplete="off" />
          </div>
        </div>
        <div class="sc-modal-actions">
          <button type="button" id="scCancel" class="sc-btn">${escapeHtml(t.modalCancel)}</button>
          <button type="button" id="scSave" class="sc-btn primary">${escapeHtml(t.modalSave)}</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    return el;
  }
}
