const { obtenerClientePorId, actualizarCliente } = require('../models/cliente-model')

const getPerfil = async (req, res) => {
  const id_cliente = req.usuario.id
  try {
    const cliente = await obtenerClientePorId(id_cliente)
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message })
  }
}

const putPerfil = async (req, res) => {
  const id_cliente = req.usuario.id
  const { nombre, apellido, telefono, documento } = req.body
  try {
    const cliente = await actualizarCliente(id_cliente, nombre, apellido, telefono, documento)
    res.json({ mensaje: 'Perfil actualizado exitosamente', cliente })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message })
  }
}

module.exports = { getPerfil, putPerfil }