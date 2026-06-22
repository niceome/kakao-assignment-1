// app/api/todos/[todoId]/route.ts
// 클라이언트 fetch(`/api/todos/${id}`)가 거쳐가는 프록시
// Todo 수정/삭제 요청을 FastAPI로 전달

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params;
  const body = await request.json();

  const res = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: '수정에 실패했어요' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params;
  const res = await fetch(`${API_URL}/todos/${todoId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    return NextResponse.json({ error: '삭제에 실패했어요' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}