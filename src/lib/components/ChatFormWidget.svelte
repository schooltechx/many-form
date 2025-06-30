<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChatWidgetConfig } from '$lib/components/types';
	export let chatWidgetConfig: ChatWidgetConfig;
	export let formData: object = {};
	// let { formData = $bindable()} = $props();
	let lastResponse = '';
	let recognition: SpeechRecognition
	let audio: HTMLAudioElement;
	onMount(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			// (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		recognition = new SpeechRecognition();
		recognition.lang = 'th-TH';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;
		recognition.onstart = () => {
			chatInput = 'กำลังถอดเสียง ...';
		};

		recognition.onresult = (event) => {
			chatInput = event.results[0][0].transcript;
		};

		// recognition.onerror = (event) => {};
		// recognition.onend = () => {};
	});
	async function speakText(text: string) {
		switch (chatWidgetConfig.ttsType) {
			case 'browser':
				var u = new SpeechSynthesisUtterance();
				u.text = text;
				u.lang = 'th-TH';
				u.rate = 1.2;
				speechSynthesis.speak(u);

				break;
			case 'edge':
			case 'gemini':
				const res = await fetch(
					`/api/tts?ttsType=${chatWidgetConfig.ttsType}&text=${encodeURIComponent(text)}`
				);
				const blob = await res.blob();
				let audioUrl = URL.createObjectURL(blob);
				audio = new Audio(audioUrl);
				audio.onended = () => {
					URL.revokeObjectURL(audioUrl); // Clean up the URL after playback
				};
				audio.play().catch((err) => {
					console.error('Error playing audio:', err);
				});
				break;
			default:
			// code block
		}
	}
	function toggleSpeak() {
		if (audio && !audio.paused) {
			audio.pause(); // Pause if currently playing
		} else {
			speakText(lastResponse.trim() || 'ยังไม่มีข้อความให้พูด'); // Speak the last response or a default message
		}
	}
	function listen() {
		recognition.start();
	}
	let showChatPanel = false;
	let chatInput = '';
	let chatBodyText: HTMLDivElement;
	function toggleChat() {
		showChatPanel = !showChatPanel;
	}
	async function send() {
		if (chatInput.trim() === '') return;
		chatBodyText.innerHTML +=
			"<p style='color: #333; background: #f1f1f1; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>" +
			chatInput +
			'</p>';
		let res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({chatInput,backend:'form'})
		});
		if (!res.ok) {
			chatBodyText.innerHTML +=
				"<p style='color: #f00; background: #fdd; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>Error: " +
				res.statusText +
				'</p>';
			return;
		}
		let data = await res.json();
		
		let answer =""
		if(typeof data.output == 'object' && 'question' in data.output   ){
			answer =  data.output.question
			formData = data.output
			console.log("Form Data",formData)
		}else{
			console.log("Form Data incorrect",data.output)
		}
		
		chatBodyText.innerHTML +=
			"<p style='color: #fff; background: #854fff; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>" +
			answer +
			'</p>';
		speakText(answer); // Speak the response
		lastResponse = answer; // Store the last response
		chatInput = ''; // Clear the input field
	}
</script>

{#if !showChatPanel}
	<button id="chat-widget-button" class="chat-widget-button" on:click={toggleChat}>💬</button>
{:else}
	<!-- Chat Widget -->
	<div class="chat-widget-container">
		<div class="chat-widget-header">
			<span>Chat</span>
			<button class="chat-widget-send" on:click={toggleChat}>✖</button>
		</div>
		<div class="chat-widget-body" bind:this={chatBodyText}>
			<p style="margin-bottom: 20px;">
				<strong>{chatWidgetConfig.welcomeMessage}</strong>
			</p>
		</div>
		<div class="chat-widget-footer">
			<input
				type="text"
				class="chat-widget-input"
				bind:value={chatInput}
				placeholder="Type your message here..."
			/>
			<button class="chat-widget-send" on:click={send}>⌯⌲</button>
			{#if recognition}
				<button class="chat-widget-send" on:click={listen}>🎤</button>
			{/if}
			{#if chatWidgetConfig.ttsType}
				<button class="chat-widget-send" on:click={toggleSpeak}>⏯</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Chat Widget Styling */
	.chat-widget-container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 450px;
		height: 500px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		z-index: 1000;
		overflow: hidden;
	}
	.chat-widget-header {
		background: #46a7c8;
		color: white;
		padding: 20px;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 18px;
	}
	.chat-widget-body {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		text-wrap: pretty;
	}
	/* Increased spacing between messages */
	.chat-widget-body p {
		margin-bottom: 15px; /* Adjust spacing between messages */
		padding: 12px;
		border-radius: 8px;
		font-size: 18px;
		word-wrap: break-word;
	}
	.chat-widget-footer {
		padding: 12px;
		border-top: 1px solid #ddd;
		display: flex;
		gap: 10px;
	}
	.chat-widget-input {
		flex: 1;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 8px;
		outline: none;
	}
	.chat-widget-send {
		background: #46a7c8;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 8px;
		cursor: pointer;
	}
	/* Make the chat bubble a perfect circle */
	.chat-widget-button {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: #46a7c8;
		color: white;
		border: none;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 22px;
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
	}
</style>
