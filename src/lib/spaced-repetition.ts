import { ReviewRating, ReviewSchedule, ReviewHistoryEntry } from './types';

export interface NextReviewCalculation {
  nextIntervalDays: number;
  newEaseFactor: number;
  newRepetitions: number;
  nextReviewAt: string; // ISO string
}

export function calculateNextReview(
  rating: ReviewRating,
  currentSchedule?: Partial<ReviewSchedule>
): NextReviewCalculation {
  const currentInterval = currentSchedule?.intervalDays ?? 0;
  const currentEase = currentSchedule?.easeFactor ?? 2.5;
  const currentReps = currentSchedule?.repetitions ?? 0;

  let nextIntervalDays: number;
  let newEaseFactor = currentEase;
  let newRepetitions = currentReps;

  if (rating === 'forgot') {
    // Forgot: reset repetition count, reschedule very soon (e.g. 0.2 days = ~5 hours)
    nextIntervalDays = 0.2;
    newRepetitions = 0;
    newEaseFactor = Math.max(1.3, currentEase - 0.2);
  } else if (rating === 'difficult') {
    // Difficult: repeat tomorrow, minor ease reduction
    nextIntervalDays = 1;
    newRepetitions = currentReps + 1;
    newEaseFactor = Math.max(1.3, currentEase - 0.15);
  } else {
    // Easy: expand interval significantly
    if (currentReps === 0) {
      nextIntervalDays = 3;
    } else if (currentReps === 1) {
      nextIntervalDays = 7;
    } else {
      nextIntervalDays = Math.max(
        currentInterval + 2,
        Math.round(currentInterval * currentEase)
      );
    }
    newRepetitions = currentReps + 1;
    newEaseFactor = Math.min(2.8, currentEase + 0.1);
  }

  const nextReviewAt = new Date(
    Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000
  ).toISOString();

  return {
    nextIntervalDays,
    newEaseFactor: Number(newEaseFactor.toFixed(2)),
    newRepetitions,
    nextReviewAt,
  };
}

export function calculateStreak(history: ReviewHistoryEntry[]): number {
  if (!history || history.length === 0) return 0;

  // Extract unique review calendar dates (YYYY-MM-DD) in reverse chronological order
  const uniqueDates = Array.from(
    new Set(
      history.map((entry) =>
        new Date(entry.reviewedAt).toISOString().split('T')[0]
      )
    )
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const mostRecent = uniqueDates[0];
  // If the user hasn't reviewed today or yesterday, streak is broken
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(mostRecent);

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}
