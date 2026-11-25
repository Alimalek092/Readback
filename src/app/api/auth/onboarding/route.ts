import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, sanitizeUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullProfile = db.getProfileByUserId(user.id);
    if (!fullProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { interests, readingGoal } = await req.json();

    const updatedProfile = db.saveProfile({
      ...fullProfile,
      interests: interests || fullProfile.interests || [],
      readingGoal: readingGoal || fullProfile.readingGoal || '',
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, user: sanitizeUser(updatedProfile) });
  } catch (error) {
    console.error('Onboarding save error:', error);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
