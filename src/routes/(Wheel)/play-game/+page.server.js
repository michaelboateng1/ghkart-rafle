import { db } from '$lib/server/db';
import { user, customers } from '$lib/server/db/schemas/schema';
import { eq } from 'drizzle-orm';

import { updateNumberOfSpins } from '$lib/query/updateData';


export const load = async () => {
    const users = await db.query.user.findMany({
            with: {
                customer: true
            }
    });

    return {
        users
    };
};

export const actions = {
    updateNumberOfSpin: async ({ request }) => {
        const formData = await request.formData();
        const numberOfSpin = formData.get('numberOfSpin');

    }
};