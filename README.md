# ReadBack — Personal Knowledge SaaS for Readers

> **Tagline**: *Read less forgetfully. Learn more permanently.*  
> **Core Loop**: **READ → CAPTURE → ORGANIZE → REMEMBER → APPLY**

ReadBack is a production-ready personal knowledge SaaS built for non-fiction, psychology, finance, and philosophy readers who want a peaceful, editorial sanctuary to capture meaningful ideas and retain them forever through adaptive spaced repetition.

---

## 1. Visual Identity & Editorial Design System

- **Warm Editorial Color Palette**:
  - Main background: `#F8F6F0`
  - Secondary background: `#F1EEE6`
  - Card background: `#FFFFFF`
  - Main text: `#292820` (warm charcoal)
  - Secondary text: `#858276`
  - Primary accent: `#74866B` (muted sage green)
  - Light accent: `#E7EDE2`
  - Border: `#E9E5DC`
  - Status indicators: Success `#6F8F70`, Warning `#C49A59`, Error `#B96C64`
- **Typography**:
  - Headings: *DM Serif Display* (editorial serif)
  - Body: *Inter* (clean sans-serif)
  - Statistics & Numbers: Tabular numerals (`num-tabular`)

---

## 2. Implemented Routes & Features

### Public Marketing Website
- `/` — Editorial Landing Page (Hero with live product preview, 5-step learning loop, feature showcase, pricing comparison, FAQ, and final CTA)
- `/pricing` — Transparent Free vs. Plus pricing with Monthly/Annual toggles and USD/INR currency support
- `/about` — ReadBack philosophy and the reader-first manifesto
- `/privacy` — Comprehensive privacy policy (zero data selling, no AI training on private notes)
- `/terms` — Commercial Terms of Service
- `/login` — Email authentication with one-click Demo Account button
- `/signup` — Registration flow connecting directly to onboarding
- `/forgot-password` — Password reset request and confirmation

### Authenticated Application
- `/app` — Dashboard with personalized greeting, real reading statistics, "Remember Today" hero spotlight, Continue Reading shelf, and Recent Ideas
- `/app/onboarding` — Interactive 4-step onboarding (reading interests, reading goals, first book creation, instant sync)
- `/app/library` — Personal Bookshelf (Grid and List views, filter tabs: All, Reading, Completed, Want to Read, Paused; sort by recently updated/title/progress)
- `/app/library/[bookId]` — Individual Book Knowledge Page (Cover hero, status pill, progress slider, tabs: Overview, Lessons, Quotes, Reflections, Actions, inline capture modal, delete book confirmation)
- `/app/notes` — Central Knowledge Library (Unified cross-book note search, tag filtering, note type filtering, favourites toggle, book backlinks)
- `/app/review` — Spaced Repetition "Remember Today" Engine (Flash review cards, memory rating: Forgot / Difficult / Easy, interval calculation, celebratory completion screen)
- `/app/insights` — Learning Analytics (Real book completion metrics, category breakdowns, monthly reflection summary)
- `/app/settings` — Profile, timezone, review reminder times, data export (JSON & Markdown), account deletion, subscription management

---

## 3. Spaced Repetition Review Engine

The review engine uses a deterministic adaptive SM-2 variant:
- **Forgot (`rating = 'forgot'`)**:
  - Interval reset to `0.2` days (~5 hours / next session)
  - Repetitions counter reset to `0`
  - Ease factor decreased by `0.2` (minimum `1.3`)
- **Difficult (`rating = 'difficult'`)**:
  - Interval set to `1` day
  - Repetitions counter incremented by `1`
  - Ease factor decreased by `0.15` (minimum `1.3`)
- **Easy (`rating = 'easy'`)**:
  - Repetition 0: `3` days
  - Repetition 1: `7` days
  - Repetition 2+: `Math.round(previous_interval * ease_factor)`
  - Ease factor increased by `0.1` (maximum `2.8`)
- **Streak Calculation**: Evaluates contiguous days with recorded review sessions in `review_history`.

---

## 4. Database Architecture & Supabase Migration

The app operates with dual-mode storage:
1. **Local Persistent Storage**: Relational JSON engine at `data/readback.json` with multi-user isolation, ACID-like atomic writes, and seed data.
2. **Production Supabase PostgreSQL**: Complete SQL migration with Row Level Security (RLS) located at:
   `supabase/migrations/20261104_init_readback.sql`

Entities:
- `profiles` (User details, preferences, onboarding state)
- `books` (Title, author, isbn, cover_url, status, progress)
- `notes` (Content, note_type, personal_reflection, page_number, tags, favourite)
- `tags` (User taxonomy)
- `review_schedules` (Spaced repetition intervals, ease factors, next review timestamps)
- `review_history` (Log of all review interactions and ratings)
- `actions` (Action items attached to notes with status and due dates)
- `subscriptions` (Plan ID, status, billing provider)
- `notification_preferences` (Daily review reminder times, timezone)

---

## 5. Quick Start & Testing

```bash
# Navigate to the project directory
cd readback

# Run automated unit and integration tests
npm test

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser. You can click **"One-Click Demo Account (Arthur's Library)"** on the sign-in page to instantly explore pre-populated books (*Atomic Habits*, *The Psychology of Money*, *Deep Work*) and review decks.
