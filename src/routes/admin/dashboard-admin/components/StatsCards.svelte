<script>
    let {customers} = $props();

    const calculateStats = $derived.by(() => {
        return {
            totalCustomers: customers.length,
            totalWinners: customers.filter(customer => customer.winPrice).length,
            totalSharedProducts: customers.filter(customer => customer.winPrice && customer.receivedPrice).length
        }
    })
    
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Customers</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{calculateStats.totalCustomers}</dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Winners</dt>
        <dd class="mt-1 text-3xl font-semibold text-green-600 tracking-tight">{calculateStats.totalWinners}</dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Shared Products</dt>
        <dd class="mt-1 text-3xl font-semibold text-red-600 tracking-tight">{calculateStats.totalSharedProducts}</dd>
    </div>
</div>