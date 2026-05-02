import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const obtenerTodasReservas = async (token) => {
  const respuesta = await axios.get(`${API_URL}/reservas`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const cancelarReserva = async (id_reserva, token) => {
  const respuesta = await axios.patch(`${API_URL}/reservas/${id_reserva}/cancelar`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const crearReserva = async (reserva, token) => {
  const respuesta = await axios.post(`${API_URL}/reservas`, reserva, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const obtenerMisReservas = async (token) => {
  const respuesta = await axios.get(`${API_URL}/reservas/mis-reservas`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const cancelarReservaCliente = async (id_reserva, token) => {
  const respuesta = await axios.patch(`${API_URL}/reservas/${id_reserva}/cancelar-cliente`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const obtenerFechasOcupadas = async (id_habitacion) => {
  const respuesta = await axios.get(`${API_URL}/reservas/fechas-ocupadas/${id_habitacion}`)
  return respuesta.data
}

export const pagarReserva = async (id_reserva, token) => {
  const respuesta = await axios.patch(`${API_URL}/reservas/${id_reserva}/pagar`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}