# Many Form Team
เป้าหมายของทีมฟอร์มเยอะ คือสร้างระบบกรอกฟอร์มเอกสาร โดยใช้ AI ช่วยเหลือ ตัวอย่างการใช้งานเช่น พยาบาลต้องซักถามผู้ป่วยตอนเช้า เช่น มีไข้/ขับถ่าย/นอนหลับ/ทานอาหาร เป็นอย่างไร วัดอุณหภูมิ ฯลฯ เราก็จะใช้ AI ทำการถามแทน  เพื่ออำนวยความสะดวกในกรอกข้อมูล นำ TTS และ STT มาช่วยด้วย ค่าวัดต่างๆพยาบาลสามารถพูด เพื่อใส่ในฟอร์มได้เลย เมื่อกดส่งฟอร์มก็จะเอาค่าไปใส่ใน Google Sheet

ตอนนี้สร้างหน้า Chat กับ ส่งค่าเข้า Google Sheet ได้แล้ว อยู่ในชั้นตอนหา Prompt ที่เหมาะกับเป้าหมายของทีม

## Idea
มีหลายแนวทางเพื่อทำงานแบบนี้
### Idea 1
หา prompt ที่อ่าน Schema ของคำตอบที่ต้องการ และ ตั้งคำถามให้เหมาะสม เมื่อได้คำตอบให้เก็บค่าเอาไว้ หรือเอาไปใส่ในฟอร์ม เมื่อได้คำตอบครบแล้ว ให้แนะนำว่าควรส่งฟอร์มได้ ถ้าฟอร์มขนาดใหญ่อาจจะมีปัญหา hallucination ได้

### Idea 2
ใช้ AI Agent 2 ตัว ไม่ต้องเก็บ History การคุย ใช้ Prompt ที่เหมาะสมกับแต่ละ Agent เก็บค่าคำตอบในตัวแปรของโปรแกรม เลยจำเป็นต้องทำหน้า Chat เองแบบเฉพาะทาง
- Schema เป็นตัวบอกว่าต้องการข้อมูลเป็นอย่างไร 
- Current_Answer(ตัวแปร)  เป็นข้อมูลคำตอบแบบมีโครงสร้างตาม Schema 
- AI Agent1 สำหรับดู Current_Answer ว่าอันไหนยังไม่ได้ถามแล้วพยายามถามทีละข้อ
- AI Agent2 รับคำตอบ ดู Schema แล้วทำเป็น Structure Output  เอาไปผนวกกับ Current_Answer
- ฟอร์มทำการอัปเดตคำตอบจาก Current_Answer ทำวนไปจนกว่าจะได้คำตอบครบ
- ตรวจสอบ Current_Answer ว่าได้คำตอบครบแล้ว ให้แนะนำให้ส่งฟอร์มหรือแก้ไขข้อมูล

## Setup
- Install node.js VS, Code
- clone โค้ดของโปรเจ็ก
```sh
git clone git@github.com:schooltechx/many-form.git
cd many-form
npm i
npm run dev
```

## Speech To Text (STT)
windows.speechRecognition ที่มากับ Browser ถอดเสียงได้ค่อนข้างแม่นยำ ใช้งานได้ฟรี เร็วกว่าเรียก API ภายนอกอย่าง whisper

## Text to Speech(TTS)
- Browser TTS จะขึ้นกับแต่ละค่าย Chrome สร้างเสียงได้เร็วแต่ไม่รองรับภาษาไทย, บน Firefox มีภาษาไทยให้เลือกแต่เสียงค่อนข้างแย่, Brave ไม่มี ทดสอบได้[ที่นี้](https://codepen.io/ve3/pen/MYWzEwg) แนะนำให้ใช้ตัวอื่น
- Microsoft Edge TTS เป็นฟีเจอร์ read around บน Browser ที่ถูกแอปเอามาใช้ในโปรแกรมอื่นๆหลายตัวเนื่องจากฟรี รองรับหลายภาษา สำหรับภาษาไทยมีสองเสียงคือ th-TH-NiwatNeural(ชาย), th-TH-PremwadeeNeural(หญิง) ตอนนี้ใช้ผ่าน [@andresaya/edge-tts](https://github.com/andresayac/edge-tts) ตัวนี้มีบักเล็กน้อยอาจจะเปลี่ยนเป็นตัวอื่น
ทดสอบเสียงได้[ที่นี้](https://huggingface.co/spaces/innoai/Edge-TTS-Text-to-Speech)
- Google gemini-2.5-flash-preview-tts รองรับเสียงภาษาไทยได้หลายแบบ สร้างเสียงได้ค่อนข้างช้า ต้องขอ 
[API Key](https://aistudio.google.com/app/apikey) ก่อน ใช้ได้ฟรีระดับหนึ่ง ติดตั้ง
[@google/genai](https://ai.google.dev/gemini-api/docs/speech-generation?hl=th) ก่อนใช้งาน 
ทดสอบได้[ที่นี้](https://aistudio.google.com/generate-speech)

## N8N
ติดตั้งแบบ self-host บนอินเตอร์เน็ต
- ทีมใช้เพื่อทดสอบ Prompt หรือโมเดลได้ง่าย ไม่ต้องเขียนโค้ด
- เป็น AI Agent ทำงานเบื้องหลัง
- เชื่อมต่อระบบอื่นๆเช่นส่งค่าเข้า Google Sheet

## SvelteKit
ใช้เพื่อทำ 
- สร้างหน้า Custom Chat เพื่อควบคุมการทำงานได้มากกว่า Chat ของ N8N ดัดแปลงมาจากตัวอย่างนี้ [video](https://www.youtube.com/watch?v=0KR8e4WP0E0), [codepen](https://codepen.io/Matt-Penny/pen/dPyVWEw)
- API เพื่อเรียกจัดการ TTS 
- จะใช้การเขียนโค้ดเพื่อการจัดการที่ซับซ้อน

## อ่านเพิ่ม
- [speechSynthesis with Svelte](https://dev.to/taw/getting-started-with-web-speech-synthesis-api-and-svelte-3l13)
- [@speechly/speech-recognition-polyfill](https://www.npmjs.com/package/@speechly/speech-recognition-polyfill)
- [Conversational Interviews with AI Agents and n8n Forms](https://n8n.io/workflows/2566-conversational-interviews-with-ai-agents-and-n8n-forms/)

