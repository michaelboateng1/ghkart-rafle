import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user, session, customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, randomUUID } from 'crypto';

export async function POST({ request, cookies }) {
	try {
		const { email, otp } = await request.json();

		console.log('Verifying OTP:', { email, otp });

		const verifyResult = await auth.api.checkVerificationOTP({
			body: {
				email: email,
				type: "email-verification",
				otp: otp
			}
		});

		if (!verifyResult) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Invalid or expired OTP"
				}),
				{ status: 400 }
			);
		}

		console.log('Verification result:', verifyResult);

		// Get customer to create session
		const customerRecord = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
		// Get user to create session
		const userRecord = await db.select().from(user).where(eq(user.email, email)).limit(1);

		if (!userRecord || userRecord.length === 0 || !customerRecord || customerRecord.length === 0) {
			throw new Error('User not found');
		}

		const customerId = customerRecord[0].id;

		// Update email verified status if not already
		await db.update(user).set({ emailVerified: true }).where(eq(user.email, email));

		// Create session manually (since auth.api.createSession is unavailable)
		const token = randomBytes(32).toString('hex');
		const sessionId = randomUUID();
		const now = new Date();
		const expiresAt = new Date(now.getTime() + (3 * 60 * 1000)); // 3 minutes from now
		
		const newSession = {
			id: sessionId,
			customerId: customerId,
			userId: userRecord[0].id,
			token: token,
			expiresAt: expiresAt,
			createdAt: now,
			updatedAt: now,
			ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('ip') || '127.0.0.1',
			userAgent: request.headers.get('user-agent')
		};

		await db.insert(session).values(newSession);
		
		cookies.set("better-auth.session_token", token, {
			path: "/",
			expires: expiresAt,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: "lax"
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Email verified successfully!',
				data: verifyResult,
				session: newSession
			}),
			{
				status: 200,
			}
		);
		
	} catch (error) {
		console.error('Verification error:', error);
		
		// Better error handling
		let errorMessage = 'Failed to verify OTP';
		
		if (error.body?.message) {
			const msg = error.body.message.toLowerCase();
			if (msg.includes('invalid') || msg.includes('incorrect')) {
				errorMessage = 'Invalid OTP code';
			} else if (msg.includes('expired')) {
				errorMessage = 'OTP has expired. Please request a new one.';
			} else if (msg.includes('attempt')) {
				errorMessage = 'Too many attempts. Please request a new code.';
			} else {
				errorMessage = error.body.message;
			}
		}
		
		return new Response(
			JSON.stringify({
				success: false,
				error: errorMessage
			}),
			{
				status: error.status || 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}