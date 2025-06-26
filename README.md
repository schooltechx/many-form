# Many Form
เป้าหายของทีมฟอร์มเยอะ คือสร้างระบบกรอกฟอร์มเอกสาร โดยใช้ AI ช่วยเหลือ ตัวอย่างการใช้งานเช่น พยาบาลต้องซักถามผู้ป่วยตอนเช้า เช่น มีไข้หรือไม่ ขับถ่ายเป็นอย่างไร นอนหลับดีหรือไม่ ทานอาหารได้หรือไม่ ฯลฯ เราก็จะใช้ AI ทำการถามแทน เพื่ออำนวยความสะดวกในกรอกข้อมูล จะมำ TTS และ STT มาช่วยด้วย

ตอนนี้อยู่ในชั้นตอนหา Prompt ที่เหมาะกับเป้าหมายของทีม


## Idea
มีหลายแนวทางเพื่อทำงานแบบนี้
### Idea 1
หา prompt ที่อ่าน Schema ของคำตอบที่ต้องการ และ ตั้งคำถามให้เหมาะสม เมื่อได้คำตอบให้เก็บค่าเอาไว้ หรือเอาไปใส่ในฟอร์ม เมื่อได้คำตอบครบแล้ว ให้แนะนำว่าควรส่งฟอร์มได้

### Idea 2
ใช้ AI Agent 2 ตัว
- Schema เป็นตัวบอกว่าต้องการข้อมูลเป็นอย่างไร 
- Current_Answer  เป็นข้อมูลแบบมีโครงสร้างตาม Schema
- AI Agent1 สำหรับดู Current_Answer ว่าอันไหนยังไม่ได้ถามแล้วพยายามถามทีละข้อ
- AI Agent2 รับคำตอบ ดู Schema แล้วทำเป็น Structure Output  เอาไปผนวกกับ Current_Answer
- ฟอร์มที่อัปเดตคำตอบจาก Current_Answer
- Current_Answer ได้คำตอบครบแล้วให้แนะนำให้ส่งฟอร์มหรือแก้ไขข้อมูล


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
ใช้ windows.speechRecognition ที่มากับ Browser ใช้ได้ฟรี และทำงานดีด้วย

## Text to Speech(TTS)
TTS ที่มากับ Chrome ไม่รองรับภาษาไทย บน Firefox มีภาษาไทยแต่ก็ค่อนข้างย่ำแย่ แนะนำให้ใช้ตัวอื่น
- Microsoft Edge TTS รองรับหลายภาษาสำหรับภาษาไทยมีสองเสียงคือ NiwatNeural(ชาย) PremwadeeNeural(หญิง) (แอบ)
ใช้ได้ฟรีใช้ผ่าน [@andresaya/edge-tts](https://github.com/andresayac/edge-tts)
- Google gemini-2.5-flash-preview-tts ต้องขอ API_KEY ก่อน ใช้ได้ฟรีระดับหนึ่ง ติดตั้ง
[@google/genai](https://ai.google.dev/gemini-api/docs/speech-generation?hl=th) ก่อนใช้งาน

## N8N
ติดตั้งแบบ self-host บนอินเตอร์เน็ต
- ทีมใช้เพื่อทดสอบ Prompt หรือโมเดลได้ง่าย ไม่ต้องเขียนโค้ด
- เป็น AI Agent ทำงานเบื้องหลัง
- เชื่อมต่อระบบอื่นๆเช่นส่งค่าเข้า Google Sheet
## SvelteKit
ใช้เพื่อทำ 
- สร้างหน้า Chat เองจะได้ควบคุมหน้าจอได้ดีกว่า Chat ของ N8N การตั้งค่าเอามาจากตัวอย่างนี้ [video](https://www.youtube.com/watch?v=0KR8e4WP0E0), [codepen](https://codepen.io/Matt-Penny/pen/dPyVWEw)
- API เพื่อเรียกจัดการ TTS หรือทำอย่างอื่นที่จำเป็น

## อ่านเพิ่ม
- [speechSynthesis with Svelte](https://dev.to/taw/getting-started-with-web-speech-synthesis-api-and-svelte-3l13)

- [@speechly/speech-recognition-polyfill](https://www.npmjs.com/package/@speechly/speech-recognition-polyfill)