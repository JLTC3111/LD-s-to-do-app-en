import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TodoCard } from "./TodoCard";

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

  useEffect(() => {
    // Initial ScrollTrigger refresh
    const timer = setTimeout(() => {
    }, 25);
    
    return () => {
      clearTimeout(timer);
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
</div> )}
    </Droppable>
    </DragDropContext>
  );
}