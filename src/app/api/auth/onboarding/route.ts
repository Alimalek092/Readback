import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interests, readingGoal } = await req.json();

    const updatedProfile = db.saveProfile({
      ...user,
      interests: interests || user.interests || [],
      readingGoal: readingGoal || user.readingGoal || '',
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, user: updatedProfile });
  } catch (error) {
    console.error('Onboarding save error:', error);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
