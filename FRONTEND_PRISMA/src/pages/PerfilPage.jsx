import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerPerfil, actualizarPerfil } from '../services/clienteService'
import {
  Box, Typography, Container, Card, CardContent,
  Divider, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import { Person, Email, Phone, Badge, Edit, CheckCircle } from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PerfilPage = () => {
  const { token } = useAuth()
  const [cliente, setCliente] = useState(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', documento: '' })
  const [exito, setExito] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerPerfil(token)
        setCliente(datos)
      } catch (error) {
        console.error('Error al cargar perfil:', error)
      }
    }
    cargar()
  }, [])

  const abrirDialog = () => {
    setForm({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      documento: cliente.documento
    })
    setExito(false)
    setDialogAbierto(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGuardar = async () => {
    try {
      const datos = await actualizarPerfil(form, token)
      setCliente(datos.cliente)
      setExito(true)
      setTimeout(() => setDialogAbierto(false), 1000)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
    }
  }

  if (!cliente) return null

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 8, flex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 90, height: 90, borderRadius: '50%',
            backgroundColor: '#2890BD', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2
          }}>
            <Person sx={{ fontSize: 50, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
            {cliente.nombre} {cliente.apellido}
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Cliente Prisma Hotel
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                Información personal
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={abrirDialog}
                sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
              >
                Editar
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Email sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                  Correo
                </Typography>
                <Typography variant="body1" fontFamily="Raleway">
                  {cliente.correo}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Person sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                  Nombre completo
                </Typography>
                <Typography variant="body1" fontFamily="Raleway">
                  {cliente.nombre} {cliente.apellido}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Phone sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                  Teléfono
                </Typography>
                <Typography variant="body1" fontFamily="Raleway">
                  {cliente.telefono}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                  Documento
                </Typography>
                <Typography variant="body1" fontFamily="Raleway">
                  {cliente.documento}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog editar */}
      <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontFamily="Lato" fontWeight={700} sx={{ pb: 0 }}>
            Editar perfil
          </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, pt: '24px !important' }}>
          {exito && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography color="success.main" variant="body2" fontFamily="Raleway">
                Perfil actualizado exitosamente
              </Typography>
            </Box>
          )}
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
          <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} fullWidth />
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth />
          <TextField label="Documento" name="documento" value={form.documento} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogAbierto(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleGuardar}
            sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}

export default PerfilPage