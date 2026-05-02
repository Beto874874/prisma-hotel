import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Hotel, MeetingRoom, EventNote } from '@mui/icons-material'
import Navbar from '../components/Navbar'

const AdminPage = () => {
  const navigate = useNavigate()

  const opciones = [
    {
      titulo: 'Gestión de Sedes',
      descripcion: 'Administra las sedes del hotel, visualiza y edita su información',
      icono: <Hotel sx={{ fontSize: 50, color: '#2890BD' }} />,
      ruta: '/admin/sedes'
    },
    {
      titulo: 'Gestión de Habitaciones',
      descripcion: 'Controla el estado y la información de todas las habitaciones',
      icono: <MeetingRoom sx={{ fontSize: 50, color: '#2890BD' }} />,
      ruta: '/admin/habitaciones'
    },
    {
      titulo: 'Gestión de Reservas',
      descripcion: 'Visualiza y administra todas las reservas activas y pasadas',
      icono: <EventNote sx={{ fontSize: 50, color: '#2890BD' }} />,
      ruta: '/admin/reservas'
    }
  ]

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontFamily="Lato" fontWeight={900} mb={2}>
            Panel de Administración
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Bienvenido, gestiona todos los recursos del hotel desde aquí
          </Typography>
        </Box>

        <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
            <Card
            onClick={() => navigate(opciones[0].ruta)}
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
            }}
            >
            <CardContent>
                {opciones[0].icono}
                <Typography variant="h6" fontFamily="Lato" fontWeight={700} mt={2} mb={1}>
                {opciones[0].titulo}
                </Typography>
                <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                {opciones[0].descripcion}
                </Typography>
            </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <Card
            onClick={() => navigate(opciones[1].ruta)}
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
            }}
            >
            <CardContent>
                {opciones[1].icono}
                <Typography variant="h6" fontFamily="Lato" fontWeight={700} mt={2} mb={1}>
                {opciones[1].titulo}
                </Typography>
                <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                {opciones[1].descripcion}
                </Typography>
            </CardContent>
            </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
            <Card
            onClick={() => navigate(opciones[2].ruta)}
            sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                }
            }}
            >
            <CardContent>
                {opciones[2].icono}
                <Typography variant="h6" fontFamily="Lato" fontWeight={700} mt={2} mb={1}>
                {opciones[2].titulo}
                </Typography>
                <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                {opciones[2].descripcion}
                </Typography>
            </CardContent>
            </Card>
        </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AdminPage