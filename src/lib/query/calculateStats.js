import { db } from "$lib/server/db";
import { customers, sessions } from "$lib/server/db/schemas/auth-schema";
import { eq, and } from "drizzle-orm";

export async function calculateStats() {
    const totalCustomers = await db.select().from(customers);
    const totalWinners = await db.select().from(customers).where(eq(customers.winPrice, true));
    const totalSharedProducts = await db.select().from(customers).where(and(eq(customers.winPrice, true), eq(customers.receivedPrice, true)));
    return {
        totalCustomers: totalCustomers.length,
        totalWinners: totalWinners.length,
        totalSharedProducts: totalSharedProducts.length
    }
}