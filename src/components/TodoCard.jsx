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

  return (
    <div className="card todo-item">
      {isEditing ? (
        <input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p>{todo.input}</p>
      )}

      <div className="todo-buttons">
        {isEditing ? (
          <>
            <button
              onClick={() => {
                if (!editedText.trim()) return;
                handleEditTodo(todoIndex, editedText);
                setIsEditing(false);
              }}
            >
              <h6>Save</h6>
            </button>
            <button onClick={() => setIsEditing(false)}>
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