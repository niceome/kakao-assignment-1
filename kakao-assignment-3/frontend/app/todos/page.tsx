const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getTodos() {
    const res = await fetch(`${API_URL}/todos`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Todo 목록을 불러오지 못했어요');
    return res.json();
  }

export default async function TodosPage() {
    const todos = await getTodos();

    return (
        <div className="container">
          <h1 className="app-title">Todo</h1>
          <a href="/todos/new">새 Todo 추가</a>
          <ul className="todo-list">
            {todos.map((todo: { id: number; text: string; completed: boolean; date: string }) => (
              <li key={todo.id} className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
                <span className="todo-text">{todo.text}</span>
                <span>{todo.date}</span>
                <a href={`/todos/${todo.id}`}>수정</a>
              </li>
            ))}
          </ul>
        </div>
      );
}