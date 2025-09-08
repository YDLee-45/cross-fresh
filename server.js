// server.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/v1/translate', (req, res) => {
  const { text = '', target = 'ja' } = req.body || {};
  // 실제 번역 대신 폴백 텍스트 반환
  res.json({ text: (target ? '' : '') + `[${target}] ${text}` });
});

app.post('/v1/chat/quick-replies', (req, res) => {
  res.json({
    suggestions: ['첫 만남 반가워요! 😊', '관심사가 궁금해요!', '주말엔 뭐 하세요?'],
  });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('API on http://0.0.0.0:5000');
});
