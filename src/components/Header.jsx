
import { useTranslation } from 'react-i18next';

export function Header({ todos }) {
    const { t } = useTranslation();
    const incompleteTodos = todos.filter(todo => !todo.complete).length;
    const taskOrTasks = incompleteTodos !== 1 ? t('header.incompleteTasks') : t('header.incompleteTask');

  return (
    <header>
        <h1 className="text-gradient">
            <span className="font-bold text-4xl text-red-500">{incompleteTodos}</span> {taskOrTasks}
        </h1>
    </header>
  );
}

