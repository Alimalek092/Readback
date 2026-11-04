'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Target,
  Plus,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [readingGoal, setReadingGoal] = useState<string>('');
  const [firstBookTitle, setFirstBookTitle] = useState('');
  const [firstBookAuthor, setFirstBookAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Personal development',
    'Business & entrepreneurship',
    'Psychology & human behavior',
    'Personal finance & wealth',
    'Productivity & focus',
    'Philosophy & stoicism',
    'Biographies & memoirs',
    'Education & learning science',
    'Thoughtful fiction',
  ];

  const goalOptions = [
    'Remember more of what I read and overcome forgetting',
    'Organize my scattered book highlights in one clean space',
    'Build a lifelong personal knowledge library',
    'Apply reading lessons directly to my work and daily decisions',
    'Improve reading consistency and deep focus',
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const finishOnboarding = async (skipBook = false) => {
    setIsSubmitting(true);
    try {
      // If user typed a first book, save it
      if (!skipBook && firstBookTitle.trim() && firstBookAuthor.trim()) {
        await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: firstBookTitle.trim(),
            author: firstBookAuthor.trim(),
            status: 'currently_reading',
            category: selectedInterests[0] || 'General',
          }),
        });
      }

      // Save onboarding preferences
      await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: selectedInterests,
          readingGoal,
        }),
      });

      router.push('/app');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/app');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#74866B] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold text-[#292820]">ReadBack</span>
          </div>
          <span className="text-xs font-mono text-[#858276]">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Step container */}
        <div className="bg-white rounded-2xl border border-[#E9E5DC] p-8 shadow-card">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl text-[#292820]">
                Welcome to ReadBack.
              </h2>
              <p className="text-sm text-[#56544D] leading-relaxed">
                Most people spend hundreds of hours reading only to forget 80% within a month. ReadBack gives you one quiet, permanent place to capture, organize, remember, and actually live by the wisdom in your books.
              </p>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E5DC] space-y-2 text-xs text-[#6B685F]">
                <p className="font-semibold text-[#292820]">The Core Loop:</p>
                <p>READ → CAPTURE → ORGANIZE → REMEMBER → APPLY</p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Genres & Interests */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#292820] mb-1">
                  What do you mainly read?
                </h2>
                <p className="text-xs text-[#858276]">
                  Select all categories you enjoy exploring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleInterest(opt)}
                      className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#74866B] bg-[#E7EDE2] text-[#3E4F37]'
                          : 'border-[#E9E5DC] bg-[#FAF8F5] text-[#56544D] hover:border-[#D5CFC1]'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#74866B]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs text-[#858276] hover:text-[#292820]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={selectedInterests.length === 0}
                  className="flex-1 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all disabled:opacity-40"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reading Goal */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#292820] mb-1">
                  What is your primary reading goal?
                </h2>
                <p className="text-xs text-[#858276]">
                  This helps tailor your daily reviews and reflection reminders.
                </p>
              </div>

              <div className="space-y-2.5">
                {goalOptions.map((goal) => {
                  const isSelected = readingGoal === goal;
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setReadingGoal(goal)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#74866B] bg-[#E7EDE2] text-[#3E4F37]'
                          : 'border-[#E9E5DC] bg-[#FAF8F5] text-[#56544D] hover:border-[#D5CFC1]'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#74866B]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 text-xs text-[#858276] hover:text-[#292820]"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!readingGoal}
                  className="flex-1 py-2.5 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all disabled:opacity-40"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Add First Book */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#E7EDE2] text-[#74866B] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#292820] mb-1">
                  Add your first book
                </h2>
                <p className="text-xs text-[#858276]">
                  What book are you reading right now or planning to read next?
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Book Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Atomic Habits, Thinking Fast & Slow"
                    value={firstBookTitle}
                    onChange={(e) => setFirstBookTitle(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#858276] mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. James Clear"
                    value={firstBookAuthor}
                    onChange={(e) => setFirstBookAuthor(e.target.value)}
                    className="w-full text-sm bg-[#F8F6F0] border border-[#E9E5DC] rounded-xl px-3.5 py-2.5 text-[#292820] placeholder:text-[#858276]/60 focus:border-[#74866B] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => finishOnboarding(false)}
                  className="w-full py-3 rounded-button bg-[#74866B] hover:bg-[#617258] text-white text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {firstBookTitle ? 'Save Book & Open Dashboard' : 'Open Dashboard'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => finishOnboarding(true)}
                  className="w-full py-2 text-xs text-[#858276] hover:text-[#292820] transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
