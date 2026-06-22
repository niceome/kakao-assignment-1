import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
    const body = await request.json();

    const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
    return NextResponse.json({ error: 'Todo 생성에 실패했어요' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}