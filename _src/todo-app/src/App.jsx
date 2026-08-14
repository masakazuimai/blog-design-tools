import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoForm from "./components/TodoForm";
import { STATUSES, loadTodos, saveTodos } from "./storage";

const LANE_LABELS = {
  idea: "アイデア",
  inProgress: "進行中",
  done: "完了",
};

const App = () => {
  const [todos, setTodos] = useState(loadTodos);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  // 変更のたびにブラウザへ保存する。閉じても次に開いたとき続きから使える
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (task) => {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: task, status: "idea" }]);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setEditingTodo((current) => (current === id ? null : current));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text: text || todo.text } : todo)));
    setEditingTodo(null);
  };

  /**
   * レーン単位の並びを保ったまま入れ替える。
   * 同じレーン内なら並べ替え、別レーンなら status を変えて移動先の位置へ差し込む。
   */
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setTodos((prev) => {
      const moved = prev.find((todo) => todo.id === draggableId);
      if (!moved) return prev;

      const lanes = Object.fromEntries(STATUSES.map((status) => [status, prev.filter((todo) => todo.status === status)]));

      lanes[source.droppableId] = lanes[source.droppableId].filter((todo) => todo.id !== draggableId);
      lanes[destination.droppableId] = [
        ...lanes[destination.droppableId].slice(0, destination.index),
        { ...moved, status: destination.droppableId },
        ...lanes[destination.droppableId].slice(destination.index),
      ];

      return STATUSES.flatMap((status) => lanes[status]);
    });
  };

  return (
    <div className="app">
      <TodoForm addTodo={addTodo} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          {STATUSES.map((status) => {
            const laneTodos = todos.filter((todo) => todo.status === status);
            return (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <section
                    className={`todo-list${snapshot.isDraggingOver ? " is-dragging-over" : ""}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h2 className="todo-list-title">
                      {LANE_LABELS[status]}
                      <span className="todo-list-count">{laneTodos.length}</span>
                    </h2>

                    {laneTodos.map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(dragProvided) => (
                          <div className="todo-item" ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                            <div className="todo-item-header">
                              <div className="drag-handle" {...dragProvided.dragHandleProps} aria-label="ドラッグして移動">
                                ⋮⋮
                              </div>
                              <div className="todo-item-text">{todo.text}</div>
                            </div>

                            <div className="todo-item-buttons">
                              {editingTodo === todo.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit(todo.id);
                                      if (e.key === "Escape") setEditingTodo(null);
                                    }}
                                    aria-label="タスクを編集"
                                    autoFocus
                                  />
                                  <button className="save-btn" onClick={() => saveEdit(todo.id)}>
                                    保存
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="edit-btn" onClick={() => startEditing(todo)}>
                                    編集
                                  </button>
                                  <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                                    削除
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {laneTodos.length === 0 && <p className="todo-list-empty">ここへドラッグ</p>}
                    {provided.placeholder}
                  </section>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
