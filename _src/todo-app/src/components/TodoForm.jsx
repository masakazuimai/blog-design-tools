import { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = task.trim();
    if (!text) return;
    addTodo(text);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="新しいタスクを追加"
        aria-label="新しいタスク"
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default TodoForm;
