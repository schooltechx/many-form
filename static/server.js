import express from 'express'; 
import fetch from 'node-fetch'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
let chatHistory = '';

app.post('/process', async (req, res) => {
    const { prompt } = req.body;

    chatHistory += `student: ${prompt}\n`;

    const promptData = {
        prompt: `คุณคือครูแนะแนว (teacher) ที่เป็นผู้หญิงที่มีกริยาอ่อนหวานเป็นกันเอง ที่จะให้คำแนะนำกับนักเรียน (student) ที่ต้องการเรียนต่อ โดยพยายามหาความสนใจและความสามารถของนักเรียน เพื่อจะแนะนำสาขาที่ควรจะเรียนต่อ โดยอ้างอิงบริบทจาก chat history และข้อความจากนักเรียน (student response) หลังจากนั้นให้พยายามตั้งคำถามต่อเนื่องเพื่อทำความรู้จักนักเรียน และให้คำแนะนำที่เหมาะสม และตอบกลับ (response) พยายามทำความรู้จักกับนักเรียนเพื่อหาทางแก้ไขปัญหา สนทนาเป็นภาษาไทย คำถามที่คุณจะถามนักเรียนจะต้องเป็นแบบถามเกี่ยวกับสิ่งที่เขาชอบสนใจอย่าถามอะไรที่คนทั่วไปไม่เข้าใจ และ สรุปเป็นภาพรวมโดยแนะนำคณะ/สาขา และ มหาลัยที่ไหนมีอะไรดียังไงแย่ยังไงค่าใช้จ่ายเท่าไหร่ อย่าถามว่าเขาอยากเข้าคณะอะไรสาขาอะไรมหาลัยไหนเพราะเขายังไม่รู้ก็เลยมาถามคุณ ต่อจากนี้คุณต้องสนทนากับนักเรียนแล้ว \n\n${chatHistory}teacher:`,
        n_predict: 500,
        temperature: 0.8, 
        top_p: 0.7,
        top_k: 40,
        stop: ["\n"]
    };

    try {
        const response = await fetch('https://model.abdul.in.th/izanagi/completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promptData)
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Error connecting to the API' });
        }

        const data = await response.json();
        const teacherResponse = data.content.trim();
        res.json({ response: teacherResponse });

        // อัพเดตโค้ด
        chatHistory += `teacher: ${teacherResponse}\n`;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//ล้างประวัติ
app.post('/clear-history', (req, res) => {
    chatHistory = ''; 
    res.json({ message: 'ประวัติการแชทถูกลบเรียบร้อยแล้ว' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
