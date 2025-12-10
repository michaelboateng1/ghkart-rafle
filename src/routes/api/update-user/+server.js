import { db } from "$lib/server/db"
import { customers, user } from "$lib/server/db/schemas/schema.js";
import { eq, and } from "drizzle-orm";

export async function POST({ request }) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({ message: "Valid email is required" }), { status: 400 });
        }

        const userRecord = await db.select().from(user).where(eq(user.email, email)).limit(1);

        // Check if user exists and is verified
        if (!userRecord.length > 0 || !userRecord[0].emailVerified) {
            return new Response(
                JSON.stringify({ message: "User not found or not verified" }), 
                { status: 404 }
            );
        }

        return await db.transaction(async (tx) => {
            // Get customer with row-level lock for update
            const [customer] = await tx.select()
                .from(customers)
                .where(eq(customers.email, email))
                .for('update')
                .limit(1);

            if (!customer) {
                return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
            }

            // Check if user has spins left
            if (customer.numberOfSpin >= 3) {
                return new Response(
                    JSON.stringify({ 
                        message: "You've used all your spins", 
                        remainingSpins: 0 
                    }), 
                    { status: 400 }
                );
            }

            // Calculate new values
            const newSpinCount = customer.numberOfSpin + 1;
            const remainingSpins = 3 - newSpinCount;

            // Update the spin count
            const [updatedCustomer] = await tx.update(customers)
                .set({ 
                    numberOfSpin: newSpinCount,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(customers.id, customer.id),
                        eq(customers.numberOfSpin, customer.numberOfSpin)
                    )
                )
                .returning();

            return new Response(
                JSON.stringify({ 
                    message: `Spin recorded. You have ${remainingSpins} spin(s) left.`,
                    remainingSpins,
                    totalSpins: newSpinCount
                }), 
                { status: 200 }
            );
        });
        
    } catch (error) {
        console.error("Error updating user spins:", error);
        return new Response(
            JSON.stringify({ message: "Internal server error" }), 
            { status: 500 }
        );
    }
}