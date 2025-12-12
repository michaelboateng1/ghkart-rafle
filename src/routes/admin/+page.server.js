import { getAllCustomers} from "$lib/query/queryAllCustomers";

export async function load() {
    const customers = await getAllCustomers();
    
    return {
        customers,
    };
}
