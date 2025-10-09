const { Schema, model, Types } = require('mongoose');

const PrestamoSchema = new Schema({
  productoId: { type: Types.ObjectId, ref: 'Producto', required: true, index: true },
  usuarioId: { type: Types.ObjectId, ref: 'Usuario', required: true, index: true },
  fechaInicio: { type: Date, default: () => new Date() },
  fechaLimite: { type: Date, required: true, index: true },
  devueltoEn: Date,
  estado: { type: String, enum: ['active','overdue','returned'], default: 'active', index: true }
}, { timestamps: true });

module.exports = model('Prestamo', PrestamoSchema);