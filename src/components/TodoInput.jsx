import { useState } from "react";

export function TodoInput(props) {
  const { handleAddTodo } = props;
  const [inputValue, setInputValue] = useState('');

  function submitInput() {
    if (!inputValue.trim()) return;
    handleAddTodo(inputValue.trim());
    setInputValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      submitInput();
    }
    if (e.key === 'Escape') {
      setInputValue(''); // Clear the input field
    }
  }

  return (
    <div className="input-container">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add Task"
      />
      <button onClick={submitInput}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
