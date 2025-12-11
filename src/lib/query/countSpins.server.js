import { db } from "$lib/server/db";
import { customers } from "$lib/server/db/schemas/schema.js";
import { eq, and } from "drizzle-orm";

export function incrementSpin(customerId, maxSpins = 3) {
    return db.transaction((tx) => {
        // Fetch customer
        const [lockedCustomer] = tx.select()
            .from(customers)
            .where(eq(customers.id, customerId))
            .limit(1)
            .all();

        if (!lockedCustomer) {
            return { error: "User not found" };
        }

        if (!lockedCustomer.emailVerified) {
            return { error: "Customer not verified", status: 403 };
        }

        if (lockedCustomer.numberOfSpins >= maxSpins) {
            return {
                error: "You've used all your spins",
                remainingSpins: 0
            };
        }

        const newSpinCount = lockedCustomer.numberOfSpins + 1;
        const remainingSpins = maxSpins - newSpinCount;

        // Optimistic lock update
        tx.update(customers)
            .set({
                numberOfSpins: newSpinCount,
                updatedAt: new Date()
            })
            .where(and(
                eq(customers.id, customerId),
                eq(customers.numberOfSpins, lockedCustomer.numberOfSpins)
            ))
            .run();

        return {
            success: true,
            message: `You have ${remainingSpins} spin(s) left.`,
            remainingSpins,
            totalSpins: newSpinCount
        };
    });
}
