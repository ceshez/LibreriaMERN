const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuarioEsquema');

exports.registrar = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ error: 'Correo ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await Usuario.create({ nombre, correo, passwordHash });
    res.status(201).json({ ok: true, id: u._id });
  } catch (e) {
    res.status(500).json({ error: 'Error al registrar' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const u = await Usuario.findOne({ correo });
    if (!u) return res.status(400).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: u._id, rol: u.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, usuario: { id: u._id, nombre: u.nombre, rol: u.rol } });
  } catch (e) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
