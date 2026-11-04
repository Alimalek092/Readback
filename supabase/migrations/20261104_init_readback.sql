-- =========================================================================
-- ReadBack SaaS — Production PostgreSQL Schema with Row Level Security (RLS)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    theme TEXT DEFAULT 'light',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    interests TEXT[] DEFAULT '{}',
    reading_goal TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    cover_url TEXT,
    description TEXT,
    publication_year INT,
    category TEXT DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'want_to_read' CHECK (status IN ('want_to_read', 'currently_reading', 'completed', 'paused', 'abandoned')),
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'lesson' CHECK (note_type IN ('lesson', 'quote', 'thought', 'question', 'actionable')),
    page_number INT,
    personal_reflection TEXT,
    is_favourite BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- 5. REVIEW SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.review_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    next_review_at TIMESTAMPTZ NOT NULL,
    interval_days NUMERIC NOT NULL DEFAULT 1,
    ease_factor NUMERIC NOT NULL DEFAULT 2.5,
    repetitions INT NOT NULL DEFAULT 0,
    review_status TEXT NOT NULL DEFAULT 'active' CHECK (review_status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEW HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.review_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('forgot', 'difficult', 'easy')),
    reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    previous_interval NUMERIC NOT NULL,
    next_interval NUMERIC NOT NULL
);

-- 7. ACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT DEFAULT 'none',
    provider_customer_id TEXT,
    provider_subscription_id TEXT,
    plan_id TEXT NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'plus_monthly', 'plus_annual')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'none')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    daily_review_enabled BOOLEAN DEFAULT TRUE,
    preferred_review_time TEXT DEFAULT '08:30',
    timezone TEXT DEFAULT 'America/New_York'
);

-- =========================================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON public.notes(book_id);
CREATE INDEX IF NOT EXISTS idx_review_schedules_due ON public.review_schedules(user_id, next_review_at) WHERE review_status = 'active';
CREATE INDEX IF NOT EXISTS idx_review_history_user_date ON public.review_history(user_id, reviewed_at);
CREATE INDEX IF NOT EXISTS idx_actions_user_status ON public.actions(user_id, status);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can manage their own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Books: Users can manage only their own books
CREATE POLICY "Users can manage their own books" 
ON public.books FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Notes: Users can manage only their own notes
CREATE POLICY "Users can manage their own notes" 
ON public.notes FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Tags: Users can manage only their own tags
CREATE POLICY "Users can manage their own tags" 
ON public.tags FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Review Schedules: Users can manage only their own review schedules
CREATE POLICY "Users can manage their own review schedules" 
ON public.review_schedules FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Review History: Users can view and insert their own review history
CREATE POLICY "Users can manage their own review history" 
ON public.review_history FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Actions: Users can manage only their own action items
CREATE POLICY "Users can manage their own actions" 
ON public.actions FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Subscriptions: Users can read their own subscription
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Preferences: Users can manage their own preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
