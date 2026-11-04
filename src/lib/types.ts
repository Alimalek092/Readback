export type BookStatus = 'want_to_read' | 'currently_reading' | 'completed' | 'paused' | 'abandoned';

export type NoteType = 'lesson' | 'quote' | 'thought' | 'question' | 'actionable';

export type ReviewRating = 'forgot' | 'difficult' | 'easy';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  onboardingCompleted: boolean;
  interests?: string[];
  readingGoal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  description?: string;
  publicationYear?: number;
  category: string;
  status: BookStatus;
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  notesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  bookId: string;
  title?: string;
  content: string;
  noteType: NoteType;
  pageNumber?: number;
  personalReflection?: string;
  isFavourite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface ReviewSchedule {
  id: string;
  userId: string;
  noteId: string;
  nextReviewAt: string; // ISO string
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  reviewStatus: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewHistoryEntry {
  id: string;
  userId: string;
  noteId: string;
  rating: ReviewRating;
  reviewedAt: string;
  previousInterval: number;
  nextInterval: number;
}

export interface ActionItem {
  id: string;
  userId: string;
  noteId: string;
  bookId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  provider: 'stripe' | 'polar' | 'none';
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  planId: 'free' | 'plus_monthly' | 'plus_annual';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  dailyReviewEnabled: boolean;
  preferredReviewTime: string; // "09:00"
  timezone: string;
}

export interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
  edition_count?: number;
}
