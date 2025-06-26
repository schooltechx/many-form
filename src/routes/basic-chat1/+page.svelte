<script>
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	let speechSynthesisLoading = true;
	let lastResponse = ''
	/**
	 * @type {SpeechSynthesisVoice[]}
	 */
	let voices = [];
	let recognizing = false
	/**
	 * @type {{ lang: string; interimResults: boolean; maxAlternatives: number; onstart: () => void; onresult: (event: any) => void; onerror: (event: any) => void; onend: () => void; start: () => void; }}
	 */
	let recognition
	onMount(() => {
		// @ts-ignore
		speechSynthesis.addEventListener('voiceschanged', (ev) => {
			voices = speechSynthesis.getVoices();
			speechSynthesisLoading = false
		});
		// @ts-ignore
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
			url: env.PUBLIC_N8N_CHAT_URL,
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
	// @ts-ignore
	let chatBodyText;
	// Function to generate or retrieve a unique chat ID
	// @ts-ignore
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
				chatId: chatId, // Attach chat ID for memory tracking
				message: message,
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

<h1>ฟอร์มเยอะ</h1>

<p>แสดงฟอร์มตรงนี้</p>
<form>
	<label for="name">ชื่อ นามสกุล:</label>
	<input type="text" id="name" name="name" required placeholder="สมชาย ฟอร์มเยอะ" />
	<br />
	<label for="email">อีเมลล์:</label>
	<input type="email" id="email" name="email" required placeholder="form@domain.com" />
	<br />
	<textarea id="message" name="message" placeholder="ใส่คำติชม"></textarea>
	<br />
	<label for="gender">อีเมลล์:</label>
	<select name="gender">
		<option value="male">ชาย</option>
		<option selected value="femail">หญิง</option>
	</select>
	<br />
	<button type="submit">ส่ง</button>
</form>

{#if showChatPanel}
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
