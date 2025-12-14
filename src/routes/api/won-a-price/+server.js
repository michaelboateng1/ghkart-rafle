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
            if (!customerRecord.length) {
                return new Response(JSON.stringify({
                    success: false,
                    winPrice: customerRecord[0].winPrice,
                    priceName: customerRecord[0].priceName,
                    redirectUrl: "/"}), {status: 400});
            }
        }

       await db.update(customers).set({
            winPrice: true,
            priceName: price,
            updatedAt: new Date()
        }).where(eq(customers.id, sessionRecord[0].customerId ));


        const customerRecord = await db.select()
            .from(customers)
            .where(eq(customers.id, sessionRecord[0].customerId))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(JSON.stringify({
                success: false,
                winPrice: customerRecord[0].winPrice,
                priceName: customerRecord[0].priceName,
                redirectUrl: "/"}), {status: 400});
        }

        cookies.set("ghkart.prizeWinner", JSON.stringify(customerRecord), {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
            sameSite: "lax"
        });



        return new Response(JSON.stringify({
                success: true,
                winPrice: customerRecord[0].winPrice,
                priceName: customerRecord[0].priceName,
                message: "",
                redirectUrl: ""}), {status: 200});

    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
