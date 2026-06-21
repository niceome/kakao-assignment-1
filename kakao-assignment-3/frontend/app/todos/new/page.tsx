'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDateKey, getTodayNormal } from '@/utils/dateUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewTodoPage() {
    const router = useRouter();
    const [text, setText]   = useState('');
    const [error, setError] = useState('');
   
    async function handleSubmit() {
      const trimmed = text.trim();
      if (!trimmed) {
        setError('할 일을 입력해주세요.');
        return;
      }
   
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, date: formatDateKey(getTodayNormal()) }),
      });
   
      if (!res.ok) {
        setError('Todo 생성에 실패했어요.');
        return;
      }
   
      router.push('/todos');
      router.refresh();
    }
   
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit();
    }
   
    return (
      <div className="container">
        <h1 className="app-title">새 Todo</h1>
        <div className="input-area">
          <input
            className="todo-input"
            value={text}
            onChange={e => { setText(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="할 일을 입력하세요"
            maxLength={100}
            autoFocus
          />
          <button className="btn btn-add" onClick={handleSubmit}>추가</button>
        </div>
        <p className={`error-message${error ? ' error-message--visible' : ''}`}>{error}</p>
      </div>
    );
  }