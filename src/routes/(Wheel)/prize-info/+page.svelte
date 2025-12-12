<script>
    import { onMount } from 'svelte';
    
    let isVisible = false;
    
    onMount(() => {
        // Trigger animation after mount
        setTimeout(() => {
            isVisible = true;
        }, 100);
    });
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-4xl w-full">
        <!-- Main Info Card -->
        <div 
            class="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
        >
            <!-- Header Section with Gradient -->
            <div class="bg-gradient-to-r from-green-600 via-teal-600 to-green-700 p-8 sm:p-12 text-center relative overflow-hidden">
                <!-- Decorative Elements -->
                <div class="absolute top-0 left-0 w-full h-full opacity-10">
                    <div class="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full"></div>
                    <div class="absolute bottom-4 right-4 w-32 h-32 border-4 border-white rounded-full"></div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-full"></div>
                </div>
                
                <!-- Trophy Icon -->
                <div class="relative mb-4 flex justify-center">
                    <div class="bg-white/20 backdrop-blur-sm rounded-full p-6 inline-block animate-bounce" style="animation-duration: 2s;">
                        <svg class="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    </div>
                </div>
                
                <h1 class="text-3xl sm:text-5xl font-bold text-white mb-3 relative">
                    Congratulations! 🎉
                </h1>
                <p class="text-lg sm:text-xl text-green-100 relative">
                    You've Won a Prize from GhKart XMAS 2025
                </p>
            </div>

            <!-- Content Section -->
            <div class="p-6 sm:p-10">
                <!-- Introduction -->
                <div class="mb-8 text-center">
                    <p class="text-lg text-gray-700 leading-relaxed">
                        Follow these simple steps to claim your amazing prize!
                    </p>
                </div>

                <!-- Steps Section -->
                <div class="space-y-6 mb-8">
                    <!-- Step 1 -->
                    <div class="flex gap-4 sm:gap-6 group hover:bg-green-50 p-4 rounded-2xl transition-all duration-300">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                1
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Download Your Certificate</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Click the download button to save your winning certificate. This certificate is your proof of winning and is required to claim your prize.
                            </p>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="flex gap-4 sm:gap-6 group hover:bg-teal-50 p-4 rounded-2xl transition-all duration-300">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                2
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Visit GhKart Store</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Head over to our main store at <a href="https://ghkart.com" target="_blank" rel="noopener noreferrer" class="text-green-600 font-semibold hover:text-green-700 underline">ghkart.com</a> or visit our physical location in person.
                            </p>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="flex gap-4 sm:gap-6 group hover:bg-blue-50 p-4 rounded-2xl transition-all duration-300">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                3
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Present Your Certificate</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Show your downloaded certificate to our staff along with a valid ID. Our team will verify your details and process your prize claim.
                            </p>
                        </div>
                    </div>

                    <!-- Step 4 -->
                    <div class="flex gap-4 sm:gap-6 group hover:bg-purple-50 p-4 rounded-2xl transition-all duration-300">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                4
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">Collect Your Prize!</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Once verified, you'll receive your prize immediately. Enjoy your new gadget and thank you for participating!
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Important Notes Section -->
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
                    <div class="flex items-start gap-3">
                        <svg class="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <h4 class="font-bold text-orange-900 mb-2 text-lg">Important Notes:</h4>
                            <ul class="space-y-2 text-orange-800">
                                <li class="flex items-start gap-2">
                                    <span class="text-orange-600 font-bold">•</span>
                                    <span>Certificate is valid until <strong>December 31, 2025</strong></span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-orange-600 font-bold">•</span>
                                    <span>Bring a valid government-issued ID for verification</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-orange-600 font-bold">•</span>
                                    <span>Prizes are non-transferable and cannot be exchanged for cash</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-orange-600 font-bold">•</span>
                                    <span>For questions, contact us at <a href="mailto:support@ghkart.com" class="underline font-semibold">support@ghkart.com</a></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="/preview-certificate"
                        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Download Certificate
                    </a>
                    
                    <a 
                        href="https://ghkart.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-green-600 text-green-600 font-bold text-lg rounded-full shadow-lg hover:bg-green-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                        Visit GhKart Store
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
                <p class="text-sm text-gray-600">
                    🎄 Thank you for participating in GhKart XMAS Prize 2025! 🎄
                </p>
            </div>
        </div>

        <!-- Additional Help Card -->
        <div class="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center transform transition-all duration-700 delay-300 {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">
            <p class="text-gray-700 mb-2">
                <span class="font-semibold">Need help?</span> Our support team is here for you!
            </p>
            <div class="flex flex-wrap justify-center gap-4 text-sm">
                <a href="tel:+233123456789" class="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    Call Us
                </a>
                <span class="text-gray-400">•</span>
                <a href="mailto:support@ghkart.com" class="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    Email Us
                </a>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .animate-bounce {
        animation: bounce 2s infinite;
    }
</style>
