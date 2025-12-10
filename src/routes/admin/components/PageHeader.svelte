<script lang="ts">
    import {fly } from 'svelte/transition';
    import { enhance } from '$app/forms';

	let isAddModalOpen = $state(false);

	function openAddModal() {
		isAddModalOpen = true;
	}

    function closeAddModal() {
		isAddModalOpen = false;
	}

</script>

<div class="md:flex md:items-center md:justify-between">
    <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
        </h2>
    </div>
    <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
            onclick={openAddModal}
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            Add Customer
        </button>
    </div>
</div>

<!-- Add Modal -->
{#if isAddModalOpen}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					transition:fly={{ y: 20, duration: 200 }}
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<form action="?/createUser" method="POST" use:enhance={() => {
						return async ({ update, result }) => {
							if (result.type === 'success') closeAddModal();
							update();
						};
					}}>
						<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
									<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Add New Customer</h3>
									<div class="mt-4 grid grid-cols-1 gap-y-4">
										<div>
											<label for="newName" class="block text-sm font-medium text-gray-700">Name</label>
											<input type="text" name="name" id="newName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
										<div>
											<label for="newEmail" class="block text-sm font-medium text-gray-700">Email</label>
											<input type="email" name="email" id="newEmail" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
										<div>
											<label for="newPhone" class="block text-sm font-medium text-gray-700">Phone</label>
											<input type="text" name="phoneNumber" id="newPhone" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
										<div>
											<label for="newAddress" class="block text-sm font-medium text-gray-700">Address</label>
											<input type="text" name="address" id="newAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="submit" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto">Create</button>
							<button type="button" onclick={closeAddModal} class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}