const pool = require('../database/conexion')

const buscarClientePorCorreo = async (correo) => {
  const resultado = await pool.query(
    'SELECT * FROM cliente WHERE correo = $1',
    [correo]
  )
  return resultado.rows[0]
}

const crearCliente = async (nombre, apellido, correo, contraseña, telefono, documento) => {
  const resultado = await pool.query(
    `INSERT INTO cliente (nombre, apellido, correo, contraseña, telefono, documento)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre, apellido, correo, contraseña, telefono, documento]
  )
  return resultado.rows[0]
}

const obtenerClientePorId = async (id_cliente) => {
  const resultado = await pool.query(
    'SELECT id_cliente, nombre, apellido, correo, telefono, documento FROM cliente WHERE id_cliente = $1',
    [id_cliente]
  )
  return resultado.rows[0]
}

const actualizarCliente = async (id_cliente, nombre, apellido, telefono, documento) => {
  const resultado = await pool.query(
    `UPDATE cliente SET nombre=$1, apellido=$2, telefono=$3, documento=$4
     WHERE id_cliente=$5 RETURNING id_cliente, nombre, apellido, correo, telefono, documento`,
    [nombre, apellido, telefono, documento, id_cliente]
  )
  return resultado.rows[0]
}

module.exports = { buscarClientePorCorreo, crearCliente, obtenerClientePorId, actualizarCliente }