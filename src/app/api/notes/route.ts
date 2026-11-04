import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkPlanLimits } from '@/lib/subscription';
import { Note } from '@/lib/types';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('bookId') || undefined;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const noteType = searchParams.get('type') || undefined;
  const tag = searchParams.get('tag')?.toLowerCase() || undefined;
  const favourite = searchParams.get('favourite') === 'true';

  let notes = db.getNotes(user.id, bookId);

  if (search) {
    notes = notes.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(search)) ||
        n.content.toLowerCase().includes(search) ||
        (n.personalReflection && n.personalReflection.toLowerCase().includes(search)) ||
        n.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  if (noteType) {
    notes = notes.filter((n) => n.noteType === noteType);
  }

  if (tag) {
    notes = notes.filter((n) => n.tags.some((t) => t.toLowerCase() === tag));
  }

  if (favourite) {
    notes = notes.filter((n) => n.isFavourite);
  }

  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentNotes = db.getNotes(user.id);
    const currentBooks = db.getBooks(user.id);
    const subscription = db.getSubscription(user.id);

    const limits = checkPlanLimits(
      subscription.planId,
      currentBooks.length,
      currentNotes.length
    );

    if (!limits.canAddNote) {
      return NextResponse.json(
        {
          error:
            'Free library limit reached (maximum 50 notes). Upgrade to ReadBack Plus to capture unlimited ideas.',
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { bookId, title, content, noteType, pageNumber, personalReflection, tags, isFavourite } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Idea content is required.' }, { status: 400 });
    }

    if (!bookId) {
      return NextResponse.json({ error: 'Please select a book for this note.' }, { status: 400 });
    }

    const book = db.getBookById(user.id, bookId);
    if (!book) {
      return NextResponse.json({ error: 'The selected book does not exist in your library.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      bookId,
      title: title ? title.trim() : undefined,
      content: content.trim(),
      noteType: noteType || 'lesson',
      pageNumber: pageNumber ? Number(pageNumber) : undefined,
      personalReflection: personalReflection ? personalReflection.trim() : undefined,
      isFavourite: Boolean(isFavourite),
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
    };

    const saved = db.saveNote(newNote);
    return NextResponse.json({ success: true, note: saved });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 });
  }
}
