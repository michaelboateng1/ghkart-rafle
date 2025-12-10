<script>
    import {onMount} from "svelte";
    import {page} from "$app/state";

    let certificatePreview;
    let certificatePreviewContainer;
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

    const handleDBChecks = async() => {
        try{
            const id = page.state;

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            }

            const request = await fetch('/download-certificate', options);
            const data = await request.json();

            if(request.ok && data){
                return data
            }

            throw new Error("Somthing didn't work out");

        }catch(err){
            console.log(err);
        }
    }

    // Download certificate as PDF
    function downloadCertificate() {
        if(!handleDBChecks()) return;

        let fileName = 'Ghkart_XMAS_2025.pdf';

        // 🔥 Convert SVGs so html2pdf doesn't hide them
        convertSvgsToImages(certificatePreview);
        
        const opt = {
            margin:       0.5,
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
        
        // Generate PDF
        html2pdf().set(opt).from(certificatePreview).save().then(() => {
            
            // Show success message
            alert('Certificate downloaded successfully! You can now send it to the office.');
        }).catch(err => {
            console.error('PDF generation failed:', err);
            alert('Failed to generate PDF. Please try again.');
        });
    }




    // Add some interactive snowflakes for fun
    function createSnowflakes() {
        const preview = certificatePreview;
        if (!preview) return;

        const width = certificatePreviewContainer.innerWidth - 200;
        const height = certificatePreviewContainer.innerHeight - 200;
        
        for (let i = 0; i < 10; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄️';
            snowflake.style.position = 'absolute';
            snowflake.style.left = Math.random() * width + 'px';
            snowflake.style.top = Math.random() * height + 'px';
            snowflake.style.opacity = Math.random() * 0.5 + 0.3;
            snowflake.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            snowflake.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            preview.appendChild(snowflake);
        }
    }

    onMount(() => {
        if(window.innerWidth > 320){
            // createSnowflakes();
        }
    })

</script>

<div class="w-full h-screen flex flex-col items-center justify-center sm:justify-end p-2 sm:p-0">
    <button class="py-3 px-10 my-8 uppercase font-bold text-lg" onclick={downloadCertificate}>Download Certificate</button>
<div bind:this={certificatePreviewContainer} class="w-full h-[58vh] sm:h-[90%] p-20 sm:p-2 border-4 border-[#d4a76a] overflow-scroll sm:overflow-auto sm:flex sm:items-center sm:justify-center">
<div bind:this={certificatePreview} class="w-[980px] h-[630px] p-5 bg-white overflow-hidden   rounded-lg shadow-lg" >
    <div class="w-full h-full  border-2 border-[#d4a76a] bg-[#fffaf0] overflow-hidden" id="certificatePreview">
        <div class="w-full h-full px-20 py-10 relative overflow-hidden " id="certificateContent">
            <!-- Border -->
            <div class="absolute w-[98%] h-[95%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-3 border-[#d4a76a] rounded-lg"></div>


            <!-- Christmas decorations -->
             <div class="holly-decoration absolute top-[40px] left-[40px] scale-down">
                <svg width="100" height="100">
                    <polygon 
                        points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                        fill="#2e7d32"
                    />
                </svg>
             </div>  
             <div class="absolute bg-[#d32f2f] top-[55px] left-[65px] w-[15px] h-[15px] rounded-full"></div>
            <div class="absolute bg-[#d32f2f] top-[40px] left-[85px] w-[15px] h-[15px] rounded-full"></div>

            <div class="holly-decoration absolute top-[40px] right-[40px] scale-down">
                <svg width="100" height="100">
                    <polygon 
                        points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                        fill="#2e7d32"
                    />
                </svg>
            </div>
            <div class="absolute bg-[#d32f2f] top-[55px] right-[65px] w-[15px] h-[15px] rounded-full"></div>
            <div class="absolute bg-[#d32f2f] top-[40px] right-[85px] w-[15px] h-[15px] rounded-full"></div>

            <div class="holly-decoration absolute bottom-[40px] left-[40px] transform rotate-180 scale-down">
                <svg width="100" height="100">
                    <polygon 
                        points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                        fill="#2e7d32"
                    />
                </svg>
            </div>
            <div class="absolute bg-[#d32f2f] bottom-[55px] left-[65px] w-[15px] h-[15px] rounded-full"></div>
            <div class="absolute bg-[#d32f2f] bottom-[40px] left-[85px] w-[15px] h-[15px] rounded-full"></div>

            <div class="holly-decoration absolute bottom-[40px] right-[40px] transform rotate-180 scale-down">
                <svg width="100" height="100">
                    <polygon 
                        points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                        fill="#2e7d32"
                    />
                </svg>
            </div>
            <div class="absolute bg-[#d32f2f] bottom-[55px] right-[65px] w-[15px] h-[15px] rounded-full"></div>
            <div class="absolute bg-[#d32f2f] bottom-[40px] right-[85px] w-[15px] h-[15px] rounded-full"></div>

            
            <!-- Snowflakes -->
            <div class="snowflake" style="top: 30%; left: 20%;">❄️</div>
            <div class="snowflake" style="top: 25%; right: 25%;">❄️</div>
            <div class="snowflake" style="bottom: 30%; left: 30%;">❄️</div>
            <div class="snowflake" style="bottom: 25%; right: 20%;">❄️</div>

            <!-- Certificate content -->
            <div class="flex flex-col items-center text-center relative top-5">
                <div class="text-3xl font-bold text-[#b3390e] mb-2">Certificate of Winning</div>
                <div class="text-xl font-semibold text-[#2e7d32]">Ghkart XMAS Prize 2025</div>
            </div>
            <div class="text-center px-10">
                <div class="text-lg font-semibold relative top-10">
                    This certifies that
                </div>

                <div class="text-4xl text-[#d32f2f] font-bold py-5 uppercase text-shadow-sm relative top-15">Michael Boateng</div>
                    
                <div class="text-center text-lg relative top-15">
                    has successfully won the following prize in our<br>
                    <strong>Ghkart XMAS Prize 2025</strong>
                </div>
     
                <div class="text-3xl text-[#2e7d32] font-bold pt-5 relative top-15">Apple PC</div>
                
                <div class="text-center top-30 text-[#b3390e] font-xl relative">
                    Awarded on: <strong>2025</strong>
                </div>
            </div>

            <div class="flex justify-between align-end px-[30px] relative top-20">
                <div class="border-t-2 border-[#d4a76a] w-[200px] pt-[10px] text-center">
                    <div class="text-lg font-semibold text-[#b3390e]">Director</div>
                    <div class="text-sm text-[#666]">Ghkart Director</div>
                </div>
                
                <div class="border-t-2 border-[#d4a76a] w-[200px] pt-[10px] text-center">
                    <div class="text-lg font-semibold text-[#b3390e]">Manager</div>
                    <div class="text-sm text-[#666]">Prize Distribution Manager</div>
                </div>
            </div>

            <div class="text-center mt-[30px] text-[#666] text-sm relative top-15">
                Certificate ID: <strong>123456</strong><br>
                Valid until: December 31, 2024
            </div>
        </div>
    </div>
</div>
</div>
</div>





<style>
    
    /* Certificate Styles */
    #certificateContent {
        background: linear-gradient(to bottom right, #fffaf0, #fff5e6);
    }
    
    .scale-down{
        transform: scale(0.8);
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

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
	}

	button:active {
		transform: translateY(0);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
    

    
    .snowflake {
        position: absolute;
        color: #d4a76a;
        font-size: 1.5rem;
        opacity: 0.5;
        animation: float 5s ease-in-out infinite;
    }
    

    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
        100% { transform: translateY(0) rotate(360deg); }
    }
</style>
