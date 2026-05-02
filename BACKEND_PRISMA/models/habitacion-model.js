const pool = require('../database/conexion')

const obtenerHabitacionesPorSede = async (id_sede) => {
  const resultado = await pool.query(`
    SELECT h.*, 
      array_agg(i.ruta_imagen_habitacion) as imagenes,
      array_agg(i.id_imagen_habitacion) as id_imagenes
    FROM habitacion h
    LEFT JOIN imagen_habitacion i ON h.id_habitacion = i.id_habitacion
    WHERE h.id_sede = $1
    GROUP BY h.id_habitacion
  `, [id_sede])
  return resultado.rows
}

const crearHabitacion = async (numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_sede) => {
  const resultado = await pool.query(
    `INSERT INTO habitacion (numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_sede)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_sede]
  )
  return resultado.rows[0]
}

const editarHabitacion = async (id_habitacion, numero, tipo, estado, descripcion, precio_noche, capacidad_personas) => {
  const resultado = await pool.query(
    `UPDATE habitacion SET numero=$1, tipo=$2, estado=$3, descripcion=$4, precio_noche=$5, capacidad_personas=$6
     WHERE id_habitacion=$7 RETURNING *`,
    [numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_habitacion]
  )
  return resultado.rows[0]
}

const eliminarHabitacion = async (id_habitacion) => {
  await pool.query('DELETE FROM imagen_habitacion WHERE id_habitacion=$1', [id_habitacion])
  await pool.query('DELETE FROM reserva WHERE id_habitacion=$1', [id_habitacion])
  await pool.query('DELETE FROM habitacion WHERE id_habitacion=$1', [id_habitacion])
}

const cambiarEstadoHabitacion = async (id_habitacion, estado) => {
  const resultado = await pool.query(
    `UPDATE habitacion SET estado=$1 WHERE id_habitacion=$2 RETURNING *`,
    [estado, id_habitacion]
  )
  return resultado.rows[0]
}

const obtenerHabitacionPorId = async (id_habitacion) => {
  const resultado = await pool.query(`
    SELECT h.*, 
      array_agg(i.ruta_imagen_habitacion) as imagenes,
      array_agg(i.id_imagen_habitacion) as id_imagenes
    FROM habitacion h
    LEFT JOIN imagen_habitacion i ON h.id_habitacion = i.id_habitacion
    WHERE h.id_habitacion = $1
    GROUP BY h.id_habitacion
  `, [id_habitacion])
  return resultado.rows[0]
}


const agregarImagenHabitacion = async (id_habitacion, ruta_imagen_habitacion) => {
  const resultado = await pool.query(
    `INSERT INTO imagen_habitacion (id_habitacion, ruta_imagen_habitacion)
     VALUES ($1, $2) RETURNING *`,
    [id_habitacion, ruta_imagen_habitacion]
  )
  return resultado.rows[0]
}

const eliminarImagenHabitacion = async (id_imagen_habitacion) => {
  const resultado = await pool.query(
    `DELETE FROM imagen_habitacion WHERE id_imagen_habitacion=$1 RETURNING *`,
    [id_imagen_habitacion]
  )
  return resultado.rows[0]
}

module.exports = { obtenerHabitacionesPorSede, 
  crearHabitacion, editarHabitacion, eliminarHabitacion, cambiarEstadoHabitacion, 
  obtenerHabitacionPorId, agregarImagenHabitacion, eliminarImagenHabitacion }