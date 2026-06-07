import { useState, useEffect } from 'react';
import { formatDateKey } from "../utils/dateUtils";

const STORAGE_KEY_TODOS  = 'todos';
const STORAGE_KEY_NEXTID = 'nextId';

export function useTodos(selectedDate) {
    const [todos, setTodos] = useState([]);
    const [nextId, setNextId] = useState(1);

    
    // 초기 렌더링 시 로컬스토리지에서 값 가져옴
    useEffect(() => {
        try {
            const rawTodos  = localStorage.getItem(STORAGE_KEY_TODOS);
            const rawNextId = localStorage.getItem(STORAGE_KEY_NEXTID);

            if (rawTodos !== null) {
                const parsed = JSON.parse(rawTodos);
                if (Array.isArray(parsed)) setTodos(parsed);
              }
              if (rawNextId !== null) {
                const parsedId = JSON.parse(rawNextId);
                if (typeof parsedId === 'number') setNextId(parsedId);
              }
            } catch (e) {
                console.warn('load failed, starting fresh:', e);
              }
            }, []);

    // todo나 nextId에 변화 생기면 로컬 스토리지에 저장       
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_TODOS,  JSON.stringify(todos));
            localStorage.setItem(STORAGE_KEY_NEXTID, JSON.stringify(nextId));
        } catch (e) {
            console.warn('save failed:', e);
        }
    }, [todos, nextId]);


    function addTodo(text) {
        const newTodo = {
            id: nextId,
            text,
            completed: false,
            date: formatDateKey(selectedDate),
        };
        setTodos(prev => [...prev, newTodo]);
        setNextId(prev => prev + 1);
    }

    function deleteTodo(id) {
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    function toggleCompleteTodo(id) {
        setTodos(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
          );
      
    }

    function editTodo(id, newId) {
        setTodos(prev => 
            prev.map(t => t.id === id ? {...t, text:newText} : t)
        );
    }

    return { todos, addTodo, deleteTodo, toggleCompleteTodo, editTodo };

          
}
