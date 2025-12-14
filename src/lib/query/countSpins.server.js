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
            .all()

        if (!lockedCustomer) {
            return {
                success: false,
                message: "User not found. Redirecting...",
                redirectUrl: "/",
                status: 400
            };
        }

        if (lockedCustomer.numberOfSpins >= maxSpins) {
            
            return {
                success: false,
                winPrice: lockedCustomer.winPrice,
                priceName: lockedCustomer.priceName,
                message: "You've used all your spins. Redirecting...",
                remainingSpins: 0,
                redirectUrl: "https://ghkart",
                status: 302
            }
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
            totalSpins: newSpinCount,
            status: 200
        };
    });
}
