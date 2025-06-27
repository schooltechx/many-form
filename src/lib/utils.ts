import { GoogleGenAI } from '@google/genai';
// Function to create WAV header for PCM data
export function createWavHeader(
	dataLength: number,
	channels = 1,
	sampleRate = 24000,
	bitsPerSample = 16
) {
	const header = new ArrayBuffer(44);
	const view = new DataView(header);
	// RIFF header
	view.setUint32(0, 0x46464952, true); // "RIFF"
	view.setUint32(4, 36 + dataLength, true); // File size - 8
	view.setUint32(8, 0x45564157, true); // "WAVE"

	// Format chunk
	view.setUint32(12, 0x20746d66, true); // "fmt "
	view.setUint32(16, 16, true); // Format chunk size
	view.setUint16(20, 1, true); // Audio format (PCM)
	view.setUint16(22, channels, true); // Number of channels
	view.setUint32(24, sampleRate, true); // Sample rate
	view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true); // Byte rate
	view.setUint16(32, channels * (bitsPerSample / 8), true); // Block align
	view.setUint16(34, bitsPerSample, true); // Bits per sample

	// Data chunk
	view.setUint32(36, 0x61746164, true); // "data"
	view.setUint32(40, dataLength, true); // Data size

	return new Uint8Array(header);
}

// Function to combine WAV header with audio data
function createWavFile(pcmData: Uint8Array, channels = 1, sampleRate = 24000, bitsPerSample = 16) {
	const header = createWavHeader(pcmData.length, channels, sampleRate, bitsPerSample);
	const wavFile = new Uint8Array(header.length + pcmData.length);

	wavFile.set(header, 0);
	wavFile.set(pcmData, header.length);

	return wavFile;
}
// Function to generate TTS using Google Gemini
export async function geminiTTS(apiKey: string, text: string, voice: string) {
	const ai = new GoogleGenAI({ apiKey: apiKey });
	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash-preview-tts',
		contents: [{ parts: [{ text }] }],
		config: {
			responseModalities: ['AUDIO'],
			speechConfig: {
				voiceConfig: {
					prebuiltVoiceConfig: { voiceName: voice }
				}
			}
		}
	});
	// gemini-tts return base64 of PCM audio data. You need to convert it to WAV format
	const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	const audioBuffer = Buffer.from(data || '', 'base64');
	const wavData = createWavFile(new Uint8Array(audioBuffer));
	return wavData; //return wav file
}
// Function to generate TTS using Edge TTS
import { EdgeTTS } from '@andresaya/edge-tts';
export async function edgeTTS(text: string, voice: string) {
	const tts = new EdgeTTS();
	await tts.synthesize(text, voice, {
		rate: '0%', // Speech rate (range: -100% to 100%)
		volume: '0%', // Speech volume (range: -100% to 100%)
		pitch: '0Hz' // Voice pitch (range: -100Hz to 100Hz)
	});
	// tts.toRaw() has bug work around this way
	const b = tts.toBase64();
	const buffer = Buffer.from(b, 'base64');
	return buffer; //mp3 file
}
