import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { useState, useEffect } from 'react' 

function App() {
  

  const [todos, setTodos] = useState([])
  const [selectedTab, setSelectedTab] = useState('All')

  function handleAddTodo(newTodo) {
    const newTodoList = [
      ...todos,
      {
        id: Date.now() + Math.random(), // ← add ID when creating
        input: newTodo,
        complete: false
      }
    ];
    setTodos(newTodoList);
    handleSaveData(newTodoList);

    if (selectedTab === 'All' || 'Completed') {
      setSelectedTab('Incomplete');
    }
  }

  function handleCompleteTodo(id) {
    const newTodoList = todos.map(todo =>
      todo.id === id ? { ...todo, complete: true } : todo
    );
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }
  
  function handleDeleteTodo(id) {
    const newTodoList = todos.filter(todo => todo.id !== id);
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }
  
  function handleEditTodo(id, newText) {
    const newTodoList = todos.map(todo =>
      todo.id === id ? { ...todo, input: newText } : todo
    );
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }

  function handleSaveData(currTodos) {
    localStorage.setItem('todo-app', JSON.stringify({ todos: currTodos }))
  }

  useEffect(() => {
    if (!localStorage || !localStorage.getItem('todo-app')) return;
  
    let db = JSON.parse(localStorage.getItem('todo-app'));
    
    const loadedTodos = db.todos.map(todo => ({
      ...todo,
      id: todo.id || Date.now() + Math.random() // assign ID if missing
    }));
  
    setTodos(loadedTodos);
  }, []);

  useEffect(() => {
    document.title = "Reminder4LD"; // Change this to your desired title
  }, []);
      
  

  return (

    <>
     <Header todos={todos} /> 

     <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos} />

    <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} setTodos={setTodos} />

    <TodoInput handleAddTodo={handleAddTodo} />
      
    <div className="language-switcher">
          <div className="globe-icon">🌎</div> 
          <div className="flag-links">
            <a href="https://reminder4LD.netlify.app/" className="flag-link">
              <span className="flag-icon flag-icon-gb"></span>
            </a>
            <a href="https://remindericuevn.netlify.app/" className="flag-link">
              <span className="flag-icon flag-icon-vn"></span>
            </a>
        </div>
    </div>
  
    <div className="video-background">
     <video className="video-bg" autoPlay loop muted playsInline>
       <source src="/bg-video.mp4" type="video/mp4" />
     </video>
    </div>
     
    </>
  )
}

export default App
