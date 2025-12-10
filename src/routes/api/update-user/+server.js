import { getUserById } from '$lib/query/queryData';
import { updateNumberOfSpins } from '$lib/query/updateData';

let spins = 0

export async function POST({request}){
    const {id} = await request.json();

    if(spins < 3){
        spins++
    }

    try{
        if(id && spins < 3){

            const userData = getUserById(id);
            console.log("userData: ", userData);

            if(userData[0].number_of_spin >! 3){
                const updateSpin =  updateNumberOfSpins(userData[0].id);
                console.log("updateSpin: ", updateSpin);
            }else{
                return new Response(JSON.stringify({message: "you only have 3 attempts.", numberOfSpin: userData[0].number_of_spin}), {status: 400});
            }

            return new Response(JSON.stringify({message: `you have ${Number(userData[0].number_of_spin) - 3} more to spin`}, {status: 200}))
        }
    }catch(err){
        console.log(err);
        return new Response(JSON.stringify({message: "Internal Error"}), {status: 500})
    }

}