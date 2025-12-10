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
import { user, customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// import { getCustomerByEmail } from '$lib/query/queryData.js';
import { insertUser } from '$lib/query/insertData.js';
import { insertCustomer } from '$lib/query/insertData.js';

export async function POST({ request }) {
	try {
		const { firstName, lastName, email, phoneNumber, location } = await request.json();

		console.log('Processing signup for:', email);

		// Check if user already exists
		// console.log(getCustomerByEmail);
		const existingUser = await db.select().from(customers).where(eq(customers.email, email)).limit(1);

		let userId;

		if (existingUser.length > 0) {
			console.log('User already exists:', existingUser[0].id);
			userId = existingUser[0].id;
		} else {
			// Create new user in better-auth user table
			try{
				userId = randomUUID();
				const now = new Date();

				const userData = {
					id: userId,
					email: email,
					name: `${firstName} ${lastName}`,
					emailVerified: false,
					createdAt: now,
					updatedAt: now
				}

				insertUser(userData);


				console.log('User created with ID:', userId);

				// Create corresponding customer record
				const customerData = {
					id: randomUUID(),
					name: `${firstName} ${lastName}`,
					email: email,
					phoneNumber: phoneNumber,
					address: location,
					numberOfSpins: 0,
					winPrice: 'false',
					certificateGenerated: 'false',
					userId: userId,
					createdAt: now,
					updatedAt: now
				}

				insertCustomer(customerData)

				console.log('Customer record created');
			}catch(error){
				console.error('Error creating user:', error.message);
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
