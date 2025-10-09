const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rutasAuth = require('./routing/rutasAuth');
const rutasProducto = require('./routing/rutasProducto');
const rutasPrestamo = require('./routing/rutasPrestamo');

const app = express();

// Conexión Mongo
mongoose.connect(process.env.DB_HOST)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api/auth', rutasAuth);
app.use('/api/products', rutasProducto);
app.use('/api/loans', rutasPrestamo);

// Páginas (si usas /public/pages/*.html)
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'shelves.html')));
app.get('/pages/:file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', req.params.file));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
