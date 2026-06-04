import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerHabitacionesPorSede, crearHabitacion, editarHabitacion, eliminarHabitacion, cambiarEstadoHabitacion, agregarImagenHabitacion, eliminarImagenHabitacion } from '../services/habitacionService'
import { obtenerSedes } from '../services/sedeService'
import {
  Box, Typography, Container, Button, Card, CardContent,
  CardActions, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel, Chip,
  IconButton, Tooltip
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Add, Edit, Delete, LocationOn, Person, AttachMoney, AddPhotoAlternate, DeleteForever } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Navbar from '../components/Navbar'

const getImageUrl = (ruta) => {
  if (!ruta) return null
  if (ruta.startsWith('uploads/')) return `http://localhost:5000/${ruta}`
  return `/${ruta}`
}

const AdminHabitacionesPage = () => {
  const { token } = useAuth()
  const [sedes, setSedes] = useState([])
  const [habitaciones, setHabitaciones] = useState([])
  const [sedeSeleccionada, setSedeSeleccionada] = useState('')
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    numero: '', tipo: '', estado: 'Disponible',
    descripcion: '', precio_noche: '', capacidad_personas: '', id_sede: ''
  })

  useEffect(() => {
    const cargarSedes = async () => {
      const datos = await obtenerSedes()
      setSedes(datos)
      if (datos.length > 0) setSedeSeleccionada(datos[0].id_sede)
    }
    cargarSedes()
  }, [])

  useEffect(() => {
    if (sedeSeleccionada) cargarHabitaciones()
  }, [sedeSeleccionada])

  const cargarHabitaciones = async () => {
    try {
      const datos = await obtenerHabitacionesPorSede(sedeSeleccionada)
      setHabitaciones(datos)
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target


    const camposNumericos = ["capacidad_personas", "precio_noche", "numero"]

    if (camposNumericos.includes(name)) {
      if (value === '') {
        setForm({ ...form, [name]: '' })
        return
      }

      const numero = Number(value)

      if (numero < 0) {
        setForm({ ...form, [name]: 0 }) 
        return
      }
    }

    setForm({ ...form, [name]: value })
  }

  const abrirDialogCrear = () => {
    setModoEdicion(false)
    setHabitacionSeleccionada(null)
    setImagenFile(null)
    setPreview(null)
    setForm({
      numero: '', tipo: '', estado: 'Disponible',
      descripcion: '', precio_noche: '', capacidad_personas: '', id_sede: sedeSeleccionada
    })
    setDialogAbierto(true)
  }

  const abrirDialogEditar = (habitacion) => {
    setModoEdicion(true)
    setHabitacionSeleccionada(habitacion)
    setImagenFile(null)
    setPreview(null)
    setForm({
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      estado: habitacion.estado,
      descripcion: habitacion.descripcion,
      precio_noche: habitacion.precio_noche,
      capacidad_personas: habitacion.capacidad_personas,
      id_sede: habitacion.id_sede
    })
    setDialogAbierto(true)
  }

  const cerrarDialog = () => {
    setDialogAbierto(false)
    setHabitacionSeleccionada(null)
    setImagenFile(null)
    setPreview(null)
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleGuardar = async () => {
    try {
      let id_habitacion_final
      if (modoEdicion) {
        await editarHabitacion(habitacionSeleccionada.id_habitacion, form, token)
        id_habitacion_final = habitacionSeleccionada.id_habitacion
      } else {
        const nueva = await crearHabitacion(form, token)
        id_habitacion_final = nueva.habitacion.id_habitacion
      }
      if (imagenFile) {
        await agregarImagenHabitacion(id_habitacion_final, imagenFile, token)
      }
      cerrarDialog()
      cargarHabitaciones()
    } catch (error) {
      console.error('Error al guardar habitación:', error)
    }
  }

  const handleEliminar = async (id_habitacion) => {
    if (!window.confirm('¿Estás seguro de eliminar esta habitación?')) return
    try {
      await eliminarHabitacion(id_habitacion, token)
      cargarHabitaciones()
    } catch (error) {
      console.error('Error al eliminar habitación:', error)
    }
  }

  const handleCambiarEstado = async (id_habitacion, estadoActual) => {
    const estados = ['Disponible', 'Ocupada', 'Mantenimiento']
    const siguiente = estados[(estados.indexOf(estadoActual) + 1) % estados.length]
    try {
      await cambiarEstadoHabitacion(id_habitacion, siguiente, token)
      cargarHabitaciones()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
    }
  }

  const handleSubirImagen = async (id_habitacion) => {
    if (!imagenFile) return
    try {
      await agregarImagenHabitacion(id_habitacion, imagenFile, token)
      setImagenFile(null)
      setPreview(null)
      const datos = await obtenerHabitacionesPorSede(sedeSeleccionada)
      setHabitaciones(datos)
      const actualizada = datos.find(h => h.id_habitacion === id_habitacion)
      setHabitacionSeleccionada(actualizada)
    } catch (error) {
      console.error('Error al subir imagen:', error)
    }
  }

  const handleEliminarImagen = async (id_imagen_habitacion, id_habitacion) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return
    try {
      await eliminarImagenHabitacion(id_imagen_habitacion, token)
      const datos = await obtenerHabitacionesPorSede(sedeSeleccionada)
      setHabitaciones(datos)
      const actualizada = datos.find(h => h.id_habitacion === id_habitacion)
      setHabitacionSeleccionada(actualizada)
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
    }
  }

  const colorEstado = (estado) => {
    if (estado === 'Disponible') return 'success'
    if (estado === 'Ocupada') return 'error'
    return 'warning'
  }

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
              Gestión de Habitaciones
            </Typography>
            <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
              Administra las habitaciones del hotel
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirDialogCrear}
            sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2 }}
          >
            Nueva habitación
          </Button>
        </Box>

        {/* Selector de sede */}
        <FormControl sx={{ mb: 4, minWidth: 250 }}>
          <InputLabel>Sede</InputLabel>
          <Select
            value={sedeSeleccionada}
            label="Sede"
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            {sedes.map((sede) => (
              <MenuItem key={sede.id_sede} value={sede.id_sede}>{sede.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {habitaciones.map((hab) => (
            <Grid size={{ xs: 12, md: 4 }} key={hab.id_habitacion}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                {hab.imagenes && hab.imagenes[0] !== null ? (
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
                ) : (
                  <Box sx={{ height: 200, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">Sin imágenes</Typography>
                  </Box>
                )}

                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                      Hab. {hab.numero}
                    </Typography>
                    <Chip
                      label={hab.estado}
                      color={colorEstado(hab.estado)}
                      size="small"
                      onClick={() => handleCambiarEstado(hab.id_habitacion, hab.estado)}
                      sx={{ cursor: 'pointer', fontFamily: 'Raleway' }}
                    />
                  </Box>
                  <Typography variant="body2" fontFamily="Raleway" color="text.secondary" mb={1}>
                    {hab.tipo}
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
                    startIcon={<Edit />}
                    onClick={() => abrirDialogEditar(hab)}
                    sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleEliminar(hab.id_habitacion)}
                    sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Dialog crear/editar */}
      <Dialog open={dialogAbierto} onClose={cerrarDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontFamily="Lato" fontWeight={700}>
          {modoEdicion ? 'Editar habitación' : 'Nueva habitación'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Número" name="numero" type="number" value={form.numero} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select name="tipo" value={form.tipo} label="Tipo" onChange={handleChange}>
              <MenuItem value="Básica">Básica</MenuItem>
              <MenuItem value="Estándar">Estándar</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select name="estado" value={form.estado} label="Estado" onChange={handleChange}>
              <MenuItem value="Disponible">Disponible</MenuItem>
              <MenuItem value="Ocupada">Ocupada</MenuItem>
              <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} fullWidth multiline rows={2} />
          <TextField label="Precio por noche" name="precio_noche" type="number" value={form.precio_noche} onChange={handleChange} fullWidth />
          <TextField label="Capacidad personas" name="capacidad_personas" type="number" value={form.capacidad_personas} onChange={handleChange} fullWidth />

          {/* Gestión de imágenes */}
          <Box>
            <Typography variant="subtitle1" fontFamily="Lato" fontWeight={700} mb={1}>
              {modoEdicion ? 'Imágenes actuales' : 'Agregar imagen'}
            </Typography>

            {modoEdicion && habitacionSeleccionada?.imagenes && habitacionSeleccionada.imagenes[0] !== null && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {habitacionSeleccionada.imagenes.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={getImageUrl(img)}
                      alt="habitacion"
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Tooltip title="Eliminar imagen">
                      <IconButton
                        size="small"
                        onClick={() => handleEliminarImagen(habitacionSeleccionada.id_imagenes?.[index], habitacionSeleccionada.id_habitacion)}
                        sx={{
                          position: 'absolute', top: -8, right: -8,
                          backgroundColor: 'error.main', color: 'white',
                          width: 22, height: 22,
                          '&:hover': { backgroundColor: 'error.dark' }
                        }}
                      >
                        <DeleteForever sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
              sx={{ fontFamily: 'Raleway', borderRadius: 2, mb: 1 }}
            >
              Seleccionar imagen
              <input type="file" accept="image/*" hidden onChange={handleImagenChange} />
            </Button>

            {preview && (
              <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden' }}>
                <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }} />
              </Box>
            )}

            {modoEdicion && imagenFile && (
              <Button
                variant="contained"
                onClick={() => handleSubirImagen(habitacionSeleccionada.id_habitacion)}
                sx={{ fontFamily: 'Raleway', borderRadius: 2, mt: 1 }}
              >
                Subir imagen
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={cerrarDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardar} sx={{ fontFamily: 'Raleway', borderRadius: 2 }}>
            {modoEdicion ? 'Guardar cambios' : 'Crear habitación'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminHabitacionesPage