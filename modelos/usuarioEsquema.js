const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  rol: { type: String, enum: ['admin','librarian','member'], default: 'member', index: true }
}, { timestamps: true });

module.exports = model('Usuario', UsuarioSchema);
