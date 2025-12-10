<script>
	import GhkartLogo from '$lib/assets/id2QTm5KPO_logos.png';

	import SignUp from './components/SignUp.svelte';
	import Login from './components/Login.svelte';

	import { onMount } from 'svelte';
	import Particle from '$lib/backgroundAnimation';

	let formState = $state('signup');

	function hundleFormState() {
		formState = formState === 'signup' ? 'login' : 'signup';
	}

	const backgroundParticles = [];

	let canvas;

	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const ctx = canvas.getContext('2d');

		function hundleParticles() {
			for (let i = 0; i <= 10; i++) {
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				backgroundParticles.push(new Particle(canvasWidth, canvasHeight));
			}
		}

		hundleParticles();

		function animate() {
			ctx.fillStyle = 'rgba(255, 255, 255, .2)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < backgroundParticles.length; i++) {
				backgroundParticles[i].draw(ctx);
				backgroundParticles[i].update();
			}

			requestAnimationFrame(animate);
		}

		animate();
	});
</script>

<div class="absolute w-full h-full flex items-center justify-center">
	<canvas class="hidden sm:block absolute top-0 left-0 w-full h-full" bind:this={canvas}></canvas>
	<main
		class=" h-full w-full sm:w-auto sm:h-auto px-10 sm:px-20 py-10 bg-gray-50 sm:rounded-2xl sm:drop-shadow-2xl flex flex-col justify-center"
	>
		<div class="flex items-center justify-center gap-2 mb-5">
			<div class=" w-[150px] sm:w-[200px] h-auto bg-white">
				<img src={GhkartLogo} alt="GH-kart Logo" class="w-full h-full object-cover" />
			</div>
		</div>
		{#if formState === 'signup'}
			<SignUp />
		{:else if formState === 'login'}
			<Login />
		{/if}
		<button
			onclick={() => hundleFormState()}
			class="text-green-400 text-sm underline mt-3 cursor-pointer hover:text-orange-400 active:text-green-400 transition-colors duration-300"
			type="button"
			>{formState === 'signup' ? 'Already been here? login' : 'New here? signup'}</button
		>
	</main>
</div>
