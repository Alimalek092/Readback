import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const book = db.getBookById(user.id, params.bookId);
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const notes = db.getNotes(user.id, params.bookId);
  return NextResponse.json({ book, notes });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingBook = db.getBookById(user.id, params.bookId);
  if (!existingBook) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  try {
    const updates = await req.json();
    const updated = db.saveBook({
      ...existingBook,
      ...updates,
      id: existingBook.id,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, book: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = db.deleteBook(user.id, params.bookId);
  if (!deleted) {
    return NextResponse.json({ error: 'Book not found or already deleted' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
