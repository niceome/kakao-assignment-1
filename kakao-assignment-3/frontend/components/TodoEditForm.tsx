'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    date: string;
}

export default function TodoEditForm({ todo }: { todo: Todo }) {
    const router = useRouter();
    const [text, setText] = useState(todo.text);
    const [completed, setCompleted] = useState(todo.completed);
    const [error, setError] = useState('');

    async function handleSave() {
        const trimmed = text.trim();
        if(!trimmed) {
            setError('할 일을 입력해주세요.');
            return;
        }

        const res = await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: trimmed, completed }),
          });

          if (!res.ok) {
            setError('수정에 실패했어요.');
            return;
          }

          router.push('/todos');
          router.refresh();
    }

    async function handleDelete() {
        const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
        if (!res.ok) {
          setError('삭제에 실패했어요.');
          return;
        }
        router.push('/todos');
        router.refresh();
      }

      return (
        <div className="container">
          <h1 className="app-title">Todo 수정</h1>
          <div className="input-area">
            <input
              className="todo-input"
              value={text}
              onChange={e => { setText(e.target.value); setError(''); }}
              maxLength={100}
            />
            <button className="btn btn-add" onClick={handleSave}>저장</button>
            <button className="btn btn-delete" onClick={handleDelete}>삭제</button>
          </div>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={e => setCompleted(e.target.checked)}
            />
            완료
          </label>
          <p className={`error-message${error ? ' error-message--visible' : ''}`}>{error}</p>
        </div>
      );
}
