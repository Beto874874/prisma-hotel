const express = require('express')
const cors = require('cors')
require('dotenv').config()
const sedeRoutes = require('./routes/sede-route')
const habitacionRoutes = require('./routes/habitacion-route')
const reservaRoutes= require('./routes/reserva-route')
const clienteRoutes = require('./routes/cliente-route')
const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth-route')
app.use('/api/auth', authRoutes)

app.use('/api/sedes', sedeRoutes)
app.use('/api/habitaciones', habitacionRoutes)
app.use('/api/reservas', reservaRoutes)
app.use('/api/clientes', clienteRoutes)

//Ruta de imágenes subidas por el admin
app.use('/uploads', express.static('uploads'))
// Arrancar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})