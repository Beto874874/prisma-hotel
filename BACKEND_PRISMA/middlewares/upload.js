const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const carpeta = req.params.tipo === 'sedes' ? 'uploads/sedes' : 'uploads/habitaciones'
    cb(null, carpeta)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname)
    const nombre = `${Date.now()}${extension}`
    cb(null, nombre)
  }
})

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'), false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = upload