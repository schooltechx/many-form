<script>
	import { env } from '$env/dynamic/public';
	import ChatWidget from '$lib/components/ChatWidget.svelte';
	/** @type {import('$lib/components/types').ChatWidgetConfig} */
	let chatWidgetConfig = {
		webhook: {
			url: env.PUBLIC_N8N_CHAT_URL,
			route: 'general'
		},
		ttsType: 'edge', 
		style: {
			primaryColor: '#854fff',
			secondaryColor: '#6b3fd4',
			position: 'right',
			backgroundColor: 'white',
			fontColor: '#333333'
		}
	};
	const options = [
		{
			value: 'edge',
			label: 'Eddge TTS'
		},
		{
			value: 'gemini',
			label: 'gemini-2.5-flash-preview-tts'
		},
		{
			value: 'browser',
			label: 'Browser'
		}
	];

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
