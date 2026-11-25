const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Spaced Repetition Engine Test
function testSpacedRepetition() {
  console.log('\n--- 1. Testing Spaced Repetition Algorithm ---');
  const { calculateNextReview, calculateStreak } = require('./src/lib/spaced-repetition');

  // Test Forgot (rating: 'forgot')
  const forgotResult = calculateNextReview('forgot', { intervalDays: 3, easeFactor: 2.5, repetitions: 2 });
  assert.strictEqual(forgotResult.nextIntervalDays, 0.2, 'Forgot should set interval to ~0.2 days');
  assert.strictEqual(forgotResult.newRepetitions, 0, 'Forgot should reset repetition counter to 0');
  assert.strictEqual(forgotResult.newEaseFactor, 2.3, 'Forgot should decrease ease factor by 0.2');
  console.log('✓ Forgot rating correctly reschedules soon and resets repetitions');

  // Test Difficult (rating: 'difficult')
  const diffResult = calculateNextReview('difficult', { intervalDays: 3, easeFactor: 2.5, repetitions: 1 });
  assert.strictEqual(diffResult.nextIntervalDays, 1, 'Difficult should set interval to 1 day');
  assert.strictEqual(diffResult.newRepetitions, 2, 'Difficult should increment repetitions');
  assert.strictEqual(diffResult.newEaseFactor, 2.35, 'Difficult should decrease ease factor by 0.15');
  console.log('✓ Difficult rating correctly sets next interval to 1 day');

  // Test Easy (rating: 'easy')
  const easyFirstResult = calculateNextReview('easy', { intervalDays: 1, easeFactor: 2.5, repetitions: 0 });
  assert.strictEqual(easyFirstResult.nextIntervalDays, 3, 'First easy review should schedule 3 days out');

  const easySecondResult = calculateNextReview('easy', { intervalDays: 3, easeFactor: 2.6, repetitions: 1 });
  assert.strictEqual(easySecondResult.nextIntervalDays, 7, 'Second easy review should schedule 7 days out');

  const easyThirdResult = calculateNextReview('easy', { intervalDays: 7, easeFactor: 2.7, repetitions: 2 });
  assert.strictEqual(easyThirdResult.nextIntervalDays, 19, 'Subsequent reviews should scale by ease factor (7 * 2.7 = 18.9 -> 19)');
  console.log('✓ Easy rating correctly scales intervals deterministically (3d -> 7d -> 19d)');

  // Test Streak Calculation
  const now = new Date();
  const todayStr = now.toISOString();
  const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgoStr = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const mockHistory = [
    { reviewedAt: todayStr },
    { reviewedAt: yesterdayStr },
    { reviewedAt: twoDaysAgoStr },
  ];
  const streak = calculateStreak(mockHistory);
  assert.strictEqual(streak, 3, 'Streak should calculate 3 consecutive review days');
  console.log('✓ Review streak accurately calculates consecutive days (3 days)');
}

// 2. Freemium & Plan Limits Test
function testPlanLimits() {
  console.log('\n--- 2. Testing Freemium Plan Limits ---');
  const { checkPlanLimits, PRICING_PLANS } = require('./src/lib/subscription');

  assert.strictEqual(PRICING_PLANS.free.limits.maxBooks, 5, 'Free plan must limit to 5 books');
  assert.strictEqual(PRICING_PLANS.free.limits.maxNotes, 50, 'Free plan must limit to 50 notes');
  assert.strictEqual(PRICING_PLANS.plus_monthly.priceUSD, 2.99, 'Plus monthly should be $2.99');
  assert.strictEqual(PRICING_PLANS.plus_monthly.priceINR, 149, 'Plus monthly in India should be ₹149');

  const underLimit = checkPlanLimits('free', 3, 20);
  assert.strictEqual(underLimit.canAddBook, true, 'User with 3 books can add another');
  assert.strictEqual(underLimit.canAddNote, true, 'User with 20 notes can add another');

  const atBookLimit = checkPlanLimits('free', 5, 20);
  assert.strictEqual(atBookLimit.canAddBook, false, 'User with 5 books cannot add another without Plus');

  const atNoteLimit = checkPlanLimits('free', 3, 50);
  assert.strictEqual(atNoteLimit.canAddNote, false, 'User with 50 notes cannot add another without Plus');

  const plusUser = checkPlanLimits('plus_monthly', 25, 300);
  assert.strictEqual(plusUser.canAddBook, true, 'Plus user has unlimited books');
  assert.strictEqual(plusUser.canAddNote, true, 'Plus user has unlimited notes');
  console.log('✓ Free and Plus plan boundaries strictly enforced');
}

