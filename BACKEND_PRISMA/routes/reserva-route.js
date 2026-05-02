const express = require('express')
const router = express.Router()
const { 
  getTodasReservas, 
  patchCancelarReserva, 
  postReserva, 
  getMisReservas,
  patchCancelarReservaCliente,
  getFechasOcupadas,
  patchPagarReserva
} = require('../controllers/reserva-controller')
const verificarToken = require('../middlewares/verificarToken')
const { soloAdmin, soloCliente } = require('../middlewares/verificarRol')

router.get('/', verificarToken, soloAdmin, getTodasReservas)
router.get('/mis-reservas', verificarToken, soloCliente, getMisReservas)
router.post('/', verificarToken, soloCliente, postReserva)
router.patch('/:id_reserva/cancelar', verificarToken, soloAdmin, patchCancelarReserva)
router.patch('/:id_reserva/cancelar-cliente', verificarToken, soloCliente, patchCancelarReservaCliente)
router.get('/fechas-ocupadas/:id_habitacion', getFechasOcupadas)
router.patch('/:id_reserva/pagar', verificarToken, soloCliente, patchPagarReserva)


module.exports = router