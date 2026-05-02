const { obtenerSedes, crearSede, editarSede, eliminarSede, obtenerSedePorId, agregarImagenSede, eliminarImagenSede } = require('../models/sede-model')
const fs = require('fs')
const path = require('path')


const getSedes = async (req, res) => {
  try {
    const sedes = await obtenerSedes()
    res.json(sedes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sedes', error: error.message })
  }
}

const postSede = async (req, res) => {
  const { nombre, ciudad, telefono, direccion } = req.body
  try {
    const sede = await crearSede(nombre, ciudad, telefono, direccion)
    res.status(201).json({ mensaje: 'Sede creada exitosamente', sede })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear sede', error: error.message })
  }
}

const putSede = async (req, res) => {
  const { id_sede } = req.params
  const { nombre, ciudad, telefono, direccion } = req.body
  try {
    const sede = await editarSede(id_sede, nombre, ciudad, telefono, direccion)
    res.json({ mensaje: 'Sede actualizada exitosamente', sede })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar sede', error: error.message })
  }
}

const deleteSede = async (req, res) => {
  const { id_sede } = req.params
  try {
    await eliminarSede(id_sede)
    res.json({ mensaje: 'Sede eliminada exitosamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar sede', error: error.message })
  }
}

const getSedeById = async (req, res) => {
  const { id_sede } = req.params
  try {
    const sede = await obtenerSedePorId(id_sede)
    if (!sede) return res.status(404).json({ mensaje: 'Sede no encontrada' })
    res.json(sede)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sede', error: error.message })
  }
}


//Controlador de la administracion de imagenes por parte del admin

const postImagenSede = async (req, res) => {
  const { id_sede } = req.params
  try {
    if (!req.file) return res.status(400).json({ mensaje: 'No se envió ninguna imagen' })
    const ruta = `uploads/sedes/${req.file.filename}`
    const imagen = await agregarImagenSede(id_sede, ruta)
    res.status(201).json({ mensaje: 'Imagen agregada exitosamente', imagen })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar imagen', error: error.message })
  }
}

const deleteImagenSede = async (req, res) => {
  const { id_imagen_sede } = req.params
  try {
    const imagen = await eliminarImagenSede(id_imagen_sede)
    // Eliminar el archivo físico del servidor
    const rutaArchivo = path.join(__dirname, '..', imagen.ruta_imagen_sede)
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo)
    res.json({ mensaje: 'Imagen eliminada exitosamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar imagen', error: error.message })
  }
}

module.exports = { getSedes, getSedeById, postSede, putSede, deleteSede, postImagenSede, deleteImagenSede }



