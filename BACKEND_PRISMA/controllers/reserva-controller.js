
const pool = require('../database/conexion')
const { obtenerTodasReservas, cancelarReserva, crearReserva, obtenerReservasPorCliente, verificarDisponibilidad, obtenerFechasOcupadas, actualizarEstadoPago } = require('../models/reserva-model')

const getTodasReservas = async (req, res) => {
  try {
    const reservas = await obtenerTodasReservas()
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reservas', error: error.message })
  }
}

const patchCancelarReserva = async (req, res) => {
  const { id_reserva } = req.params
  try {
    const reserva = await cancelarReserva(id_reserva)
    res.json({ mensaje: 'Reserva cancelada exitosamente', reserva })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar reserva', error: error.message })
  }
}



const postReserva = async (req, res) => {
  const { fecha_inicio, fecha_fin, cantidad_personas, id_habitacion } = req.body
  const id_cliente = req.usuario.id

  try {
    const inicio = new Date(fecha_inicio)
    const fin = new Date(fecha_fin)
    const total_noches = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))

    // Verificar disponibilidad
    const ocupada = await verificarDisponibilidad(id_habitacion, fecha_inicio, fecha_fin)
    if (ocupada) {
      return res.status(400).json({ mensaje: 'La habitación no está disponible en esas fechas' })
    }

    // Obtener precio por noche de la habitación
    const habitacion = await pool.query(
      'SELECT precio_noche FROM habitacion WHERE id_habitacion = $1',
      [id_habitacion]
    )
    const precio_total = total_noches * habitacion.rows[0].precio_noche
    const fecha_reserva = new Date().toISOString().split('T')[0]

    const reserva = await crearReserva(
      fecha_inicio, fecha_fin, fecha_reserva,
      total_noches, precio_total, 'Activa',
      cantidad_personas, id_habitacion, id_cliente
    )
    res.status(201).json({ mensaje: 'Reserva creada exitosamente', reserva })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear reserva', error: error.message })
  }
}

const getMisReservas = async (req, res) => {
  const id_cliente = req.usuario.id
  try {
    const reservas = await obtenerReservasPorCliente(id_cliente)
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reservas', error: error.message })
  }
}

const patchCancelarReservaCliente = async (req, res) => {
  const { id_reserva } = req.params
  try {
    const reserva = await cancelarReserva(id_reserva)
    res.json({ mensaje: 'Reserva cancelada exitosamente', reserva })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar reserva', error: error.message })
  }
}

const getFechasOcupadas = async (req, res) => {
  const { id_habitacion } = req.params
  try {
    const fechas = await obtenerFechasOcupadas(id_habitacion)
    res.json(fechas)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener fechas ocupadas', error: error.message })
  }
}


const patchPagarReserva = async (req, res) => {
  const { id_reserva } = req.params
  try {
    const reserva = await actualizarEstadoPago(id_reserva, 'Pagado')
    res.json({ mensaje: 'Pago realizado exitosamente', reserva })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar pago', error: error.message })
  }
}

module.exports = { getTodasReservas, patchCancelarReserva, postReserva, getMisReservas, patchCancelarReservaCliente, getFechasOcupadas, patchPagarReserva }