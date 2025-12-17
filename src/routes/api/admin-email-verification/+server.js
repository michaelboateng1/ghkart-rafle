// import { auth } from '$lib/auth';
// import { db } from '$lib/server/db';
// import { admins } from '$lib/server/db/schemas/schema.js';
// import { eq } from 'drizzle-orm';
// import { randomBytes, randomUUID } from 'crypto';

// export async function POST({ request, cookies }) {
//     try {
//         const { email, otp } = await request.json();

//         const adminRecord = await db
//             .select()
//             .from(admins)
//             .where(eq(admins.email, email))
//             .limit(1);

//         if (!adminRecord.length) {
//             return new Response(
//                 JSON.stringify({ success: false, error: "User not found" }),
//                 { status: 400 }
//             );
//         }

//         // Check if user has exceeded spin limit
//         const adminHitSinLimit = adminRecord[0].numberOfSpins >= 3;
//         const adminRecievedPrice = adminRecord[0].winPrice && adminRecord[0].priceName && adminRecord[0].certificateGenerated && adminRecord[0].receivedPrice;


//         const certificateNotGenerated = adminRecord[0].winPrice && adminRecord[0].priceName && !adminRecord[0].receivedPrice && !adminRecord[0].certificateGenerated;
//         const certificateGeneratedButNotRecievedPrice = adminRecord[0].winPrice && adminRecord[0].priceName && adminRecord[0].certificateGenerated && !adminRecord[0].receivedPrice;

//         if (adminHitSinLimit || adminRecievedPrice) {
//             console.log("User has used all spins, sending redirect response");
//             return new Response(
//                 JSON.stringify({
//                     success: true,
//                     spinsExceeded: true,
//                     redirectUrl: "https://ghkart.com",
//                     message: "You have used all your spins. Redirecting..."
//                 }),
//                 { 
//                     status: 200,
//                     headers: { 'Content-Type': 'application/json' }
//                 }
//             );
//         }else if(certificateNotGenerated){
//             return new Response(
//                 JSON.stringify({
//                     success: true,
//                     spinsExceeded: true,
//                     redirectUrl: "/preview-certificate",
//                     message: "You've not downloaded your certificate for the prize. Redirecting..."
//                 }),
//                 { 
//                     status: 200,
//                     headers: { 'Content-Type': 'application/json' }
//                 }
//             );
//         }else if(certificateGeneratedButNotRecievedPrice){
//             return new Response(
//                 JSON.stringify({
//                     success: true,
//                     spinsExceeded: true,
//                     redirectUrl: "/prize-info",
//                     message: "You've not receive your prize. Redirecting..."
//                 }),
//                 { 
//                     status: 200,
//                     headers: { 'Content-Type': 'application/json' }
//                 }
//             );
//         }


//         const verifyResult = await auth.api.checkVerificationOTP({
//             body: {
//                 email,
//                 type: "email-verification",
//                 otp
//             }
//         });

//         if (!verifyResult) {
//             return new Response(
//                 JSON.stringify({ success: false, error: "Invalid or expired OTP" }),
//                 { status: 400 }
//             );
//         }


//         const adminId = adminRecord[0].id;
//         const now = new Date();
//         const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);
        
//         const newSession = {
//             id: randomUUID(),
//             adminId,
//             token: randomBytes(32).toString('hex'),
//             expiresAt: expiresAt,
//             createdAt: now,
//             updatedAt: now,
//             ipAddress: request.headers.get('x-forwarded-for') ||
//                        request.headers.get('ip') ||
//                        "127.0.0.1",
//             userAgent: request.headers.get("user-agent")
//         };

//         await db.insert(sessions).values(newSession);

//         cookies.set("better-auth.session_token", newSession.token, {
//             path: "/",
//             expires: expiresAt,
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
//             sameSite: "lax"
//         });

//         console.log("Session created successfully!", cookies.get("better-auth.session_token"));

//         // Mark email verified
//         await db.update(admins)
//             .set({ emailVerified: true })
//             .where(eq(admins.email, email));


//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 message: "Email verified successfully!",
//                 session: newSession
//             }),
//             { status: 200 }
//         );

//     } catch (error) {
//         console.error("Verification error:", error);

//         let msg = "Failed to verify OTP";
//         if (error.body?.message) msg = error.body.message;

//         return new Response(
//             JSON.stringify({ success: false, error: msg }),
//             { status: 400 }
//         );
//     }
// }
