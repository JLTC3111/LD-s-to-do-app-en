import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TodoCard } from "./TodoCard";

export function TodoList(props) {
  const {
    todos,
    selectedTab,
    setTodos,
    handleEditTodo,
    handleDeleteTodo,
    handleCompleteTodo,
  } = props;

  // Dynamically filter todos based on tab
  const filteredTodos =
    selectedTab === 'All'
      ? todos
      : selectedTab === 'Completed'
      ? todos.filter((val) => val.complete)
      : todos.filter((val) => !val.complete);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const updatedFilteredTodos = [...filteredTodos];
    const [movedItem] = updatedFilteredTodos.splice(sourceIndex, 1);
    updatedFilteredTodos.splice(destIndex, 0, movedItem);

    // Map back to full todos
    if (selectedTab === 'All') {
      setTodos(updatedFilteredTodos);
      handleSaveData(updatedFilteredTodos);
    } else {
      const newTodos = [...todos];
      // Reinsert updated filtered list into correct spots in original todos
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
          <div className="todo-List" {...provided.droppableProps} ref={provided.innerRef}>
            {filteredTodos.map((todo, index) => (
              <Draggable key={index} draggableId={String(index)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoCard
                      todo={todo}
                      todoIndex={todos.indexOf(todo)}
                      handleEditTodo={handleEditTodo}
                      handleDeleteTodo={handleDeleteTodo}
                      handleCompleteTodo={handleCompleteTodo}
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