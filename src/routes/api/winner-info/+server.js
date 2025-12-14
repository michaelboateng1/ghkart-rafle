export async function GET({request, cookies}){
    const winner = cookies.get("ghkart.prizeWinner");
    if(!winner){
        console.log("No Winner Data Found");
    }

    if (winner) return new Request(JSON.stringify({winner}), {status: 200});
}