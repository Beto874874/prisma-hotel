const express = require('express')
const router = express.Router()
const { getSedes, postSede, putSede, deleteSede, getSedeById, postImagenSede, deleteImagenSede } = require('../controllers/sede-controller')
const verificarToken = require('../middlewares/verificarToken')
const { soloAdmin } = require('../middlewares/verificarRol')
const upload = require('../middlewares/upload')

router.get('/', getSedes)
router.post('/', verificarToken, soloAdmin, postSede)
router.put('/:id_sede', verificarToken, soloAdmin, putSede)
router.delete('/:id_sede', verificarToken, soloAdmin, deleteSede)
router.get('/:id_sede', getSedeById)
router.post('/:id_sede/imagenes/:tipo', verificarToken, soloAdmin, upload.single('imagen'), postImagenSede)
router.delete('/imagenes/:id_imagen_sede', verificarToken, soloAdmin, deleteImagenSede)

module.exports = router