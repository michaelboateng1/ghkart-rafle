<script>
	export let email = '';

	import {goto} from "$app/navigation";

	let otpDigits = ['', '', '', ''];
	let otpInputs = [];
	let resendOTPButton;
	let disableOTPResend = false;
	let timeToResend = 60;
	let timer = null;

	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	// Handle input and auto-focus next field
	function handleInput(index, event) {
		const value = event.target.value;

		// Only allow numbers
		if (!/^\d*$/.test(value)) {
			event.target.value = otpDigits[index];
			return;
		}

		otpDigits[index] = value;

		// Auto-focus next input
		if (value && index < 3) {
			otpInputs[index + 1].focus();
		}

		// Send OTP for verification if all digits are filled
		if (otpDigits.every((digit) => digit !== '')) {
			verifyOTP();
		}
	}

	// Handle backspace
	function handleKeydown(index, event) {
		if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
			otpInputs[index - 1].focus();
		}
	}

	// Handle paste
	function handlePaste(event) {
		event.preventDefault();
		const pastedData = event.clipboardData.getData('text').trim();

		if (/^\d{4}$/.test(pastedData)) {
			otpDigits = pastedData.split('');
			otpInputs[3].focus();
		}

		// Send OTP for verification if all digits are filled
		if (otpDigits.every((digit) => digit !== '')) {
			verifyOTP();
		}
	}

	async function verifyOTP() {
		errorMessage = '';
		successMessage = '';

		const otp = otpDigits.join('');

		if (otp.length !== 4) {
			errorMessage = 'Please enter all 4 digits';
			return;
		}

		isLoading = true;

		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, otp })
			};

			const response = await fetch('/api/verify-otp', options);

			const data = await response.json();

			// console.log("FINISHED OTP DATABASE OPERATIONS: ", data);

			if (response.ok && response.status === 200) {
				successMessage = 'Email verified successfully!';
				setTimeout(() => goto('/play-game'), 1500);
				
			} else {
				if(data.message){
					successMessage = data.message || 'Email verified successfully!';
				}else if(data.error){
					errorMessage = data.error || 'Invalid OTP. Please try again.';
				}
				// Clear OTP inputs on error
				otpDigits = ['', '', '', ''];
				otpInputs[0].focus();

				if(data.redirectUrl && data.redirectUrl.includes("https://ghkart.com")) setTimeout(() => window.location = data.redirectUrl, 1500);
				if(data.redirectUrl) setTimeout(() => goto(data.redirectUrl), 1500);
			}
		} catch (err) {
			errorMessage = 'An error occurred. Please try again.';
			console.error('Error:', err);
		} finally {
			isLoading = false;
		}
	}

	async function resendOTP() {
		// prevent multiple clicks
		if (disableOTPResend || isLoading) return;

		errorMessage = '';
		successMessage = '';
		isLoading = true;

		// start countdown
		disableOTPResend = true;
		timeToResend = 60;
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			timeToResend -= 1;
			if (timeToResend <= 0) {
				clearInterval(timer);
				timer = null;
				disableOTPResend = false;
				timeToResend = 60;
				errorMessage = '';
				successMessage = '';
			}
		}, 1000);

		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			};

			const response = await fetch('/api/otp-auth', options);

			const data = await response.json();

			if (response.ok && data.success) {
				successMessage = 'New OTP sent! Check your email.';
			} else {
				errorMessage = data.error || 'Failed to resend OTP';
				// Stop countdown on failure so user can retry
				if (timer) {
					clearInterval(timer);
					timer = null;
				}
				disableOTPResend = false;
				timeToResend = 60;
			}
		} catch (err) {
			errorMessage = 'An error occurred';
			console.error('Error:', err);
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			disableOTPResend = false;
			timeToResend = 60;
		} finally {
			isLoading = false;
		}
	}
</script>

<form>
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold mb-2">Verify Your Email</h2>
		<p class="text-gray-600">We've sent a 4-digit code to</p>
		<p class="font-semibold text-green-600">{email}</p>
	</div>

	{#if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
			{errorMessage}
		</div>
	{/if}

	{#if successMessage}
		<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded">
			{successMessage}
		</div>
	{/if}

	<div class="flex justify-center gap-3">
		{#each otpDigits as digit, i}
			<input
				bind:this={otpInputs[i]}
				type="text"
				maxlength="1"
				value={digit}
				oninput={(e) => handleInput(i, e)}
				onkeydown={(e) => handleKeydown(i, e)}
				onpaste={handlePaste}
				class="w-14 h-14 text-center text-2xl font-bold border-2 border-green-400 rounded-lg focus:border-green-600 focus:outline-none"
				disabled={isLoading}
			/>
		{/each}
	</div>
</form>

<button
	bind:this={resendOTPButton}
	onclick={() => resendOTP()}
	type="button"
	disabled={disableOTPResend || isLoading}
	class={'mt-15 w-full text-center p-2 text-lg font-bold text-white capitalize rounded-lg transition-colors duration-300 ' +
		(disableOTPResend
			? 'bg-gray-400 opacity-60 cursor-not-allowed'
			: 'bg-green-400 hover:bg-orange-400 active:bg-green-400')}>Resend OTP ({timeToResend})</button
>
