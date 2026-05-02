import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { obtenerMisReservas, cancelarReservaCliente } from '../services/reservaService'
import {
  Box, Typography, Container, Card, CardContent,
  Button, Chip, Divider
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { CalendarMonth, Hotel, AttachMoney, CreditCard } from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MisReservasPage = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      const datos = await obtenerMisReservas(token)
      setReservas(datos)
    } catch (error) {
      console.error('Error al cargar reservas:', error)
    }
  }

  const handleCancelar = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return
    try {
      await cancelarReservaCliente(id_reserva, token)
      cargarReservas()
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
    }
  }

  const colorEstado = (estado) => {
    if (estado === 'Activa') return 'success'
    if (estado === 'Cancelada') return 'error'
    return 'warning'
  }

  const colorEstadoPago = (estado_pago) => {
    if (estado_pago === 'Pagado') return 'success'
    if (estado_pago === 'Reembolsado') return 'warning'
    return 'error'
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO')
  }

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
            Mis Reservas
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Aquí puedes ver y gestionar tus reservas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reservas.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" fontFamily="Raleway" color="text.secondary" textAlign="center">
                No tienes reservas registradas
              </Typography>
            </Grid>
          ) : (
            reservas.map((reserva) => (
              <Grid size={{ xs: 12, md: 6 }} key={reserva.id_reserva}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                        Reserva #{reserva.id_reserva}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={reserva.estado}
                          color={colorEstado(reserva.estado)}
                          size="small"
                          sx={{ fontFamily: 'Raleway' }}
                        />
                        <Chip
                          label={reserva.estado_pago || 'Pendiente'}
                          color={colorEstadoPago(reserva.estado_pago)}
                          size="small"
                          sx={{ fontFamily: 'Raleway' }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Hotel sx={{ fontSize: 16, color: '#2890BD' }} />
                      <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                        {reserva.nombre_sede} — Hab. {reserva.numero_habitacion} ({reserva.tipo_habitacion})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarMonth sx={{ fontSize: 16, color: '#2890BD' }} />
                      <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                        {formatearFecha(reserva.fecha_inicio)} → {formatearFecha(reserva.fecha_fin)} ({reserva.total_noches} noches)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney sx={{ fontSize: 16, color: '#2890BD' }} />
                      <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                        Total: ${Number(reserva.precio_total).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  {reserva.estado === 'Activa' && (
                    <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {reserva.estado_pago !== 'Pagado' && (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<CreditCard />}
                          onClick={() => navigate(`/pago/${reserva.id_reserva}`)}
                          sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                        >
                          Completar pago
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelar(reserva.id_reserva)}
                        sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                      >
                        Cancelar reserva
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default MisReservasPage