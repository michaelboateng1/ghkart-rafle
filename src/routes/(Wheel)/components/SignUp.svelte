<script>
	import { goto } from '$app/navigation';

	let firstNameInput;
	let lastNameInput;
	let emailInput;
	let phoneNumberInput;
	let locationInput;

	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	async function handleSubmit(e) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';
		isLoading = true;

		try {
			const body = {
				firstName: firstNameInput.value,
				lastName: lastNameInput.value,
				email: emailInput.value,
				phoneNumber: phoneNumberInput.value,
				location: locationInput.value
			};

			const response = await fetch('/api/otp-auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();

			if (response.ok && data.success) {
				goto(`/verify-email?email=${encodeURIComponent(body.email)}`);

				// Clear form
				firstNameInput.value = '';
				lastNameInput.value = '';
				emailInput.value = '';
				phoneNumberInput.value = '';
				locationInput.value = '';
			} else {
				console.log(data.error);
				errorMessage = data.error || 'Failed to send OTP';
			}
		} catch (err) {
			errorMessage = 'An error occurred';
			console.error('Error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

{#if errorMessage}
	<div class="text-red-500 mb-4">{errorMessage}</div>
{/if}

{#if successMessage}
	<div class="text-green-500 mb-4">{successMessage}</div>
{/if}

<form action="" method="post" class="space-y-3">
	<div class="flex flex-col sm:flex-row sm:items-center gap-5">
		<div class="flex flex-col items-start justify-center">
			<input
				bind:this={firstNameInput}
				type="text"
				name="firstName"
				id="firstName"
				placeholder="Fill in your first name..."
				class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<input
				bind:this={lastNameInput}
				type="text"
				name="lastName"
				id="lastName"
				placeholder="Fill in your last name..."
				class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
			/>
		</div>
	</div>

	<div class="flex flex-col sm:flex-row sm:items-center gap-5">
		<div class="flex flex-col items-start justify-center">
			<input
				bind:this={emailInput}
				type="email"
				name="email"
				id="email"
				placeholder="Fill in your email..."
				class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
			/>
		</div>
		<div class="flex flex-col items-start justify-center">
			<input
				bind:this={phoneNumberInput}
				type="tel"
				name="phoneNumber"
				id="phoneNumber"
				placeholder="Fill in your phone number..."
				class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
			/>
		</div>
	</div>
	<div class="flex flex-col items-start justify-center">
		<input
			bind:this={locationInput}
			type="text"
			name="location"
			id="location"
			placeholder="Fill in your location address..."
			class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
		/>
	</div>

	<button
		type="submit"
		onclick={(e) => handleSubmit(e)}
		disabled={isLoading}
		class="mt-5 w-full bg-green-400 text-center p-2 text-lg font-bold text-white capitalize rounded-lg cursor-pointer hover:bg-orange-400 active:bg-green-400 transition-colors duration-300 disabled:opacity-50"
	>
		{isLoading ? 'Sending...' : 'Submit'}
	</button>
</form>
