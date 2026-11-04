import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const profile = db.getProfileByEmail(email);
    if (!profile) {
      return NextResponse.json(
        { error: 'No account found with this email. Please check or sign up.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: profile,
      redirectTo: profile.onboardingCompleted ? '/app' : '/app/onboarding',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: profile.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
