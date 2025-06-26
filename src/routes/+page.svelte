
<script>

</script>
<h1>ฟอร์มเยอะ</h1>

<h2> <a href="basic-chat1">Basic Chat 1</a> </h2>
<div>
	ตัวอย่างโปรแกรม Chat ที่ใช้ N8N เป็นเบื้องหลัง แสดงตัวอย่างการฝัง chat ในหน้าเวป
	ดัดแปลงมากจาก [ตัวอย่างนี้](https://www.youtube.com/watch?v=0KR8e4WP0E0)
	<ul>
		<li>STT ใช้ window.SpeechRecognition เป็นของ Browser(ฟรี)</li>
		<li>
			TTS ใช้ของ Browser (ฟรี) สังเคราะห์เสียงได้ไม่ดีเลย บน Chrome ไม่รองรับภาษาไทย ลองดูใน
			<a href="https://codepen.io/ve3/pen/MYWzEwg" target="_blank"> Codepen</a></li>
	</ul>
</div>

<h2><a href="basic-chat2">Basic Chat 2</a></h2>
<div>
	ทำงานเหมือนตัวอย่าง <a href="basic-chat">Basic Chat 1</a> ใช้ STT แบบเดียวกัน
	<ul>
		<li>TTS เพิ่ม <a href="https://github.com/andresayac/edge-tts">@andresaya/edge-tts</a> และ 
			<a href="https://ai.google.dev/gemini-api/docs/speech-generation?hl=th">gemini-2.5-flash-preview-tts</a> </li>
		<li>แยก chat เป็น component lib/component/ChatWidget.svelte เพื่อใช้ซ้ำได้</li>
	</ul>
</div>
