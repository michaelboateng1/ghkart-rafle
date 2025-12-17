<script>
	import { page } from '$app/stores';
	import {onMount} from "svelte";

	import ghkartChrismasErrorLogo from "$lib/assets/ghkartchristmaslogo404.png";
	
	import Particle from '$lib/backgroundAnimation';
	
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

		window.addEventListener("resize", () =>{
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Update limits for existing particles
			backgroundParticles.forEach((particle) => {
				particle.canvasWidth = canvas.width;
				particle.canvasHeight = canvas.height;
			});
		});
	});

</script>

<div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white">
	<canvas bind:this={canvas} class="absolute inset-0 z-0"></canvas>
	<!-- Dynamic Background -->
	<div class="absolute inset-0 z-0">
		<div
			class="absolute top-0 left-0 w-full h-full"
		></div>
		<div
			class="absolute -top-40 -right-40 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
		></div>
		<div
			class="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob [animation-delay:2s]"
		></div>
	</div>

	<!-- Content Card -->
	<div
		class="relative z-10 max-w-lg w-full bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12 text-center"
	>
	<div class="w-full flex items-center justify-center mb-6">
		<div class="w-[50%] h-auto rounded-lg overflow-hidden">
			<img src={ghkartChrismasErrorLogo} alt="ghkart-logo" class="w-full h-full object-cover">
		</div>
	</div>
		{#if $page.status === 404}
			<div class="mb-6">
				<h1 class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3eb128] to-[#f00]"
				>
					404
				</h1>
			</div>
			<h2 class="text-3xl font-bold text-gray-600 mb-4">Page Not Found</h2>
			<p class="text-gray-600 text-lg mb-8 leading-relaxed">
				Oops! It looks like the page you're looking for doesn't exist.
			</p>
		{:else}
			<div class="mb-6">
				<h1
					class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
				>
					{$page.status}
				</h1>
			</div>
			<h2 class="text-3xl font-bold text-gray-600 mb-4">Something Went Wrong</h2>
			<p class="text-gray-600 text-lg mb-8 leading-relaxed">
				{$page.error?.message || "An unexpected error occurred. Our engineers have been notified and are working on it."}
			</p>
		{/if}

		<a
			href="/"
			class="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-[#3eb128] to-[#105c57] rounded-full shadow-lg hover:transform hover:translate-y-[-2px] hover:shadow-lg active:transform active:translate-y-0"
		>
			Take Me Home
			<svg
				class="w-5 h-5 ml-2 -mr-1"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 7l5 5m0 0l-5 5m5-5H6"
				></path>
			</svg>
		</a>
	</div>
</div>


