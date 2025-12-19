import { db } from '$lib/server/db/index.js';
import { sessions, customers } from "$lib/server/db/schemas/schema.js";
import { eq } from 'drizzle-orm';


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
            return new Response(JSON.stringify({
                success: false,
                redirectUrl: "/"}), {status: 400});
        }

        const customerRecord = await db.select()
            .from(customers)
            .where(eq(customers.id, sessionRecord[0].customerId))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(JSON.stringify({
                success: false,
                redirectUrl: "/"}), {status: 400});
        }

        await db.update(customers).set({
            winPrice: true,
            priceName: price,
            updatedAt: new Date()
        }).where(eq(customers.id, customerRecord[0].id ));

        const updatedWinner = await db.select().from(customers).where(eq(customers.id, customerRecord[0].id)).limit(1);


        return new Response(JSON.stringify({
                success: true,
                winPrice: updatedWinner[0].winPrice,
                priceName: updatedWinner[0].priceName,
                message: "",
                redirectUrl: ""}), {status: 200});

    } catch (err) {
        // console.log(err);
        return new Response(JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
