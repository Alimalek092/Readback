import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Book,
  Note,
  Tag,
  ReviewSchedule,
  ReviewHistoryEntry,
  ActionItem,
  Subscription,
  NotificationPreferences,
} from './types';

export interface DatabaseSchema {
  profiles: UserProfile[];
  books: Book[];
  notes: Note[];
  tags: Tag[];
  reviewSchedules: ReviewSchedule[];
  reviewHistory: ReviewHistoryEntry[];
  actions: ActionItem[];
  subscriptions: Subscription[];
  notificationPreferences: NotificationPreferences[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'readback.json');

// Initial seed data for a rich, realistic reading experience
const INITIAL_SEED: DatabaseSchema = {
  profiles: [
    {
      id: 'usr_demo_readback_01',
      email: 'demo@readback.app',
      displayName: 'Arthur Pendelton',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      timezone: 'America/New_York',
      theme: 'light',
      onboardingCompleted: true,
      interests: ['Personal development', 'Psychology', 'Productivity', 'Finance', 'Philosophy'],
      readingGoal: 'Remember more of what I read and apply it to daily work',
      createdAt: '2026-10-01T08:00:00.000Z',
      updatedAt: '2026-11-01T10:00:00.000Z',
    },
  ],
  books: [
    {
      id: 'book_atomic_habits',
      userId: 'usr_demo_readback_01',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      coverUrl: 'https://covers.openlibrary.org/b/id/12843475-M.jpg',
      description: 'An easy and proven way to build good habits and break bad ones.',
      publicationYear: 2018,
      category: 'Productivity & Habits',
      status: 'currently_reading',
      progressPercentage: 68,
      startedAt: '2026-10-15T00:00:00.000Z',
      createdAt: '2026-10-15T09:30:00.000Z',
      updatedAt: '2026-11-03T18:20:00.000Z',
    },
    {
      id: 'book_psychology_of_money',
      userId: 'usr_demo_readback_01',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      isbn: '9780857197689',
      coverUrl: 'https://covers.openlibrary.org/b/id/10523455-M.jpg',
      description: 'Timeless lessons on wealth, greed, and happiness.',
      publicationYear: 2020,
      category: 'Finance & Psychology',
      status: 'completed',
      progressPercentage: 100,
      startedAt: '2026-09-01T00:00:00.000Z',
      completedAt: '2026-10-12T00:00:00.000Z',
      createdAt: '2026-09-01T14:10:00.000Z',
      updatedAt: '2026-10-12T16:45:00.000Z',
    },
    {
      id: 'book_deep_work',
      userId: 'usr_demo_readback_01',
      title: 'Deep Work',
      author: 'Cal Newport',
      isbn: '9781455586691',
      coverUrl: 'https://covers.openlibrary.org/b/id/8316104-M.jpg',
      description: 'Rules for focused success in a distracted world.',
      publicationYear: 2016,
      category: 'Productivity & Focus',
      status: 'completed',
      progressPercentage: 100,
      startedAt: '2026-08-10T00:00:00.000Z',
      completedAt: '2026-08-30T00:00:00.000Z',
      createdAt: '2026-08-10T11:00:00.000Z',
      updatedAt: '2026-08-30T17:00:00.000Z',
    },
    {
      id: 'book_essentialism',
      userId: 'usr_demo_readback_01',
      title: 'Essentialism: The Disciplined Pursuit of Less',
      author: 'Greg McKeown',
      isbn: '9780804137386',
      coverUrl: 'https://covers.openlibrary.org/b/id/7984916-M.jpg',
      description: 'The disciplined pursuit of less but better.',
      publicationYear: 2014,
      category: 'Philosophy & Leadership',
      status: 'want_to_read',
      progressPercentage: 0,
      createdAt: '2026-10-20T12:00:00.000Z',
      updatedAt: '2026-10-20T12:00:00.000Z',
    },
    {
      id: 'book_thinking_fast_slow',
      userId: 'usr_demo_readback_01',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      isbn: '9780374275631',
      coverUrl: 'https://covers.openlibrary.org/b/id/7268804-M.jpg',
      description: 'The two systems that drive the way we think—System 1 (fast, intuitive) and System 2 (slow, deliberative).',
      publicationYear: 2011,
      category: 'Cognitive Psychology',
      status: 'paused',
      progressPercentage: 42,
      startedAt: '2026-09-15T00:00:00.000Z',
      createdAt: '2026-09-15T09:00:00.000Z',
      updatedAt: '2026-10-05T18:00:00.000Z',
    },
  ],
  notes: [
    {
      id: 'note_ah_01',
      userId: 'usr_demo_readback_01',
      bookId: 'book_atomic_habits',
      title: 'The aggregation of marginal gains',
      content: 'You do not rise to the level of your goals. You fall to the level of your systems. Getting 1 percent better each day compounds into extraordinary results over a year (37x better).',
      noteType: 'lesson',
      pageNumber: 27,
      personalReflection: 'Focus less on setting ambitious quarterly targets and more on standardizing the first 5 minutes of my morning writing routine.',
      isFavourite: true,
      tags: ['Habits', 'Systems', 'Productivity'],
      createdAt: '2026-10-16T08:30:00.000Z',
      updatedAt: '2026-10-16T08:30:00.000Z',
    },
    {
      id: 'note_ah_02',
      userId: 'usr_demo_readback_01',
      bookId: 'book_atomic_habits',
      title: 'Environment is the invisible hand',
      content: 'Environment design is the secret to habit stability. Be the designer of your world and not merely the consumer of it. Make good cues obvious and friction low.',
      noteType: 'lesson',
      pageNumber: 82,
      personalReflection: 'Moved my Kindle and physical reading notebook right beside the bedside lamp. Phone stays on the study desk across the room.',
      isFavourite: true,
      tags: ['Habits', 'Environment', 'Focus'],
      createdAt: '2026-10-18T21:15:00.000Z',
      updatedAt: '2026-10-18T21:15:00.000Z',
    },
    {
      id: 'note_ah_03',
      userId: 'usr_demo_readback_01',
      bookId: 'book_atomic_habits',
      title: 'Identity-based habits quote',
      content: 'Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity.',
      noteType: 'quote',
      pageNumber: 38,
      personalReflection: 'Whenever I resist reading before sleep, I remind myself: I am a thoughtful reader who cherishes learning.',
      isFavourite: false,
      tags: ['Identity', 'Psychology'],
      createdAt: '2026-10-19T22:00:00.000Z',
      updatedAt: '2026-10-19T22:00:00.000Z',
    },
    {
      id: 'note_pom_01',
      userId: 'usr_demo_readback_01',
      bookId: 'book_psychology_of_money',
      title: 'Controlling your time is the highest dividend',
      content: 'The highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today." Financial success is not hard science; it is a soft skill where how you behave matters more than what you know.',
      noteType: 'lesson',
      pageNumber: 85,
      personalReflection: 'Wealth is not the cars we buy; it is the freedom of schedule and independence it buys our families.',
      isFavourite: true,
      tags: ['Finance', 'Freedom', 'Philosophy'],
      createdAt: '2026-09-12T11:20:00.000Z',
      updatedAt: '2026-09-12T11:20:00.000Z',
    },
    {
      id: 'note_pom_02',
      userId: 'usr_demo_readback_01',
      bookId: 'book_psychology_of_money',
      title: 'Reasonable beats purely rational',
      content: 'Do not aim to be coldly rational when making financial decisions. Aim to just be pretty reasonable. Reasonable is more realistic and you have a better chance of sticking with it over the long run.',
      noteType: 'thought',
      pageNumber: 114,
      personalReflection: 'Having a conservative cash buffer lets me sleep peacefully, even if spreadsheet math suggests investing 100% in index funds.',
      isFavourite: false,
      tags: ['Finance', 'Decision Making'],
      createdAt: '2026-09-24T15:40:00.000Z',
      updatedAt: '2026-09-24T15:40:00.000Z',
    },
    {
      id: 'note_dw_01',
      userId: 'usr_demo_readback_01',
      bookId: 'book_deep_work',
      title: 'The Deep Work Hypothesis',
      content: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive.',
      noteType: 'lesson',
      pageNumber: 14,
      personalReflection: 'Block 9:00 AM to 11:30 AM every morning with Slack/email closed for high-leverage architectural thinking.',
      isFavourite: true,
      tags: ['Focus', 'Productivity', 'Career'],
      createdAt: '2026-08-15T09:00:00.000Z',
      updatedAt: '2026-08-15T09:00:00.000Z',
    },
    {
      id: 'note_dw_02',
      userId: 'usr_demo_readback_01',
      bookId: 'book_deep_work',
      title: 'Embrace Boredom',
      content: 'If every moment of potential boredom in your life—say, having to wait five minutes in line or waiting for a colleague—is relieved with a quick glance at your smartphone, then your brain has likely been rewired to resist sustained concentration.',
      noteType: 'actionable',
      pageNumber: 161,
      personalReflection: 'Practice standing in line or sitting at red lights without reflexively pulling out my phone.',
      isFavourite: false,
      tags: ['Focus', 'Mindfulness'],
      createdAt: '2026-08-22T17:30:00.000Z',
      updatedAt: '2026-08-22T17:30:00.000Z',
    },
    {
      id: 'note_tfs_01',
      userId: 'usr_demo_readback_01',
      bookId: 'book_thinking_fast_slow',
      title: 'WYSIATI — What You See Is All There Is',
      content: 'System 1 radically constructs coherent stories based on limited available evidence, neglecting what it does not know. It is consistency, not completeness, that determines subjective confidence.',
      noteType: 'lesson',
      pageNumber: 87,
      personalReflection: 'Whenever I feel 100% sure about a design or business conclusion, ask: "What evidence am I completely missing right now?"',
      isFavourite: true,
      tags: ['Psychology', 'Decision Making', 'Cognitive Bias'],
      createdAt: '2026-09-20T10:15:00.000Z',
      updatedAt: '2026-09-20T10:15:00.000Z',
    },
  ],
  tags: [
    { id: 'tag_1', userId: 'usr_demo_readback_01', name: 'Habits', createdAt: '2026-10-16T08:30:00.000Z' },
    { id: 'tag_2', userId: 'usr_demo_readback_01', name: 'Systems', createdAt: '2026-10-16T08:30:00.000Z' },
    { id: 'tag_3', userId: 'usr_demo_readback_01', name: 'Productivity', createdAt: '2026-10-16T08:30:00.000Z' },
    { id: 'tag_4', userId: 'usr_demo_readback_01', name: 'Environment', createdAt: '2026-10-18T21:15:00.000Z' },
    { id: 'tag_5', userId: 'usr_demo_readback_01', name: 'Focus', createdAt: '2026-10-18T21:15:00.000Z' },
    { id: 'tag_6', userId: 'usr_demo_readback_01', name: 'Finance', createdAt: '2026-09-12T11:20:00.000Z' },
    { id: 'tag_7', userId: 'usr_demo_readback_01', name: 'Freedom', createdAt: '2026-09-12T11:20:00.000Z' },
    { id: 'tag_8', userId: 'usr_demo_readback_01', name: 'Psychology', createdAt: '2026-09-20T10:15:00.000Z' },
    { id: 'tag_9', userId: 'usr_demo_readback_01', name: 'Decision Making', createdAt: '2026-09-20T10:15:00.000Z' },
  ],
  reviewSchedules: [
    {
      id: 'rs_01',
      userId: 'usr_demo_readback_01',
      noteId: 'note_ah_01',
      nextReviewAt: '2026-11-04T01:00:00.000Z', // Due today!
      intervalDays: 3,
      easeFactor: 2.5,
      repetitions: 2,
      reviewStatus: 'active',
      createdAt: '2026-10-16T08:30:00.000Z',
      updatedAt: '2026-11-01T09:00:00.000Z',
    },
    {
      id: 'rs_02',
      userId: 'usr_demo_readback_01',
      noteId: 'note_pom_01',
      nextReviewAt: '2026-11-04T02:00:00.000Z', // Due today!
      intervalDays: 7,
      easeFactor: 2.6,
      repetitions: 3,
      reviewStatus: 'active',
      createdAt: '2026-09-12T11:20:00.000Z',
      updatedAt: '2026-10-28T09:00:00.000Z',
    },
    {
      id: 'rs_03',
      userId: 'usr_demo_readback_01',
      noteId: 'note_dw_01',
      nextReviewAt: '2026-11-05T10:00:00.000Z',
      intervalDays: 14,
      easeFactor: 2.6,
      repetitions: 4,
      reviewStatus: 'active',
      createdAt: '2026-08-15T09:00:00.000Z',
      updatedAt: '2026-10-22T09:00:00.000Z',
    },
    {
      id: 'rs_04',
      userId: 'usr_demo_readback_01',
      noteId: 'note_tfs_01',
      nextReviewAt: '2026-11-04T03:00:00.000Z', // Due today!
      intervalDays: 1,
      easeFactor: 2.3,
      repetitions: 1,
      reviewStatus: 'active',
      createdAt: '2026-09-20T10:15:00.000Z',
      updatedAt: '2026-11-03T07:30:00.000Z',
    },
  ],
  reviewHistory: [
    {
      id: 'rh_01',
      userId: 'usr_demo_readback_01',
      noteId: 'note_ah_01',
      rating: 'easy',
      reviewedAt: '2026-11-01T09:00:00.000Z',
      previousInterval: 1,
      nextInterval: 3,
    },
    {
      id: 'rh_02',
      userId: 'usr_demo_readback_01',
      noteId: 'note_pom_01',
      rating: 'easy',
      reviewedAt: '2026-10-28T09:00:00.000Z',
      previousInterval: 3,
      nextInterval: 7,
    },
    {
      id: 'rh_03',
      userId: 'usr_demo_readback_01',
      noteId: 'note_tfs_01',
      rating: 'difficult',
      reviewedAt: '2026-11-03T07:30:00.000Z',
      previousInterval: 0.2,
      nextInterval: 1,
    },
  ],
  actions: [
    {
      id: 'act_01',
      userId: 'usr_demo_readback_01',
      noteId: 'note_ah_02',
      bookId: 'book_atomic_habits',
      title: 'Move phone charger out of bedroom',
      description: 'Create friction for late-night scrolling and make bedside reading book obvious.',
      dueDate: '2026-11-08',
      status: 'pending',
      createdAt: '2026-10-18T21:20:00.000Z',
    },
    {
      id: 'act_02',
      userId: 'usr_demo_readback_01',
      noteId: 'note_dw_01',
      bookId: 'book_deep_work',
      title: 'Set up calendar morning focus blocks',
      description: 'Block 9:00 AM - 11:30 AM Monday through Thursday on work calendar.',
      dueDate: '2026-10-25',
      status: 'completed',
      completedAt: '2026-10-24T16:00:00.000Z',
      createdAt: '2026-08-15T09:15:00.000Z',
    },
  ],
  subscriptions: [
    {
      id: 'sub_demo_01',
      userId: 'usr_demo_readback_01',
      provider: 'none',
      planId: 'free',
      status: 'active',
      cancelAtPeriodEnd: false,
      createdAt: '2026-10-01T08:00:00.000Z',
      updatedAt: '2026-10-01T08:00:00.000Z',
    },
  ],
  notificationPreferences: [
    {
      id: 'notif_demo_01',
      userId: 'usr_demo_readback_01',
      emailEnabled: true,
      pushEnabled: false,
      dailyReviewEnabled: true,
      preferredReviewTime: '08:30',
      timezone: 'America/New_York',
    },
  ],
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
      return INITIAL_SEED;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return INITIAL_SEED;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

export const db = {
  // Profiles
  getProfileByUserId: (userId: string): UserProfile | undefined => {
    const data = ensureDbFile();
    return data.profiles.find((p) => p.id === userId);
  },
  getProfileByEmail: (email: string): UserProfile | undefined => {
    const data = ensureDbFile();
    return data.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  },
  saveProfile: (profile: UserProfile): UserProfile => {
    const data = ensureDbFile();
    const idx = data.profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      data.profiles[idx] = { ...data.profiles[idx], ...profile, updatedAt: new Date().toISOString() };
    } else {
      data.profiles.push(profile);
    }
    saveDb(data);
    return profile;
  },

  // Books
  getBooks: (userId: string): Book[] => {
    const data = ensureDbFile();
    const userNotes = data.notes.filter((n) => n.userId === userId);
    return data.books
      .filter((b) => b.userId === userId)
      .map((b) => ({
        ...b,
        notesCount: userNotes.filter((n) => n.bookId === b.id).length,
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  getBookById: (userId: string, bookId: string): Book | undefined => {
    const data = ensureDbFile();
    const book = data.books.find((b) => b.id === bookId && b.userId === userId);
    if (!book) return undefined;
    const notesCount = data.notes.filter((n) => n.bookId === bookId && n.userId === userId).length;
    return { ...book, notesCount };
  },
  saveBook: (book: Book): Book => {
    const data = ensureDbFile();
    const idx = data.books.findIndex((b) => b.id === book.id && b.userId === book.userId);
    const now = new Date().toISOString();
    if (idx >= 0) {
      data.books[idx] = { ...data.books[idx], ...book, updatedAt: now };
    } else {
      data.books.push({ ...book, createdAt: book.createdAt || now, updatedAt: now });
    }
    saveDb(data);
    return book;
  },
  deleteBook: (userId: string, bookId: string): boolean => {
    const data = ensureDbFile();
    const bookIdx = data.books.findIndex((b) => b.id === bookId && b.userId === userId);
    if (bookIdx === -1) return false;

    // Cascade delete notes, schedules, history, and actions tied to this book
    const bookNotes = data.notes.filter((n) => n.bookId === bookId && n.userId === userId);
    const noteIds = new Set(bookNotes.map((n) => n.id));

    data.books.splice(bookIdx, 1);
    data.notes = data.notes.filter((n) => !noteIds.has(n.id));
    data.reviewSchedules = data.reviewSchedules.filter((rs) => !noteIds.has(rs.noteId));
    data.reviewHistory = data.reviewHistory.filter((rh) => !noteIds.has(rh.noteId));
    data.actions = data.actions.filter((a) => !noteIds.has(a.noteId));

    saveDb(data);
    return true;
  },

  // Notes
  getNotes: (userId: string, bookId?: string): Note[] => {
    const data = ensureDbFile();
    return data.notes
      .filter((n) => n.userId === userId && (!bookId || n.bookId === bookId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getNoteById: (userId: string, noteId: string): Note | undefined => {
    const data = ensureDbFile();
    return data.notes.find((n) => n.id === noteId && n.userId === userId);
  },
  saveNote: (note: Note): Note => {
    const data = ensureDbFile();
    const idx = data.notes.findIndex((n) => n.id === note.id && n.userId === note.userId);
    const now = new Date().toISOString();
    if (idx >= 0) {
      data.notes[idx] = { ...data.notes[idx], ...note, updatedAt: now };
    } else {
      data.notes.push({ ...note, createdAt: note.createdAt || now, updatedAt: now });
      // Create initial review schedule 1 day out
      const scheduleId = `rs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      data.reviewSchedules.push({
        id: scheduleId,
        userId: note.userId,
        noteId: note.id,
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        reviewStatus: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }

    // Upsert tags
    note.tags.forEach((tagName) => {
      const exists = data.tags.some(
        (t) => t.userId === note.userId && t.name.toLowerCase() === tagName.toLowerCase()
      );
      if (!exists && tagName.trim()) {
        data.tags.push({
          id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          userId: note.userId,
          name: tagName.trim(),
          createdAt: now,
        });
      }
    });

    saveDb(data);
    return note;
  },
  deleteNote: (userId: string, noteId: string): boolean => {
    const data = ensureDbFile();
    const idx = data.notes.findIndex((n) => n.id === noteId && n.userId === userId);
    if (idx === -1) return false;

    data.notes.splice(idx, 1);
    data.reviewSchedules = data.reviewSchedules.filter((rs) => rs.noteId !== noteId);
    data.reviewHistory = data.reviewHistory.filter((rh) => rh.noteId !== noteId);
    data.actions = data.actions.filter((a) => a.noteId !== noteId);

    saveDb(data);
    return true;
  },
  toggleFavouriteNote: (userId: string, noteId: string): boolean => {
    const data = ensureDbFile();
    const note = data.notes.find((n) => n.id === noteId && n.userId === userId);
    if (!note) return false;
    note.isFavourite = !note.isFavourite;
    note.updatedAt = new Date().toISOString();
    saveDb(data);
    return note.isFavourite;
  },

  // Tags
  getTags: (userId: string): Tag[] => {
    const data = ensureDbFile();
    return data.tags.filter((t) => t.userId === userId);
  },

  // Review Schedules & History
  getReviewQueue: (userId: string): { schedule: ReviewSchedule; note: Note; book: Book }[] => {
    const data = ensureDbFile();
    const now = new Date();

    const activeSchedules = data.reviewSchedules.filter(
      (rs) => rs.userId === userId && rs.reviewStatus === 'active' && new Date(rs.nextReviewAt) <= now
    );

    const queue: { schedule: ReviewSchedule; note: Note; book: Book }[] = [];

    for (const schedule of activeSchedules) {
      const note = data.notes.find((n) => n.id === schedule.noteId && n.userId === userId);
      if (!note) continue;
      const book = data.books.find((b) => b.id === note.bookId && b.userId === userId);
      if (!book) continue;
      queue.push({ schedule, note, book });
    }

    return queue;
  },
  recordReview: (
    userId: string,
    noteId: string,
    rating: 'forgot' | 'difficult' | 'easy',
    nextIntervalDays: number,
    newEaseFactor: number,
    newRepetitions: number,
    nextReviewAt: string
  ): void => {
    const data = ensureDbFile();
    const now = new Date().toISOString();

    const schedule = data.reviewSchedules.find((rs) => rs.noteId === noteId && rs.userId === userId);
    const prevInterval = schedule ? schedule.intervalDays : 0;

    if (schedule) {
      schedule.intervalDays = nextIntervalDays;
      schedule.easeFactor = newEaseFactor;
      schedule.repetitions = newRepetitions;
      schedule.nextReviewAt = nextReviewAt;
      schedule.updatedAt = now;
    }

    data.reviewHistory.push({
      id: `rh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      noteId,
      rating,
      reviewedAt: now,
      previousInterval: prevInterval,
      nextInterval: nextIntervalDays,
    });

    saveDb(data);
  },
  getReviewHistory: (userId: string): ReviewHistoryEntry[] => {
    const data = ensureDbFile();
    return data.reviewHistory.filter((rh) => rh.userId === userId);
  },

  // Actions
  getActions: (userId: string): ActionItem[] => {
    const data = ensureDbFile();
    return data.actions.filter((a) => a.userId === userId);
  },
  saveAction: (action: ActionItem): ActionItem => {
    const data = ensureDbFile();
    const idx = data.actions.findIndex((a) => a.id === action.id && a.userId === action.userId);
    if (idx >= 0) {
      data.actions[idx] = { ...data.actions[idx], ...action };
    } else {
      data.actions.push(action);
    }
    saveDb(data);
    return action;
  },
  deleteAction: (userId: string, actionId: string): boolean => {
    const data = ensureDbFile();
    const idx = data.actions.findIndex((a) => a.id === actionId && a.userId === userId);
    if (idx === -1) return false;
    data.actions.splice(idx, 1);
    saveDb(data);
    return true;
  },

  // Subscriptions
  getSubscription: (userId: string): Subscription => {
    const data = ensureDbFile();
    const sub = data.subscriptions.find((s) => s.userId === userId);
    if (sub) return sub;

    const defaultSub: Subscription = {
      id: `sub_${userId}`,
      userId,
      provider: 'none',
      planId: 'free',
      status: 'active',
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.subscriptions.push(defaultSub);
    saveDb(data);
    return defaultSub;
  },
  updateSubscription: (subscription: Subscription): Subscription => {
    const data = ensureDbFile();
    const idx = data.subscriptions.findIndex((s) => s.userId === subscription.userId);
    if (idx >= 0) {
      data.subscriptions[idx] = { ...data.subscriptions[idx], ...subscription, updatedAt: new Date().toISOString() };
    } else {
      data.subscriptions.push(subscription);
    }
    saveDb(data);
    return subscription;
  },

  // Preferences
  getPreferences: (userId: string): NotificationPreferences => {
    const data = ensureDbFile();
    const pref = data.notificationPreferences.find((p) => p.userId === userId);
    if (pref) return pref;

    const defaultPref: NotificationPreferences = {
      id: `notif_${userId}`,
      userId,
      emailEnabled: true,
      pushEnabled: false,
      dailyReviewEnabled: true,
      preferredReviewTime: '08:30',
      timezone: 'UTC',
    };
    data.notificationPreferences.push(defaultPref);
    saveDb(data);
    return defaultPref;
  },
  savePreferences: (pref: NotificationPreferences): NotificationPreferences => {
    const data = ensureDbFile();
    const idx = data.notificationPreferences.findIndex((p) => p.userId === pref.userId);
    if (idx >= 0) {
      data.notificationPreferences[idx] = { ...data.notificationPreferences[idx], ...pref };
    } else {
      data.notificationPreferences.push(pref);
    }
    saveDb(data);
    return pref;
  },

  // Export data
  exportUserData: (userId: string) => {
    const data = ensureDbFile();
    return {
      profile: data.profiles.find((p) => p.id === userId),
      books: data.books.filter((b) => b.userId === userId),
      notes: data.notes.filter((n) => n.userId === userId),
      tags: data.tags.filter((t) => t.userId === userId),
      actions: data.actions.filter((a) => a.userId === userId),
      reviewHistory: data.reviewHistory.filter((rh) => rh.userId === userId),
      subscription: data.subscriptions.find((s) => s.userId === userId),
      exportedAt: new Date().toISOString(),
    };
  },
};
