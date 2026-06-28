// ハブ（アプリ選択トップ）のカードをドラッグで並べ替え。順番は localStorage に保存。

const grid = document.getElementById("hubGrid");
if (grid) {
  const STORAGE_KEY = grid.dataset.storage || "sc:hub-order:v1";
  const items = () => [...grid.querySelectorAll(".hub-item")];

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.error("並び順の読み込みに失敗しました:", error);
      return null;
    }
  };

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items().map((li) => li.dataset.app)));
    } catch (error) {
      console.error("並び順の保存に失敗しました:", error);
    }
  };

  // 保存済みの順に並べ替え（未知の新規アプリは末尾に残す）
  const applySaved = () => {
    const saved = load();
    if (!saved) return;
    const map = new Map(items().map((li) => [li.dataset.app, li]));
    const known = saved.filter((app) => map.has(app));
    const rest = items()
      .map((li) => li.dataset.app)
      .filter((app) => !known.includes(app));
    for (const app of [...known, ...rest]) grid.appendChild(map.get(app));
  };

  let dragEl = null;

  grid.addEventListener("dragstart", (e) => {
    const li = e.target.closest(".hub-item");
    if (!li) return;
    dragEl = li;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  grid.addEventListener("dragend", () => {
    dragEl?.classList.remove("dragging");
    items().forEach((li) => li.classList.remove("over"));
    dragEl = null;
  });

  grid.addEventListener("dragover", (e) => {
    e.preventDefault();
    const li = e.target.closest(".hub-item");
    items().forEach((x) => x.classList.remove("over"));
    if (li && li !== dragEl) li.classList.add("over");
  });

  grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const li = e.target.closest(".hub-item");
    if (!li || !dragEl || li === dragEl) return;
    const list = items();
    const from = list.indexOf(dragEl);
    const to = list.indexOf(li);
    const moved = dragEl;
    grid.insertBefore(moved, from < to ? li.nextSibling : li);
    items().forEach((x) => x.classList.remove("over"));

    // ドロップ確定の軽いアニメーション
    moved.classList.add("just-dropped");
    moved.addEventListener("animationend", () => moved.classList.remove("just-dropped"), { once: true });
    save();
  });

  applySaved();
}
