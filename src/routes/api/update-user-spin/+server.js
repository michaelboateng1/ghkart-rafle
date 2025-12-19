import { incrementSpin } from "$lib/query/countSpins.server.js";
import { db } from "$lib/server/db";
import { sessions } from "$lib/server/db/schemas/schema.js";
import { eq } from "drizzle-orm";

export async function GET({ cookies }) {
    const sessionToken = cookies.get("better-auth.session_token");

    if (!sessionToken) {
        return new Response(JSON.stringify({
                success: false,
                message: "Missing session token. Redirecting...",
                redirectUrl: "/",
            }), { status: 302 });
    }

    const [sessionRecord] = await db.select()
        .from(sessions)
        .where(eq(sessions.token, sessionToken))
        .limit(1);

    if (!sessionRecord) {
        cookies.delete("better-auth.session_token", { path: "/" });
        return new Response(JSON.stringify({
                success: false,
                message: "Missing session. Redirecting...",
                redirectUrl: "/",
            }), { status: 302 });
    }


    // Check expiry
    // if (sessionRecord.expiresAt < Date.now()) {
    //     cookies.delete("better-auth.session_token");
    //     return new Response(JSON.stringify({
    //         success: false,
    //         message: "Session has expired. Redirecting...",
    //         redirectUrl: "/",
    //     }), { status: 400 });
    // }

    // Call sync transaction safely
    const result = await incrementSpin(sessionRecord.customerId);
    // console.log("increment number of spin", result);


    if (result.message) {
        return new Response(JSON.stringify(result), { status: result.status ?? 400 });
    }

    // return new Response("Hollo World", {status: 200})

    return new Response(JSON.stringify(result), { status: 200 });
}
