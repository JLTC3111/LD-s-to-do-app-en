import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from 'react-i18next';
import { useSoundContext } from './SoundProvider';

gsap.registerPlugin(ScrollTrigger);

export function TodoCard(props) {
  const { t } = useTranslation();
  const { playSound } = useSoundContext();
  const { todo, todoId, handleDeleteTodo, handleCompleteTodo, handleEditTodo, setSelectedTab } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.input);

  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0, 
          y: 40,
          scale: 0.95 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          delay: Math.min(0.1 * todoId, 0.5) // Staggered delay up to 0.5s
        }
      );
    }
  }, [todoId]);

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
    playSound('miss');
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
    <div 
      ref={cardRef} 
      className={`card todo-item ${todo.complete ? 'completed-task' : ''}`}
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