import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSoundContext } from './SoundProvider';

export function TodoInput(props) {
  const { t } = useTranslation();
  const { playSound } = useSoundContext();
  const { handleAddTodo } = props;
  const [inputValue, setInputValue] = useState('');
  

  function submitInput() {
    if (!inputValue.trim()) {
      playSound('error');
      return;
    }
    
    playSound('submit');
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
        onFocus={() => playSound('inputFocus')}
        placeholder={t('todo.addPlaceholder')}
      />
      <button onClick={submitInput} onMouseDown={() => playSound('button')}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
