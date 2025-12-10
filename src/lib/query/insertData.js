import { db } from "./db";
import { user, customers, session } from "./schema";

export async function insertCustomer(values) {
    return await db.insert(customers).values(values)
}

export async function insertUser(values) {
    return await db.insert(user).values(values)
}

export async function insertSession(values) {
    return await db.insert(session).values(values)
}


