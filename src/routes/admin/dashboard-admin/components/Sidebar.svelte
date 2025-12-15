<script>
    import {page} from "$app/stores";
    import GhkartLogo from '$lib/assets/ghkartchristmaslogo.png';

    export let isSidebarOpen;

    const navigation = [
		{ name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
	];
</script>

<aside
    class="absolute inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 {isSidebarOpen
        ? 'translate-x-0'
        : '-translate-x-full'}"
>
    <!-- Logo -->
    <div class="flex h-16 px-5 items-center justify-center border-b border-gray-100">
        <img src={GhkartLogo} alt="Logo" class="h-full w-full" />
    </div>

    <!-- Nav Links -->
    <nav class="mt-6 flex flex-col gap-1 px-4">
        {#each navigation as item}
            <a
                href={item.href}
                class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {$page.url
                    .pathname === item.href
                    ? 'bg-green-50 text-green-600'
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