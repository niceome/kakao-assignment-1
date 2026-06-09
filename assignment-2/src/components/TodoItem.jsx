import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText]   = useState(todo.text);

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEdit(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  }

  return (
    <li className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors group">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
          todo.completed
            ? 'bg-violet-600 border-violet-600'
            : 'border-gray-300 hover:border-violet-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            className="w-full text-sm text-gray-800 bg-transparent border-b-2 border-violet-400 focus:outline-none py-0.5"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            autoFocus
          />
        ) : (
          <span className={`text-sm break-words ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}>
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
            </svg>
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              title="수정"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 2.5a1.5 1.5 0 012.121 2.121L5.5 12.243l-3 .757.757-3L11 2.5z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="w-7 h-7 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
              title="삭제"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h10M6 4V3h4v1M5 4v9h6V4" />
              </svg>
            </button>
          </>
        )}
      </div>
    </li>
  );
}
