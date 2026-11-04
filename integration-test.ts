import assert from 'assert';
import { db } from './src/lib/db';
import { checkPlanLimits, PRICING_PLANS } from './src/lib/subscription';
import { calculateNextReview, calculateStreak } from './src/lib/spaced-repetition';

async function runIntegrationTests() {
  console.log('\n====================================================');
  console.log('       READBACK SAAS INTEGRATION SUITE              ');
  console.log('====================================================');

  // Test 1: Seed data integrity
  console.log('\n--- 1. Seed Data Integrity ---');
  const demoUser = db.getProfileByEmail('demo@readback.app');
  assert.ok(demoUser, 'Demo account must exist in seed database');
  assert.strictEqual(demoUser.displayName, 'Arthur Pendelton', 'Demo user must be Arthur Pendelton');

  const demoBooks = db.getBooks(demoUser.id);
  assert.ok(demoBooks.length >= 5, `Demo user must have at least 5 books (found ${demoBooks.length})`);
  const atomicHabits = demoBooks.find((b) => b.title === 'Atomic Habits');
  assert.ok(atomicHabits, 'Atomic Habits must exist in library');
  assert.strictEqual(atomicHabits.status, 'currently_reading', 'Atomic Habits should be currently reading');
  console.log(`✓ Demo user verified with ${demoBooks.length} books`);

  // Test 2: Notes & Cross-Book Search
  console.log('\n--- 2. Notes & Search Logic ---');
  const demoNotes = db.getNotes(demoUser.id);
  assert.ok(demoNotes.length >= 8, `Demo user must have at least 8 notes (found ${demoNotes.length})`);
  const habitNotes = demoNotes.filter((n) => n.tags.includes('Habits'));
  assert.ok(habitNotes.length > 0, 'Tags indexing must find notes tagged #Habits');
  console.log(`✓ Notes verified: ${demoNotes.length} notes, search indexing functional`);

  // Test 3: Review Queue Generation
  console.log('\n--- 3. Spaced Repetition Review Queue ---');
  const queue = db.getReviewQueue(demoUser.id);
  console.log(`✓ Active queue retrieved: ${queue.length} cards scheduled for today`);
  assert.ok(queue.length > 0, 'Should have cards due today in demo queue');

  // Test 4: Record a review and verify schedule update
  const firstItem = queue[0];
  const oldRepetitions = firstItem.schedule.repetitions;
  const calc = calculateNextReview('easy', firstItem.schedule);
  db.recordReview(
    demoUser.id,
    firstItem.note.id,
    'easy',
    calc.nextIntervalDays,
    calc.newEaseFactor,
    calc.newRepetitions,
    calc.nextReviewAt
  );

  const updatedHistory = db.getReviewHistory(demoUser.id);
  const latestEntry = updatedHistory[updatedHistory.length - 1];
  assert.strictEqual(latestEntry.noteId, firstItem.note.id);
  assert.strictEqual(latestEntry.rating, 'easy');
  console.log(`✓ Review recorded successfully: rating=easy, next interval=${calc.nextIntervalDays} days`);

  // Test 5: Export formatting
  console.log('\n--- 5. Data Export Verification ---');
  const exported = db.exportUserData(demoUser.id);
  assert.ok(exported.books.length > 0, 'Export must contain books');
  assert.ok(exported.notes.length > 0, 'Export must contain notes');
  assert.ok(exported.reviewHistory.length > 0, 'Export must contain review history');
  console.log(`✓ Data export contains ${exported.books.length} books, ${exported.notes.length} notes`);

  console.log('\n====================================================');
  console.log('   ALL READBACK INTEGRATION TESTS PASSED (100%)     ');
  console.log('====================================================\n');
}

runIntegrationTests().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
