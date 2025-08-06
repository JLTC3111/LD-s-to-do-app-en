import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TodoCard } from "./TodoCard";

gsap.registerPlugin(ScrollTrigger);

export function TodoList(props) {
  const {
    todos,
    selectedTab,
    setTodos,
    handleEditTodo,
    cardRefs,
    handleDeleteTodo,
    handleCompleteTodo,
    setSelectedTab,
  } = props;

  const listRef = useRef(null);

  const filteredTodos =
    selectedTab === 'All'
      ? todos
      : selectedTab === 'Completed'
      ? todos.filter((val) => val.complete)
      : todos.filter((val) => !val.complete);

  // Set up scroll animations for all cards in the list
  useEffect(() => {
    if (!listRef.current) return;
    
    // Kill all existing ScrollTriggers and animations
    gsap.killTweensOf(listRef.current.children);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    const cards = Array.from(listRef.current.children);
    if (cards.length === 0) return;
    
    // Set initial state
    gsap.set(cards, { 
      opacity: 0,
      y: 20,
      clearProps: 'all'
    });
    
    // Force a reflow
    listRef.current.offsetHeight;
    
    // Simple fade in animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Refresh ScrollTrigger after animations complete
        setTimeout(() => ScrollTrigger.refresh(true), 50);
      }
    });
    
    tl.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out'
    });
    
    // Set up scroll triggers
    cards.forEach(card => {
      if (!card) return;
      
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.3, clearProps: 'all' }),
        onLeave: () => {},
        onEnterBack: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.3, clearProps: 'all' }),
        onLeaveBack: () => {}
      });
    });
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredTodos]); // Only depend on filteredTodos

  useEffect(() => {
    // Initial ScrollTrigger refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 25);
    
    return () => {
      clearTimeout(timer);
      // Clean up any pending animations
      gsap.globalTimeline.clear();
    };
  }, [todos, selectedTab]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const updatedFilteredTodos = [...filteredTodos];
    const [movedItem] = updatedFilteredTodos.splice(sourceIndex, 1);
    updatedFilteredTodos.splice(destIndex, 0, movedItem);

    if (selectedTab === 'All') {
      setTodos(updatedFilteredTodos);
      handleSaveData(updatedFilteredTodos);
    } else {
      const newTodos = [...todos];
      let filterFn = selectedTab === 'Completed' ? t => t.complete : t => !t.complete;
      let filteredIdx = 0;
      for (let i = 0; i < newTodos.length; i++) {
        if (filterFn(newTodos[i])) {
          newTodos[i] = updatedFilteredTodos[filteredIdx++];
        }
      }
      setTodos(newTodos);
      handleSaveData(newTodos);
    }
  };

  function handleSaveData(currTodos) {
    localStorage.setItem('todo-app', JSON.stringify({ todos: currTodos }))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <div className="todo-List" {...provided.droppableProps} ref={(el) => {
            provided.innerRef(el);
            listRef.current = el;
          }}>
            {filteredTodos.map((todo, index) => (
    <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TodoCard
            todo={todo}
            todoId={todo.id} 
            handleEditTodo={handleEditTodo}
            cardRef={el => cardRefs.current.set(todo.id, el)}
            handleDeleteTodo={handleDeleteTodo}
            handleCompleteTodo={() => handleCompleteTodo(todo.id)}
            setSelectedTab={setSelectedTab}
          />
        </div>
      )}
    </Draggable>
  ))}
{provided.placeholder}
  </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}