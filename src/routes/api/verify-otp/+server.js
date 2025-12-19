import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { sessions, customers, verification } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes, randomUUID } from 'crypto';

export async function POST({ request, cookies }) {
    try {
        const { email, otp } = await request.json();

        let newSession;

        let sessionToken = cookies.get("better-auth.session_token");

        const customerRecord = await db.select({ customerId: customers.id, numberOfSpins: customers.numberOfSpins, winPrice: customers.winPrice, priceName: customers.priceName, receivedPrice: customers.receivedPrice, certificateGenerated: customers.certificateGenerated })
            .from(customers)
            .where(eq(customers.email, email))
            .limit(1);

        if (!customerRecord.length) {
            return new Response(
                JSON.stringify({ success: false, error: "User not found" }),
                { status: 400 }
            );
        }

        const verifyResult = await auth.api.checkVerificationOTP({
            body: {
                email,
                type: "email-verification",
                otp
            }
        });

        
        if (!verifyResult) {
            return new Response(
                JSON.stringify({ success: false, error: "Invalid or expired OTP" }),
                { status: 400 }
            );
        }

        // Check if user has exceeded spin limit
        if(customerRecord[0].numberOfSpins >= 9 && customerRecord[0].receivedPrice){
            // console.log("User has used all spins, sending redirect response");
            return new Response(
                JSON.stringify({
                    success: false,
                    spinsExceeded: true,
                    redirectUrl: "https://ghkart.com",
                    error: "Sorry, you can only spin 9 times."
                }),
                { 
                    status: 301,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }else if(customerRecord[0].winPrice && customerRecord[0].priceName !== "null"){
            if(customerRecord[0].receivedPrice){
                return new Response(
                    JSON.stringify({
                        success: false,
                        redirectUrl: "https://ghkart.com",
                        message: "You have already claimed your prize."
                    }),
                    { 
                        status: 302,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            } else if(!customerRecord[0].certificateGenerated){
                return new Response(
                    JSON.stringify({
                        success: false,
                        redirectUrl: "/preview-certificate",
                        message: "Downloaded certificate for the prize."
                    }),
                    { 
                        status: 302,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }else if(customerRecord[0].certificateGenerated && !customerRecord[0].receivedPrice){
                return new Response(
                    JSON.stringify({
                        success: false,
                        redirectUrl: "/prize-info",
                        message: "You have already claimed your prize."
                    }),
                    { 
                        status: 302,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        }

        // Check if there's an existing valid session
        let existingSession = null;
        if (sessionToken) {
            // FIXED: Added await here!
            const sessionRecords = await db.select()
                .from(sessions)
                .where(eq(sessions.token, sessionToken))
                .limit(1);
            
            if (sessionRecords.length > 0) {
                existingSession = sessionRecords[0];
                // console.log("Found existing session:", existingSession.id);
            }
        }

        // Create new session if none exists
        if (!existingSession) {
            const now = new Date();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const customerId = customerRecord[0].customerId;
            const newSessionToken = randomBytes(32).toString('hex'); // Create token here

            // Delete old sessions for this customer
            await db.delete(sessions).where(eq(sessions.customerId, customerId));
            
                
            newSession = {
                id: randomUUID(),
                customerId,
                token: newSessionToken,
                expiresAt: expiresAt,
                createdAt: now,
                updatedAt: now,
                ipAddress: request.headers.get('x-forwarded-for') ||
                        request.headers.get('ip') ||
                        "127.0.0.1",
                userAgent: request.headers.get("user-agent")
            };

            // Insert the session
            await db.insert(sessions).values(newSession);
            // console.log("Created new session for customer ID:", customerId);

            // Set the cookie with the NEW token
            cookies.set("better-auth.session_token", newSessionToken, {
                path: "/",
                expires: expiresAt,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
                sameSite: "lax"
            });
        } else {
            newSession = existingSession;
        }

        // const sessionRecord = db.select()
        //     .from(sessions)
        //     .where(eq(sessions.token, sessionToken))
        //     .limit(1);

        // if(!sessionRecord){
        //     const now = new Date();
        //     const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        //     const customerId = customerRecord[0].customerId;

        //      await db.delete(sessions).where(eq(sessions.customerId, customerId));
            
        //     newSession = {
        //         id: randomUUID(),
        //         customerId,
        //         token: randomBytes(32).toString('hex'),
        //         expiresAt: expiresAt,
        //         createdAt: now,
        //         updatedAt: now,
        //         ipAddress: request.headers.get('x-forwarded-for') ||
        //                 request.headers.get('ip') ||
        //                 "127.0.0.1",
        //         userAgent: request.headers.get("user-agent")
        //     };

        //    const createdSession = await db.insert(sessions).values(newSession);

        //    console.log("Created session for customer ID:", createdSession)
        //     cookies.set("better-auth.session_token", newSession.token, {
        //         path: "/",
        //         expires: expiresAt,
        //         httpOnly: true,
        //         secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
        //         sameSite: "lax"
        //     });
        // }

        // const session = db.select()
        //     .from(sessions)
        //     .where(eq(sessions.token, sessionToken))
        //     .limit(1);

        // if(!session.length){
        //     return new Response(
        //         JSON.stringify({
        //             success: false,
        //             redirectUrl: "/",
        //             message: "Invalid session."
        //         }),
        //         { 
        //             status: 400,
        //             headers: { 'Content-Type': 'application/json' }
        //         }
        //     );
        // }


        // console.log("Session created successfully!", newSession);

        // Mark email verified
        await db.update(customers)
            .set({ emailVerified: true })
            .where(eq(customers.email, email));

        // console.log("Email marked as verified in database.");

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




// import { auth } from '$lib/auth';
// import { db } from '$lib/server/db';
// import { sessions, customers, verification } from '$lib/server/db/schemas/schema.js';
// import { eq } from 'drizzle-orm';
// import { randomBytes, randomUUID } from 'crypto';

// export async function POST({ request, cookies }) {
//     try {
//         const { email, otp } = await request.json();

//         let newSession;
//         let sessionToken = cookies.get("better-auth.session_token");

//         const customerRecord = await db.select({ 
//             customerId: customers.id, 
//             numberOfSpins: customers.numberOfSpins, 
//             winPrice: customers.winPrice, 
//             priceName: customers.priceName, 
//             receivedPrice: customers.receivedPrice, 
//             certificateGenerated: customers.certificateGenerated 
//         })
//             .from(customers)
//             .where(eq(customers.email, email))
//             .limit(1);

//         if (!customerRecord.length) {
//             return new Response(
//                 JSON.stringify({ success: false, error: "User not found" }),
//                 { status: 400 }
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

//         // Check if user has exceeded spin limit
//         if(customerRecord[0].numberOfSpins >= 9 && customerRecord[0].receivedPrice){
//             console.log("User has used all spins, sending redirect response");
//             return new Response(
//                 JSON.stringify({
//                     success: false,
//                     spinsExceeded: true,
//                     redirectUrl: "https://ghkart.com",
//                     error: "Sorry, you can only spin 9 times."
//                 }),
//                 { 
//                     status: 301,
//                     headers: { 'Content-Type': 'application/json' }
//                 }
//             );
//         } else if(customerRecord[0].winPrice && customerRecord[0].priceName !== "null"){
//             if(customerRecord[0].receivedPrice){
//                 return new Response(
//                     JSON.stringify({
//                         success: false,
//                         redirectUrl: "https://ghkart.com",
//                         message: "You have already claimed your prize."
//                     }),
//                     { 
//                         status: 302,
//                         headers: { 'Content-Type': 'application/json' }
//                     }
//                 );
//             } else if(!customerRecord[0].certificateGenerated){
//                 return new Response(
//                     JSON.stringify({
//                         success: false,
//                         redirectUrl: "/preview-certificate",
//                         message: "Downloaded certificate for the prize."
//                     }),
//                     { 
//                         status: 302,
//                         headers: { 'Content-Type': 'application/json' }
//                     }
//                 );
//             } else if(customerRecord[0].certificateGenerated && !customerRecord[0].receivedPrice){
//                 return new Response(
//                     JSON.stringify({
//                         success: false,
//                         redirectUrl: "/prize-info",
//                         message: "You have already claimed your prize."
//                     }),
//                     { 
//                         status: 302,
//                         headers: { 'Content-Type': 'application/json' }
//                     }
//                 );
//             }
//         }

//         // Check if there's an existing valid session
//         let existingSession = null;
//         if (sessionToken) {
//             // FIXED: Added await here!
//             const sessionRecords = await db.select()
//                 .from(sessions)
//                 .where(eq(sessions.token, sessionToken))
//                 .limit(1);
            
//             if (sessionRecords.length > 0) {
//                 existingSession = sessionRecords[0];
//                 console.log("Found existing session:", existingSession.id);
//             }
//         }

//         // Create new session if none exists
//         if (!existingSession) {
//             const now = new Date();
//             const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
//             const customerId = customerRecord[0].customerId;
//             const newSessionToken = randomBytes(32).toString('hex'); // Create token here

//             // Delete old sessions for this customer
//             await db.delete(sessions).where(eq(sessions.customerId, customerId));
            
//             newSession = {
//                 id: randomUUID(),
//                 customerId,
//                 token: newSessionToken, // Use the new token
//                 expiresAt: Math.floor(expiresAt.getTime() / 1000), // Convert to Unix timestamp
//                 createdAt: Math.floor(now.getTime() / 1000),
//                 updatedAt: Math.floor(now.getTime() / 1000),
//                 ipAddress: request.headers.get('x-forwarded-for') ||
//                         request.headers.get('ip') ||
//                         "127.0.0.1",
//                 userAgent: request.headers.get("user-agent") || ""
//             };

//             // Insert the session
//             await db.insert(sessions).values(newSession);
//             console.log("Created new session for customer ID:", customerId);

//             // Set the cookie with the NEW token
//             cookies.set("better-auth.session_token", newSessionToken, {
//                 path: "/",
//                 expires: expiresAt,
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
//                 sameSite: "lax"
//             });

//             // Verify the session was created
//             const verifySession = await db.select()
//                 .from(sessions)
//                 .where(eq(sessions.token, newSessionToken))
//                 .limit(1);

//             if (!verifySession.length) {
//                 console.error("Session was not inserted into database!");
//                 return new Response(
//                     JSON.stringify({
//                         success: false,
//                         error: "Failed to create session"
//                     }),
//                     { status: 500 }
//                 );
//             }

//             console.log("Session verified in database:", verifySession[0].id);
//         } else {
//             console.log("Using existing session:", existingSession.id);
//             newSession = existingSession;
//         }

//         // Mark email verified
//         await db.update(customers)
//             .set({ emailVerified: true })
//             .where(eq(customers.email, email));

//         console.log("Email marked as verified in database.");

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
//         if (error?.body?.message) msg = error.body.message;

//         return new Response(
//             JSON.stringify({ success: false, error: msg }),
//             { status: 400 }
//         );
//     }
// }