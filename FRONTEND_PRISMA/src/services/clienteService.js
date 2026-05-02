import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const obtenerPerfil = async (token) => {
  const respuesta = await axios.get(`${API_URL}/clientes/perfil`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}

export const actualizarPerfil = async (datos, token) => {
  const respuesta = await axios.put(`${API_URL}/clientes/perfil`, datos, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return respuesta.data
}