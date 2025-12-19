import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { sessions, customers } from '$lib/server/db/schemas/schema.js';
import { eq, and } from 'drizzle-orm';

export async function POST({request, cookies }) {
        try {
        const sessionToken = cookies.get("better-auth.session_token");

        if (!sessionToken) {
            return new Response(
                JSON.stringify({
                    success: false,
                    redirectUrl: "/",
                    error: "Missing session token"
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const sessionRecord = await db.select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

        if (!sessionRecord.length) {
            return new Response(
                JSON.stringify({
                    success: false,
                    redirectUrl: "/",
                    error: "Expired session."
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }


       const updatedData = await db.transaction(async (tx) => {
                // Fetch customer
                const [lockedCustomer] = await tx.select()
                    .from(customers)
                    .where(eq(customers.id, sessionRecord[0].customerId))
                    .limit(1)
                    .all()

                    if (!lockedCustomer) {
                        return {
                            success: false,
                            goToGhKart: false,
                            winPrice: lockedCustomer.winPrice,
                            priceName: lockedCustomer.priceName,
                            message: "User not found. Redirecting...",
                            certificateGenerated: lockedCustomer.certificateGenerated,
                            redirectUrl: "/",
                        }
                    }
            
                    if (!lockedCustomer.emailVerified) {
                        return {
                            success: false,
                            goToGhKart: false,
                            winPrice: lockedCustomer.winPrice,
                            priceName: lockedCustomer.priceName,
                            message: "Email not verified. Redirecting...",
                            certificateGenerated: lockedCustomer.certificateGenerated,
                            redirectUrl: "/",
                        }
                    }
            
            
                    if(!lockedCustomer.winPrice && lockedCustomer.priceName === "null"){
                        return {
                            success: false,
                            goToGhKart: false,
                            winPrice: lockedCustomer.winPrice,
                            priceName: lockedCustomer.priceName,
                            message: "Sorry, you have to spin and win...",
                            certificateGenerated: lockedCustomer.certificateGenerated,
                            redirectUrl: "/",
                        }
                    }
                    
                    if(lockedCustomer.winPrice && lockedCustomer.priceName !== "null" && lockedCustomer.certificateGenerated && lockedCustomer.receivedPrice){
                        return {
                            success: false,
                            goToGhKart: true,
                            winPrice: lockedCustomer.winPrice,
                            priceName: lockedCustomer.priceName,
                            message: "Sorry, you can only win once. Redirecting...",
                            certificateGenerated: lockedCustomer.certificateGenerated,
                            redirectUrl: "https://ghkart.com",
                        }
                    }

        
                // Optimistic lock update
                if(!lockedCustomer.certificateGenerated){
                    await tx.update(customers)
                        .set({
                            certificateGenerated: true,
                            updatedAt: new Date()
                        })
                        .where(and(
                            eq(customers.id, lockedCustomer.id),
                            eq(customers.certificateGenerated, lockedCustomer.certificateGenerated)
                        ))
                        .run();
                }

                return {
                    success: true,
                    winPrice: lockedCustomer.winPrice,
                    priceName: lockedCustomer.priceName,
                    message: `Successfully generated certificate.`,
                    redirectUrl: "/prize-info",
                };
            });


            const customerUpdate = await db.select().from(customers).where(eq(customers.id, sessionRecord[0].customerId));



            if(!updatedData.success){
                return new Response(JSON.stringify({...updatedData, certificateGenerated: customerUpdate[0].certificateGenerated}),{status: 400, headers: { 'Content-Type': 'application/json' }});
            }else{
                return new Response(JSON.stringify({...updatedData, certificateGenerated: customerUpdate[0].certificateGenerated}),{status: 200, headers: { 'Content-Type': 'application/json' }});
            }

    } catch (err) {
        // console.log(err);
        return new Response(JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}