import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [text, setText]   = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('할 일을 입력해주세요.');
      return;
    }
    onAdd(trimmed);
    setText('');
    setError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
  }

  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
          value={text}
          onChange={e => { setText(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          maxLength={100}
        />
        <button
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          onClick={handleAdd}
        >
          추가
        </button>
      </div>
      <p className={`text-xs text-red-500 mt-1.5 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
        {error || '　'}
      </p>
    </div>
  );
}
