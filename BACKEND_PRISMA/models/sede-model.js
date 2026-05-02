const pool = require('../database/conexion')

const obtenerSedes = async () => {
  const resultado = await pool.query(`
    SELECT s.*, 
      array_agg(i.ruta_imagen_sede) as imagenes,
      array_agg(i.id_imagen_sede) as id_imagenes
    FROM sede s
    LEFT JOIN imagen_sede i ON s.id_sede = i.id_sede
    GROUP BY s.id_sede
  `)
  return resultado.rows
}

const crearSede = async (nombre, ciudad, telefono, direccion) => {
  const resultado = await pool.query(
    `INSERT INTO sede (nombre, ciudad, telefono, direccion)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre, ciudad, telefono, direccion]
  )
  return resultado.rows[0]
}

const editarSede = async (id_sede, nombre, ciudad, telefono, direccion) => {
  const resultado = await pool.query(
    `UPDATE sede SET nombre=$1, ciudad=$2, telefono=$3, direccion=$4
     WHERE id_sede=$5 RETURNING *`,
    [nombre, ciudad, telefono, direccion, id_sede]
  )
  return resultado.rows[0]
}

const eliminarSede = async (id_sede) => {
  // Primero eliminar las imágenes asociadas
  await pool.query('DELETE FROM imagen_sede WHERE id_sede=$1', [id_sede])
  // Luego eliminar la sede
  await pool.query('DELETE FROM sede WHERE id_sede=$1', [id_sede])
}

const obtenerSedePorId = async (id_sede) => {
  const resultado = await pool.query(`
    SELECT s.*, 
      array_agg(i.ruta_imagen_sede) as imagenes,
      array_agg(i.id_imagen_sede) as id_imagenes
    FROM sede s
    LEFT JOIN imagen_sede i ON s.id_sede = i.id_sede
    WHERE s.id_sede = $1
    GROUP BY s.id_sede
  `, [id_sede])
  return resultado.rows[0]
}


//Funciones para que el admin agregue imagenes

const agregarImagenSede = async (id_sede, ruta_imagen_sede) => {
  const resultado = await pool.query(
    `INSERT INTO imagen_sede (id_sede, ruta_imagen_sede)
     VALUES ($1, $2) RETURNING *`,
    [id_sede, ruta_imagen_sede]
  )
  return resultado.rows[0]
}

const eliminarImagenSede = async (id_imagen_sede) => {
  const resultado = await pool.query(
    `DELETE FROM imagen_sede WHERE id_imagen_sede=$1 RETURNING *`,
    [id_imagen_sede]
  )
  return resultado.rows[0]
}

module.exports = { obtenerSedes, crearSede, editarSede, eliminarSede, obtenerSedePorId, agregarImagenSede, eliminarImagenSede }