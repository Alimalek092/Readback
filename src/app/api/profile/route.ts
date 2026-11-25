import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, sanitizeUser, SESSION_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = db.getSubscription(user.id);
  const preferences = db.getPreferences(user.id);

  return NextResponse.json({
    profile: sanitizeUser(user),
    subscription,
    preferences,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const fullProfile = db.getProfileByUserId(user.id);
    if (!fullProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updated = db.saveProfile({
      ...fullProfile,
      displayName: body.displayName ? body.displayName.trim() : fullProfile.displayName,
      timezone: body.timezone ? body.timezone.trim() : fullProfile.timezone,
      theme: body.theme || fullProfile.theme,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, profile: sanitizeUser(updated) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = db.deleteUserAccount(user.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const response = NextResponse.json({ success: true, redirectTo: '/' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
