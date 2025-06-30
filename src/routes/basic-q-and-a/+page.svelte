<script lang='ts'>
	import ChatFormWidget from '$lib/components/ChatFormWidget.svelte';
	import type { ChatWidgetConfig } from '$lib/components/types';
	let chatWidgetConfig:ChatWidgetConfig = {
		ttsType: 'none',
		welcomeMessage:"สวัสดี 👋, เริ่มคุยกันนะ?", 
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
			id: 'none',
			name: 'Disable'
		},
	 	{
			id: 'edge',
			name: 'Edge'
		},
		{
			id: 'gemini',
			name: 'gemini-2.5-flash-preview-tts'
		},
		{
			id: 'browser',
			name: 'Browser'
		}
	];
	let formData= {}

</script>

<h1>My Web</h1>
<div>
	กดปุ่ม 💬 (ล่างขวา) เพื่อเปิดแชทวิดเจ็ต
	<h2>Text To Speech</h2>
	<div>
	{#each options as item (item.id)}
		<label>
			<input
				bind:group={chatWidgetConfig.ttsType}
				type="radio"
				name="tts"
				value={item.id}
			/> {item.name}
		</label>
	{/each}
	</div>
	<pre>{JSON.stringify(formData,null,2)}</pre>
	<ChatFormWidget chatWidgetConfig={chatWidgetConfig} bind:formData={formData} />
</div>
