const STORAGE_KEY = "codequest-todo-app";

export const STATUSES = ["idea", "inProgress", "done"];

/**
 * localStorage から復元する。
 * 壊れた値・別バージョンの値が入っていても落ちないよう、形の検証まで行う。
 */
export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t) => t && typeof t.id === "string" && typeof t.text === "string" && STATUSES.includes(t.status))
      .map((t) => ({ id: t.id, text: t.text, status: t.status }));
  } catch (error) {
    console.error("保存済みタスクの読み込みに失敗しました:", error);
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // 容量超過やプライベートモードでの書き込み拒否。操作自体は続行させる
    console.error("タスクの保存に失敗しました:", error);
  }
}
