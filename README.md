# Many Form Team
Repo นี้สำหรับโครงการ Super AI Innovator 
เป้าหมายของทีมฟอร์มเยอะ คือสร้างต้นแบบระบบกรอกฟอร์มเอกสาร โดยใช้ AI ช่วยเหลือถามทีละขั้นตอน 
นำ TTS และ STT มาช่วยด้วย พูดง่ายคือสามารถคุยกับฟอร์มได้
ตัวอย่างการใช้งานเช่น พยาบาลต้องซักถามเพื่อคัดกรองผู้ป่วย เช่น มีไข้/ขับถ่าย/นอนหลับ/ทานอาหาร เป็นอย่างไร วัดอุณหภูมิ ฯลฯ เมื่อกดส่งฟอร์มก็จะเอาค่าไปใส่ใน Google Sheet
- ใช้ backend เป็น N8N เพื่อให้ง่ายต่อการทดสอบ 
- ส่วนการติดต่อผู้ใช้งานและ API ใช้ SvelteKit เพราะเป็น Framwork ที่เรียนรู้ง่าย 
- AI จะใช้โมเดลของ Google Gemini เพราะใช้ได้ฟรี(แบบจำกัด)

## Idea

มีหลายแนวทางเพื่อทำงานแบบนี้ สามารถทดสอบ prompt ผ่าน N8N ตอนนี้เลือกใช้ Idea 1 

- Idea 1: หา prompt ที่อ่าน Schema ของคำตอบที่ต้องการ และ ตั้งคำถามให้เหมาะสม เมื่อได้คำตอบให้เก็บค่าเอาไว้ หรือเอาไปใส่ในฟอร์ม เมื่อได้คำตอบครบแล้ว ให้แนะนำว่าควรส่งฟอร์มได้ ถ้าฟอร์มขนาดใหญ่อาจจะมีปัญหา hallucination ได้
- Idea 2:ใช้ AI Agent 2 ตัว ไม่ต้องเก็บ History การคุย ใช้ Prompt ที่เหมาะสมกับแต่ละ Agent เก็บค่าคำตอบในตัวแปรของโปรแกรม เลยจำเป็นต้องทำหน้า Chat เองแบบเฉพาะทาง
  - Schema เป็นตัวบอกว่าต้องการข้อมูลเป็นอย่างไร
  - Current_Answer(ตัวแปร) เป็นข้อมูลคำตอบแบบมีโครงสร้างตาม Schema
  - AI Agent1 สำหรับดู Current_Answer ว่าอันไหนยังไม่ได้ถามแล้วพยายามถามทีละข้อ
  - AI Agent2 รับคำตอบ ดู Schema แล้วทำเป็น Structure Output เอาไปผนวกกับ Current_Answer
  - ฟอร์มทำการอัปเดตคำตอบจาก Current_Answer ทำวนไปจนกว่าจะได้คำตอบครบ
  - ตรวจสอบ Current_Answer ว่าได้คำตอบครบแล้ว ให้แนะนำให้ส่งฟอร์มหรือแก้ไขข้อมูล

