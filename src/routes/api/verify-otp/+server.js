import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, randomUUID } from 'crypto';

import { router } from 'better-auth/api';
import { page } from '$app/state';

import { updateEmailVerifiedStatus } from '$lib/query/updateData.js';
import { getCustomerByEmail } from '$lib/query/queryData.js';
import {getUserAccountByEmail} from "$lib/query/queryData.js";
import { insertSession } from '$lib/query/insertData.js';

export async function POST({ request }) {
	try {
		const { email, otp } = await request.json();

		console.log('Verifying OTP:', { email, otp });
		console.log('Available auth.api methods:', Object.keys(auth.api));

		const verifyResult = await auth.api.checkVerificationOTP({
			body: {
				email: email,
				type: "email-verification",
				otp: otp
			}
		});

		console.log('Verification result:', verifyResult);

		if (verifyResult) {
			// Get customer to create session
			const existingCustomer = getCustomerByEmail(email);
			// Get user to create session
			const existingUser = getUserAccountByEmail(email);

			console.log("all customer data: ", existingCustomer);

			if (existingCustomer.length > 0) {
				const customerId = existingCustomer[0].id;

				page.state = {customerId, userId: existingUser[0].id, email};

				if(existingCustomer[0].number_of_spin >= 3) throw new Error("You've reach your number of spining");

				// Update email verified status if not already
				updateEmailVerifiedStatus(existingCustomer)

				// Correct the colum name
				if(existingCustomer[0].win_price && !existingCustomer[0].claimprice){
					router('/preview-certificate');
					return;
				}

				// Create session manually (since auth.api.createSession is unavailable)
				const token = randomBytes(32).toString('hex');
				const sessionId = randomUUID();
				const now = new Date();
				const expiresAt = 60 * 60 * 5; // 7 days

				const newSession = {
					id: sessionId,
					customerId: customerId,
					token: token,
					expiresAt: expiresAt,
					createdAt: now,
					updatedAt: now,
					ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('ip') || '127.0.0.1',
					userAgent: request.headers.get('user-agent')
				};

				insertSession(newSession);

				// Set session cookie
				const headers = new Headers();
				headers.set('Content-Type', 'application/json');
				
				// Construct cookie string manually
				// better-auth buffer encoding might differ but hex is standard enough.
				// Format: better-auth.session_token=token; Path=/; HttpOnly; SameSite=Lax; Expires=...
				const cookieValue = `better-auth.session_token=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}`;
				
				// If https, add Secure. (Assuming dev env might not be https, but good to add if in prod? better-auth handles this automatically usually)
				// For now locally:
				headers.append('Set-Cookie', cookieValue);

				return new Response(
					JSON.stringify({
						success: true,
						message: 'Email verified successfully!',
						data: verifyResult,
						session: newSession
					}),
					{
						status: 200,
						headers: headers
					}
				);
			} else {
				// Should not happen if flow is correct, but handle it
				return new Response(
					JSON.stringify({
						success: false,
						error: 'User not found'
					}),
					{ status: 404, headers: { 'Content-Type': 'application/json' } }
				);
			}
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Invalid or expired OTP'
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}
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