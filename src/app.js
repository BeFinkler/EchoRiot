require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/apiRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/produtos', require('./routes/produtosRoutes'));
app.use('/api/clientes', require('./routes/clientesRoutes'));
app.use('/api/pedidos', require('./routes/pedidosRoutes'));

app.use((req, res) => {
  res.status(404).json({ msg: 'Rota nao encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API de vendas rodando na porta ${PORT}`);
});
