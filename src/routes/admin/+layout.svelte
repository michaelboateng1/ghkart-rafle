<script lang="ts">
	import GhkartLogo from '$lib/assets/id2QTm5KPO_logos.png';
	import { page } from '$app/stores';

	let { children } = $props();

	let isSidebarOpen = $state(false);

	const navigation = [
		{ name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ name: 'Customers', href: '/admin/customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
		{ name: 'Orders', href: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
		{ name: 'Settings', href: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
	];

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
</script>

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Sidebar -->
	<aside
		class="absolute inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 {isSidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<!-- Logo -->
		<div class="flex h-16 items-center justify-center border-b border-gray-100">
			<img src={GhkartLogo} alt="Logo" class="h-8 w-auto" />
			<span class="ml-2 text-xl font-bold text-gray-800">Admin</span>
		</div>

		<!-- Nav Links -->
		<nav class="mt-6 flex flex-col gap-1 px-4">
			{#each navigation as item}
				<a
					href={item.href}
					class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {$page.url
						.pathname === item.href
						? 'bg-indigo-50 text-indigo-600'
						: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d={item.icon}
						/>
					</svg>
					{item.name}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Overlay for mobile -->
	{#if isSidebarOpen}
		<div
			class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
			onclick={toggleSidebar}
			aria-hidden="true"
		></div>
	{/if}

	<!-- Main Content Area -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Navigation -->
		<header class="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
			<div class="flex items-center">
				<button
					onclick={toggleSidebar}
					class="mr-4 text-gray-500 focus:outline-none lg:hidden"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
				
				<!-- Search Bar -->
				<div class="relative hidden sm:block">
					<span class="absolute inset-y-0 left-0 flex items-center pl-3">
						<svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
							<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</span>
					<input class="block w-full rounded-md border border-gray-100 bg-gray-50 py-2 pl-10 pr-3 leading-5 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" placeholder="Search..." type="search">
				</div>
			</div>

			<!-- User Profile -->
			<div class="flex items-center gap-4">
				<button class="relative p-1 text-gray-400 hover:text-gray-500">
					<span class="sr-only">Notifications</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
					<span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
				</button>
				<div class="flex items-center gap-2">
					<img
						class="h-8 w-8 rounded-full object-cover ring-2 ring-white"
						src="https://ui-avatars.com/api/?name=Admin+User&background=random"
						alt="Admin"
					/>
					<span class="hidden text-sm font-medium text-gray-700 sm:block">Admin User</span>
				</div>
			</div>
		</header>

		<!-- Main Content Scroll Area -->
		<main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
			{@render children()}
		</main>
	</div>
</div>
