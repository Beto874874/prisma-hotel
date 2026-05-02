const { 
  obtenerHabitacionesPorSede, 
  crearHabitacion, 
  editarHabitacion, 
  eliminarHabitacion,
  cambiarEstadoHabitacion,
  obtenerHabitacionPorId,
  agregarImagenHabitacion,
  eliminarImagenHabitacion
} = require('../models/habitacion-model')


const fs = require('fs')
const path = require('path')

const getHabitacionesPorSede = async (req, res) => {
  try {
    const { id_sede } = req.params
    const habitaciones = await obtenerHabitacionesPorSede(id_sede)
    res.json(habitaciones)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener habitaciones', error: error.message })
  }
}

const postHabitacion = async (req, res) => {
  const { numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_sede } = req.body
  try {
    const habitacion = await crearHabitacion(numero, tipo, estado, descripcion, precio_noche, capacidad_personas, id_sede)
    res.status(201).json({ mensaje: 'Habitación creada exitosamente', habitacion })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear habitación', error: error.message })
  }
}

const putHabitacion = async (req, res) => {
  const { id_habitacion } = req.params
  const { numero, tipo, estado, descripcion, precio_noche, capacidad_personas } = req.body
  try {
    const habitacion = await editarHabitacion(id_habitacion, numero, tipo, estado, descripcion, precio_noche, capacidad_personas)
    res.json({ mensaje: 'Habitación actualizada exitosamente', habitacion })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar habitación', error: error.message })
  }
}

const deleteHabitacion = async (req, res) => {
  const { id_habitacion } = req.params
  try {
    await eliminarHabitacion(id_habitacion)
    res.json({ mensaje: 'Habitación eliminada exitosamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar habitación', error: error.message })
  }
}

const patchEstadoHabitacion = async (req, res) => {
  const { id_habitacion } = req.params
  const { estado } = req.body
  try {
    const habitacion = await cambiarEstadoHabitacion(id_habitacion, estado)
    res.json({ mensaje: 'Estado actualizado exitosamente', habitacion })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado', error: error.message })
  }
}


const getHabitacionPorId = async (req, res) => {
  const { id_habitacion } = req.params
  try {
    const habitacion = await obtenerHabitacionPorId(id_habitacion)
    if (!habitacion) return res.status(404).json({ mensaje: 'Habitación no encontrada' })
    res.json(habitacion)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener habitación', error: error.message })
  }
}


const postImagenHabitacion = async (req, res) => {
  const { id_habitacion } = req.params
  try {
    if (!req.file) return res.status(400).json({ mensaje: 'No se envió ninguna imagen' })
    const ruta = `uploads/habitaciones/${req.file.filename}`
    const imagen = await agregarImagenHabitacion(id_habitacion, ruta)
    res.status(201).json({ mensaje: 'Imagen agregada exitosamente', imagen })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar imagen', error: error.message })
  }
}

const deleteImagenHabitacion = async (req, res) => {
  const { id_imagen_habitacion } = req.params
  try {
    const imagen = await eliminarImagenHabitacion(id_imagen_habitacion)
    const rutaArchivo = path.join(__dirname, '..', imagen.ruta_imagen_habitacion)
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo)
    res.json({ mensaje: 'Imagen eliminada exitosamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar imagen', error: error.message })
  }
}


module.exports = { getHabitacionesPorSede, postHabitacion, putHabitacion,deleteHabitacion, patchEstadoHabitacion, 
  getHabitacionPorId, postImagenHabitacion, deleteImagenHabitacion}