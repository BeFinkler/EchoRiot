require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());

// 👇 rota de teste
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

app.listen(5000, () => console.log('Servidor rodando na porta 5000'));