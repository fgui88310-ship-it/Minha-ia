const express = require('express');
const { Ollama } = require('ollama');

const app = express();
const ollama = new Ollama({ host: 'http://localhost:11434' });

// Função que garante que o modelo está baixado
async function garantirModelo() {
  try {
    await ollama.show({ model: 'llama3.2:1b' });
    console.log('Modelo llama3.2:1b já está baixado');
  } catch {
    console.log('Baixando llama3.2:1b pela primeira vez... (pode demorar ~40 segundos)');
    await ollama.pull({ model: 'llama3.2:1b' });
    console.log('Modelo baixado com sucesso!');
  }
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <meta charset="utf-8">
    <h1 style="text-align:center; margin-top:100px;">IA 100% sem censura rodando de graça no Render</h1>
    <div style="max-width:600px; margin:auto; font-family:sans-serif;">
      <textarea id="msg" style="width:100%; height:120px; font-size:18px;" placeholder="Pergunta qualquer coisa... até crime kkk"></textarea><br>
      <button onclick="enviar()" style="padding:15px 40px; font-size:20px;">Enviar</button>
      <pre id="res" style="margin-top:20px; background:#f0f0f0; padding:20px; border-radius:10px; white-space: pre-wrap;"></pre>
    </div>
    <script>
      async function enviar() {
        const msg = document.getElementById('msg').value;
        if (!msg) return;
        document.getElementById('res').textContent = 'Pensando...';
        const r = await fetch('/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:msg})});
        const j = await r.json();
        document.getElementById('res').textContent = j.reply || j.error;
      }
    </script>
  `);
});

app.post('/chat', async (req, res) => {
  try {
    await garantirModelo();  // ← garante o modelo aqui
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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
