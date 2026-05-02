import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const obtenerHabitacionesPorSede = async (id_sede) => {
  const respuesta = await axios.get(`${API_URL}/habitaciones/${id_sede}`)
  return respuesta.data
}

export const crearHabitacion = async (habitacion, token) => {
  const respuesta = await axios.post(`${API_URL}/habitaciones`, habitacion, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const editarHabitacion = async (id_habitacion, habitacion, token) => {
  const respuesta = await axios.put(`${API_URL}/habitaciones/${id_habitacion}`, habitacion, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const eliminarHabitacion = async (id_habitacion, token) => {
  const respuesta = await axios.delete(`${API_URL}/habitaciones/${id_habitacion}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const cambiarEstadoHabitacion = async (id_habitacion, estado, token) => {
  const respuesta = await axios.patch(`${API_URL}/habitaciones/${id_habitacion}/estado`, { estado }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const obtenerHabitacionPorId = async (id_habitacion) => {
  const respuesta = await axios.get(`${API_URL}/habitaciones/detalle/${id_habitacion}`)
  return respuesta.data
}


export const agregarImagenHabitacion = async (id_habitacion, imagen, token) => {
  const formData = new FormData()
  formData.append('imagen', imagen)
  const respuesta = await axios.post(`${API_URL}/habitaciones/${id_habitacion}/imagenes/habitaciones`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return respuesta.data
}

export const eliminarImagenHabitacion = async (id_imagen_habitacion, token) => {
  const respuesta = await axios.delete(`${API_URL}/habitaciones/imagenes/${id_imagen_habitacion}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}