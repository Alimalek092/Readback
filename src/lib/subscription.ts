export interface PlanPricing {
  id: 'free' | 'plus_monthly' | 'plus_annual';
  name: string;
  tagline: string;
  priceUSD: number;
  priceINR: number;
  period: 'month' | 'year' | 'forever';
  limits: {
    maxBooks: number;
    maxNotes: number;
    canExport: boolean;
    fullAnalytics: boolean;
    unlimitedReviews: boolean;
  };
  features: string[];
}

export const PRICING_PLANS: Record<string, PlanPricing> = {
  free: {
    id: 'free',
    name: 'Free Library',
    tagline: 'For thoughtful readers starting their personal knowledge repository.',
    priceUSD: 0,
    priceINR: 0,
    period: 'forever',
    limits: {
      maxBooks: 5,
      maxNotes: 50,
      canExport: false,
      fullAnalytics: false,
      unlimitedReviews: false,
    },
    features: [
      'Up to 5 books in your library',
      'Up to 50 saved ideas & quotes',
      'Basic daily review (up to 5 cards/day)',
      'Global note search',
      'Standard reading statistics',
      'Open Library book search',
    ],
  },
  plus_monthly: {
    id: 'plus_monthly',
    name: 'ReadBack Plus',
    tagline: 'For lifelong learners who want every important book lesson at their fingertips.',
    priceUSD: 2.99,
    priceINR: 149,
    period: 'month',
    limits: {
      maxBooks: Infinity,
      maxNotes: Infinity,
      canExport: true,
      fullAnalytics: true,
      unlimitedReviews: true,
    },
    features: [
      'Unlimited books in your library',
      'Unlimited saved ideas & reflections',
      'Full adaptive spaced-repetition engine',
      'Advanced note tagging & taxonomy',
      'Action items with deadlines & reflections',
      'Complete reading & retention insights',
      'Export notes to Markdown, JSON & CSV',
      'Priority cloud sync & backup',
    ],
  },
  plus_annual: {
    id: 'plus_annual',
    name: 'ReadBack Plus (Annual)',
    tagline: 'Best value for dedicated readers. Save over 30% annually.',
    priceUSD: 24.99,
    priceINR: 999,
    period: 'year',
    limits: {
      maxBooks: Infinity,
      maxNotes: Infinity,
      canExport: true,
      fullAnalytics: true,
      unlimitedReviews: true,
    },
    features: [
      'Everything in ReadBack Plus',
      'Save over 30% vs monthly',
      'Lifetime knowledge archive guarantee',
      'Early access to new AI reflection features',
    ],
  },
};

export function checkPlanLimits(
  planId: 'free' | 'plus_monthly' | 'plus_annual',
  currentBookCount: number,
  currentNoteCount: number
) {
  const plan = PRICING_PLANS[planId] || PRICING_PLANS.free;
  return {
    canAddBook: currentBookCount < plan.limits.maxBooks,
    canAddNote: currentNoteCount < plan.limits.maxNotes,
    booksRemaining: Math.max(0, plan.limits.maxBooks - currentBookCount),
    notesRemaining: Math.max(0, plan.limits.maxNotes - currentNoteCount),
    isUnlimited: plan.limits.maxBooks === Infinity,
  };
}
