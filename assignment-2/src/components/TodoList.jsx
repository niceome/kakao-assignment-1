import TodoItem from './TodoItem';

export default function TodoList({ todos, emptyMessage, onToggle, onDelete, onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-50 py-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
