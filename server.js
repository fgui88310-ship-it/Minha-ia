const express = require('express');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama({ host: 'http://localhost:11434' });

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <meta charset="utf-8">
    <h1 style="font-family: sans-serif; text-align:center; margin-top:100px;">
      Minha IA grátis rodando no Render.com
    </h1>
    <div style="max-width:600px; margin:auto; font-family:sans-serif;">
      <textarea id="msg" style="width:100%; height:100px; font-size:16px;" placeholder="Digite sua pergunta..."></textarea><br>
      <button onclick="enviar()" style="padding:15px 30px; font-size:18px;">Enviar</button>
      <pre id="res" style="margin-top:20px; background:#f0f0f0; padding:15px; border-radius:8px;"></pre>
    </div>
    <script>
      async function enviar() {
        const msg = document.getElementById('msg').value;
        if (!msg) return;
        document.getElementById('res').textContent = 'Pensando...';
        const r = await fetch('/chat', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({message: msg})
        });
        const j = await r.json();
        document.getElementById('res').textContent = j.reply || j.error;
      }
    </script>
  `);
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: message }],
      stream: false
    });
    res.json({ reply: response.message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('IA rodando!'));
