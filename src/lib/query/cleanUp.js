// utils/cleanup.js
import { db } from '$lib/server/db';
import { session, verification } from '$lib/server/db/schemas/schema.js';
import { sql } from 'drizzle-orm';

export async function cleanExpired() {
  const now = Date.now();

  try {
    // Delete expired sessions
    const deletedSessions = await db.delete(session).where(sql`${session.expiresAt} < ${now}`);
    
    // Delete expired OTP/verification codes
    const deletedVerifications = await db.delete(verification).where(sql`${verification.expiresAt} < ${now}`);

    console.log(
      `Cleanup complete: ${deletedSessions} expired sessions, ${deletedVerifications} expired OTPs removed`
    );
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
