import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerTodasReservas, cancelarReserva } from '../services/reservaService'
import {
  Box, Typography, Container, Card, CardContent,
  Button, Chip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { CalendarMonth, Person, Hotel, AttachMoney, Email, Phone, Badge, CreditCard } from '@mui/icons-material'
import Navbar from '../components/Navbar'

const AdminReservasPage = () => {
  const { token } = useAuth()
  const [reservas, setReservas] = useState([])
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      const datos = await obtenerTodasReservas(token)
      setReservas(datos)
    } catch (error) {
      console.error('Error al cargar reservas:', error)
    }
  }

  const handleCancelar = async (id_reserva) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return
    try {
      await cancelarReserva(id_reserva, token)
      cargarReservas()
      setDialogAbierto(false)
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
    }
  }

  const abrirDetalle = (reserva) => {
    setReservaSeleccionada(reserva)
    setDialogAbierto(true)
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
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontFamily="Lato" fontWeight={700}>
            Gestión de Reservas
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Visualiza y administra todas las reservas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {reservas.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" fontFamily="Raleway" color="text.secondary" textAlign="center">
                No hay reservas registradas
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
                      <Person sx={{ fontSize: 16, color: '#2890BD' }} />
                      <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                        {reserva.nombre_cliente} {reserva.apellido_cliente}
                      </Typography>
                    </Box>
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

                  <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => abrirDetalle(reserva)}
                      sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                    >
                      Ver detalles
                    </Button>
                    {reserva.estado === 'Activa' && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelar(reserva.id_reserva)}
                        sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Dialog detalles */}
      {reservaSeleccionada && (
        <Dialog open={dialogAbierto} onClose={() => setDialogAbierto(false)} maxWidth="sm" fullWidth>
          <DialogTitle fontFamily="Lato" fontWeight={700} sx={{ pb: 0 }}>
            Reserva #{reservaSeleccionada.id_reserva}
          </DialogTitle>
          <DialogContent sx={{ pt: '24px !important' }}>

            <Typography variant="subtitle1" fontFamily="Lato" fontWeight={700} mb={1}>
              Información del cliente
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Person sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Nombre</Typography>
                <Typography variant="body2" fontFamily="Raleway">
                  {reservaSeleccionada.nombre_cliente} {reservaSeleccionada.apellido_cliente}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Email sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Correo</Typography>
                <Typography variant="body2" fontFamily="Raleway">{reservaSeleccionada.correo_cliente}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Phone sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Teléfono</Typography>
                <Typography variant="body2" fontFamily="Raleway">{reservaSeleccionada.telefono_cliente}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Badge sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Documento</Typography>
                <Typography variant="body2" fontFamily="Raleway">{reservaSeleccionada.documento_cliente}</Typography>
              </Box>
            </Box>

            <Typography variant="subtitle1" fontFamily="Lato" fontWeight={700} mb={1}>
              Detalles de la reserva
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Hotel sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Habitación</Typography>
                <Typography variant="body2" fontFamily="Raleway">
                  {reservaSeleccionada.nombre_sede} — Hab. {reservaSeleccionada.numero_habitacion} ({reservaSeleccionada.tipo_habitacion})
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <CalendarMonth sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Fechas</Typography>
                <Typography variant="body2" fontFamily="Raleway">
                  {formatearFecha(reservaSeleccionada.fecha_inicio)} → {formatearFecha(reservaSeleccionada.fecha_fin)} ({reservaSeleccionada.total_noches} noches)
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Person sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Cantidad de personas</Typography>
                <Typography variant="body2" fontFamily="Raleway">{reservaSeleccionada.cantidad_personas}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <AttachMoney sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Precio por noche</Typography>
                <Typography variant="body2" fontFamily="Raleway">
                  ${Number(reservaSeleccionada.precio_noche_habitacion).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <AttachMoney sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Total</Typography>
                <Typography variant="body1" fontFamily="Raleway" fontWeight={700}>
                  ${Number(reservaSeleccionada.precio_total).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CreditCard sx={{ color: '#2890BD' }} />
              <Box>
                <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Estado de pago</Typography>
                <Box mt={0.5}>
                  <Chip
                    label={reservaSeleccionada.estado_pago || 'Pendiente'}
                    color={colorEstadoPago(reservaSeleccionada.estado_pago)}
                    size="small"
                    sx={{ fontFamily: 'Raleway' }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setDialogAbierto(false)} sx={{ fontFamily: 'Raleway' }}>
              Cerrar
            </Button>
            {reservaSeleccionada.estado === 'Activa' && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancelar(reservaSeleccionada.id_reserva)}
                sx={{ fontFamily: 'Raleway', borderRadius: 2 }}
              >
                Cancelar reserva
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}

export default AdminReservasPage