import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { db } from '$lib/server/db/';
import { customers, sessions } from '$lib/server/db/schemas/schema';
import { eq } from 'drizzle-orm';


async function handleEmailVerificationPath({ event, resolve }) {
	try {
		const { cookies, url } = event;

		const sessionToken = cookies.get("better-auth.session_token");
		const userEmail = cookies.get("ghkart.user_email");
		console.log("Session Token:", sessionToken);

		console.log("Current Path: ", url.pathname)

		// Pages that require authentication
		if (url.pathname === "/play-game") {

			if(!sessionToken){
				console.log("MISSING SESSION TOKEN")
				throw redirect(302, "/");
			}

			const sessionRecord = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, sessionToken))
				.limit(1);

			if (!sessionRecord.length) {
				console.log("MISSING SESSION IN THE DATABASE");
				throw redirect(302, "/");
			}

			// Check expiration
			if (sessionRecord[0].expiresAt < Date.now()) {
				await db.delete(sessions).where(eq(sessions.id, sessionRecord[0].id));
				cookies.delete("better-auth.session_token");
				throw redirect(302, "/");
			}

			const customerRecord = await db
				.select()
				.from(customers)
				.where(eq(customers.id, sessionRecord[0].customerId))
				.limit(1);

			if (!customerRecord.length) {
				console.log("USER DON'T EXIST IN OUR DATABASE");
				throw redirect(302, "/");
			}

			if (!customerRecord[0].emailVerified) {
				console.log("USER ISN'T VERIFIED")
				throw redirect(302, "/");
			}
			
			if (customerRecord[0].numberOfSpins >= 3) {
				console.log("YOU'VE SPIN MORE THAN 3")
				throw redirect(301, "https://ghkart.com");
			}

			if (customerRecord[0].winPrice && customerRecord[0].priceName !== "null" && customerRecord[0].certificateGenerated && customerRecord[0].receivedPrice) {
				console.log("YOU'VE ALREADY GOTTON YOUR PTIZE, WHAT DO YOU WANT");
				throw redirect(301, "https://ghkart.com");
			}

			if(customerRecord[0].winPrice && customerRecord[0].priceName !== "null"){
				console.log("YOU'VE ALREADY WON A PRIZE");
				throw redirect(302, "/");
			}

			if (customerRecord[0].winPrice && customerRecord[0].priceName !== "null" && !customerRecord[0].receivedPrice && !customerRecord[0].certificateGenerated) {
				console.log("GO AND CLAIM YOUR CERTIFICATE");
				throw redirect(302, "/preview-certificate");
			}

			if (customerRecord[0].winPrice && customerRecord[0].priceName !== "null" && customerRecord[0].certificateGenerated && !customerRecord[0].receivedPrice) {
				console.log("YOU'VE WON AND GENERATED CERTIFICATE, COME FOR YOUR PRIZE");
				throw redirect(302, "/prize-info");
			}

		}else if(url.pathname === "/preview-certificate" || url.pathname === "/api/generate-certificate"){
			if(!sessionToken){
				console.log("MISSING SESSION TOKEN FOR PREVIEW CERTIFICATE PAGE");
				throw redirect(301, "/");
			}

			const sessionRecord = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, sessionToken))
				.limit(1);

			if (!sessionRecord.length) {
				console.log("MISSIONG SESSION IN DATABASE FOR CERTIFICATE PREVIEW PAGE");
				throw redirect(301, "/");
			}

			// // // Check expiration
			if (sessionRecord[0].expiresAt < Date.now()) {
				await db.delete(sessions).where(eq(sessions.id, sessionRecord[0].id));
				cookies.delete("better-auth.session_token");
				console.log('USER SESSION HAS EXPIRED FOR PREVIEW CERTIFICATE PAGE');
				throw redirect(301, "/");
			}

			const customerRecord = await db
				.select()
				.from(customers)
				.where(eq(customers.id, sessionRecord[0].customerId))
				.limit(1);

			if (!customerRecord.length) {
				console.log("USER DOESN'T EXISTS IN DATABASE FOR CERTIFICATE PREVIEW PAGE")
				throw redirect(301, "/");
			}

			if (!customerRecord[0].emailVerified) {
				console.log("USER EMAIL NOT VERIFIED FOR CERTIFICATE PREVIEW PAGE")
				throw redirect(301, "/");
			}

			if(!customerRecord[0].winPrice && customerRecord[0].priceName === "null"){
				console.log("YOU'VE NOT WON A PRIZE");
				throw redirect(301, "/");
			}

			if(customerRecord[0].numberOfSpins > 3){
				console.log("YOU'VE SPIN MORE THAN 3");
				throw redirect(301, "/");
			}

		}else if(url.pathname === "/prize-info"){
			if(!sessionToken){
				console.log("MISSING SESSION TOKEN FOR PRIZE INFO PAGE");
				throw redirect(301, "/");
			}

			const sessionRecord = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, sessionToken))
				.limit(1);

				if (!sessionRecord.length) {
					console.log("MISSIONG SESSION IN DATABASE FOR PRIZE INFO PAGE");
					throw redirect(301, "/");
				}
				
			const customerRecord = await db
				.select()
				.from(customers)
				.where(eq(customers.id, sessionRecord[0].customerId))
				.limit(1);

			if (!customerRecord.length) {
				console.log("USER DOESN'T EXISTS IN DATABASE FOR PRIZE INFO PAGE")
				throw redirect(301, "/");
			}

			if (!customerRecord[0].emailVerified) {
				console.log("USER EMAIL NOT VERIFIED FOR PRIZE INFO PAGE")
				throw redirect(301, "/");
			}

			if(customerRecord[0].winPrice && customerRecord[0].priceName !== "null" && customerRecord[0].receivedPrice){
				console.log("YOU'VE ALREADY WON A PRIZE FOR PRIZE INFO PAGE");
				throw redirect(301, "https://ghkart.com");
			}

			if(!customerRecord[0].winPrice && customerRecord[0].priceName === "null" && !customerRecord[0].certificateGenerated){
				console.log("YOU'VE NOT WON A PRIZE FOR PRIZE INFO PAGE");
				throw redirect(301, "/");
			}

			
			if(customerRecord[0].numberOfSpins > 3){
				console.log("YOU'VE SPIN MORE THAN 3");
				throw redirect(301, "/");
			}
		}

		return resolve(event);

	} catch (err) {
		console.log("Middleware Error:", err);
		throw err; // Re-throw to not swallow redirects
	}
}

