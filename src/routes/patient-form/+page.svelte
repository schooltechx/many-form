<script lang="ts">
	import ChatFormWidget from '$lib/components/ChatFormWidget.svelte';
	import type { ChatWidgetConfig } from '$lib/components/types';
	let ChatFormWidgetInstance: ChatFormWidget;
	const emptyFormData = { name: '', age: 0, gender: '', symptoms: [], note: '' };
	let formData = $state(emptyFormData);
	let chatWidgetConfig: ChatWidgetConfig = {
		ttsType: 'none',
		welcomeMessage: 'สวัสดี 👋, บอกอาการได้เลย',
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

	async function submitForm() {
		if (isFormDataNotReady) return;
		const res = await fetch('/api/patient', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		if (!res.ok) {
			alert('Error in SubmitForm please check logs');
			console.error('Error in SubmitForm:', res.status, res.statusText);
		} else {
			formData = emptyFormData;
			ChatFormWidgetInstance.reset();
		}
	}

	let isFormDataNotReady = $derived(
		!formData.name ||
			!formData.age ||
			!formData.gender ||
			!(formData.symptoms.length > 0 || formData.note)
	);
</script>

<div class="paper">
	<h1>แบบฟอร์มผู้ป่วย</h1>
	<div class="section">
		<label for="name">ชื่อ - นามสกุล:</label>
		<input
			type="text"
			id="name"
			name="name"
			placeholder="สมชาย จรดปลายเท้า"
			bind:value={formData.name}
		/>
	</div>

	<div class="section">
		<label for="age">อายุ (ปี):</label>
		<input type="number" id="age" name="age" min="0" bind:value={formData.age} />
	</div>

	<div class="section">
		<label for="gender">เพศ:</label>
		<select id="gender" name="gender" bind:value={formData.gender}>
			<option value="">-- กรุณาเลือก --</option>
			<option value="ชาย">ชาย</option>
			<option value="หญิง">หญิง</option>
			<option value="อื่นๆ">อื่นๆ</option>
			<option value="ไม่ระบุ">ไม่ระบุ</option>
		</select>
	</div>

	<div class="section">
		<label for="symptoms">อาการที่มี:</label>
		<div id="symptoms" class="checkbox-group">
			<label
				><input
					type="checkbox"
					name="symptoms"
					value="ไข้"
					bind:group={formData.symptoms}
				/>ไข้</label
			>
			<label
				><input
					type="checkbox"
					name="symptoms"
					value="ไอ"
					bind:group={formData.symptoms}
				/>ไอ</label
			>
			<label
				><input
					type="checkbox"
					name="symptoms"
					value="เจ็บคอ"
					bind:group={formData.symptoms}
				/>เจ็บคอ</label
			>
			<label
				><input
					type="checkbox"
					name="symptoms"
					value="เหนื่อย"
					bind:group={formData.symptoms}
				/>เหนื่อย</label
			>
			<label
				><input
					type="checkbox"
					name="symptoms"
					value="ปวดศีรษะ"
					bind:group={formData.symptoms}
				/>ปวดศีรษะ</label
			>
		</div>
	</div>

	<div class="section">
		<label for="note">ข้อมูลเพิ่มเติมที่ต้องการแจ้งแพทย์:</label>
		<textarea id="note" name="note" bind:value={formData.note}></textarea>
	</div>
	<div class="form-footer">
		<button class="submit-btn" type="button" onclick={submitForm} disabled={isFormDataNotReady}
			>ส่งแบบฟอร์ม</button
		>
	</div>
</div>
<div class="form-option">
	<ul>
		<li>กดปุ่ม 💬 (ล่างขวา) เพื่อเปิดแชทวิดเจ็ต พิมพ์อาการหรือทักทายได้เลย</li>
		<li>พิมพ์ด้วยเสียโดยการกดไมโครโฟน 🎤 ตอบกลับด้วยเสียงให้เลือก TTS ที่ต้องการ</li>
		<li>พิมพ์คำว่า reset เพื่อเริ่มต้นใหม่</li>
		<li>
			ฟอร์มส่งค่าไปที่ <a
				href="https://docs.google.com/spreadsheets/d/1g0T_drugFAj2nf7H4lhACbTefYsN2faSjKImDjuW2hc/edit?usp=sharing"
			>
				Google Sheet</a
			>
		</li>
	</ul>
	<label for="tts">Text To Speech:</label>
	<div id="tts" class="checkbox-group">
		{#each options as item (item.id)}
			<label>
				<input bind:group={chatWidgetConfig.ttsType} type="radio" name="tts" value={item.id} />
				{item.name}
			</label>
		{/each}
	</div>
	<div>Debug</div>
	<pre>{JSON.stringify(formData, null, 2)}</pre>
	<ChatFormWidget {chatWidgetConfig} bind:formData bind:this={ChatFormWidgetInstance} />
</div>

<style>
	.form-option {
		background: #ccc;
		padding: 30px;
		margin: auto;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
		width: 794px;
	}
	.paper {
		width: 794px;
		height: 1123px;
		background: white;
		border: 2px solid black;
		margin: auto;
		padding: 40px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
	}

	h1 {
		text-align: center;
		font-size: 32px;
		margin-bottom: 40px;
	}

	label {
		font-size: 18px;
		margin-top: 20px;
		display: block;
	}

	input[type='text'],
	input[type='number'],
	textarea,
	select {
		width: 100%;
		padding: 8px;
		font-size: 16px;
		margin-top: 5px;
		box-sizing: border-box;
	}

	.checkbox-group {
		margin-top: 10px;
	}

	.checkbox-group label {
		display: inline-block;
		margin-right: 15px;
		font-size: 16px;
	}
	textarea {
		height: 100px;
	}

	.section {
		margin-bottom: 30px;
	}
	.form-footer {
		text-align: center;
		bottom: 40px;
		left: 0;
		width: 100%;
	}

	.submit-btn {
		padding: 10px 30px;
		font-size: 18px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.submit-btn:hover {
		background-color: #0056b3;
	}
	.submit-btn:disabled,
	.submit-btn[disabled] {
		border: 1px solid #999999;
		background-color: #cccccc;
		color: #666666;
	}
</style>
