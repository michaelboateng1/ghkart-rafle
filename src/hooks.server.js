import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import {redirect} from "@sveltejs/kit";
import {sequence} from "@sveltejs/kit/hooks";

import {db} from "$lib/server/db/";
import { customers, user } from "$lib/server/db/schemas/schema";
import { eq } from "drizzle-orm";

async function checkCookies({event, resolve}){
	console.log("Event: ",event);
	console.log("Resolve: ", resolve);
	const {cookies, url} = event;





	// const token = cookies.get("token");	
	// console.log("Token: ", token);
	// console.log("Cookies: ", cookies.getAll());

	if(url.pathname === "/verify-email" && )

	return resolve(event);
}

async function spinLimit({ event, resolve }) {
	return resolve(event);
}

async function svelteKit({event, resolve}){
	return svelteKitHandler({ event, resolve, auth, building });
}


export const handle = sequence(checkCookies, spinLimit, svelteKit);