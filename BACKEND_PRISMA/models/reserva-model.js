const pool = require('../database/conexion')

const obtenerTodasReservas = async () => {
  const resultado = await pool.query(`
    SELECT r.*, 
      c.nombre AS nombre_cliente, 
      c.apellido AS apellido_cliente,
      c.correo AS correo_cliente,
      c.telefono AS telefono_cliente,
      c.documento AS documento_cliente,
      h.numero AS numero_habitacion,
      h.tipo AS tipo_habitacion,
      h.precio_noche AS precio_noche_habitacion,
      s.nombre AS nombre_sede,
      s.ciudad AS ciudad_sede
    FROM reserva r
    JOIN cliente c ON r.id_cliente = c.id_cliente
    JOIN habitacion h ON r.id_habitacion = h.id_habitacion
    JOIN sede s ON h.id_sede = s.id_sede
    ORDER BY r.fecha_reserva DESC
  `)
  return resultado.rows
}

const cancelarReserva = async (id_reserva) => {
  const resultado = await pool.query(
    `UPDATE reserva SET estado='Cancelada' WHERE id_reserva=$1 RETURNING *`,
    [id_reserva]
  )
  return resultado.rows[0]
}



const crearReserva = async (fecha_inicio, fecha_fin, fecha_reserva, total_noches, precio_total, estado, cantidad_personas, id_habitacion, id_cliente) => {
  const resultado = await pool.query(
    `INSERT INTO reserva (fecha_inicio, fecha_fin, fecha_reserva, total_noches, precio_total, estado, cantidad_personas, id_habitacion, id_cliente)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [fecha_inicio, fecha_fin, fecha_reserva, total_noches, precio_total, estado, cantidad_personas, id_habitacion, id_cliente]
  )
  return resultado.rows[0]
}

const obtenerReservasPorCliente = async (id_cliente) => {
  const resultado = await pool.query(`
    SELECT r.*,
      h.numero AS numero_habitacion,
      h.tipo AS tipo_habitacion,
      s.nombre AS nombre_sede,
      s.ciudad AS ciudad_sede
    FROM reserva r
    JOIN habitacion h ON r.id_habitacion = h.id_habitacion
    JOIN sede s ON h.id_sede = s.id_sede
    WHERE r.id_cliente = $1
    ORDER BY r.fecha_reserva DESC
  `, [id_cliente])
  return resultado.rows
}
const verificarDisponibilidad = async (id_habitacion, fecha_inicio, fecha_fin) => {
  const resultado = await pool.query(`
    SELECT * FROM reserva
    WHERE id_habitacion = $1
    AND estado = 'Activa'
    AND (
      (fecha_inicio <= $2 AND fecha_fin >= $2) OR
      (fecha_inicio <= $3 AND fecha_fin >= $3) OR
      (fecha_inicio >= $2 AND fecha_fin <= $3)
    )
  `, [id_habitacion, fecha_inicio, fecha_fin])
  return resultado.rows.length > 0
}

const obtenerFechasOcupadas = async (id_habitacion) => {
  const resultado = await pool.query(`
    SELECT fecha_inicio, fecha_fin 
    FROM reserva 
    WHERE id_habitacion = $1 
    AND estado = 'Activa'
  `, [id_habitacion])
  return resultado.rows
}

const actualizarEstadoPago = async (id_reserva, estado_pago) => {
  const resultado = await pool.query(
    `UPDATE reserva SET estado_pago=$1 WHERE id_reserva=$2 RETURNING *`,
    [estado_pago, id_reserva]
  )
  return resultado.rows[0]
}

module.exports = { obtenerTodasReservas, cancelarReserva, crearReserva, obtenerReservasPorCliente, verificarDisponibilidad, obtenerFechasOcupadas, actualizarEstadoPago }