// 3. Database & Relational Isolation Test (User A vs User B)
function testDatabaseIsolation() {
  console.log('\n--- 3. Testing Multi-User Data Isolation ---');
  const { db } = require('./src/lib/db');

  const userA = 'test_usr_alice';
  const userB = 'test_usr_bob';

  // Seed Alice
  db.saveProfile({
    id: userA,
    email: 'alice@example.com',
    displayName: 'Alice Reader',
    timezone: 'UTC',
    theme: 'light',
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Alice adds a book and a private note
  const bookA = db.saveBook({
    id: 'book_alice_01',
    userId: userA,
    title: "Alice's Secret Book",
    author: 'Lewis Carroll',
    category: 'Classics',
    status: 'currently_reading',
    progressPercentage: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const noteA = db.saveNote({
    id: 'note_alice_01',
    userId: userA,
    bookId: bookA.id,
    title: 'Private Reflection',
    content: 'Curiouser and curiouser!',
    noteType: 'lesson',
    isFavourite: true,
    tags: ['Curiosity'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Verify Bob cannot see Alice's books
  const bobBooks = db.getBooks(userB);
  assert.strictEqual(bobBooks.some((b) => b.id === bookA.id), false, "User B must never see User A's books");

  // Verify Bob cannot see Alice's notes
  const bobNotes = db.getNotes(userB);
  assert.strictEqual(bobNotes.some((n) => n.id === noteA.id), false, "User B must never see User A's notes");

  // Verify Bob cannot access Alice's book by ID
  const directFetch = db.getBookById(userB, bookA.id);
  assert.strictEqual(directFetch, undefined, "User B fetching User A's book by ID returns undefined");

  // Verify Bob cannot delete Alice's book
  const deleteAttempt = db.deleteBook(userB, bookA.id);
  assert.strictEqual(deleteAttempt, false, "User B cannot delete User A's book");

  console.log('✓ Multi-user data isolation verified: User A data is completely unreachable by User B');

  // Clean up test data
  db.deleteBook(userA, bookA.id);
}

// 4. Cryptographic Password & Signed Session Token Test
function testAuthSecurity() {
  console.log('\n--- 4. Testing Password Hashing, Signed Cookies & Email Validation ---');
  const {
    hashPassword,
    verifyPassword,
    signSessionToken,
    verifySessionToken,
    isValidEmail,
  } = require('./src/lib/auth');
  const { db } = require('./src/lib/db');

  assert.strictEqual(isValidEmail('reader@example.com'), true, 'Valid email must pass');
  assert.strictEqual(isValidEmail('not-an-email'), false, 'Invalid email must fail');
  assert.strictEqual(isValidEmail('1234567890'), false, 'Phone number must be rejected');

  const hash = hashPassword('MySecretPass123!');
  assert.strictEqual(verifyPassword('MySecretPass123!', hash), true, 'Valid password must verify');
  assert.strictEqual(verifyPassword('WrongPass', hash), false, 'Wrong password must fail');

  const token = signSessionToken('usr_12345');
  assert.strictEqual(verifySessionToken(token), 'usr_12345', 'Valid signed token must return userId');
  assert.strictEqual(verifySessionToken('usr_99999.tampered'), null, 'Tampered token must be rejected');

  const emailUserId = 'test_usr_email_01';
  db.saveProfile({
    id: emailUserId,
    email: 'maya.lin@example.com',
    passwordHash: hash,
    displayName: 'Maya Lin',
    timezone: 'UTC',
    theme: 'light',
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const foundByEmail = db.getProfileByEmail('MAYA.LIN@example.com');
  assert.ok(foundByEmail, 'User should be found by case-insensitive email');
  assert.strictEqual(foundByEmail.id, emailUserId);

  const deleted = db.deleteUserAccount(emailUserId);
  assert.strictEqual(deleted, true, 'Account deletion should succeed');
  assert.strictEqual(db.getProfileByUserId(emailUserId), undefined, 'Deleted account must be gone');
  console.log('✓ Password hashing, HMAC session verification, email validation & account deletion verified');
}

// 5. Run All
try {
  console.log('====================================================');
  console.log('      READBACK SAAS AUTOMATED TEST SUITE            ');
  console.log('====================================================');
  testSpacedRepetition();
  testPlanLimits();
  testDatabaseIsolation();
  testAuthSecurity();
  console.log('\n====================================================');
  console.log('      ALL AUTOMATED VERIFICATION TESTS PASSED       ');
  console.log('====================================================\n');
} catch (err) {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
}
