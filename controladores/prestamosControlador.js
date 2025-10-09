const Prestamo = require('../modelos/prestamoEsquema.js');
const Producto = require('../modelos/productoEsquema');
const Movimiento = require('../modelos/movimientoEsquema');

exports.crearPrestamo = async (req, res) => {
  try {
    const { productoId, dias = 7 } = req.body;
    // intenta decrementar si hay stock
    const actualizado = await Producto.findOneAndUpdate(
      { _id: productoId, stockDisponible: { $gt: 0 } },
      { $inc: { stockDisponible: -1 } },
      { new: true }
    );
    if (!actualizado) return res.status(400).json({ error: 'Sin stock disponible' });

    const fechaLimite = new Date(Date.now() + Number(dias) * 24 * 60 * 60 * 1000);
    const p = await Prestamo.create({
      productoId, usuarioId: req.usuarioId, fechaLimite, estado: 'active'
    });
    await Movimiento.create({ productoId, tipo:'borrow', cantidad:1, usuarioId: req.usuarioId, nota:'Préstamo' });
    res.status(201).json(p);
  } catch {
    res.status(400).json({ error: 'Error al prestar' });
  }
};

exports.devolverPrestamo = async (req, res) => {
  try {
    const { id } = req.params; // id de préstamo
    const p = await Prestamo.findById(id);
    if (!p || p.devueltoEn) return res.status(400).json({ error: 'Préstamo inválido' });

    await Prestamo.findByIdAndUpdate(id, { devueltoEn: new Date(), estado: 'returned' });
    await Producto.findByIdAndUpdate(p.productoId, { $inc: { stockDisponible: 1 } });
    await Movimiento.create({ productoId: p.productoId, tipo:'return', cantidad:1, usuarioId: req.usuarioId, nota:'Devolución' });

    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Error al devolver' });
  }
};

exports.misPrestamos = async (req, res) => {
  const items = await Prestamo.find({ usuarioId: req.usuarioId }).populate('productoId');
  res.json({ items });
};
