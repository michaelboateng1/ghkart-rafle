import { db } from "./db";
import { customers, user } from "./schema";
import { eq } from "drizzle-orm";

export async function getCustomerById(id) {
    return await db.select().from(customers).where(eq(customers.id, id)).limit(1);
}

export async function getCustomerByEmail(email) {
    return await db.select().from(customers).where(eq(customers.email, email)).limit(1);
}

export async function getCustomerByPhoneNumber(phoneNumber) {
    return await db.select().from(customers).where(eq(customers.phone_number, phoneNumber)).limit(1);
}

// User Account;
export async function getUserAccountById(id) {
    return await db.select().from(user).where(eq(user.id, id)).limit(1);
}

export async function getUserAccountByEmail(email) {
    return await db.select().from(user).where(eq(user.email, email)).limit(1);
}
