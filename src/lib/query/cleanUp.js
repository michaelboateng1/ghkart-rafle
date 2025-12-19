// utils/cleanup.js
import { db } from '$lib/server/db';
import { sessions, verification } from '$lib/server/db/schemas/schema';
import { sql } from 'drizzle-orm';

export async function cleanExpired() {
  const now = new Date();

  try {
    // Delete expired sessions
    const deletedSessions = await db.delete(sessions).where(sql`${sessions.expiresAt} < ${now}`);
    
    // Delete expired OTP/verification codes
    const deletedVerifications = await db.delete(verification).where(sql`${verification.expiresAt} < ${now}`);

    // console.log('Cleanup complete: expired sessions and OTPs removed');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
