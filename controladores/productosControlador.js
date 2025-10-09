const Producto = require('../modelos/productoEsquema');
const Movimiento = require('../modelos/movimientoEsquema');

exports.obtenerProductos = async (req, res) => {
  try {
    const { q, autor, tema, desde, hasta, sort='titulo', page=1, limit=20 } = req.query;
    const filtro = {};
    if (q) filtro.$text = { $search: q };
    if (autor) filtro.autor = new RegExp(autor, 'i');
    if (tema) filtro.tema = tema;
    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }
    const skip = (Number(page)-1) * Number(limit);
    const [items, total] = await Promise.all([
      Producto.find(filtro).sort(sort).skip(skip).limit(Number(limit)),
      Producto.countDocuments(filtro)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
  } catch {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  const item = await Producto.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json(item);
};

exports.crearProducto = async (req, res) => {
  try {
    const { titulo, descripcion, autor, fecha, tema, stockTotal } = req.body;
    const item = await Producto.create({
      titulo, descripcion, autor,
      fecha: fecha ? new Date(fecha) : null,
      tema,
      stockTotal: Number(stockTotal || 0),
      stockDisponible: Number(stockTotal || 0)
    });
    await Movimiento.create({ productoId: item._id, tipo: 'create', cantidad: item.stockTotal, usuarioId: req.usuarioId, nota: 'Alta' });
    res.status(201).json(item);
  } catch {
    res.status(400).json({ error: 'Error al crear' });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const prev = await Producto.findById(id);
    if (!prev) return res.status(404).json({ error: 'No encontrado' });

    const { titulo, descripcion, autor, fecha, tema, stockTotal } = req.body;
    const nuevoTotal = Number(stockTotal ?? prev.stockTotal);
    const nuevoDisponible = Math.max(0, nuevoTotal - (prev.stockTotal - prev.stockDisponible));

    const item = await Producto.findByIdAndUpdate(
      id,
      { titulo, descripcion, autor, fecha: fecha ? new Date(fecha) : null, tema, stockTotal: nuevoTotal, stockDisponible: nuevoDisponible },
      { new: true }
    );
    await Movimiento.create({ productoId: item._id, tipo:'update', usuarioId: req.usuarioId, nota:'Edición' });
    res.json(item);
  } catch {
    res.status(400).json({ error: 'Error al actualizar' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const id = req.params.id;
    await Producto.findByIdAndDelete(id);
    await Movimiento.create({ productoId: id, tipo:'delete', usuarioId: req.usuarioId, nota:'Borrado' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

exports.ajustarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, nota } = req.body;  // cantidad puede ser positiva o negativa
    const item = await Producto.findByIdAndUpdate(
      id,
      { $inc: { stockTotal: Number(cantidad), stockDisponible: Number(cantidad) } },
      { new: true }
    );
    await Movimiento.create({ productoId: item._id, tipo:'adjust', cantidad: Number(cantidad), usuarioId: req.usuarioId, nota: nota || 'Ajuste' });
    res.json(item);
  } catch {
    res.status(400).json({ error: 'Error al ajustar stock' });
  }
};
