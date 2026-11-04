import { cookies } from 'next/headers';
import { db } from './db';
import { UserProfile } from './types';

export const SESSION_COOKIE_NAME = 'readback_session_uid';

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = cookies();
    const sessionUserId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionUserId) {
      return null;
    }

    const profile = db.getProfileByUserId(sessionUserId);
    return profile || null;
  } catch (err) {
    return null;
  }
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
