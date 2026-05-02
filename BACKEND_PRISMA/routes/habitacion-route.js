const express = require('express')
const router = express.Router()
const { 
  getHabitacionesPorSede, 
  postHabitacion, 
  putHabitacion, 
  deleteHabitacion,
  patchEstadoHabitacion,
  getHabitacionPorId,
  postImagenHabitacion,
  deleteImagenHabitacion
} = require('../controllers/habitacion-controller')
const verificarToken = require('../middlewares/verificarToken')
const { soloAdmin } = require('../middlewares/verificarRol')
const upload = require('../middlewares/upload')


router.get('/:id_sede', getHabitacionesPorSede)
router.post('/', verificarToken, soloAdmin, postHabitacion)
router.put('/:id_habitacion', verificarToken, soloAdmin, putHabitacion)
router.delete('/:id_habitacion', verificarToken, soloAdmin, deleteHabitacion)
router.patch('/:id_habitacion/estado', verificarToken, soloAdmin, patchEstadoHabitacion)
router.get('/detalle/:id_habitacion', getHabitacionPorId)
router.post('/:id_habitacion/imagenes/:tipo', verificarToken, soloAdmin, upload.single('imagen'), postImagenHabitacion)
router.delete('/imagenes/:id_imagen_habitacion', verificarToken, soloAdmin, deleteImagenHabitacion)

module.exports = router