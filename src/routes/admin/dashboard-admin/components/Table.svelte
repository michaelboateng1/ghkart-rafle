<script>
    // Props
    let { customers } = $props();
    
    let searchQuery = $state('');

    // Derived - filter customers based on search query
    let filteredUsers = $derived.by(() => {
        if (!searchQuery) return customers;
        const q = searchQuery.toLowerCase();
        return customers.filter(
            (user) =>
                user.name?.toLowerCase().includes(q) ||
                user.email?.toLowerCase().includes(q) ||
                user.phoneNumber?.includes(q)
        );
    });

</script>

<div class="overflow-hidden rounded-lg bg-white shadow">
    <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div class="ml-4 mt-2">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Customers</h3>
                <p class="mt-1 text-sm text-gray-500">A list of all customers</p>
            </div>
            <div class="ml-4 mt-2 flex-shrink-0">
                <!-- Helper search input for the table context -->
                <input
                    bind:value={searchQuery}
                    type="email"
                    placeholder="Search customers by email..."
                    class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
            </div>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Prize</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Prize Status</th>
                    <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
                {#each filteredUsers as user (user.id)}
                    <tr class="hover:bg-gray-50">
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="flex items-center">
                                <div class="h-10 w-10 flex-shrink-0">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <div class="font-medium text-gray-900">{user.name}</div>
                                    <div class="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                                </div>
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="text-sm text-gray-900">{user.phoneNumber}</div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="text-sm text-gray-900">{user.address}</div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            {#if user.winPrice && user.priceName}
                                <span
                                    class="text-sm text-gray-900"
                                >
                                    {user.priceName}
                                </span>
                            {:else}
                                <span
                                    class="text-sm text-gray-900"
                                >
                                    Not Won
                                </span>
                            {/if}
                        </td>

                        <td class="whitespace-nowrap px-6 py-4">
                            {#if user.winPrice && user.priceName && user.receivedPrice}
                                <span
                                    class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
                                >
                                    Received
                                </span>
                            {:else}
                                <span
                                    class="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800"
                                >
                                    Not Received
                                </span>
                            {/if}
                        </td>
                        
                        <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                                onclick={() => openEditModal(user)}
                                class="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                                Edit
                            </button>
                            <form
                                action="?/deleteUser"
                                method="POST"
                                class="inline"
                                use:enhance
                            >
                                <input type="hidden" name="id" value={user.id} />
                                <button
                                    type="submit"
                                    class="text-red-600 hover:text-red-900"
                                    onclick={(e) => {
                                        if (!confirm('Delete this user permanently?')) e.preventDefault();
                                    }}
                                >
                                    Delete
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
                {#if filteredUsers.length === 0}
                    <tr>
                        <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                            No users found.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>