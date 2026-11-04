import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkPlanLimits } from '@/lib/subscription';
import { Book } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const books = db.getBooks(user.id);
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentBooks = db.getBooks(user.id);
    const currentNotes = db.getNotes(user.id);
    const subscription = db.getSubscription(user.id);

    const limits = checkPlanLimits(
      subscription.planId,
      currentBooks.length,
      currentNotes.length
    );

    if (!limits.canAddBook) {
      return NextResponse.json(
        {
          error:
            'Free library limit reached (maximum 5 books). Upgrade to ReadBack Plus for unlimited books.',
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      author,
      isbn,
      coverUrl,
      description,
      publicationYear,
      category,
      status,
      progressPercentage,
    } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Book title and author are required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newBook: Book = {
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn ? isbn.trim() : undefined,
      coverUrl: coverUrl ? coverUrl.trim() : undefined,
      description: description ? description.trim() : undefined,
      publicationYear: publicationYear ? Number(publicationYear) : undefined,
      category: category ? category.trim() : 'General',
      status: status || 'want_to_read',
      progressPercentage: progressPercentage !== undefined ? Number(progressPercentage) : 0,
      startedAt: status === 'currently_reading' ? now : undefined,
      completedAt: status === 'completed' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const saved = db.saveBook(newBook);
    return NextResponse.json({ success: true, book: saved });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book.' }, { status: 500 });
  }
}
