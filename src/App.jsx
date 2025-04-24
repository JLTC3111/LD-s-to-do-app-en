import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { useState, useEffect } from 'react'


function App() {
  // const todos = [
  // { input: 'Hello! Add your first todo!', complete: true },
  // { input: 'Get the groceries!', complete: false },
  // { input: 'Learn how to web design', complete: false },
  // { input: 'Say hi to gran gran', complete: true },]

  const [todos, setTodos] = useState([
    { input: 'Hello! Add your first todo!', complete: true }
  ])
  const [selectedTab, setSelectedTab] = useState('Open')


  function handleAddTodo(newTodo) {
    const newTodoList = [...todos, { input: newTodo, complete: false }]
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function handleCompleteTodo(index) {
    // update/edit/modify
    let newTodoList = [...todos]
    let completedTodo = todos[index]
    completedTodo['complete'] = true
    newTodoList[index] = completedTodo
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function handleDeleteTodo(index) {
    let newTodoList = todos.filter((val, valIndex) => {
      return valIndex !== index
    })
    setTodos(newTodoList)
    handleSaveData(newTodoList)
  }

  function handleEditTodo(index, newText) {
    const updatedTodos = [...todos];
    updatedTodos[index].input = newText;
    setTodos(updatedTodos);
    handleSaveData(updatedTodos);
  }

  function handleSaveData(currTodos) {
    localStorage.setItem('todo-app', JSON.stringify({ todos: currTodos }))
  }

  useEffect(() => {
    if (!localStorage || !localStorage.getItem('todo-app')) { return }
    let db = JSON.parse(localStorage.getItem('todo-app'))
    setTodos(db.todos)
  }, [])

  useEffect(() => {
    document.title = "Reminder4LD"; // Change this to your desired title
  }, []);
      
  
  return (

    <>
     <Header todos={todos} /> 

     <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos} />

    <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} setTodos={setTodos} />

    <TodoInput handleAddTodo={handleAddTodo} />
      
      
      <div class="language-switcher">
         <a href="https://icuestodoapp.netlify.app/" class="flag-link">
           <span class="flag-icon flag-icon-gb"></span> </a>
        <a href="https://remindericuevn.netlify.app/" class="flag-link">
           <span class="flag-icon flag-icon-vn"></span> </a>
      </div>

     <div className="app-container">
        <video className="video-bg" autoPlay muted playsInline>
        <source src="/bg-video.mp4" type="video/mp4" />
        </video>
      </div>
     
    </>
  )
}

export default App
