import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { db } from '$lib/server/db/';
import { customers, sessions } from '$lib/server/db/schemas/schema';
import { eq } from 'drizzle-orm';

async function handleSignUpPath({event, resolve}){
	try {
		const { cookies, url } = event;

		const sessionToken = cookies.get("better-auth.session_token");


		if ((url.pathname === "/" || url.pathname === "/verify-email") && sessionToken) {


			const sessionRecord = await db
				.select()
				.from(sessions)
				.where(eq(sessions.token, sessionToken))
				.limit(1);

			if (!sessionRecord || sessionRecord.length === 0) {
				cookies.delete("better-auth.session_token", { path: "/" });
				return resolve(event);
			}

			const customerRecord = await db
				.select()
				.from(customers)
				.where(eq(customers.id, sessionRecord[0].customerId))
				.limit(1);

			// Check expiration
			if (sessionToken && sessionRecord[0].expiresAt < Date.now()) {
				await db.delete(sessions).where(eq(sessions.id, sessionRecord[0].id));
				cookies.delete("better-auth.session_token");
			}

			if (customerRecord[0].emailVerified && !customerRecord[0].winPrice && sessionToken && customerRecord[0].numberOfSpins < 3) {
				throw redirect(302, "/play-game");
			}

			if (customerRecord[0].winPrice && customerRecord[0].certificateGenerated && customerRecord[0].receivedPrice) {
				throw redirect(302, "https://ghkart.com");
			}

			if (!customerRecord[0].winPrice && customerRecord[0].numberOfSpins >= 3) {
				throw redirect(302, "https://ghkart.com");
			}
		}

		return resolve(event);
	} catch (error) {
		console.log("Middleware Error:", error);
		throw error;
	}
}

async function handleEmailVerificationPath({ event, resolve }) {
	try {
		const { cookies, url } = event;

		const sessionToken = cookies.get("better-auth.session_token");
		console.log("Session Token:", sessionToken);

		// Pages that require authentication
		if (url.pathname === "/play-game") {

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

			if (customerRecord[0].winPrice && customerRecord[0].priceName !== "null" && !customerRecord[0].receivedPrice && !customerRecord[0].certificateGenerated) {
				throw redirect(302, "/preview-certificate");
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

export const handle = sequence(handleSignUpPath, handleEmailVerificationPath, handleCertificatePath, svelteKit);
