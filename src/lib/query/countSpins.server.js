import { db } from "$lib/server/db";
import { customers } from "$lib/server/db/schemas/schema.js";
import { eq, and } from "drizzle-orm";

export function incrementSpin(customerId, maxSpins = 10) {
    return db.transaction(async (tx) => {
        // Fetch customer
        const [lockedCustomer] = await tx.select()
            .from(customers)
            .where(eq(customers.id, customerId))
            .limit(1)
            .all();

        if (!lockedCustomer) {
            return {
                success: false,
                message: "User not found. Redirecting...",
                redirectUrl: "/",
                status: 400
            };
        }

        if (lockedCustomer.winPrice && lockedCustomer.priceName !== "null" && lockedCustomer.certificateGenerated && !lockedCustomer.receivedPrice) {
            return {
                success: false,
                winPrice: lockedCustomer.winPrice,
                priceName: lockedCustomer.priceName,
                message: "You've used all your spins. Redirecting...",
                remainingSpins: 0,
                redirectUrl: "/prize-info",
                status: 302
            }
		}

        if (lockedCustomer.numberOfSpins >= maxSpins) {
            
            return {
                success: false,
                winPrice: lockedCustomer.winPrice,
                priceName: lockedCustomer.priceName,
                message: "You've used all your spins. Redirecting...",
                remainingSpins: 0,
                redirectUrl: "https://ghkart.com",
                status: 301
            }
        }

        const newSpinCount = lockedCustomer.numberOfSpins + 1;
        const remainingSpins = maxSpins - newSpinCount;

        // Optimistic lock update
        await tx.update(customers)
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
