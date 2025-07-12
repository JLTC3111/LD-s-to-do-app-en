import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import soundManager from '../utils/sounds';

export function TodoCard(props) {
  const { todo, todoId, handleDeleteTodo, handleCompleteTodo, handleEditTodo } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.input);

  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  function saveEdit() {
    if (!editedText.trim()) {
      soundManager.playError();
      return;
    }
    handleEditTodo(todoId, editedText);
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditedText(todo.input);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  function handleDelete() {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 40,
      duration: .5,
      ease: "power2.inout",
      onComplete: () => handleDeleteTodo(todoId),
    });
  }

  function handleComplete() {
    gsap.to(cardRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => handleCompleteTodo(todoId),
    });
  }

  function handleEdit() {
    gsap.to(cardRef.current, {
      duration: 0.5,
      ease: "power1.out"
    });
    handleEditTodo(todoId);
  }

  const handleButtonHover = (e) => {
    gsap.to(e.currentTarget, { scale: 1.3, duration: 0.2 });
  };

  const handleButtonLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
  };

  return (
    <div ref={cardRef} className={`card todo-item ${todo.complete ? 'completed-task' : ''}`}>
      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveEdit}
          autoFocus
          rows={Math.max(1, editedText.split('\n').length)}
          style={{
            resize: 'vertical',
            minHeight: '60px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
        />
      ) : (
        <p style={{ textDecoration: todo.complete ? "line-through" : "none" }}>
          {todo.input}
        </p>
      )}

      <div className="todo-buttons">
        {isEditing ? (
          <>
            <button onClick={saveEdit} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>Save</h6>
            </button>
            <button onClick={cancelEdit} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>Cancel</h6>
            </button>
          </>
        ) : (
          <>  
            <button onClick={() => handleComplete(todoId)} disabled={todo.complete} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave} >
            <h6>Done</h6></button>
              
            <button className="delete-button" onClick={() => handleDelete(todoId)} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
            <h6>Delete</h6>
            </button>

            <button onClick={() => setIsEditing(true)} disabled={todo.complete} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>Edit</h6>
            </button>
             
              
          </>
        )}
      </div>
    </div>
  );
}