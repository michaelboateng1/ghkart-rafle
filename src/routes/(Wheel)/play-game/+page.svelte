<script>
	import CloseIcon from './icons/closeIcon.svelte';

	import {goto} from "$app/navigation";

	import keyboradImage from '$lib/assets/images/Adobe Express - file (1).png';
	import batteryImage from '$lib/assets/images/Adobe Express - file (2).png';
	import watchImage from '$lib/assets/images/Adobe Express - file (3).png';
	import appleImage from '$lib/assets/images/Adobe Express - file.png';
	import tryAgainImage from '$lib/assets/images/error-alert-button-symbol.png';

	import { onMount } from 'svelte';
	import { drawWheel, updateSelectorColor, spin } from '$lib/wheel';

	import WheelParticle from '$lib/wheelBackgroundAnimation';

	import ConfettiPiece from '$lib/celebration';

	
	let canvas3;
	let showConfetti = false;
	let confettiAnimationStarted = false;
	let savedPrice = false;

	$: if(showConfetti && canvas3 && !confettiAnimationStarted){
		confettiAnimationStarted = true;
		initializeConfetti();
	}


	function initializeConfetti() {
		canvas3.width = window.innerWidth;
		canvas3.height = window.innerHeight;
		const ctx3 = canvas3.getContext('2d');

		const confetti = [];
		let spawnTimer = 0;
		let confettiAnimating = true;

		function spawnConfetti() {
			for (let i = 0; i < 40; i++) {
				const w = canvas3.width;
				const h = canvas3.height;
				const side = Math.random() < 0.5 ? 'left' : 'right';
				const posX = side === 'left' ? 0 : w;
				const posY = h;
				confetti.push(new ConfettiPiece(posX, posY, side, w, h));
			}
		}

		// Animation loop (ONE loop only)
		function animate() {
			if (!canvas3 || !ctx3) return;

			ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

			// Spawn for only 1 second
			if (spawnTimer < 60) {
				spawnConfetti();
				spawnTimer++;
			}

			// Update & draw
			for (let i = confetti.length - 1; i >= 0; i--) {
				const piece = confetti[i];
				piece.update();
				piece.draw(ctx3);

				if (piece.isOffScreen()) {
					confetti.splice(i, 1);
				}
			}

			// If empty, stop animation
			if (confetti.length === 0 && spawnTimer >= 60) {
				confettiAnimating = false;
				showConfetti = false;
				confettiAnimationStarted = false;
				return;
			}

			if (confettiAnimating) requestAnimationFrame(animate);
		}

		animate();
	}

	
	const wheelParticles = [];
	let canvas2;

	const productImages = [
		appleImage,
		tryAgainImage,
		watchImage,
		tryAgainImage,
		batteryImage,
		tryAgainImage,
		keyboradImage,
		tryAgainImage
	];
	
	let canvas;
	let selector;
	let spinBtn;
	let resultDisplay;
	let showModal = false;
	let selectedImage;
	let showCertificateBtn = false;

	let rotation = 0;
	let spinVelocity = 0;
	let friction = 0.985;
	let spinning = false;
	let animationId;

	const sections = 8;
	const colors = [
		'#FF5252',
		'#FF9800',
		'#FFEB3B',
		'#4CAF50',
		'#2196F3',
		'#9C27B0',
		'#E91E63',
		'#00BCD4'
	];
	const labels = [
		'Laptop',
		'Try Again',
		'Phone Watch',
		'Try Again',
		'Battery',
		'Try Again',
		'Keyboard',
		'Try Again'
	];

	function closeModal(e) {
		if (e.target.id === 'modal') {
			showModal = false;
		}
	}

	// let wheelSize = 400;

	// function updateWheelSize() {
	// 	const w = window.innerWidth;

	// 	if (w < 450) {
	// 		wheelSize = 260;   // small phones
	// 	} else if (w < 768) {
	// 		wheelSize = 320;   // large phones / small tablets
	// 	} else if (w < 1024) {
	// 		wheelSize = 360;   // tablets
	// 	} else {
	// 		wheelSize = 400;   // desktop
	// 	}
	// }


	const navigateToCert = () => {
		goto("/preview-certificate");
	}

	// const wonAPrice = async (price) => {
	// 	try{
	// 		price = labels.includes(price) ? price : "no price";
	// 		console.log("storing price: ", price);
	
	// 		const options = {
	// 			method: "PSOT",
	// 			headers: {
	// 				"Content-Type": "application/json"
	// 			},
	// 			body: JSON.stringify({id: customerId, price})
	// 		}
	
	// 		const req = await fetch("/won-a-price", options);
	// 		const data = await req.json();

	// 		if(req.ok && data.success){
	// 			savedPrice = true;
	// 			return data;
	// 		}

	// 	}catch(err){
	// 		console.log(err)
	// 	}

	// }

	const updateUser = async () => {
		try{
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			}
			const req = await fetch("/update-user", options);
			const data = await req.json();
			console.log("Updated Customer Data: ", data);
		}
		catch(err){
			console.log(err)
		}
	}


	onMount(() => {
		canvas2.width = window.innerWidth;
		canvas2.height = window.innerHeight;
		const ctx2 = canvas2.getContext('2d');

		function hundleParticles() {
			for (let i = 0; i <= 1; i++) {
				const canvasWidth = canvas2.width;
				const canvasHeight = canvas2.height;
				wheelParticles.push(new WheelParticle(canvasWidth, canvasHeight));
			}
		}

		hundleParticles();

		function animateBackground() {
			ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
			hundleParticles();

			for (let i = 0; i < wheelParticles.length; i++) {
				wheelParticles[i].draw(ctx2);
				wheelParticles[i].update();
				// console.log(wheelParticles[i].radius);

				if (wheelParticles[i].radius <= 0.3) {
					wheelParticles.splice(i, 1);
					// console.log(wheelParticles.length);
				}
			}

			requestAnimationFrame(animateBackground);
		}

		animateBackground();

		const ctx = canvas.getContext('2d');
		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;




		console.log(ctx);

		// Start Drawing
		drawWheel(canvasWidth, canvasHeight, ctx, sections, rotation, colors, labels);
		updateSelectorColor(selector, colors, rotation, sections);

		spinBtn.onclick = () => {
				updateUser();
				spin({
					rotation,
					spinning,
					spinBtn,
					animationId,
					sections,
					colors,
					labels,
					canvasWidth: canvasWidth,
					canvasHeight: canvasHeight,
					ctx,
					selector,
					onUpdate: (updates) => {
						if ('selectedSection' in updates) {
							console.log(updates.selectedSection);
							selectedImage = productImages[updates.selectedSection];
						}
	
						if("selectedSection" in updates){
							showCertificateBtn = labels[updates.selectedSection] === "Try Again" ? false : true;
						}
	
						if("selectedSection" in updates){
							showConfetti = labels[updates.selectedSection] !== "Try Again" ? true : false;
							// wonAPrice(labels[updates.selectedSection]);
						}
	
						if ('rotation' in updates) {
							rotation = updates.rotation;
						}
	
						if ('spinning' in updates) {
							spinning = updates.spinning;
						}
	
						let timeOut;
						if ('result' in updates) {
							resultDisplay = updates.result;
							setTimeout(() => (showModal = true), 400);
						}
					}
				});
			return;
		};
	});
