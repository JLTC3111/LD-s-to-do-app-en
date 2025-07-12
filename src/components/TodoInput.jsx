import { useState } from "react";
import { useTranslation } from 'react-i18next';
import soundManager from '../utils/sounds';

export function TodoInput(props) {
  const { t } = useTranslation();
  const { handleAddTodo } = props;
  const [inputValue, setInputValue] = useState('');
  

  function submitInput() {
    if (!inputValue.trim()) {
      soundManager.playError();
      return;
    }
    
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
        onKeyUpCapture={handleKeyDown}
        placeholder={t('todo.addPlaceholder')}
      />
      <button onClick={submitInput}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
