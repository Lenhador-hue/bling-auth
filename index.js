const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/bling/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('❌ Código não recebido');

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const result = await axios.post('https://www.bling.com.br/Api/v3/oauth/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token, expires_in } = result.data;

    res.send(`
      <h2>✅ Token gerado com sucesso!</h2>
      <p><b>Access Token:</b> ${access_token}</p>
      <p><b>Refresh Token:</b> ${refresh_token}</p>
      <p><b>Expira em:</b> ${expires_in} segundos</p>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send(`❌ Erro: ${JSON.stringify(err.response?.data || err.message)}`);
  }
});

app.get('/', (req, res) => {
  res.send('🟢 Servidor do Bling rodando');
});

app.listen(3000, () => console.log('Rodando na porta 3000'));
