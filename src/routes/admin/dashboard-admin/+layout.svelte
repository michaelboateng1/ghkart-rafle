<script>
	import Sidebar from "./components/Sidebar.svelte";

	let { children } = $props();


	let isSidebarOpen = $state(false);

    function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
	
</script>

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Sidebar -->
	<Sidebar {isSidebarOpen} />

	
	<!-- Overlay for mobile -->
	{#if isSidebarOpen}
		<div
		class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
			onclick={toggleSidebar}
			aria-hidden="true"
			></div>
	{/if}
			
		<div class="flex flex-1 flex-col overflow-hidden">
			<main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
			{@render children()}
			</main>
		</div>
	
</div>
