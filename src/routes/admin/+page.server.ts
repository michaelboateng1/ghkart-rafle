import { db } from '$lib/server/db';
import { user, customers } from '$lib/server/db/schemas/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const users = await db.query.user.findMany({
		with: {
			customer: true
		}
	});

	return {
		users
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createUser: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phoneNumber = formData.get('phoneNumber') as string;
		const address = formData.get('address') as string;

		if (!name || !email || !phoneNumber) {
			return fail(400, { message: 'Name, email, and phone number are required' });
		}

		const id = crypto.randomUUID();

		try {
			await db.transaction(async (tx) => {
				await tx.insert(user).values({
					id,
					name,
					email,
					emailVerified: false,
					createdAt: new Date(),
					updatedAt: new Date()
				});

				await tx.insert(customers).values({
					id: crypto.randomUUID(),
					userId: id,
					name,
					email,
					phoneNumber,
					address: address || '',
					numberOfSpins: 0,
					winPrice: false,
					priceName: '',
					priceCollected: false,
					certificateGenerated: false
				});
			});

			return { success: true };
		} catch (error) {
			console.error('Failed to create user:', error);
			return fail(500, { message: 'Failed to create user' });
		}
	},

	updateUser: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string; // Read-only usually but let's allow basic edits if needed? Actually auth schema might restrict email changes, but let's see.
		// Customer fields
		const phoneNumber = formData.get('phoneNumber') as string;
		const address = formData.get('address') as string;
		const numberOfSpins = Number(formData.get('numberOfSpins'));
		const winPrice = formData.get('winPrice') === 'on';
		const priceName = formData.get('priceName') as string;
		const priceCollected = formData.get('priceCollected') === 'on';
		const certificateGenerated = formData.get('certificateGenerated') === 'on';

		if (!id) {
			return fail(400, { message: 'User ID is required' });
		}

		try {
			await db.transaction(async (tx) => {
				// Update User
				await tx.update(user).set({ name }).where(eq(user.id, id));

				// Update Customer
				// Check if customer exists first? The schema implies 1:1 but let's be safe.
				// Based on schema, customer has userIdFK.
				const customerExists = await tx.query.customers.findFirst({
					where: eq(customers.userId, id)
				});

				if (customerExists) {
					await tx.update(customers).set({
						name, // Sync name? Schema has name in both.
						// email, // Sync email?
						phoneNumber,
						address,
						numberOfSpins,
						winPrice,
						priceName,
						priceCollected,
						certificateGenerated
					}).where(eq(customers.userId, id));
				}
			});

			return { success: true };
		} catch (error) {
			console.error('Failed to update user:', error);
			return fail(500, { message: 'Failed to update user' });
		}
	},

	deleteUser: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'User ID is required' });
		}

		try {
			await db.delete(user).where(eq(user.id, id));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
};
