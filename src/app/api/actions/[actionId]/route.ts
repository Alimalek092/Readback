import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: { actionId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = db.getActions(user.id).find((a) => a.id === params.actionId);
  if (!existing) {
    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  }

  try {
    const updates = await req.json();
    const updated = db.saveAction({
      ...existing,
      ...updates,
      id: existing.id,
      userId: user.id,
      completedAt: updates.status === 'completed' ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ success: true, action: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { actionId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = db.deleteAction(user.id, params.actionId);
  if (!deleted) {
    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