</script>

<main class="m-0 p-5 flex flex-col items-center justify-center min-h-screen">
	{#if showConfetti}
	<canvas class="block absolute top-0 left-0 w-full h-full z-40" bind:this={canvas3}></canvas>
	{/if}
	<canvas class="block absolute top-0 left-0 w-full h-full" bind:this={canvas2}></canvas>
	<div class="relative mt-5" id="wheelContainer">
		<div
			class="absolute -top-5 left-[50%] transform translate-x-[-50%] w-0 h-0"
			bind:this={selector}
			id="selector"
		></div>
		<canvas bind:this={canvas} id="wheel" class="block z-20" width={400} height={400}></canvas>
	</div>
	<button bind:this={spinBtn} class="py-3 px-10 mt-8 z-20" id="spinBtn">SPIN THE WHEEL</button>
</main>

{#if showModal}
	<div
		onclick={(e) => closeModal(e)}
		tabindex="0"
		role="button"
		onkeydown={(e) => 'a'}
		id="modal"
		class="modal-bg fixed top-0 left-0 w-full h-screen flex items-center justify-center z-30"
	>
		<div
			class="bg-white modal-content-bg rounded-lg drop-shadow-xl w-full sm:w-[800px] sm:h-[400px]"
		>
			<div class="flex justify-end items-center py-5 sm:px-6">
				<button onclick={() => closeModal({ target: { id: 'modal' } })}><CloseIcon /></button>
			</div>
			<div class="text-center">
				<p class="sm:text-3xl font-bold text-white">{resultDisplay}</p>
				<div class="w-full flex items-center justify-center py-2">
					<div class="h-auto w-[150px]">
						<img
							src={selectedImage}
							width="150"
							height="150"
							class="w-full h-full object-cover"
							alt=""
						/>
					</div>
				</div>
				{#if showCertificateBtn}
					<button onclick={() => navigateToCert()} class="py-2 text-sm px-10 mt-8" id="certificateBtn">CLAIM CERTIFICATE FOR YOUR PRIZE</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-content-bg {
		background:
			linear-gradient(135deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 100%),
			url('../../../lib/assets/backgroundImage/Gemini_Generated_Image_c9bqgvc9bqgvc9bq.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		font-family: Arial, sans-serif;
	}

	.modal-bg {
		background: linear-gradient(224deg, hsla(0, 0%, 0%, 0.8) 0%, hsla(0, 0%, 0%, 0.8) 100%);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	main {
		background:
			linear-gradient(135deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0) 100%),
			url('../../../lib/assets/backgroundImage/Gemini_Generated_Image_kvb6rjkvb6rjkvb6.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		font-family: Arial, sans-serif;
	}

	#wheel {
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		border-radius: 50%;
	}

	#selector {
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;
		border-top: 40px solid #ff0000;
		filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3));
		transition: border-top-color 0.1s;
	}

	button {
		font-size: 18px;
		font-weight: bold;
		color: white;
		background: linear-gradient(135deg, #3eb128 0%, #105c57 100%);
		border: none;
		border-radius: 50px;
		cursor: pointer;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	button#spinBtn:hover,
	button#certificateBtn:hover {
		transform: translateY(-2px);
		box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
	}

	button#spinBtn:active,
	button#certificateBtn:active {
		transform: translateY(0);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* #result {
        margin-top: 20px;
        font-size: 24px;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        min-height: 30px;
    } */
</style>

























