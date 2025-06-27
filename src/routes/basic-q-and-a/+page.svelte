<script>
	import { env } from '$env/dynamic/public';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
	/** @type {import('$lib/components/types').ChatWidgetConfig} */
	let chatWidgetConfig = {
		webhook: {
			url: "https://ai-demo-dev.frappet.synology.me/webhook/f4495b47-362b-4ae4-9d0f-8a995525f969/chat",
			route: 'general'
		},
		ttsType: '',
		welcomeMessage:"สวัสดีวันนี้มีอาการอย่างไรบ้างค่ะ? เริ่มต้นใหม่ให้พิมคำว่า reset", 
		style: {
			primaryColor: '#854fff',
			secondaryColor: '#6b3fd4',
			position: 'right',
			backgroundColor: 'white',
			fontColor: '#333333'
		}
	};

	/**
	 * @param {{ currentTarget: { value: string; }; }} event
	 */
	function onChange(event) {
		chatWidgetConfig.ttsType = event.currentTarget.value;
	}
</script>

<h1>My Web</h1>
<div>
	กดปุ่ม 💬 (ล่างขวา) เพื่อเปิดแชทวิดเจ็ต
	<h2>Text To Speech</h2>
	<div>
		<label>
			<input
				checked={chatWidgetConfig.ttsType === ''}
				on:change={onChange}
				type="radio"
				name="tts"
				value="edge"
			/> None
		</label>
		<label>
			<input
				checked={chatWidgetConfig.ttsType === 'edge'}
				on:change={onChange}
				type="radio"
				name="tts"
				value="edge"
			/> Edge TTS
		</label>
		<label>
			<input
				checked={chatWidgetConfig.ttsType === 'gemini'}
				on:change={onChange}
				type="radio"
				name="tts"
				value="gemini"
			/> Gemini TTS
		</label>
		<label>
			<input
				checked={chatWidgetConfig.ttsType === 'browser'}
				on:change={onChange}
				type="radio"
				name="tts"
				value="browser"
			/> Browser TTS
		</label>
	</div>
	<ChatWidget {chatWidgetConfig} />
</div>