async function handleCertificatePath({ event, resolve }) {
	try {
		const { cookies, url } = event;

		const sessionToken = cookies.get("better-auth.session_token");
		console.log("Session Token:", sessionToken);

		// Pages that require authentication
		if (url.pathname === "/preview-certificate") {

			if (!sessionToken) {
				throw redirect(302, "/");
			}

			const sessionRecord = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, sessionToken))
				.limit(1);

			if (!sessionRecord.length) {
				cookies.delete("better-auth.session_token");
				throw redirect(302, "/");
			}

			// Check expiration
			if (sessionRecord[0].expiresAt < Date.now()) {
				await db.delete(sessions).where(eq(sessions.id, sessionRecord[0].id));
				cookies.delete("better-auth.session_token");
				throw redirect(302, "/");
			}

			const customerRecord = await db
				.select()
				.from(customers)
				.where(eq(customers.id, sessionRecord[0].customerId))
				.limit(1);

			if (!customerRecord.length) {
				throw redirect(302, "/");
			}

			if (!customerRecord[0].emailVerified) {
				throw redirect(302, "/");
			}

			if (!customerRecord[0].winPrice && customerRecord[0].numberOfSpins >= 3) {
				throw redirect(302, "https://ghkart.com");
			}

			if(!customerRecord[0].winPrice && customerRecord[0].numberOfSpins < 3){
				throw redirect(302, "/play-game");
			}

			if (customerRecord[0].winPrice && customerRecord[0].certificateGenerated && !customerRecord[0].receivedPrice) {
				throw redirect(302, "/price-info");
			}
		}

		return resolve(event);

	} catch (err) {
		console.log("Middleware Error:", err);
		throw err; // Re-throw to not swallow redirects
	}
}


async function svelteKit({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth, building });
}

export const handle = sequence( handleEmailVerificationPath, handleCertificatePath, svelteKit);
