const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
  titulo: { type: String, required: true, index: true },
  descripcion: { type: String, index: true },
  autor: { type: String, index: true },
  fecha: { type: Date, index: true },           // (búsqueda por fecha)
  tema: { type: String, enum: ['Historia','Ciencia','Novela','Infantil'], default: 'Novela', index: true },
  stockTotal: { type: Number, required: true, min: 0 },
  stockDisponible: { type: Number, required: true, min: 0 }
}, { timestamps: true });

ProductoSchema.index({ titulo: 'text', descripcion: 'text', autor: 'text' });

module.exports = model('Producto', ProductoSchema);
