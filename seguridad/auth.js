const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = (req.query.token) || (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
  if (!token) return res.status(401).json({ error: 'Falta token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioRol = decoded.rol;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken };
