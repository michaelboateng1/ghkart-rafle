<script>
    export let data;

	let stats = $derived.by(() => {
		const total = data.users.length;
		const winners = data.users.filter((u) => u.customer?.winPrice).length;
		// Mock recent activity based on filtered list for now or just generic
		const recent = data.users.filter((u) => {
			const date = new Date(u.createdAt);
			const now = new Date();
			return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) < 7; // joined last 7 days
		}).length;
		return { total, winners, recent };
	});

</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Customers</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.total}</dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Winners</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">{stats.winners}</dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">New (Last 7 Days)</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats.recent}</dd>
    </div>
</div>