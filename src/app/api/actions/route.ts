import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ActionItem } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const actions = db.getActions(user.id);
  return NextResponse.json({ actions });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId, bookId, title, description, dueDate } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Action title is required' }, { status: 400 });
    }

    const newAction: ActionItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      noteId,
      bookId,
      title: title.trim(),
      description: description ? description.trim() : undefined,
      dueDate: dueDate || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const saved = db.saveAction(newAction);
    return NextResponse.json({ success: true, action: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
  }
}
