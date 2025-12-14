import winSound from "$lib/assets/audio/applause_fireworks.mp3.ogg";

let audioContext = null;
let audioBuffer = null;


async function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Only load the buffer once
    if (!audioBuffer) {
        try {
            const response = await fetch(winSound);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading win audio:", error);
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
