<script>
    import { onMount } from "svelte";
    import { playAudio as playCertificateAudio } from "$lib/audio/downloadCertificateAudio.js";
    import {goto} from "$app/navigation";

    import ghkartchristmaslogo from "$lib/assets/ghkartchristmaslogo404.png";

    let certificatePreview;
    let scalingContainer;
    let scale = 1;
    let logoBase64 = "";
    let redirectAfterDownload = false;
	let winner = null;
	let winnerName = 'Winner Name';
	let prizeName = 'Prize Name';
	let certificateId;
    let isDownloading = false;

    // Format current date
    function getCurrentDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return now.toLocaleDateString('en-US', options);
    }
    
    // Convert static image to Base64 to prevent html2canvas CORS issues
    async function prepareLogo() {
        try {
            const response = await fetch(ghkartchristmaslogo);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                logoBase64 = reader.result;
            };
            reader.readAsDataURL(blob);
        } catch (e) {
            console.error("Failed to load logo", e);
            // Fallback to original URL if conversion fails
            logoBase64 = ghkartchristmaslogo;
        }
    }


    function convertSvgsToImages(container = document) {
        const svgs = Array.from(container.querySelectorAll("svg"));

        svgs.forEach(svg => {
            if (!svg.getAttribute("xmlns")) {
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            }

            const width = svg.clientWidth || svg.getAttribute("width") || 80;
            const height = svg.clientHeight || svg.getAttribute("height") || 80;

            if (!svg.getAttribute("viewBox")) {
                svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            }

            const clone = svg.cloneNode(true);

            const xml = new XMLSerializer().serializeToString(clone);
            const encoded = encodeURIComponent(xml)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');

            const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

            const img = document.createElement("img");
            img.src = dataUrl;
            img.width = width;
            img.height = height;
            img.style.cssText = svg.style.cssText;
            img.className = svg.className.baseVal || svg.className || "";

            svg.replaceWith(img);
        });
    }

	const getWinnersData = async() => {
		try {
			const req = await fetch('/api/winner-info');
			if (!req.ok) return;
			const data = await req.json();
			if (data?.found) {
				// console.log("WINNER INFOMATION: ", data);
				winner = data.winPrice;
				winnerName = data.name;
				prizeName = winner && data.prize !== 'null' ? data.prize : "Prize Name";
				certificateId = data.id.split("-").slice(0, 2).join("-");
			}
		} catch (e) {
			console.warn('getWinnersData error', e);
		}
	}

    const handleDBChecks = async() => {

            const options = {
                method: "POST",
            }

            const request = await fetch('/api/generate-certificate', options);
			let data = await request.json();

			if (request.ok && request.status === 200) {
				if (data.certificateGenerated) {
					redirectAfterDownload = true;
				}

				// Success path - return so caller can continue
				return true;
			} else {
				// Non-OK response: follow redirect instructions from server if present
				if (data.goToGhKart) {
					setTimeout(() => (window.location = data.redirectUrl), 1500);
				} else {
					setTimeout(() => goto(data.redirectUrl), 1500);
				}
				return false;
			}

    }

    // Download certificate as PDF
	async function downloadCertificate() { 

		// show downloading state immediately
		isDownloading = true;

		try {
			await handleDBChecks();

			let fileName = 'Ghkart_XMAS_2025.pdf';

			// Convert SVGs so html2pdf doesn't hide them
			convertSvgsToImages(certificatePreview);

			const opt = {
				margin:       0.1,
				filename:     fileName,
				image:        { type: 'jpeg', quality: 0.98 },
				html2canvas:  { 
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#fffaf0',
				},
				jsPDF:        { 
					unit: 'in', 
					format: 'letter', 
					orientation: 'landscape' 
				}
			};

			// Generate PDF and then play audio and redirect
			try {
				// html2pdf is included globally via src/app.html
				html2pdf()
					.set(opt)
					.from(certificatePreview)
					.save()
					.then(() => {
						try {
							// play a short certificate audio and then redirect
							playCertificateAudio?.(1800);
						} catch (e) {
							console.warn('certificate audio play error', e);
						}

						// stop showing downloading (we'll redirect shortly)
						isDownloading = false;

						// Redirect after a short delay to allow audio to start
						setTimeout(() => goto('/prize-info'), 900);
					})
					.catch(err => {
						console.error('PDF generation failed:', err);
						alert(`Failed to generate PDF: ${err?.message || err}`);
						isDownloading = false;
					});
			} catch (err) {
				console.error('html2pdf invocation failed', err);
				isDownloading = false;
			}

		} catch (err) {
			console.error('downloadCertificate error', err);
			isDownloading = false;
		}
	}

    function updateScale() {
        if (!scalingContainer) return;
        const parentWidth = scalingContainer.parentElement.clientWidth;
        // 980 is the base width of the certificate + some padding buffer
        const baseWidth = 1020; 
        
        if (parentWidth < baseWidth) {
            scale = parentWidth / baseWidth;
        } else {
            scale = 1;
        }
    }

    onMount(() => {
        prepareLogo();
        updateScale();
        getWinnersData();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    })

