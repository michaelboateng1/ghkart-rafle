import { getCustomerById } from '$lib/query/queryData.js';
import { updateCertificateGenerated } from '$lib/query/updateData.js';

export async function POST({request}){
    try{        
        const {id} = request.json();
    
        const userData = getCustomerById(id);
    
        if(userData[0].win_price && userData[0].price_name !== "no price" && !userData[0].certificate_generated && !userData[0].price_collected){
            updateCertificateGenerated(id);
            return new Response(JSON.stringify({message: "claim your cert now"}, {status: 200}));
        }
        return new Response(JSON.stringify({message: "you've won no price yet"}), {status: 401});
    }catch(err){
        console.log(err);
        return new Response(JSON.stringify({message: "Internal Server Error"}, {status: 500}));
    }
}