import { db } from "$lib/server/db";
import { sessions, customers } from "$lib/server/db/schemas/schema.js";
import { eq, and } from "drizzle-orm";

export async function POST({ request, cookies }) {
    try {
        const sessionToken = cookies.get("better-auth.session_token");

        if (!sessionToken) {
            return new Response(JSON.stringify({ message: "missing token" }), { status: 400 });
        }

        // Validate session
        const sessionRecord = await db.select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

        if (!sessionRecord.length) {
            return new Response(JSON.stringify({ message: "missing user session" }), { status: 400 });
        }

        const customerRecord = await db.select()
            .from(customers)
            .where(eq(customers.id, sessionRecord[0].customerId))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
        }

        const customer = customerRecord[0];

        if (!customer.emailVerified) {
            return new Response(JSON.stringify({ message: "Customer not verified" }), { status: 403 });
        }

        return await db.transaction(async (tx) => {
            // Lock row
            const [lockedCustomer] = await tx.select()
                .from(customers)
                .where(eq(customers.id, customer.id))
                .for("update")
                .limit(1);

            if (!lockedCustomer) {
                return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
            }

            if (lockedCustomer.numberOfSpin >= 3) {
                return new Response(JSON.stringify({
                    message: "You've used all your spins",
                    remainingSpins: 0
                }), { status: 400 });
            }

            const newSpinCount = lockedCustomer.numberOfSpin + 1;
            const remainingSpins = 3 - newSpinCount;

            await tx.update(customers)
                .set({
                    numberOfSpin: newSpinCount,
                    updatedAt: new Date()
                })
                .where(and(
                    eq(customers.id, customer.id),
                    eq(customers.numberOfSpin, lockedCustomer.numberOfSpin)
                ));

            return new Response(JSON.stringify({
                message: `Spin recorded. You have ${remainingSpins} spin(s) left.`,
                remainingSpins,
                totalSpins: newSpinCount
            }), { status: 200 });
        });

    } catch (error) {
        console.error("Error updating customer spins:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
