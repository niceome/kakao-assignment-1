import { useState } from 'react';
import { getTodayNormal } from './utils/dateUtils';
import { useTodos } from './hooks/useTodos';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import DateNav from './components/DateNav';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayNormal());

  const {
    currentFilter,
    setCurrentFilter,
    filteredTodos,
    emptyMessage,
    addTodo,
    deleteTodo,
    toggleCompleteTodo,
    editTodo,
  } = useTodos(selectedDate);

  function handleMoveDate(days) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    next.setHours(0, 0, 0, 0);
    setSelectedDate(next);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-t-3xl px-6 pt-8 pb-6 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-5 tracking-tight">Todo</h1>
          <DateNav selectedDate={selectedDate} onMove={handleMoveDate} />
        </div>
        <div className="bg-white rounded-b-3xl shadow-2xl">
          <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
          <TodoInput onAdd={addTodo} />
          <TodoList
            todos={filteredTodos}
            emptyMessage={emptyMessage}
            onToggle={toggleCompleteTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>
      </div>
    </div>
  );
}
