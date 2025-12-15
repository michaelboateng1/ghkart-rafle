<script>
	import { enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const { isEditModalOpen, selectedUser = null } = $props();

	const dispatch = createEventDispatcher();

	function closeEditModal() {
		dispatch('close');
	}

	// Toast state
	let toast = $state({ show: false, message: '', type: 'error' });

	function showToast(message, type = 'error', ms = 3000) {
		toast = { show: true, message, type };
		setTimeout(() => (toast = { show: false, message: '', type }), ms);
	}
</script>

<!-- Edit Modal -->
{#if isEditModalOpen}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					transition:fly={{ y: 20, duration: 200 }}
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<form
						action="?/updateUser"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								if (result?.type === 'success') {
									showToast('Customer updated', 'success', 1200);
									// give user a moment to see toast then close and reload
									setTimeout(() => {
										closeEditModal();
										location.reload();
									}, 1200);
								} else if (result?.type === 'failure') {
									const message = result?.data?.error || 'Update failed';
									showToast(message, 'error');
								}
							};
						}}
					>
						<input type="hidden" name="id" value={selectedUser?.id} />
						<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<h3 class="text-base font-semibold leading-6 text-gray-900">Edit Customer</h3>
							<div class="mt-4 grid grid-cols-1 gap-y-4 max-h-[60vh] overflow-y-auto px-1">
								<div>
									<label for="editName" class="block text-sm font-medium text-gray-700">Name</label>
									<input
										type="text"
										name="name"
										id="editName"
										value={selectedUser?.name}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
								<div>
									<label for="editEmail" class="block text-sm font-medium text-gray-700"
										>Email</label
									>
									<input
										type="email"
										name="email"
										id="editEmail"
										value={selectedUser?.email}
										readonly
										class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
									/>
								</div>
								<div>
									<label for="editPhone" class="block text-sm font-medium text-gray-700"
										>Phone</label
									>
									<input
										type="text"
										name="phoneNumber"
										id="editPhone"
										value={selectedUser?.phoneNumber}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
								<div>
									<label for="editAddress" class="block text-sm font-medium text-gray-700"
										>Address</label
									>
									<input
										type="text"
										name="address"
										id="editAddress"
										value={selectedUser?.address}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<label for="editSpins" class="block text-sm font-medium text-gray-700"
											>Spins</label
										>
										<input
											type="number"
											name="numberOfSpins"
											id="editSpins"
											value={selectedUser?.numberOfSpins}
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
									<div>
										<label for="editPriceName" class="block text-sm font-medium text-gray-700"
											>Prize Name</label
										>
										<input
											type="text"
											name="priceName"
											id="editPriceName"
											value={selectedUser?.priceName === 'null' ? '' : selectedUser?.priceName}
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>
								<div class="space-y-2">
									<div class="flex items-center">
										<input
											id="editWinPrice"
											name="winPrice"
											type="checkbox"
											checked={selectedUser?.winPrice}
											class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<label for="editWinPrice" class="ml-2 block text-sm text-gray-900"
											>Win Prize</label
										>
									</div>
									<div class="flex items-center">
										<input
											id="editReceivedPrice"
											name="receivedPrice"
											type="checkbox"
											checked={selectedUser?.receivedPrice}
											class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<label for="editReceivedPrice" class="ml-2 block text-sm text-gray-900"
											>Prize Collected</label
										>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button
								type="submit"
								class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
								>Save Changes</button
							>
							<button
								type="button"
								on:click={closeEditModal}
								class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
								>Cancel</button
							>
						</div>
					</form>

					<!-- Toast -->
					{#if toast.show}
						<div class="fixed top-6 right-6 z-50">
							<div
								class={'px-4 py-2 rounded shadow text-white ' +
									(toast.type === 'success' ? 'bg-green-600' : 'bg-red-600')}
							>
								{toast.message}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
