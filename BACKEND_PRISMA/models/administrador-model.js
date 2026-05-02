const pool = require('../database/conexion')

const buscarAdminPorCorreo = async (correo) => {
  const resultado = await pool.query(
    'SELECT * FROM administrador WHERE correo = $1',
    [correo]
  )
  return resultado.rows[0]
}

module.exports = { buscarAdminPorCorreo }