import { getCustomerById } from '$lib/query/queryData';
import { db } from '$lib/server/db/index.js';
import { customers } from '$lib/server/db/schemas/schema.js';
import { eq } from 'drizzle-orm';

export async function POST({request}){
    const {id, price} = await request.json();

    const user = getCustomerById(id);

    try{
        await db.transaction(async (data) => {
            if(!user[0].win_price){
                data.update(customers).set({win_price: true}).where(eq(customers.id, id));
            }

            if(user[0].price_name){
                data.update(customers).set({price_name: price}).where(eq(customers.id, id));

            }
        })
        return new Response(JSON.stringify({message: "user updated"}), {status: 200})
    }catch(err){
        return new Response(JSON.stringify({message: "Internal server error"}), {status: 500})
        console.log(err)
    }

}