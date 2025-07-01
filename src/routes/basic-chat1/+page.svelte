<script>
	import { onMount } from 'svelte';
	let speechSynthesisLoading = true;
	let lastResponse = ''
	let n8nChatUrl='http://localhost:5678/webhook/10106cc5-e735-4399-b6bf-9e0f0dd3f89e/chat'
	/**
	 * @type {SpeechSynthesisVoice[]}
	 */
	let voices = [];
	let recognizing = false
	/**
	 * @type {SpeechRecognition}
	 */
	let recognition
	onMount(() => {
		// @ts-ignore
		speechSynthesis.addEventListener('voiceschanged', (ev) => {
			voices = speechSynthesis.getVoices();
			speechSynthesisLoading = false
		});
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'th-TH';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => {
        	recognizing = true;
			message = ''
        };
        // @ts-ignore
        recognition.onresult = (event) => {
        	recognizing = false;
			message = event.results[0][0].transcript
        };
		// @ts-ignore
        recognition.onerror = (event) => {
        	recognizing = false;
        };
        recognition.onend = () => {
        	recognizing = false;
        };
	});


	/**
	 * @param {string} text
	 */
	function speakText(text) {
			const utter = new SpeechSynthesisUtterance(text);
			const thaiVoice = voices.find((v) => v.lang.startsWith('th'));
			if (thaiVoice) utter.voice = thaiVoice;
			utter.lang = thaiVoice ? thaiVoice.lang : 'th-TH';
			utter.rate = 1;
			speechSynthesis.speak(utter);
	}
	function toggleSpeak(){
		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
		} else {
			speakText(lastResponse.trim()|| 'No Chat response to speak');
		}
	}
	function listen() {

		recognition.start()
	}
	let ChatWidgetConfig = {
		webhook: {
			url: n8nChatUrl,
			route: 'general'
		},
		style: {
			primaryColor: '#854fff',
			secondaryColor: '#6b3fd4',
			position: 'right',
			backgroundColor: '#ffffff',
			fontColor: '#333333'
		}
	};
	let showChatPanel = false;
	let message = '';

	/**
	 * @type {HTMLDivElement}
	 */
	let chatBodyText;
	// Function to generate or retrieve a unique chat ID

	function getChatId() {
		let chatId = sessionStorage.getItem('chatId');
		if (!chatId) {
			chatId = 'chat_' + Math.random().toString(36).substr(2, 9); // Unique ID
			sessionStorage.setItem('chatId', chatId);
		}
		return chatId;
	}
	function toggleChat() {
		showChatPanel = !showChatPanel;
	}
	async function send() {
		if (message.trim() === '') return;
		// @ts-ignore
		chatBodyText.innerHTML +=
			"<p style='color: #333; background: #f1f1f1; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>" +
			message +
			'</p>';
		let chatId = getChatId(); // Retrieve the session chat ID
		let res = await fetch(ChatWidgetConfig.webhook.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sessionId: chatId, // Attach chat ID for memory tracking
				chatInput: message,
				route: ChatWidgetConfig.webhook.route
			})
		});
		if (!res.ok) {
			// @ts-ignore
			chatBodyText.innerHTML +=
				"<p style='color: #f00; background: #fdd; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>Error: " +
				res.statusText +
				'</p>';
			return;
		}
		let data = await res.json();

		// @ts-ignore
		chatBodyText.innerHTML +=
			"<p style='color: #fff; background: #854fff; padding: 10px; border-radius: 8px; margin-bottom: 10px;'>" +
			data.output +
			'</p>';
		speakText(data.output); // Speak the response
		lastResponse = data.output; // Store the last response
		message = ''; // Clear the input field
	}
</script>

<h1>Basic Chat</h1>
N8N Chat URL:
<input
	type="text"
	bind:value={n8nChatUrl}
	placeholder="n8nChat URL"
	style="width: 80%; padding: 8px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 10px;">

<div>
	<ul>
		<li>ตัวอย่างต้นแบบแชทวิดเจ็ตพื้นที่ใช้กับ N8N </li>
		<li>มี TTS และ STT ใช้ build in ของ Browser</li>
		<li>ใช้ JavaScript รวมทุกอย่างในไฟล์เดียว เพื่อการศึกษาเรียบง่าย</li>
		<li>ไม่ปลอดภัยเพราะใช้ URL ของ N8N อยู่บน Client และต้องเปิด CORS</li>
	</ul>
	  
</div>

{#if !showChatPanel}
	<button id="chat-widget-button" class="chat-widget-button" on:click={toggleChat}>💬</button>
{:else}
	<!-- Chat Widget -->
	<div class="chat-widget-container">
		<div class="chat-widget-header">
			<span>Basic Chat</span>
			<button class="chat-widget-send" on:click={toggleChat}>✖</button>
		</div>
		<div class="chat-widget-body" bind:this={chatBodyText}>
			<p style="margin-bottom: 20px;">
				<strong>สวัสดี 👋, ผมจะสอบถามข้อมูลใส่ฟอร์ม เริ่มได้เลยนะ?</strong>
			</p>
		</div>
		<div class="chat-widget-footer">
			<input
				type="text"
				class="chat-widget-input"
				bind:value={message}
				placeholder="Type your message here..."
			/>
			<button class="chat-widget-send" on:click={send}>⌯⌲</button> 
			<button class="chat-widget-send" on:click={listen}>🎤</button> 
			<button class="chat-widget-send" on:click={toggleSpeak}>⏯</button>
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
