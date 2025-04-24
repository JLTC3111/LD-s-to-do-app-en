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

  const filteredTodos =
    selectedTab === 'All'
      ? todos
      : selectedTab === 'Completed'
      ? todos.filter((val) => val.complete)
      : todos.filter((val) => !val.complete);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTodos = [...todos];
    const [movedItem] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedItem);

    setTodos(newTodos);
    localStorage.setItem('todo-app', JSON.stringify({ todos: newTodos }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
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
                      todoIndex={index}
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