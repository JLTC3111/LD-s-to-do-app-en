import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { Footer } from "./components/Footer"
import { AmbientSounds } from "./components/AmbientSounds"
import { useState, useEffect } from 'react' 
import { ToastContainer, toast } from 'react-toastify';
import gsap from "gsap";  
import { useRef } from 'react';
import Splashcursor from "./components/Splashcursor"
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { SoundProvider, useSoundContext } from './components/SoundProvider';

function AppContent({ performanceMode, setPerformanceMode }) {
  const { t } = useTranslation();
  const { playSound, soundEnabled, toggleSound } = useSoundContext();
  const [isBot, setIsBot] = useState(false);
  const [todos, setTodos] = useState([])
  const [selectedTab, setSelectedTab] = useState('All')
  const [lastDeletedTodo, setLastDeletedTodo] = useState(null);

  function handleAddTodo(newTodo) {
    playSound('success');
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
    playSound('coin_bling');
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
  
    playSound('panel_expand');
    const newTodoList = todos.filter(todo => todo.id !== id);
    setTodos(newTodoList);
    setLastDeletedTodo(toDelete);
    handleSaveData(newTodoList);
    toast.error(t('notifications.taskDeleted'));
  }
  
  function handleEditTodo(id, newText) {
    playSound('edit');
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
    // Play boot up sound when app loads
    setTimeout(() => playSound('boot_up'), 500);
  }, []);

  useEffect(() => {
    const handleUndoKey = (e) => {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z';
      if (isUndo && lastDeletedTodo) {
        playSound('undo');
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

  const togglePerformanceMode = () => {
    setPerformanceMode(prev => prev === 'auto' ? 'low' : 'auto');
    playSound('toggle');
  };

  useEffect(() => {
    if (navigator.userAgent.includes("Headless")) {
      setIsBot(true);
    }
  }, []);

  if (isBot) {
    return (
      <img
        src="/preview.jpg"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
        alt="Static Preview"
      />
    );
  }

  return (

    <>
     <Header todos={todos} /> 

     <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos} />

    <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} setTodos={setTodos} setSelectedTab={setSelectedTab} />

    <TodoInput handleAddTodo={handleAddTodo} />
      
    <div className="controls-container">
      <button 
        className={`sound-toggle btn-hover-effect${!soundEnabled ? ' disabled' : ''}`}
        onClick={toggleSound}
        onMouseDown={() => playSound('toggle')}
        title={soundEnabled ? t('controls.soundOff') : t('controls.soundOn')}
      >
        <img 
          src="/img/musical_note.png" 
          alt="Sound" 
          style={{ 
            width: '20px', 
            height: '20px',
            filter: soundEnabled ? 'none' : 'grayscale(100%) brightness(0.5)'
          }} 
        />
      </button>
      <button 
        className={`performance-toggle btn-hover-effect${performanceMode === 'low' ? ' disabled' : ''}`}
        onClick={togglePerformanceMode}
        onMouseDown={() => playSound('toggle')}
        title={performanceMode === 'auto' ? t('controls.performanceLow') : t('controls.performanceAuto')}
      >
        <span style={{ fontSize: '18px' }}>⚡</span>
      </button>
      <AmbientSounds />
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

function App() {
  const [performanceMode, setPerformanceMode] = useState('auto');
  const [isBot, setIsBot] = useState(false);
  useEffect(() => {
    if (navigator.userAgent.includes("Headless")) {
      setIsBot(true);
    }
  }, []);

  if (isBot) {
    return (
      <img
        src="/preview.jpg"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
        alt="Static Preview"
      />
    );
  }
  return (
    <>
    <Splashcursor performanceMode={performanceMode} />
    <SoundProvider>
      <AppContent performanceMode={performanceMode} setPerformanceMode={setPerformanceMode} /> 
    </SoundProvider>
    </>
  );
}

export default App
