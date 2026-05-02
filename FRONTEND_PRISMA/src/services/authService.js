import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

export const loginService = async (correo, contraseña) => {
  const respuesta = await axios.post(`${API_URL}/login`, { correo, contraseña })
  return respuesta.data
}

export const registroService = async (nombre, apellido, correo, contraseña, telefono, documento) => {
  const respuesta = await axios.post(`${API_URL}/registro`, { nombre, apellido, correo, contraseña, telefono, documento })
  return respuesta.data
}