const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol admin' })
  }
  next()
}

const soloCliente = (req, res, next) => {
  if (req.usuario.rol !== 'cliente') {
    return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol cliente' })
  }
  next()
}

module.exports = { soloAdmin, soloCliente }