// import { auth } from '$lib/auth';

// export async function POST({ request }) {
// 	const { firstName, lastName, email, phoneNumber, location } = await request.json();
// 	const data = await auth.api.sendVerificationOTP({
// 		body: {
// 			email: email,
// 			type: 'email-verification'
// 		}
// 	});

// 	if (data) {
// 		console.log('Data Returned', data);
// 		return new Response(JSON.stringify(data), {
// 			status: 200
// 		});
// 	}

// 	return new Response(JSON.stringify(email), {
// 		status: 500
// 	});
// }

import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import {customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';


export async function POST({ request }) {
	try {
		const { firstName, lastName, email, phoneNumber, location } = await request.json();

		console.log('Processing signup for:', email);

		// Check if customer already exists
		const existingCustomer = await db.select().from(customers).where(eq(customers.email, email)).limit(1);

		let customerId;

		if (existingCustomer.length > 0) {
			console.log('User already exists:', existingCustomer[0].id);
			customerId = existingCustomer[0].id;
		} else {
			
			customerId = randomUUID();
			const now = new Date();

			// Create new customer record
			await db.insert(customers).values({
				id: randomUUID(),
				name: `${firstName} ${lastName}`,
				email: email,
				phoneNumber: phoneNumber,
				address: location,
				createdAt: now,
				updatedAt: now
			});

			console.log('New Customer record created');
		}

		// Send OTP for verification
		const otpResult = await auth.api.sendVerificationOTP({
			body: {
				email: email,
				type: 'email-verification'
			}
		});

		console.log('OTP sent successfully');

		return new Response(
			JSON.stringify({
				success: true,
				message: 'OTP sent to your email',
				email: email
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.error('Error during signup:', error);
		console.error('Error stack:', error.stack);

		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'Failed to create account'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}
