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
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    let ctx;
    let scrollTriggerInstance;
    
    // Initial setup
    const setupAnimations = () => {
      // Kill any existing ScrollTrigger to prevent duplicates
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === card) trigger.kill();
      });
      
      // Reset any transforms that might be left over
      gsap.set(card, { clearProps: "transform,opacity,scale" });
      
      // Initial animation (entering from left)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 97.5%",
          end: "bottom 2.5%",
          toggleActions: "play none reverse none",
          // Enable animations on both forward and backward scrolls
          onUpdate: (self) => {
            // When scrolling down past the card
            if (self.direction === 1 && self.progress > 0.95) {
              gsap.to(card, {
                opacity: 0,
                y: 50,
                scale: 1,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                  if (parseFloat(card.style.opacity) === 0) {
                    gsap.set(card, { y: 0 });
                  }
                }
              });
            }
            // When scrolling up past the card
            else if (self.direction === -1 && self.progress < 0.95) {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.25,
                ease: "power2.out",
                clearProps: "all"
              });
            }
          },
          onEnter: () => {
            // Only animate if the card is not already visible
            if (parseFloat(card.style.opacity) < 1) {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.25,
                ease: "power2.out",
                clearProps: "all"
              });
            }
          },
          onLeave: () => {
            // Only animate if we're actually scrolling down past this card
            if (window.scrollY > card.offsetTop) {
              gsap.to(card, {
                opacity: 0,
                y: 50,
                scale: 1,
                duration: 0.6,
                ease: "back.in(1.2)",
                onComplete: () => {
                  // Only reset position if still not visible
                  if (parseFloat(card.style.opacity) === 0) {
                    gsap.set(card, { y: 0 });
                  }
                }
              });
            }
          },
          onEnterBack: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.2)",
              clearProps: "all"
            });
          },
          onLeaveBack: () => {
            gsap.to(card, {
              opacity: 0,
              y: 50,
              scale: 1,
              duration: 0.6,
              ease: "back.in(1.2)",
              onComplete: () => {
                // Only reset position if still not visible
                if (parseFloat(card.style.opacity) === 0) {
                  gsap.set(card, { y: 0 });
                }
              }
            });
          }
        }
      });
      
      // Initial animation
      tl.fromTo(card,
        { 
          opacity: 0, 
          y: 50,
          scale: 1 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          delay: Math.min(0.1 * todoId, 0.25)
        }
      );
      
      return tl;
    };
    
    // Set up the initial animations
    ctx = gsap.context(setupAnimations, card);
    
    // Function to refresh ScrollTrigger after tab changes
    const refreshScrollTrigger = () => {
      // Small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Reset card to visible state
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      });
    };
    
    // Set up a mutation observer to detect when the card becomes visible again
    const observer = new MutationObserver(refreshScrollTrigger);
    if (card.parentElement) {
      observer.observe(card.parentElement, { childList: true, subtree: true });
    }
    
    // Also refresh on window resize
    window.addEventListener('resize', refreshScrollTrigger);
    
    return () => {
      // Cleanup
      if (ctx) ctx.revert();
      observer.disconnect();
      window.removeEventListener('resize', refreshScrollTrigger);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === card) trigger.kill();
      });
    };
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
      y: 100,
      height: 0,
      margin: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => handleDeleteTodo(todoId),
    });
  }

  function handleComplete() {
    gsap.to(cardRef.current, {
      y: 100,
      height: 0,
      margin: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => handleCompleteTodo(todoId),
    });
  }

  function handleEdit() {
    playSound('miss');
    gsap.to(cardRef.current, {
      duration: 0.25,
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