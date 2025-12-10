import { db } from '$lib/server/db';
import { user, customers } from '$lib/server/db/schemas/schema';
import { eq } from "drizzle-orm";

const prizes = ["laptop", "tablet", "watch", "phone"]

export async function updateUser(values) {
    return await db.update(user).set(values)
}

export async function updateWinPrize(prize) {
    prize = prize.toLowerCase();
    if (!prizes.includes(prize)) return;
    return await db.update(customers).set({win_prize: true}).where(eq(user.id, id));
}

export async function updateNumberOfSpins(id) {
    return await db.update(customers).set({number_of_spins: customers.number_of_spins + 1}).where(eq(user.id, id));
}

export async function updatePriceCollected(id) {
    return await db.update(customers).set({price_collected: true}).where(eq(user.id, id));
}

export async function updatePriceName(id, price) {
    return await db.update(customers).set({price_name: price}).where(eq(user.id, id));
}

export async function updateCertificateGenerated(id) {
    return await db.update(customers).set({certificate_generated: true}).where(eq(user.id, id));
}

export async function updateCustomer(values) {
    return await db.update(customers).set(values)
}

export async function updateEmailVerifiedStatus(existingUser) {
    if (!existingUser[0].emailVerified) {
		return await db.update(user).set({ emailVerified: true }).where(eq(user.id, userId));
	}
}