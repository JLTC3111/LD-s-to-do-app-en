import { Header } from "./components/Header"
import { Tabs } from "./components/Tabs"
import { TodoInput } from "./components/TodoInput"
import { TodoList } from "./components/TodoList"
import { useState, useEffect } from 'react'
import { PomodoroTimer } from "./components/PomodoroTimer";

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

  function handleEditTodo(index) {
    // step 1 - create a duplicate array
    // step 2 - create a new variable and assign the current value of the todo that needs editing to it
    // step 3 - set the input value equal to the current value of the todo in question
    // step 4 - copy the delete functionality and filter out the todo @ index from the duplicate array
    // step 5 - set the todo state equal to the filtered duplicate array
    // step 6 - now the user can edit the todo and re-add it when satisfied
  }

  function handleDeleteTodo(index) {
    let newTodoList = todos.filter((val, valIndex) => {
      return valIndex !== index
    })
    setTodos(newTodoList)
    handleSaveData(newTodoList)
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
      
  function handleEditTodo(index, newText) {
    const updatedTodos = [...todos];
    updatedTodos[index].input = newText;
    setTodos(updatedTodos);
    handleSaveData(updatedTodos);
  }
  
  return (

    <>
     <Header todos={todos} /> 
     <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} todos={todos} />
      <TodoList handleCompleteTodo={handleCompleteTodo} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} selectedTab={selectedTab} todos={todos} />
      <TodoInput handleAddTodo={handleAddTodo} />
      <PomodoroTimer /> {/* Add the PomodoroTimer game here */}
      
      <div class="language-switcher">
         <a href="https://icuestodoapp.netlify.app/" class="flag-link">
           <span class="flag-icon flag-icon-gb"></span> </a>
       

        <a href="https://remindericuevn.netlify.app/" class="flag-link">
           <span class="flag-icon flag-icon-vn"></span>  </a>
     
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
