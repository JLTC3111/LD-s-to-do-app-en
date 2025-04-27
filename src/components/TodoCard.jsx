import { useState } from "react";

export function TodoCard(props) {
  const {
    todo,
    handleDeleteTodo,
    todoIndex,
    handleCompleteTodo,
    handleEditTodo,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.input);

  function saveEdit() {
    if (!editedText.trim()) return;
    handleEditTodo(todoIndex, editedText);
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditedText(todo.input);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      saveEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  return (
    <div className="card todo-item">
      {isEditing ? (
        <input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown} // press Enter to save, Esc to cancel
          onBlur={saveEdit}          // click outside to save
          autoFocus
        />
      ) : (
        <p>{todo.input}</p>
      )}

      <div className="todo-buttons">
        {isEditing ? (
          <>
            <button onClick={saveEdit}>
              <h6>Save</h6>
            </button>
            <button onClick={cancelEdit}>
              <h6>Cancel</h6>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleCompleteTodo(todoIndex)}
              disabled={todo.complete}
            >
              <h6>Done</h6>
            </button>
            <button className="delete-button" onClick={() => handleDeleteTodo(todoIndex)}>
              <h6>Delete</h6>
            </button>
            <button onClick={() => setIsEditing(true)}>
              <h6>Edit</h6>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
