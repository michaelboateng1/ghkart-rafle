import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { sessions, customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, randomUUID } from 'crypto';

import { goto } from '$app/navigation';

export async function POST({ request, cookies }) {
    try {
        const { email, otp } = await request.json();

        const verifyResult = await auth.api.checkVerificationOTP({
            body: {
                email,
                type: "email-verification",
                otp
            }
        });

        const customerRecord = await db
            .select()
            .from(customers)
            .where(eq(customers.email, email))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(
                JSON.stringify({ success: false, error: "User not found" }),
                { status: 400 }
            );
        }

        if (!verifyResult) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid or expired OTP" }),
                { status: 400 }
            );
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);

        // Mark email verified
        await db.update(customers)
            .set({ emailVerified: true })
            .where(eq(customers.email, email));

        // Check if user has exceeded spin limit
        const customerHitSinLimit = customerRecord[0].numberOfSpins >= 3;
        const customerRecievedPrice = customerRecord[0].winPrice && customerRecord[0].priceName && customerRecord[0].certificateGenerated && customerRecord[0].receivedPrice;


        const certificateNotGenerated = customerRecord[0].winPrice && customerRecord[0].priceName && !customerRecord[0].receivedPrice && !customerRecord[0].certificateGenerated;
        const certificateGeneratedButNotRecievedPrice = customerRecord[0].winPrice && customerRecord[0].priceName && customerRecord[0].certificateGenerated && !customerRecord[0].receivedPrice;

        if (customerHitSinLimit || customerRecievedPrice) {
            console.log("User has used all spins, sending redirect response");
            return new Response(
                JSON.stringify({
                    success: true,
                    spinsExceeded: true,
                    redirectUrl: "https://ghkart.com",
                    message: "You have used all your spins. Redirecting..."
                }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }else if(certificateNotGenerated){
            goto("/preview-certificate");
        }else if(certificateGeneratedButNotRecievedPrice){
            goto("/prize-info");
        }

        const customerId = customerRecord[0].id;
        
        const newSession = {
            id: randomUUID(),
            customerId,
            token: randomBytes(32).toString('hex'),
            expiresAt: expiresAt,
            createdAt: now,
            updatedAt: now,
            ipAddress: request.headers.get('x-forwarded-for') ||
                       request.headers.get('ip') ||
                       "127.0.0.1",
            userAgent: request.headers.get("user-agent")
        };

        await db.insert(sessions).values(newSession);

        cookies.set("better-auth.session_token", newSession.token, {
            path: "/",
            expires: expiresAt,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
            sameSite: "lax"
        });

        console.log("Session created successfully!", cookies.get("better-auth.session_token"));

        return new Response(
            JSON.stringify({
                success: true,
                message: "Email verified successfully!",
                session: newSession
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Verification error:", error);

        let msg = "Failed to verify OTP";
        if (error.body?.message) msg = error.body.message;

        return new Response(
            JSON.stringify({ success: false, error: msg }),
            { status: 400 }
        );
    }
}
