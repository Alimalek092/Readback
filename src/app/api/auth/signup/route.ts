import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { UserProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, password } = await req.json();

    if (!email || !displayName || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existing = db.getProfileByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newProfile: UserProfile = {
      id: newUserId,
      email: email.trim().toLowerCase(),
      displayName: displayName.trim(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      theme: 'light',
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    db.saveProfile(newProfile);

    // Initialize default free subscription and notification preferences
    db.getSubscription(newUserId);
    db.getPreferences(newUserId);

    const response = NextResponse.json({
      success: true,
      user: newProfile,
      redirectTo: '/app/onboarding',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newUserId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during account creation.' },
      { status: 500 }
    );
  }
}
