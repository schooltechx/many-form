<div class="container">
	<h1>ทีมฟอร์มเยอะ</h1>
	<div>โปรแกรมต้นแบบสำหรับการทดสอบ</div>

	<h2><a href="basic-chat1">Basic Chat 1</a></h2>
	<div>
		ตัวอย่างโปรแกรม Chat ที่ใช้ N8N เป็นเบื้องหลัง แสดงตัวอย่างการฝัง chat ในหน้าเวป ดัดแปลงมากจาก
		<a href="https://www.youtube.com/watch?v=0KR8e4WP0E0">ตัวอย่างนี้</a>
		<ul>
			<li>STT ใช้ window.SpeechRecognition เป็นของ Browser(ฟรี)</li>
			<li>
				TTS ใช้ของ Browser (ฟรี) สังเคราะห์เสียงไทยได้ไม่ดี บน Chrome ไม่รองรับภาษาไทย ลองดูใน
				<a href="https://codepen.io/ve3/pen/MYWzEwg" target="_blank"> Codepen</a>
			</li>
		</ul>
	</div>

	<h2><a href="basic-chat2">Basic Chat 2</a></h2>
	<div>
		ทำงานเหมือนตัวอย่าง <a href="basic-chat">Basic Chat 1</a> ใช้ STT แบบเดียวกัน
		<ul>
			<li>
				TTS เพิ่ม <a href="https://github.com/andresayac/edge-tts">@andresaya/edge-tts</a> และ
				<a href="https://ai.google.dev/gemini-api/docs/speech-generation?hl=th"
					>gemini-2.5-flash-preview-tts</a
				>
			</li>
			<li>แยก chat เป็น component lib/component/ChatWidget.svelte เพื่อใช้ซ้ำได้</li>
		</ul>
	</div>

	<h2><a href="patient-form">Patient Form</a></h2>
	<div>
		ตัวอย่างฟอร์มถามตอบผู้ป่วย เหมือนพยาบาลสอบถามอาการผู้ป่วยเบื้องต้น เป็น prompt
		ต้นแบบไม่ได้ใส่รายละเอียดสมจริง รองรับ TTS/STT มีปุ่มส่งค่าในฟอร์มไปที่ Google Sheet
	</div>
</div>

<style>
	.container {
		width: 90%;
		background: white;
		margin: auto;
		padding: 40px;
	}
</style>
