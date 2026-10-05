import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerHabitacionesPorSede } from '../services/habitacionService'
import { obtenerSedePorId } from '../services/sedeService'
import { crearReserva } from '../services/reservaService'
import {
  Box, Typography, Container, Card, CardContent,
  CardActions, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Divider
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { AttachMoney, Person, CalendarMonth, LocationOn, Phone, Home, ArrowBack } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CalendarioReserva from '../components/CalendarioReserva'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const coordenadas = {
  'Cartagena': [10.3910, -75.4794],
  'Santa Marta': [11.2408, -74.1990],
  'San Andrés': [12.5847, -81.7006]
}

const getImageUrl = (ruta) => {
  if (!ruta) return null
  if (ruta.startsWith('uploads/')) return `http://localhost:5000/${ruta}`
  return `/${ruta}`
}

const SedeHabitacionesPage = () => {
  const { id_sede } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [sede, setSede] = useState(null)
  const [habitaciones, setHabitaciones] = useState([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null)
  const [form, setForm] = useState({ fecha_inicio: '', fecha_fin: '', cantidad_personas: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      const datosSede = await obtenerSedePorId(id_sede)
      const datosHabitaciones = await obtenerHabitacionesPorSede(id_sede)
      setSede(datosSede)
      setHabitaciones(datosHabitaciones)
    }
    cargar()
  }, [id_sede])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "cantidad_personas") {
      if (value === '') {
        setForm({ ...form, [name]: '' })
        return
      }

      const numero = Number(value)

      if (numero < 0) {
        setForm({ ...form, [name]: 0 })
        return
      }


      if (habitacionSeleccionada && numero > habitacionSeleccionada.capacidad_personas) {
        setForm({ ...form, [name]: habitacionSeleccionada.capacidad_personas })
        return
      }
    }

    setForm({ ...form, [name]: value })
  }

  const abrirDialog = (habitacion) => {
    setHabitacionSeleccionada(habitacion)
    setForm({ fecha_inicio: '', fecha_fin: '', cantidad_personas: '' })
    setError(null)
    setDialogAbierto(true)
  }

  const handleRangoSeleccionado = (rango) => {
    setForm({
      ...form,
      fecha_inicio: rango.from.toISOString().split('T')[0],
      fecha_fin: rango.to.toISOString().split('T')[0]
    })
  }

  const calcularNoches = () => {
    if (!form.fecha_inicio || !form.fecha_fin) return 0
    const inicio = new Date(form.fecha_inicio)
    const fin = new Date(form.fecha_fin)
    return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
  }

  const calcularTotal = () => {
    return calcularNoches() * Number(habitacionSeleccionada?.precio_noche || 0)
  }

  const handleReservar = async () => {
    setError(null)
    const noches = calcularNoches()
    if (noches <= 0) return setError('Las fechas no son válidas')
    if (Number(form.cantidad_personas) > habitacionSeleccionada.capacidad_personas) {
      return setError(`La capacidad máxima es ${habitacionSeleccionada.capacidad_personas} personas`)
    }
    try {
      await crearReserva({
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        cantidad_personas: form.cantidad_personas,
        id_habitacion: habitacionSeleccionada.id_habitacion
      }, token)
      setDialogAbierto(false)
      navigate('/mis-reservas')
    } catch (error) {
      setError('La habitación no está disponible en esas fechas')
    }
  }

  const colorEstado = (estado) => {
    if (estado === 'Disponible') return 'success'
    if (estado === 'Ocupada') return 'error'
    return 'warning'
  }

  if (!sede) return null

  const coords = coordenadas[sede.ciudad] || [4.711, -74.0721]

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          sx={{ fontFamily: 'Raleway', mb: 3 }}
        >
          Volver a sedes
        </Button>

        {/* Info de la sede */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 8, overflow: 'hidden' }}>
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                loop={true}
                style={{ height: '100%', width: '100%', minHeight: 420 }}
              >
                {sede.imagenes.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={getImageUrl(img)}
                      alt={sede.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" fontFamily="Lato" fontWeight={700} mb={2}>
                  {sede.nombre}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LocationOn sx={{ color: '#2890BD' }} />
                  <Box>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Ciudad</Typography>
                    <Typography variant="body1" fontFamily="Raleway">{sede.ciudad}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Home sx={{ color: '#2890BD' }} />
                  <Box>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Dirección</Typography>
                    <Typography variant="body1" fontFamily="Raleway">{sede.direccion}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Phone sx={{ color: '#2890BD' }} />
                  <Box>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Teléfono</Typography>
                    <Typography variant="body1" fontFamily="Raleway">{sede.telefono}</Typography>
                  </Box>
                </Box>

                {/* Mapa */}
                <Box sx={{ borderRadius: 2, overflow: 'hidden', flex: 1, minHeight: 200 }}>
                  <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%', minHeight: 200 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={coords}>
                      <Popup>{sede.nombre}</Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Habitaciones */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontFamily="Lato" fontWeight={700} mb={1}>
            Habitaciones disponibles
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Selecciona una habitación para ver el detalle o hacer tu reserva
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {habitaciones.map((hab) => (
            <Grid size={{ xs: 12, md: 4 }} key={hab.id_habitacion}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
              }}>
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 3000 }}
                  pagination={{ clickable: true }}
                  loop={true}
                  style={{ height: 200 }}
                >
                  {hab.imagenes.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={getImageUrl(img)}
                        alt={hab.tipo}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                      Hab. {hab.numero} — {hab.tipo}
                    </Typography>
                    <Chip
                      label={hab.estado}
                      color={colorEstado(hab.estado)}
                      size="small"
                      sx={{ fontFamily: 'Raleway' }}
                    />
                  </Box>
                  <Typography variant="body2" fontFamily="Raleway" color="text.secondary" mb={1}>
                    {hab.descripcion}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <AttachMoney sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                      ${Number(hab.precio_noche).toLocaleString()} / noche
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Person sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                      Capacidad: {hab.capacidad_personas} personas
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/habitacion/${hab.id_habitacion}`)}
                    sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2 }}
                  >
                    Ver detalle
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={hab.estado !== 'Disponible'}
                    onClick={() => abrirDialog(hab)}
                    sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2 }}
                  >
                    {hab.estado === 'Disponible' ? 'Reservar' : 'No disponible'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Dialog reserva */}
      <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontFamily="Lato" fontWeight={700} sx={{ pb: 0 }}>
          Reservar — Hab. {habitacionSeleccionada?.numero} ({habitacionSeleccionada?.tipo})
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, pt: '24px !important' }}>
          {error && <Typography color="error" variant="body2">{error}</Typography>}

          {habitacionSeleccionada && (
            <CalendarioReserva
              id_habitacion={habitacionSeleccionada.id_habitacion}
              onRangoSeleccionado={handleRangoSeleccionado}
            />
          )}

          <TextField
            label="Cantidad de personas"
            name="cantidad_personas"
            type="number"
            value={form.cantidad_personas}
            onChange={handleChange}
            fullWidth
          />

          {calcularNoches() > 0 && (
            <Box sx={{ backgroundColor: '#D1F3FF', borderRadius: 2, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ color: '#2890BD' }} />
                <Typography variant="body2" fontFamily="Raleway">
                  {calcularNoches()} noches — {new Date(form.fecha_inicio).toLocaleDateString('es-CO')} → {new Date(form.fecha_fin).toLocaleDateString('es-CO')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <AttachMoney sx={{ color: '#2890BD' }} />
                <Typography variant="body1" fontFamily="Raleway" fontWeight={700}>
                  Total: ${calcularTotal().toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleReservar}
            disabled={!form.fecha_inicio || !form.fecha_fin || !form.cantidad_personas}
            sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
          >
            Confirmar reserva
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}

export default SedeHabitacionesPage