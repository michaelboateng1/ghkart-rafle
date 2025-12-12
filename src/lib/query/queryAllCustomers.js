import { db } from "$lib/server/db";
import { customers, sessions } from "$lib/server/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

export async function getAllCustomers() {
    return await db.select().from(customers);
}

export async function getCustomerById(id) {
    return await db.select().from(customers).where(eq(customers.id, id)).limit(1);
}

export async function getCustomerByEmail(email) {
    return await db.select().from(customers).where(eq(customers.email, email)).limit(1);
}

export async function getCustomerByPhoneNumber(phoneNumber) {
    return await db.select().from(customers).where(eq(customers.phone_number, phoneNumber)).limit(1);
}
