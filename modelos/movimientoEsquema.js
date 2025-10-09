const { Schema, model, Types } = require('mongoose');

const MovimientoSchema = new Schema({
  productoId: { type: Types.ObjectId, ref: 'Producto', required: true, index: true },
  tipo: { type: String, enum: ['create','update','delete','adjust','borrow','return'], required: true, index: true },
  cantidad: { type: Number, default: 0 },
  usuarioId: { type: Types.ObjectId, ref: 'Usuario', index: true },
  nota: String
}, { timestamps: true });

module.exports = model('Movimiento', MovimientoSchema);
