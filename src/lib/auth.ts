import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from './db';
import { UserProfile } from './types';

export const SESSION_COOKIE_NAME = 'readback_session_uid';

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'readback_default_hmac_secret_change_in_prod_2026';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derivedBuf = crypto.scryptSync(password, salt, 64);
    if (keyBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, derivedBuf);
  } catch {
    return false;
  }
}

export function signSessionToken(userId: string): string {
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(userId)
    .digest('hex');
  return `${userId}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  if (!token) return null;
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;

  const userId = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!userId || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(userId)
    .digest('hex');

  try {
    const sigBuf = Buffer.from(sig, 'hex');
    const expectedBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expectedBuf.length) return null;
    return crypto.timingSafeEqual(sigBuf, expectedBuf) ? userId : null;
  } catch {
    return null;
  }
}

export function sanitizeUser(user: UserProfile): UserProfile {
  const { passwordHash: _removed, ...safe } = user;
  return safe;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = cookies();
    const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!rawCookie) {
      return null;
    }

    const userId = verifySessionToken(rawCookie);
    if (!userId) {
      return null;
    }

    const profile = db.getProfileByUserId(userId);
    return profile ? sanitizeUser(profile) : null;
  } catch {
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
