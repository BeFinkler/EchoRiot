require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar ao MongoDB
connectDB();

// Segurança - Helmet com CSP relaxado para CDN
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    },
  },
}));

// Logging
app.use(morgan('combined'));

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Headers:`, req.headers.authorization ? 'Token present' : 'No token');
  next();
});

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template engine - EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));

// Rotas do frontend
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Catch-all route for debugging
app.use((req, res) => {
  console.log(`CATCH-ALL: ${req.method} ${req.path} not found`);
  res.status(404).json({ msg: 'Rota não encontrada' });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});