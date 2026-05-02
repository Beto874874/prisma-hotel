import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const obtenerSedes = async () => {
  const respuesta = await axios.get(`${API_URL}/sedes`)
  return respuesta.data
}

export const obtenerHabitacionesPorSede = async (id_sede) => {
  const respuesta = await axios.get(`${API_URL}/habitaciones/${id_sede}`)
  return respuesta.data
}

export const crearSede = async (sede, token) => {
  const respuesta = await axios.post(`${API_URL}/sedes`, sede, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const editarSede = async (id_sede, sede, token) => {
  const respuesta = await axios.put(`${API_URL}/sedes/${id_sede}`, sede, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const eliminarSede = async (id_sede, token) => {
  const respuesta = await axios.delete(`${API_URL}/sedes/${id_sede}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const obtenerSedePorId = async (id_sede) => {
  const respuesta = await axios.get(`${API_URL}/sedes/${id_sede}`)
  return respuesta.data
}

//Service de gestion de imagenes por parte del admin


export const agregarImagenSede = async (id_sede, imagen, token) => {
  const formData = new FormData()
  formData.append('imagen', imagen)
  const respuesta = await axios.post(`${API_URL}/sedes/${id_sede}/imagenes/sedes`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return respuesta.data
}

export const eliminarImagenSede = async (id_imagen_sede, token) => {
  const respuesta = await axios.delete(`${API_URL}/sedes/imagenes/${id_imagen_sede}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}