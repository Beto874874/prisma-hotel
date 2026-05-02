const express = require('express')
const router = express.Router()
const { getPerfil, putPerfil } = require('../controllers/cliente-controller')
const verificarToken = require('../middlewares/verificarToken')
const { soloCliente } = require('../middlewares/verificarRol')

router.get('/perfil', verificarToken, soloCliente, getPerfil)
router.put('/perfil', verificarToken, soloCliente, putPerfil)
module.exports = router