## Local install
- npm run command จะใช้ script ใน [package.json](./package.json) แนะนำให้เข้าไปดูการการทำงานเพราะจะไม่ได้อธิบายโดยละเอียดในเอกสารนี้
- OS ใช้ Windows (WSL) หรือ Linux
- Install node.js,docker, VS Code
- clone โค้ดของโปรเจ็ก ,สร้าง Docker Image, แล้วรันโปรแกรม (many-form, N8N)
```sh
git clone https://github.com/schooltechx/many-form.git
cd many-form
code .
npm i
cp env.example .env
npm run docker:build
cd docker
cp env.example .env
docker compose up -d
cd ..
```
- ไปที่ [http://localhost:5678/](http://localhost:5678/) ใส่อีเมลล์และรหัสผ่านและลงทะเบียนผู้ใช้ให้เรียบร้อย
- Create Workflow สองตัวโดยใช้ n8n/chat.json , n8n/patient-form.json
- Create Credential สร้าง 'Google Sheet OAuth2 API' และ 'Google Gemini (PaLM) Api'
- แก้ไขค่า GOOGLE_API_KEY ให้ถูกต้อง
- ทดสอบโปรแกรมที่ [http://localhost:3000/](http://localhost:3000/)

## Development
- N8N จากขั้นตอนก่อนหน้าต้องทำงานอยู่ รันแบบ developer
```sh
npm run dev
```
- ใช้งานไปที่(พอร์ตอาจจะเปลี่ยนตามสภาพแวดล้อม) [http://localhost:5173](http://localhost:5173) 

## Deployment
- Linux เซิร์ฟเวอร์หรือ VM ที่ติดตั้ง Docker ssh ผ่าน ssh-key ได้
- ตัวอย่าง ~/.ssh/config 

```
Host remote-host
  User username
  HostName ip-address
  ForwardAgent yes
  Port 22
  IdentityFile ~/.ssh/remote-host
```
- ทำการ Build Docker Image และส่งไปที่ remote-host
```sh
npm run docker:build
npm run remote:push
```
- ติดตั้ง compose.yaml ไว้ที่ remote-host ในตัวอย่างนี้อยู่ที่ ~/docker/workflow
- การติดตั้งคล้าย Local install ตั้งค่า reverse proxy และ โดเมนให้เรียบร้อย ทดสอบจนใช้งานได้บนเซิร์ฟเวอร์
เมื่อมีการแก้ไขโค้ดและทดสอบเรียบร้อยแล้ว ทำการ Build Image,Push Image ไปที่ remote-host และทำการ reload โปรแกรมตัวใหม่ให้เรียกคำสั่ง
```sh
npm run deploy
```

## Speech To Text (STT)

windows.speechRecognition ที่มากับ Browser ถอดเสียงได้ค่อนข้างแม่นยำ ใช้งานได้ฟรี เร็วกว่าเรียก API ภายนอกอย่าง whisper

## Text to Speech(TTS)

- Browser TTS จะขึ้นกับแต่ละค่าย Chrome สร้างเสียงได้เร็วแต่ไม่รองรับภาษาไทย, บน Firefox มีภาษาไทยให้เลือกแต่เสียงค่อนข้างแย่, Brave ไม่มี ทดสอบได้[ที่นี้](https://codepen.io/ve3/pen/MYWzEwg) แนะนำให้ใช้ตัวอื่นแทน Browser
- Microsoft Edge TTS เป็นฟีเจอร์ read around บน Browser ที่ถูกแอปเอามาใช้ในโปรแกรมอื่นๆหลายตัวเนื่องจากฟรี รองรับหลายภาษา สำหรับภาษาไทยมีสองเสียงคือ th-TH-NiwatNeural(ชาย), th-TH-PremwadeeNeural(หญิง) ตอนนี้ใช้ผ่าน [@andresaya/edge-tts](https://github.com/andresayac/edge-tts) ตัวนี้มีบักเล็กน้อยอาจจะเปลี่ยนเป็นตัวอื่น
  ทดสอบเสียงได้[ที่นี้](https://huggingface.co/spaces/innoai/Edge-TTS-Text-to-Speech)
- Google gemini-2.5-flash-preview-tts รองรับเสียงภาษาไทยได้หลายแบบ สร้างเสียงได้ค่อนข้างช้า ต้องขอ
  [API Key](https://aistudio.google.com/app/apikey) ก่อน ใช้ได้ฟรีระดับหนึ่ง ติดตั้ง
  [@google/genai](https://ai.google.dev/gemini-api/docs/speech-generation?hl=th) ก่อนใช้งาน
  ทดสอบได้[ที่นี้](https://aistudio.google.com/generate-speech)

## N8N

ติดตั้งแบบ self-host บนเครื่องตัวเองหรือบนอินเตอร์เน็ต
- ทีมใช้เพื่อทดสอบ Prompt หรือโมเดลได้ง่าย ไม่ต้องเขียนโค้ด
- เป็น AI Agent ทำงานเบื้องหลัง
- เชื่อมต่อระบบอื่นๆเช่นส่งค่าเข้า Google Sheet

## SvelteKit
- เรียนรู้และใช้งานง่าย
- สร้างหน้า Custom Chat เพื่อควบคุมการทำงานได้มากกว่า Chat ของ N8N ดัดแปลงมาจากตัวอย่างนี้ [video](https://www.youtube.com/watch?v=0KR8e4WP0E0), [codepen](https://codepen.io/Matt-Penny/pen/dPyVWEw)
- API เพื่อเรียกจัดการ TTS และ TTS
- API เพื่อซ่อน end point ของระบบ
- จะใช้การเขียนโค้ดเพื่อการจัดการที่ซับซ้อน

## อ่านเพิ่ม

- [speechSynthesis with Svelte](https://dev.to/taw/getting-started-with-web-speech-synthesis-api-and-svelte-3l13)
- [@speechly/speech-recognition-polyfill](https://www.npmjs.com/package/@speechly/speech-recognition-polyfill)
- [Conversational Interviews with AI Agents and n8n Forms](https://n8n.io/workflows/2566-conversational-interviews-with-ai-agents-and-n8n-forms/)
- [Speech Recognition & Voice Synthesis in React (Web Speech API)](https://www.youtube.com/watch?v=JFfCDvKiJqU)
- [Passing Data from Child to Parent in Svelte: A Comprehensive Guide](https://dev.to/arjun_computer_geek/passing-data-from-child-to-parent-in-svelte-a-comprehensive-guide-318g)
- [Conversational Form(No Ai)](https://space10-community.github.io/conversational-form/landingpage/)


