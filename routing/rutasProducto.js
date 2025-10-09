const express = require('express');
const router = express.Router();
const ctrl = require('../controladores/productosControlador');
const { verificarToken } = require('../seguridad/auth');

router.get('/', verificarToken, ctrl.obtenerProductos);
router.get('/:id', verificarToken, ctrl.obtenerProductoPorId);
router.post('/', verificarToken, ctrl.crearProducto);
router.put('/:id', verificarToken, ctrl.actualizarProducto);
router.delete('/:id', verificarToken, ctrl.eliminarProducto);
router.post('/:id/ajustar', verificarToken, ctrl.ajustarStock);

module.exports = router;
