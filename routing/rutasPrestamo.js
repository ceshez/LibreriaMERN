const express = require('express');
const router = express.Router();
const ctrl = require('../controladores/prestamosControlador');
const { verificarToken } = require('../seguridad/auth');

router.get('/my', verificarToken, ctrl.misPrestamos);
router.post('/', verificarToken, ctrl.crearPrestamo);
router.post('/:id/return', verificarToken, ctrl.devolverPrestamo);

module.exports = router;
