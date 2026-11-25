import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SESSION_COOKIE_NAME, sanitizeUser, signSessionToken } from '@/lib/auth';

export async function POST() {
  const demoUser = db.getProfileByEmail('demo@readback.app');
  if (!demoUser) {
    return NextResponse.json({ error: 'Demo account not initialized.' }, { status: 500 });
  }

  const token = signSessionToken(demoUser.id);

  const response = NextResponse.json({
    success: true,
    user: sanitizeUser(demoUser),
    redirectTo: '/app',
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
