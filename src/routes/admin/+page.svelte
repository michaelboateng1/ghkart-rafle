<script>
	import GhkartLogo from '$lib/assets/ghkartchristmaslogo.png';

	import { onMount } from 'svelte';
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
	});

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

			const response = await fetch("/api/admin-auth", options);
			const data = await response.json();
			console.log(data);
			emailInput.value = "";
		}catch(err){
			console.log(err);
		}finally{
			isLoading = false;
		}
		
    }
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
	</main>
</div>
