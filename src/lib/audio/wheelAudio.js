import wheelAudio from "$lib/assets/audio/spinning.ogg";

const audioURL = wheelAudio;

const audioContext = new AudioContext();
const audioBuffer = audioContext.createBufferSource();

function playAudio() {
    audioBuffer.buffer = audioContext.createBuffer(audioContext.decodeAudioData(audioURL));
    audioBuffer.start();
}

export { playAudio };