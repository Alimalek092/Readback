import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  SESSION_COOKIE_NAME,
  hashPassword,
  isValidEmail,
  sanitizeUser,
  signSessionToken,
} from '@/lib/auth';
import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, displayName, password } = body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !displayName || !password) {
      return NextResponse.json(
        { error: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existing = db.getProfileByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    let newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // If Supabase is configured, register the user in Supabase Auth & profiles table
    if (isSupabaseConfigured()) {
      const supabaseAdmin = getSupabaseAdmin();
      const supabaseClient = getSupabaseClient();

      if (supabaseAdmin) {
        const { data: createdAuth, error: authErr } =
          await supabaseAdmin.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
            user_metadata: { display_name: displayName.trim() },
          });

        if (authErr) {
          return NextResponse.json(
            { error: authErr.message || 'Could not register with Supabase.' },
            { status: 400 }
          );
        }

        if (createdAuth.user) {
          newUserId = createdAuth.user.id;
          await supabaseAdmin.from('profiles').upsert({
            id: newUserId,
            email: normalizedEmail,
            display_name: displayName.trim(),
            onboarding_completed: false,
          });
        }
      } else if (supabaseClient) {
        const { data: signUpData, error: signUpErr } = await supabaseClient.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (signUpErr) {
          return NextResponse.json(
            { error: signUpErr.message || 'Could not register with Supabase.' },
            { status: 400 }
          );
        }
        if (signUpData.user) {
          newUserId = signUpData.user.id;
        }
      }
    }

    const newProfile: UserProfile = {
      id: newUserId,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      displayName: displayName.trim(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      theme: 'light',
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    db.saveProfile(newProfile);
    db.getSubscription(newUserId);
    db.getPreferences(newUserId);

    const token = signSessionToken(newUserId);

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(newProfile),
      redirectTo: '/app/onboarding',
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during account creation.' },
      { status: 500 }
    );
  }
}
