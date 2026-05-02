import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerSedes, crearSede, editarSede, eliminarSede, agregarImagenSede, eliminarImagenSede } from '../services/sedeService'
import {
  Box, Typography, Container, Button, Card, CardContent,
  CardActions, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Tooltip
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Add, Edit, Delete, LocationOn, Phone, Home, AddPhotoAlternate, DeleteForever } from '@mui/icons-material'
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

const AdminSedesPage = () => {
  const { token } = useAuth()
  const [sedes, setSedes] = useState([])
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null)
  const [imagenFile, setImagenFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({ nombre: '', ciudad: '', telefono: '', direccion: '' })

  useEffect(() => {
    cargarSedes()
  }, [])

  const cargarSedes = async () => {
    try {
      const datos = await obtenerSedes()
      setSedes(datos)
    } catch (error) {
      console.error('Error al cargar sedes:', error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const abrirDialogCrear = () => {
    setModoEdicion(false)
    setSedeSeleccionada(null)
    setImagenFile(null)
    setPreview(null)
    setForm({ nombre: '', ciudad: '', telefono: '', direccion: '' })
    setDialogAbierto(true)
  }

  const abrirDialogEditar = (sede) => {
    setModoEdicion(true)
    setSedeSeleccionada(sede)
    setImagenFile(null)
    setPreview(null)
    setForm({ nombre: sede.nombre, ciudad: sede.ciudad, telefono: sede.telefono, direccion: sede.direccion })
    setDialogAbierto(true)
  }

  const cerrarDialog = () => {
    setDialogAbierto(false)
    setSedeSeleccionada(null)
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
      let id_sede_final

      if (modoEdicion) {
        await editarSede(sedeSeleccionada.id_sede, form, token)
        id_sede_final = sedeSeleccionada.id_sede
      } else {
        const nuevaSede = await crearSede(form, token)
        id_sede_final = nuevaSede.sede.id_sede
      }

      // Si hay imagen seleccionada la sube
      if (imagenFile) {
        await agregarImagenSede(id_sede_final, imagenFile, token)
      }

      cerrarDialog()
      cargarSedes()
    } catch (error) {
      console.error('Error al guardar sede:', error)
    }
  }

  const handleEliminar = async (id_sede) => {
    if (!window.confirm('¿Estás seguro de eliminar esta sede?')) return
    try {
      await eliminarSede(id_sede, token)
      cargarSedes()
    } catch (error) {
      console.error('Error al eliminar sede:', error)
    }
  }

  const handleSubirImagen = async (id_sede) => {
    if (!imagenFile) return
    try {
      await agregarImagenSede(id_sede, imagenFile, token)
      setImagenFile(null)
      setPreview(null)
      const datos = await obtenerSedes()
      setSedes(datos)
      const actualizada = datos.find(s => s.id_sede === id_sede)
      setSedeSeleccionada(actualizada)
    } catch (error) {
      console.error('Error al subir imagen:', error)
    }
  }

  const handleEliminarImagen = async (id_imagen_sede, id_sede) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) return
    try {
      await eliminarImagenSede(id_imagen_sede, token)
      const datos = await obtenerSedes()
      setSedes(datos)
      const actualizada = datos.find(s => s.id_sede === id_sede)
      setSedeSeleccionada(actualizada)
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
    }
  }

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box>
            <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
              Gestión de Sedes
            </Typography>
            <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
              Administra las sedes del hotel
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirDialogCrear}
            sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2 }}
          >
            Nueva sede
          </Button>
        </Box>

        <Grid container spacing={4}>
          {sedes.map((sede) => (
            <Grid size={{ xs: 12, md: 4 }} key={sede.id_sede}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                {sede.imagenes && sede.imagenes[0] !== null ? (
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    loop={true}
                    style={{ height: 200 }}
                  >
                    {sede.imagenes.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={getImageUrl(img)}
                          alt={sede.nombre}
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
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                    {sede.nombre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">{sede.ciudad}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">{sede.telefono}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Home sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">{sede.direccion}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => abrirDialogEditar(sede)}
                    sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleEliminar(sede.id_sede)}
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
          {modoEdicion ? 'Editar sede' : 'Nueva sede'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
          <TextField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} fullWidth />
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth />
          <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} fullWidth />

          {/* Gestión de imágenes */}
          <Box>
            <Typography variant="subtitle1" fontFamily="Lato" fontWeight={700} mb={1}>
              {modoEdicion ? 'Imágenes actuales' : 'Agregar imagen'}
            </Typography>

            {/* Miniaturas con eliminar - solo en edición */}
            {modoEdicion && sedeSeleccionada?.imagenes && sedeSeleccionada.imagenes[0] !== null && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {sedeSeleccionada.imagenes.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={getImageUrl(img)}
                      alt="sede"
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <Tooltip title="Eliminar imagen">
                      <IconButton
                        size="small"
                        onClick={() => handleEliminarImagen(sedeSeleccionada.id_imagenes?.[index], sedeSeleccionada.id_sede)}
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

            {/* Subir nueva imagen */}
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

            {/* Botón subir solo en edición - en creación se sube junto con guardar */}
            {modoEdicion && imagenFile && (
              <Button
                variant="contained"
                onClick={() => handleSubirImagen(sedeSeleccionada.id_sede)}
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
            {modoEdicion ? 'Guardar cambios' : 'Crear sede'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminSedesPage