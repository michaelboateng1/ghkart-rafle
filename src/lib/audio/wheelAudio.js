import wheelAudio from "$lib/assets/audio/tick.ogg";

let audioContext = null;
let audioBuffer = null;
let masterGain = null; // persistent master gain for wheel ticks


async function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create a master gain node for volume control (one per module)
    if (!masterGain) {
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.6; // default tick volume
        masterGain.connect(audioContext.destination);
    }

    // Ensure context is running (useful if autoplay policy left it suspended)
    if (audioContext.state === 'suspended') {
        try {
            await audioContext.resume();
        } catch (e) {
            // resume may fail in some browsers if not allowed; ignore gracefully
        }
    }

    // Only load the buffer once
    if (!audioBuffer) {
        try {
            const response = await fetch(wheelAudio);
            const arrayBuffer = await response.arrayBuffer();
            // decodeAudioData returns a promise in modern browsers
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading wheel audio:", error);
        }
    }
}


async function playAudio(volume = 1) {
    // Initialize audio if not already done
    await initAudio();

    if (!audioBuffer) {
        console.warn("Audio buffer not loaded");
        return;
    }

    // Create a new buffer source for each tick
    // Use a small per-call gain so overlapping ticks can have their own level
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = Math.max(0, Math.min(1, volume));

    source.connect(gainNode);
    // connect to masterGain if available, otherwise directly to destination
    if (masterGain) {
        gainNode.connect(masterGain);
    } else {
        gainNode.connect(audioContext.destination);
    }

    // Start immediately
    try {
        source.start(0);
    } catch (e) {
        // Could fail if context is suspended; try to resume once
        try {
            await audioContext.resume();
            source.start(0);
        } catch (err) {
            console.warn('wheelAudio: failed to start source', err);
        }
    }

    return { source, gainNode };
}


export { playAudio, initAudio };