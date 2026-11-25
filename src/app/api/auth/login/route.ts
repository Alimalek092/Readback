import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  SESSION_COOKIE_NAME,
  hashPassword,
  isValidEmail,
  sanitizeUser,
  signSessionToken,
  verifyPassword,
} from '@/lib/auth';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Email address and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // If Supabase is configured, verify credentials against Supabase Auth first
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: authData, error: authErr } =
          await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

        if (authErr || !authData.user) {
          return NextResponse.json(
            { error: 'Invalid email or password.' },
            { status: 401 }
          );
        }

        // Ensure local profile mirror exists for this Supabase user
        let profile = db.getProfileByUserId(authData.user.id) || db.getProfileByEmail(normalizedEmail);
        if (!profile) {
          const now = new Date().toISOString();
          profile = db.saveProfile({
            id: authData.user.id,
            email: normalizedEmail,
            passwordHash: hashPassword(password),
            displayName:
              (authData.user.user_metadata?.display_name as string) ||
              normalizedEmail.split('@')[0],
            timezone: 'UTC',
            theme: 'light',
            onboardingCompleted: false,
            createdAt: now,
            updatedAt: now,
          });
        }

        const token = signSessionToken(profile.id);
        const response = NextResponse.json({
          success: true,
          user: sanitizeUser(profile),
          redirectTo: profile.onboardingCompleted ? '/app' : '/app/onboarding',
        });

        response.cookies.set({
          name: SESSION_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        });

        return response;
      }
    }

    const profile = db.getProfileByEmail(normalizedEmail);
    if (!profile) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please sign up first.' },
        { status: 401 }
      );
    }

    const isDemoLegacy =
      profile.email === 'demo@readback.app' && !profile.passwordHash && password === 'password123';
    const isValid = isDemoLegacy || verifyPassword(password, profile.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const token = signSessionToken(profile.id);

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(profile),
      redirectTo: profile.onboardingCompleted ? '/app' : '/app/onboarding',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
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
