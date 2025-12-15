import { getAllCustomers} from "$lib/query/queryAllCustomers";
import { db } from '$lib/server/db';
import { customers, sessions } from '$lib/server/db/schemas/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export async function load() {
    const customersList = await getAllCustomers();

    return {
        customers: customersList,
    };
}

export const actions = {
    createUser: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name');
        const email = data.get('email');
        const phoneNumber = data.get('phoneNumber');
        const address = data.get('address') || '';

        if (!name || !email || !phoneNumber) {
            return fail(400, { error: 'Missing required fields' });
        }

        const id = randomUUID();

        try {
            await db.insert(customers).values({
                id,
                name,
                email,
                phoneNumber,
                address,
                emailVerified: false,
                numberOfSpins: 0,
                winPrice: false,
                priceName: 'null',
                receivedPrice: false,
                certificateGenerated: false
            });

            return { success: true };
        } catch (err) {
            console.error('createUser error', err);

            // Handle sqlite unique constraint errors and return field-specific messages
            const msg = String(err?.message || '');
            if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE' || msg.includes('UNIQUE constraint failed')) {
                if (msg.includes('phone_number') || msg.includes('customers.phone_number')) {
                    return fail(409, { error: 'Phone number already exists' });
                }
                if (msg.includes('email') || msg.includes('customers.email')) {
                    return fail(409, { error: 'Email already exists' });
                }
                // generic unique constraint
                return fail(409, { error: 'Unique constraint violation' });
            }

            return fail(500, { error: 'Create user failed' });
        }
    },

    updateUser: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        if (!id) return fail(400, { error: 'Missing id' });

        const name = data.get('name');
        const phoneNumber = data.get('phoneNumber');
        const address = data.get('address');
        const numberOfSpins = data.get('numberOfSpins') ? Number(data.get('numberOfSpins')) : undefined;
        const priceNameRaw = data.get('priceName');
        const priceName = priceNameRaw === '' || priceNameRaw === null ? 'null' : priceNameRaw;
        const winPrice = data.get('winPrice') ? true : false;
        const receivedPrice = data.get('receivedPrice') ? true : false;

        const updateObj = {};
        if (name !== null) updateObj.name = name;
        if (phoneNumber !== null) updateObj.phoneNumber = phoneNumber;
        if (address !== null) updateObj.address = address;
        if (numberOfSpins !== undefined) updateObj.numberOfSpins = numberOfSpins;
        if (priceName !== null) updateObj.priceName = priceName;
        updateObj.winPrice = winPrice;
        updateObj.receivedPrice = receivedPrice;

        try {
            await db.update(customers).set(updateObj).where(eq(customers.id, id));
            return { success: true };
        } catch (err) {
            console.error('updateUser error', err);

            const msg = String(err?.message || '');
            if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE' || msg.includes('UNIQUE constraint failed')) {
                if (msg.includes('phone_number') || msg.includes('customers.phone_number')) {
                    return fail(409, { error: 'Phone number already exists' });
                }
                if (msg.includes('email') || msg.includes('customers.email')) {
                    return fail(409, { error: 'Email already exists' });
                }
                return fail(409, { error: 'Unique constraint violation' });
            }

            return fail(500, { error: 'Update failed' });
        }
    },

    deleteUser: async ({ request, cookies }) => {
        const data = await request.formData();
        console.log("DELETEING USER...", data);
        const id = data.get('id');
        if (!id) return fail(400, { error: 'Missing id' });

        try {
            await db.delete(customers).where(eq(customers.id, id));
            await db.delete(sessions).where(eq(sessions.customerId, id));
            cookies.delete("better-auth.session_token");
            return { success: true };
        } catch (err) {
            console.error('deleteUser error', err);
            return fail(500, { error: 'Delete failed' });
        }
    }
};

