<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	

	import PageHeader from "./components/PageHeader.svelte";
	import StatsCards from "./components/StatsCards.svelte";
	import Table from './components/Table.svelte';

	let { data }: { data: PageData } = $props();

	// State

	let isEditModalOpen = $state(false);
	
	let editingUser = $state<any>(null);




	function openEditModal(user: any) {
		editingUser = user;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		editingUser = null;
		isEditModalOpen = false;
	}




</script>

<div class="space-y-6">
	<!-- Page Header -->
	 <PageHeader />

	<!-- Stats Cards -->
	 <StatsCards {data} />

	<!-- Table Section -->
	 <Table {data} />
</div>



<!-- Edit Modal -->
{#if isEditModalOpen && editingUser}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					transition:fly={{ y: 20, duration: 200 }}
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<form action="?/updateUser" method="POST" use:enhance={() => {
						return async ({ update, result }) => {
							if (result.type === 'success') closeEditModal();
							update();
						};
					}}>
						<input type="hidden" name="id" value={editingUser.id} />
						<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<h3 class="text-base font-semibold leading-6 text-gray-900">Edit Customer</h3>
							<div class="mt-4 grid grid-cols-1 gap-y-4 max-h-[60vh] overflow-y-auto px-1">
								<div>
									<label for="editName" class="block text-sm font-medium text-gray-700">Name</label>
									<input type="text" name="name" id="editName" value={editingUser.name} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
								</div>
								<div>
									<label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
									<input type="email" name="email" id="editEmail" value={editingUser.email} readonly class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm" />
								</div>
								
								{#if editingUser.customer}
									<div>
										<label for="editPhone" class="block text-sm font-medium text-gray-700">Phone</label>
										<input type="text" name="phoneNumber" id="editPhone" value={editingUser.customer.phoneNumber} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="editSpins" class="block text-sm font-medium text-gray-700">Spins</label>
											<input type="number" name="numberOfSpins" id="editSpins" value={editingUser.customer.numberOfSpins} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
										<div>
											<label for="editPriceName" class="block text-sm font-medium text-gray-700">Price Name</label>
											<input type="text" name="priceName" id="editPriceName" value={editingUser.customer.priceName} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
									</div>
									<div class="space-y-2">
										<div class="flex items-center">
											<input id="editWinPrice" name="winPrice" type="checkbox" checked={editingUser.customer.winPrice} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
											<label for="editWinPrice" class="ml-2 block text-sm text-gray-900">Win Price</label>
										</div>
										<div class="flex items-center">
											<input id="editPriceCollected" name="priceCollected" type="checkbox" checked={editingUser.customer.priceCollected} class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
											<label for="editPriceCollected" class="ml-2 block text-sm text-gray-900">Price Collected</label>
										</div>
									</div>
								{/if}
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="submit" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto">Save Changes</button>
							<button type="button" onclick={closeEditModal} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
