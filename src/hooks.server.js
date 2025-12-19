import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { db } from '$lib/server/db/';
import { customers, sessions } from '$lib/server/db/schemas/schema';
import { eq, or } from 'drizzle-orm';
import {cleanExpired} from "$lib/query/cleanUp";


async function handleAuth({event, resolve}) {
	if (building) {
		return resolve(event);
	}
	
	const { cookies, url } = event;

	const noAuth = ["/", "/api/otp-auth", "/verify-email", "/api/verify-otp", "/admin/dashboard-admin"];

	
	if (noAuth.includes(url.pathname) || url.pathname.startsWith("/api/")) {
		if(Math.random() < 0.01){
			await cleanExpired();
		}
		return resolve(event);
	}
	
	const sessionToken = cookies.get("better-auth.session_token");
	// console.log("Session Token:", sessionToken);

	// console.log("CURRENT PATH: ", url.pathname);

	if(!sessionToken){
		// console.log("MISSING SESSION TOKEN")
		throw redirect(302, "/");
	}

	const record = await db
	.select({
		sessionId: sessions.id,
		expiresAt: sessions.expiresAt,
		customerId: customers.id,
		emailVerified: customers.emailVerified,
		numberOfSpins: customers.numberOfSpins,
		winPrice: customers.winPrice,
		priceName: customers.priceName,
		certificateGenerated: customers.certificateGenerated,
		receivedPrice: customers.receivedPrice
	})
	.from(sessions)
	.innerJoin(customers, eq(customers.id, sessions.customerId))
	.where(eq(sessions.token, sessionToken))
	.limit(1);

	if (!record.length) {
		// console.log("MISSING SESSION IN THE DATABASE");
		throw redirect(302, "/");
	}else if(!record[0].sessionId){
		// console.log("MISSING SESSION ID IN THE DATABASE");
		throw redirect(302, "/");
	}

	const customer = record[0];
	
	// Check expiration
	if (new Date(customer.expiresAt).getTime() < Date.now()) {
		await db.delete(sessions).where(or(eq(sessions.token, sessionToken), eq(sessions.id, customer.sessionId)));
		cookies.delete("better-auth.session_token", { path: "/" });
		throw redirect(302, "/");
	}
	
	event.locals.customerId = customer.customerId;

	if (!customer.emailVerified) {
		throw redirect(302, "/");
	}

	if (customer.winPrice && customer.priceName !== "null") {
		if (!customer.certificateGenerated && !customer.receivedPrice) {
			if (url.pathname !== "/preview-certificate") {
				throw redirect(302, "/preview-certificate");
			}
		} else if (customer.certificateGenerated && !customer.receivedPrice) {
			if (url.pathname !== "/prize-info") {
				throw redirect(302, "/prize-info");
			}
		} else {
			throw redirect(302, "https://ghkart.com");
		}
	}

	if (customer.numberOfSpins > 10) {
		throw redirect(302, "https://ghkart.com");
	}

	
	return resolve(event);
}

async function svelteKit({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth, building });
}

export const handle = sequence( handleAuth, svelteKit);
