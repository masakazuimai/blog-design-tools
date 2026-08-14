// 型定義
type Task = {
  id: number;
  text: string;
  done: boolean;
};

// DOM要素の取得
const taskInput = document.getElementById("taskInput") as HTMLTextAreaElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

// タスク状態
let tasks: Task[] = [];
let nextId = 1;

// ストレージキー
const STORAGE_KEY = "checklist-tasks";

// タスクをローカルストレージに保存
function saveTasks(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ローカルストレージからタスクを読み込む
function loadTasks(): void {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    tasks = JSON.parse(data);
    // id重複防止のために最大id＋1を設定
    const maxId = Math.max(...tasks.map((t) => t.id), 0);
    nextId = maxId + 1;
  }
}

// タスク追加
function addTask(): void {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask: Task = {
    id: nextId++,
    text,
    done: false,
  };

  tasks.push(newTask);
  saveTasks(); // ✅ 保存
  renderTasks();

  taskInput.value = "";
  taskInput.blur();
  taskInput.focus();
  setTimeout(() => {
    taskInput.value = "";
  }, 0);
}

// タスクリスト表示
function renderTasks(): void {
  taskList.innerHTML = "";

  const sortedTasks = [...tasks.filter((t) => !t.done).reverse(), ...tasks.filter((t) => t.done).reverse()];

  sortedTasks.forEach((task) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
      }
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) {
      span.classList.add("done");
      li.classList.add("done");
    }

    // ✅ 編集ボタン
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.addEventListener("click", () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.classList.add("edit-input");

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            tasks[index].text = input.value.trim() || task.text;
            saveTasks();
            renderTasks();
          } else if (e.key === "Escape") {
            renderTasks(); // キャンセル
          }
        });

        li.replaceChild(input, span);
        input.focus();
      }
    });

    // ✅ 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "del";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // ✅ DOM構成
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn); //
    li.appendChild(deleteBtn); //
    taskList.appendChild(li);
  });
}

// ボタンクリックで追加
addBtn.addEventListener("click", () => {
  addTask();
});

// Enter / Shift+Enter 対応
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.shiftKey) {
      e.preventDefault();
      const start = taskInput.selectionStart ?? 0;
      const end = taskInput.selectionEnd ?? 0;
      const value = taskInput.value;
      taskInput.value = value.slice(0, start) + "\n" + value.slice(end);
      taskInput.setSelectionRange(start + 1, start + 1);
    } else {
      e.preventDefault();
      addTask();
    }
  }
});

// ✅ ページ読み込み時に復元
window.addEventListener("load", () => {
  loadTasks();
  renderTasks();
});
