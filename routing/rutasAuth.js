const router = require('express').Router();
const ctrl = require('../controladores/authControlador');

router.post('/register', ctrl.registrar);
router.post('/login', ctrl.login);

module.exports = router;