</script>

<div class="w-full flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] p-4">
	<button
		class="mb-8 px-8 py-3 bg-gradient-to-br from-green-600 to-teal-800 text-white font-bold text-lg rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide flex items-center justify-center"
		onclick={downloadCertificate}
		disabled={isDownloading}
		aria-busy={isDownloading}
	>
		{#if isDownloading}
			<svg
				class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
			</svg>
			Downloading...
		{:else}
			Download Certificate
		{/if}
	</button>

	<!-- Scaling Container Wrapper -->
	<div class="w-full flex justify-center overflow-hidden" bind:this={scalingContainer}>
		<!-- The scaled wrapper -->
		<div
			style="transform: scale({scale}); transform-origin: top center; width: 980px; height: 630px; transition: transform 0.2s ease-out;"
			class="shrink-0"
		>
			<!-- Actual Certificate DOM -->
			<div
				bind:this={certificatePreview}
				class="w-[980px] h-[630px] p-5 bg-white rounded-lg shadow-2xl relative overflow-hidden text-[#1f2937] font-sans"
			>
				<div
					class="w-full h-full border-4 border-[#d4a76a] bg-gradient-to-br from-[#fffaf0] to-[#fff5e6] relative overflow-hidden"
					id="certificateContent"
				>
					<div class="w-full h-full px-20 py-6 relative">
						<!-- Reduced py-10 to py-6 -->

						<!-- Inner Border -->
						<div
							class="absolute inset-[10px] border-2 border-[#d4a76a] rounded-sm pointer-events-none"
						></div>

						<!-- Christmas decorations: Top Left -->
						<div class="absolute top-[30px] left-[30px] transform scale-75">
							<svg width="100" height="100">
								<polygon
									points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
									fill="#2e7d32"
								/>
							</svg>
							<div
								class="absolute bg-[#d32f2f] top-[55px] left-[25px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[40px] left-[45px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[55px] left-[65px] w-[15px] h-[15px] rounded-full"
							></div>
						</div>

						<!-- Christmas decorations: Top Right -->
						<div class="absolute top-[30px] right-[30px] transform scale-75">
							<svg width="100" height="100">
								<polygon
									points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
									fill="#2e7d32"
								/>
							</svg>
							<div
								class="absolute bg-[#d32f2f] top-[55px] right-[25px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[40px] right-[45px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[55px] right-[65px] w-[15px] h-[15px] rounded-full"
							></div>
						</div>

						<!-- Christmas decorations: Bottom Left -->
						<div class="absolute bottom-[30px] left-[30px] transform rotate-180 scale-75">
							<svg width="100" height="100">
								<polygon
									points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
									fill="#2e7d32"
								/>
							</svg>
							<div
								class="absolute bg-[#d32f2f] top-[55px] left-[25px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[40px] left-[45px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[55px] left-[65px] w-[15px] h-[15px] rounded-full"
							></div>
						</div>

						<!-- Christmas decorations: Bottom Right -->
						<div class="absolute bottom-[30px] right-[30px] transform rotate-180 scale-75">
							<svg width="100" height="100">
								<polygon
									points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
									fill="#2e7d32"
								/>
							</svg>
							<div
								class="absolute bg-[#d32f2f] top-[55px] right-[25px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[40px] right-[45px] w-[15px] h-[15px] rounded-full"
							></div>
							<div
								class="absolute bg-[#d32f2f] top-[55px] right-[65px] w-[15px] h-[15px] rounded-full"
							></div>
						</div>

						<!-- Snowflakes (Decorative) -->
						<div
							class="absolute top-[20%] left-[15%] text-2xl opacity-40 text-[#d4a76a] animate-pulse"
						>
							❄️
						</div>
						<div
							class="absolute top-[15%] right-[20%] text-3xl opacity-30 text-[#d4a76a] animate-bounce"
							style="animation-duration: 3s"
						>
							❄️
						</div>
						<div
							class="absolute bottom-[25%] left-[25%] text-xl opacity-40 text-[#d4a76a] animate-pulse"
							style="animation-duration: 4s"
						>
							❄️
						</div>
						<div
							class="absolute bottom-[20%] right-[15%] text-2xl opacity-30 text-[#d4a76a] animate-bounce"
							style="animation-duration: 5s"
						>
							❄️
						</div>

						<!-- Content -->
						<div class="text-center mt-2 space-y-1">
							<!-- Reduced mt-4 to mt-2, space-y-2 to space-y-1 -->
							<div>
								<h1 class="text-3xl font-bold text-[#b3390e] tracking-wide mb-0">
									Certificate of Winning
								</h1>
								<h2 class="text-xl font-bold text-[#2e7d32] uppercase tracking-wider">
									Ghkart XMAS Prize 2025
								</h2>
							</div>

							<div class="flex justify-center my-2">
								<img src={logoBase64} alt="Ghkart Christmas Logo" class="h-14 object-contain" />
								<!-- Reduced h-16 to h-14 -->
							</div>

							<div class="pt-2 text-lg text-[#374151] italic">
								<!-- Reduced pt-4 to pt-2 -->
								This certifies that
							</div>

							<div class="py-1">
								<!-- Reduced py-2 to py-1 -->
								<div
									class="text-4xl font-bold text-[#d32f2f] border-b-2 border-[#d4a76a] inline-block px-12 pb-1 min-w-[300px]"
								>
									{winnerName}
								</div>
							</div>

							<div class="text-lg text-[#374151] leading-relaxed relative top-5">
								has successfully won the following prize in our<br />
								<strong class="text-[#b3390e]">Ghkart XMAS Prize 2025</strong> event
							</div>

							<div class="py-2 relative top-5">
								<!-- Reduced py-3 to py-2 -->
								<div class="text-3xl font-bold text-[#2e7d32] drop-shadow-sm">{prizeName}</div>
							</div>

							<div class="text-[#b3390e] text-sm mt-1 relative top-10">
								<!-- Reduced mt-2 to mt-1 -->
								Awarded on: <strong>{getCurrentDate()}</strong>
							</div>
						</div>

						<!-- Signatures -->
						<div class="flex justify-between items-end px-16 relative top-18">
							<div class="text-center">
								<div class="w-48 border-t-2 border-[#d4a76a] pt-2">
									<div class="text-lg font-bold text-[#b3390e]">Director</div>
									<div class="text-xs text-[#6b7280] uppercase tracking-wider">Ghkart Director</div>
								</div>
							</div>

							<div class="text-center">
								<div class="w-48 border-t-2 border-[#d4a76a] pt-2">
									<div class="text-lg font-bold text-[#b3390e]">Manager</div>
									<div class="text-xs text-[#6b7280] uppercase tracking-wider">
										Prize Distribution
									</div>
								</div>
							</div>
						</div>

						<!-- Footer -->
						<div class="text-center mt-4 text-[#9ca3af] text-xs relative -bottom-10">
							<!-- Reduced mt-6 to mt-4 -->
							<p>
								Certificate ID: <span class="font-mono text-[#4b5563]">GK-{certificateId}</span>
							</p>
							<p>Valid until: December 31, 2025</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
