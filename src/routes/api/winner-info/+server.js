import { db } from '$lib/server/db/index.js';
import { sessions, customers } from "$lib/server/db/schemas/schema.js";
import { eq } from 'drizzle-orm';

export async function GET({ request, cookies }) {
    try {
        const cookie = cookies.get('better-auth.session_token');

        if (!cookie) {
            return new Response(JSON.stringify({ found: false }), { status: 404 });
        }

        const customerSession = await db.select()
            .from(sessions)
            .where(eq(sessions.token, cookie))
            .limit(1);

        if(!customerSession.length) {
            return new Response(JSON.stringify({ found: false }), { status: 404 });
        }

        const customerRecord = await db.select()
            .from(customers)
            .where(eq(customers.id, customerSession[0].customerId))
            .limit(1);

        if(!customerRecord.length) {
            return new Response(JSON.stringify({ found: false }), { status: 404 });
        }

        

        return new Response(JSON.stringify({ found: true, name: customerRecord[0].name, prize: customerRecord[0].priceName, winPrice: customerRecord[0].winPrice, id:  customerRecord[0].id}), { status: 200 });
    } catch (err) {
        console.error('winner-info error', err);
        return new Response(JSON.stringify({ found: false }), { status: 500 });
    }
}
