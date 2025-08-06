import { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useSoundContext } from './SoundProvider';

export function TodoCard(props) {
  const { t } = useTranslation();
  const { playSound } = useSoundContext();
  const { todo, todoId, handleDeleteTodo, handleCompleteTodo, handleEditTodo, setSelectedTab } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.input);

  const cardRef = useRef(null);

  function saveEdit() {
    if (!editedText.trim()) {
      playSound('error');
      return;
    }
    playSound('completed');
    handleEditTodo(todoId, editedText);
    setIsEditing(false);
    if (setSelectedTab) setSelectedTab('Incomplete');
  }

  function cancelEdit() {
    playSound('screenshot');
    setEditedText(todo.input);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  function handleDelete() {
    handleDeleteTodo(todoId);
  }

  function handleComplete() {
    handleCompleteTodo(todoId);
    setIsEditing(false);
    if (setSelectedTab) setSelectedTab('Completed');
  }

  function handleEdit() {
    playSound('miss');
    handleEditTodo(todoId);
  }

  const handleButtonHover = () => {};
  const handleButtonLeave = () => {};

  return (
    <div 
      ref={cardRef} 
      className={`card todo-item ${todo.complete ? 'completed-task' : ''}`}
      data-aos="fade-up"
    >
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
            <button onClick={saveEdit} onMouseDown={() => playSound('button')} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>{t('todo.save')}</h6>
            </button>
            <button onClick={cancelEdit} onMouseDown={() => playSound('button')} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>{t('todo.cancel')}</h6>
            </button>
          </>
        ) : (
          <>  
            <button onClick={() => handleComplete(todoId)} disabled={todo.complete} onMouseDown={() => playSound('button')} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave} >
            <h6>{t('todo.done')}</h6></button>
              
            <button className="delete-button" onClick={() => handleDelete(todoId)} onMouseDown={() => playSound('button')} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
            <h6>{t('todo.delete')}</h6>
            </button>

            <button onClick={() => setIsEditing(true)} onMouseDown={() => playSound('button')} onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <h6>{t('todo.edit')}</h6>
            </button>
          </>
        )}
      </div>
    </div>
  );
}