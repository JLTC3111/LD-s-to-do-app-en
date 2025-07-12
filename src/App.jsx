import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { Footer } from "./components/Footer"
import { useState, useEffect } from 'react' 
import { ToastContainer, toast } from 'react-toastify';
import gsap from "gsap"; 
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import soundManager from './utils/sounds';

function App() {
  const { t } = useTranslation();

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

    toast.success(t('notifications.taskDone'), {
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
    toast.error(t('notifications.taskDeleted'));
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
    document.title = t('app.title');
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
        toast.success(t('notifications.taskRestored'));
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

    <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} setTodos={setTodos} setSelectedTab={setSelectedTab} />

    <TodoInput handleAddTodo={handleAddTodo} />
      
    <div className="controls-container">
      <button 
        className="sound-toggle"
        onClick={() => {
          const newState = soundManager.toggle();
          setSoundEnabled(newState);
        }}
        title={soundEnabled ? t('controls.soundOff') : t('controls.soundOn')}
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
    <Footer />
    </>
  )
}

export default App
