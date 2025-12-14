import certificateSound from "$lib/assets/audio/applause-clapping-church-crowd-immersive-preview.ogg";

let audioContext = null;
let audioBuffer = null;


async function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Only load the buffer once
    if (!audioBuffer) {
        try {
            const response = await fetch(certificateSound);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading certificate download audio:", error);
        }
    }
}


async function playAudio() {
    // Initialize audio if not already done
    await initAudio();

    if (!audioBuffer) {
        console.warn("Audio buffer not loaded");
        return;
    }

    // Create a new buffer source for playback
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}


export { playAudio, initAudio };
