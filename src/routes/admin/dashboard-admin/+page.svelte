<script>
	import PageHeader from "./components/PageHeader.svelte";
	import StatsCards from "./components/StatsCards.svelte";
	import Table from './components/Table.svelte';

	// Props
	let { data, stats } = $props();

	
</script>

<div class="space-y-6">
	<!-- Page Header -->
	 <PageHeader />

	<!-- Stats Cards -->
	 <StatsCards customers={data.customers} />

	<!-- Table Section -->
	 <Table customers={data.customers} />
</div>



