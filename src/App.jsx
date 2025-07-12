import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { useState, useEffect } from 'react' 
import { ToastContainer, toast } from 'react-toastify';
import gsap from "gsap"; 
import { useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import soundManager from './utils/sounds';

function App() {
  

  const [todos, setTodos] = useState([])
  const [selectedTab, setSelectedTab] = useState('All')
  const [lastDeletedTodo, setLastDeletedTodo] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  function handleAddTodo(newTodo) {
    soundManager.playAdd();
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

    if (selectedTab === 'All' || selectedTab === 'Completed') {
      setSelectedTab('Incomplete');
    }
  }

  function handleCompleteTodo(id) {
    soundManager.playComplete();
    const newTodoList = todos.map(todo =>
      todo.id === id ? { ...todo, complete: true } : todo
    );
    setTodos(newTodoList);
    handleSaveData(newTodoList);

    toast.success("🎉 Task Done!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    })
  }
  
  function handleDeleteTodo(id) {
    const toDelete = todos.find(todo => todo.id === id);
    if (!toDelete) return;
  
    // Avoid overwriting undo with same task
    if (lastDeletedTodo && lastDeletedTodo.id === id) return;
  
    soundManager.playDelete();
    const newTodoList = todos.filter(todo => todo.id !== id);
    setTodos(newTodoList);
    setLastDeletedTodo(toDelete);
    handleSaveData(newTodoList);
    toast.error('❌ Task deleted');
  }
  
  function handleEditTodo(id, newText) {
    soundManager.playEdit();
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

  useEffect(() => {
    const handleUndoKey = (e) => {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z';
      if (isUndo && lastDeletedTodo) {
        soundManager.playUndo();
        const updated = [...todos, lastDeletedTodo];
        setTodos(updated);
        handleSaveData(updated);
        setLastDeletedTodo(null);
        toast.success('✅ Task restored');
      }
    };
    
    window.addEventListener('keydown', handleUndoKey);
    return () => window.removeEventListener('keydown', handleUndoKey);
  }, [lastDeletedTodo, todos]);
      
const cardRefs = useRef(new Map());

  return (

    <>
     <Header todos={todos} /> 

     <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos} />

    <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} setTodos={setTodos} />

    <TodoInput handleAddTodo={handleAddTodo} />
      
    <div className="controls-container">
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
      
      <button 
        className="sound-toggle"
        onClick={() => {
          const newState = soundManager.toggle();
          setSoundEnabled(newState);
        }}
        title={soundEnabled ? "Disable sounds" : "Enable sounds"}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
    </div>
  
    <div className="video-background">
     <video className="video-bg" autoPlay loop muted playsInline>
       <source src="/bg-video.mp4" type="video/mp4" />
     </video>
    </div>
    <ToastContainer position="bottom-center" autoClose={2500} hideProgressBar />
    </>
  )
}

export default App
