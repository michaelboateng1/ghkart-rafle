import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import {redirect} from "@sveltejs/kit";
import {sequence} from "@sveltejs/kit/hooks";

import {db} from "$lib/server/db/";
import { customers, user } from "$lib/server/db/schemas/schema";
import { eq } from "drizzle-orm";

async function checkCookies({event, resolve}){
	try{
		const sessionToken = event.cookies.get("better-auth.session_token");

		console.log("Session Token: ", sessionToken);
	
		return resolve(event);
	}catch(err) {
		console.log("Middleware Error: ", err)
	}
}

async function spinLimit({ event, resolve }) {
	return resolve(event);
}

async function svelteKit({event, resolve}){
	return svelteKitHandler({ event, resolve, auth, building });
}


export const handle = sequence(checkCookies, spinLimit, svelteKit);