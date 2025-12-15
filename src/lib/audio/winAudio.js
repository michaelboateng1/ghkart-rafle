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


async function playAudio(maxDurationMs, fadeMs = 400) {
    // Initialize audio if not already done
    await initAudio();

    if (!audioBuffer) {
        console.warn("Audio buffer not loaded");
        return;
    }

    // Create a new buffer source for playback
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Use gain node for smoother end
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);

    if (maxDurationMs && typeof maxDurationMs === 'number' && maxDurationMs > 0) {
        try {
            const stopTime = audioContext.currentTime + maxDurationMs / 1000;
            const fadeDuration = Math.min(fadeMs / 1000, Math.max(0, stopTime - audioContext.currentTime));
            const fadeStart = stopTime - fadeDuration;

            gainNode.gain.setValueAtTime(1, Math.max(audioContext.currentTime, fadeStart));
            gainNode.gain.linearRampToValueAtTime(0.0001, stopTime);

            source.stop(stopTime + 0.01);
        } catch (e) {
            // ignore stop errors
        }
    }

    return { source, gainNode };
}


export { playAudio, initAudio };
