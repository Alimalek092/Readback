import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const note = db.getNoteById(user.id, params.noteId);
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json({ note });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingNote = db.getNoteById(user.id, params.noteId);
  if (!existingNote) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  try {
    const updates = await req.json();
    const updated = db.saveNote({
      ...existingNote,
      ...updates,
      id: existingNote.id,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, note: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = db.deleteNote(user.id, params.noteId);
  if (!deleted) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// Toggle favourite
export async function PATCH(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isFavourite = db.toggleFavouriteNote(user.id, params.noteId);
  return NextResponse.json({ success: true, isFavourite });
}
