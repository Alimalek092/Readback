import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateNextReview, calculateStreak } from '@/lib/spaced-repetition';
import { ReviewRating } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const queue = db.getReviewQueue(user.id);
  const history = db.getReviewHistory(user.id);
  const streak = calculateStreak(history);

  // Count reviews done today
  const todayStr = new Date().toISOString().split('T')[0];
  const reviewsToday = history.filter((h) => h.reviewedAt.startsWith(todayStr)).length;

  return NextResponse.json({
    queue,
    count: queue.length,
    reviewsToday,
    streak,
    estimatedMinutes: Math.ceil(queue.length * 1.5),
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId, rating } = (await req.json()) as {
      noteId: string;
      rating: ReviewRating;
    };

    if (!noteId || !['forgot', 'difficult', 'easy'].includes(rating)) {
      return NextResponse.json(
        { error: 'Valid noteId and rating (forgot, difficult, easy) are required.' },
        { status: 400 }
      );
    }

    const note = db.getNoteById(user.id, noteId);
    if (!note) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    // Get current schedule if any
    const data = db.exportUserData(user.id);
    const schedule = (data as any).reviewHistory ? undefined : undefined; // or from db
    const currentQueue = db.getReviewQueue(user.id);
    const currentItem = currentQueue.find((q) => q.note.id === noteId);

    const calc = calculateNextReview(rating, currentItem?.schedule);

    db.recordReview(
      user.id,
      noteId,
      rating,
      calc.nextIntervalDays,
      calc.newEaseFactor,
      calc.newRepetitions,
      calc.nextReviewAt
    );

    const updatedHistory = db.getReviewHistory(user.id);
    const updatedStreak = calculateStreak(updatedHistory);

    return NextResponse.json({
      success: true,
      calculation: calc,
      streak: updatedStreak,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to record review.' }, { status: 500 });
  }
}
