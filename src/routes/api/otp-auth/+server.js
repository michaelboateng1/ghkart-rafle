import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import {customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';


export async function POST({ request, cookies }) {
	try {
		const { firstName, lastName, email, phoneNumber, location } = await request.json();

		// console.log('Processing signup for:', email);

		// Check if customer already exists
		const existingCustomer = await db.select({ id: customers.id })
		.from(customers)
		.where(eq(customers.email, email))
		.limit(1);

		let customerId;

		if (existingCustomer.length > 0) {
			// console.log('User already exists:', existingCustomer[0].id);
			customerId = existingCustomer[0].id;
		} else {
			
			customerId = randomUUID();
			const now = new Date();

			// Create new customer record
			await db.insert(customers).values({
				id: customerId,
				name: `${firstName} ${lastName}`,
				email: email,
				phoneNumber: phoneNumber,
				address: location,
				createdAt: now,
				updatedAt: now
			});

			// console.log('New Customer record created');
		}

		// Send OTP for verification
		const otpResult = await auth.api.sendVerificationOTP({
			body: {
				email: email,
				type: 'email-verification'
			}
		});

		// console.log('OTP sent successfully');

		const now = new Date();
        const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);

		cookies.set("ghkart.user_email", email, {
            path: "/",
            expires: expiresAt,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
            sameSite: "lax"
        });

        // console.log("OTP helper cookie set:", cookies.get("ghkart.user_email"));

		return new Response(
			JSON.stringify({
				success: true,
				message: 'We sent 4 digit code to your email',
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

		if(error.message.includes('UNIQUE constraint failed:')) {
			const getColumn = error.message.split(".");
			return new Response(
				JSON.stringify({
					success: false,
					error: `${getColumn[1].split("_").join(" ")} already exists`
				}),
				{
					status: 409,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}else if(error.message.includes("Failed query:")){
			
		}

		return new Response(
			JSON.stringify({
				success: false,
				error: error.message || 'Failed to create account or User already exists'
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
