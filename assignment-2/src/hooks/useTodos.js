import { useState, useEffect } from 'react';
import { formatDateKey } from '../utils/dateUtils';

const STORAGE_KEY_TODOS  = 'todos';
const STORAGE_KEY_NEXTID = 'nextId';

function loadFromStorage(key, validator, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (validator(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('load failed, starting fresh:', e);
  }
  return fallback;
}

export function useTodos(selectedDate) {
  const [todos, setTodos]                 = useState(() => loadFromStorage(STORAGE_KEY_TODOS, Array.isArray, []));
  const [nextId, setNextId]               = useState(() => loadFromStorage(STORAGE_KEY_NEXTID, v => typeof v === 'number', 1));
  const [currentFilter, setCurrentFilter] = useState('all');

  // todos나 nextId가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TODOS,  JSON.stringify(todos));
      localStorage.setItem(STORAGE_KEY_NEXTID, JSON.stringify(nextId));
    } catch (e) {
      console.warn('save failed:', e);
    }
  }, [todos, nextId]);

  // selectedDate + currentFilter 적용해서 표시할 todo 목록 반환
  function getFilteredTodos() {
    const dateKey  = formatDateKey(selectedDate);
    const dayTodos = todos.filter(t => t.date === dateKey);

    switch (currentFilter) {
      case 'active':    return dayTodos.filter(t => !t.completed);
      case 'completed': return dayTodos.filter(t =>  t.completed);
      default:          return dayTodos;
    }
  }

  function getEmptyMessage() {
    switch (currentFilter) {
      case 'active':    return '진행 중인 할 일이 없어요';
      case 'completed': return '완료된 할 일이 없어요';
      default:          return '이 날의 할 일이 없어요';
    }
  }

  function addTodo(text) {
    const newTodo = {
      id: nextId,
      text,
      completed: false,
      date: formatDateKey(selectedDate),
    };
    setTodos(prev => [...prev, newTodo]);
    setNextId(prev => prev + 1);
    // 완료 필터 상태에서 추가하면 전체로 초기화
    if (currentFilter === 'completed') setCurrentFilter('all');
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function toggleCompleteTodo(id) {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  function editTodo(id, newText) {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText } : t)
    );
  }

  return {
    currentFilter,
    setCurrentFilter,
    filteredTodos: getFilteredTodos(),
    emptyMessage:  getEmptyMessage(),
    addTodo,
    deleteTodo,
    toggleCompleteTodo,
    editTodo,
  };
}