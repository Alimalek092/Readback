import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const preferences = db.getPreferences(user.id);
  return NextResponse.json({ preferences });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = db.getPreferences(user.id);

    const updated = db.savePreferences({
      ...existing,
      emailEnabled: body.emailEnabled !== undefined ? Boolean(body.emailEnabled) : existing.emailEnabled,
      pushEnabled: body.pushEnabled !== undefined ? Boolean(body.pushEnabled) : existing.pushEnabled,
      dailyReviewEnabled:
        body.dailyReviewEnabled !== undefined
          ? Boolean(body.dailyReviewEnabled)
          : existing.dailyReviewEnabled,
      preferredReviewTime: body.preferredReviewTime || existing.preferredReviewTime,
      timezone: body.timezone || existing.timezone,
    });

    // Sync timezone to user profile as well
    if (body.timezone) {
      const fullProfile = db.getProfileByUserId(user.id);
      if (fullProfile) {
        db.saveProfile({ ...fullProfile, timezone: body.timezone });
      }
    }

    return NextResponse.json({ success: true, preferences: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
