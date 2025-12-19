
<script>
    import { goto } from '$app/navigation';

	let emailInput;
	let isLoading = false;

   async function handleSubmit(e) {
        e.preventDefault();
		isLoading = true;

		try{
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: {
					email: emailInput.value,
				}
			}

			const response = await fetch("/api/sign-in", options);
			const data = await response.json();
			// console.log(data);
			emailInput.value = "";
		}catch(err){
			// console.log(err);
		}finally{
			isLoading = false;
		}
		
    }
</script>

<form action="" method="get" class="space-y-3">
	<div class="flex flex-col items-start justify-center">
		<input bind:this={emailInput}
			type="email"
			name="email"
			id="email"
			placeholder="Fill in your email..."
			class="w-full border-0 border-b-2 border-green-400 font-semibold bg-gray-50"
		/>
	</div>

	<button disable={isLoading} onclick={(e) => handleSubmit(e)}
		class="mt-5 w-full bg-green-400 text-center p-2 text-lg font-bold text-white capitalize rounded-lg cursor-pointer hover:bg-orange-400 active:bg-green-400 transition-colors duration-300"
		type="submit">{isLoading ? 'Sending...' : 'Login'}</button
	>
</form>
