const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { buscarClientePorCorreo, crearCliente } = require('../models/cliente-model')
const { buscarAdminPorCorreo } = require('../models/administrador-model')

const registro = async (req, res) => { 
  const { nombre, apellido, correo, contraseña, telefono, documento } = req.body

  try {
    // ¿Ya existe un cliente con ese correo?
    const existe = await buscarClientePorCorreo(correo)
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' })
    }

    // Encriptar la contraseña
    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10)

    // Crear el cliente en la BD
    const nuevoCliente = await crearCliente(
      nombre, apellido, correo, contraseñaEncriptada, telefono, documento
    )

    res.status(201).json({ mensaje: 'Cliente registrado exitosamente', cliente: nuevoCliente })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const login = async (req, res) => {
  const { correo, contraseña } = req.body

  try {
    // Buscar primero en clientes
    let usuario = await buscarClientePorCorreo(correo)
    let rol = 'cliente'

    // Si no está en clientes, buscar en admins
    if (!usuario) {
      usuario = await buscarAdminPorCorreo(correo)
      rol = 'admin'
    }

    // Si no existe en ninguna tabla
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo o contraseña incorrectos' })
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id_cliente || usuario.id_administrador, correo: usuario.correo, rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ mensaje: 'Login exitoso', token, rol })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { registro, login }