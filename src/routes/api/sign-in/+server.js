import { auth } from '$lib/auth';

export async function POST({request}){
    try {
        const {email} = await request.json();

        const response = await auth.api.signInEmail({
            body: {
                email: email,
            }
        });

        console.log(response)

        return new Response(JSON.stringify(response));
    } catch (error) {
        return new Response(JSON.stringify(error), {status: 500});
    }
}