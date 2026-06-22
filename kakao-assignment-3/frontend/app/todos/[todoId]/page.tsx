import TodoEditForm from '@/components/TodoEditForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getTodo(id: string) {
    const res = await fetch(`${API_URL}/todos/${id}`, { cache: 'no-store'});

    if(!res.ok) throw new Error('Todo를 불러오지 못했어요');
    return res.json();
}

export default async function TodoDetailPage({ params }: {
    params: Promise<{ todoId: string }> }) {
        const { todoId } = await params;
        const todo = await getTodo(todoId);

        return <TodoEditForm todo={todo} />;
    }

