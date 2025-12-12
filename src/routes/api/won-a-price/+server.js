import { db } from '$lib/server/db/index.js';
import { sessions, customers } from "$lib/server/db/schemas/schema.js";
import { eq } from 'drizzle-orm';

import {goto} from '$app/navigation';

export async function POST({ request, cookies }) {
    try {
        const { price } = await request.json();

        const sessionToken = cookies.get("better-auth.session_token");

        if (!sessionToken) {
            return new Response(
                JSON.stringify({ message: "missing token" }),
                { status: 400 }
            );
        }

        const sessionRecord = await db.select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

        if (!sessionRecord.length) {
            return new Response(
                JSON.stringify({ message: "missing user session" }),
                { status: 400 }
            );
        }

        const customerRecord = await db.select()
            .from(customers)
            .where(eq(customers.id, sessionRecord[0].customerId))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(
                JSON.stringify({ message: "user not found" }),
                { status: 400 }
            );
        }

        const customer = customerRecord[0];

        // Transaction — safe update
        db.transaction((tx) => {
            // Fetch customer
            const [lockedCustomer] = tx.select()
                .from(customers)
                .where(eq(customers.id, customer.id))
                .limit(1)
                .all();

            if (!lockedCustomer) return;

            // If no prize yet → give prize
            if (!lockedCustomer.winPrice) {
                tx.update(customers)
                    .set({
                        winPrice: true,
                        priceName: price,
                        updatedAt: new Date()
                    })
                    .where(eq(customers.id, lockedCustomer.id))
                    .run();
            }
        })();

        return new Response(JSON.stringify({
                success: true,
                won: true,
                redirectUrl: "/preview-certificate"}), {status: 200});

    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
