import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerMisReservas, pagarReserva } from '../services/reservaService'
import {
  Box, Typography, Container, Card, CardContent,
  Button, TextField, Divider, InputAdornment
} from '@mui/material'
import { CreditCard, Person, CalendarMonth, Lock, AttachMoney, Hotel } from '@mui/icons-material'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PagoPage = () => {
  const { id_reserva } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [reserva, setReserva] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [exito, setExito] = useState(false)
  const [form, setForm] = useState({
    nombre_titular: '',
    numero_tarjeta: '',
    fecha_vencimiento: '',
    cvv: ''
  })
  const [errores, setErrores] = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const reservas = await obtenerMisReservas(token)
        const reservaEncontrada = reservas.find(r => r.id_reserva === parseInt(id_reserva))
        setReserva(reservaEncontrada)
      } catch (error) {
        console.error('Error al cargar reserva:', error)
      }
    }
    cargar()
  }, [id_reserva])

  const handleChange = (e) => {
    let valor = e.target.value
    const nombre = e.target.name

    // Formatear número de tarjeta con espacios
    if (nombre === 'numero_tarjeta') {
      valor = valor.replace(/\D/g, '').slice(0, 16)
      valor = valor.replace(/(.{4})/g, '$1 ').trim()
    }

    // Formatear fecha vencimiento
    if (nombre === 'fecha_vencimiento') {
      valor = valor.replace(/\D/g, '').slice(0, 4)
      if (valor.length >= 2) valor = valor.slice(0, 2) + '/' + valor.slice(2)
    }

    // Limitar CVV
    if (nombre === 'cvv') {
      valor = valor.replace(/\D/g, '').slice(0, 3)
    }

    setForm({ ...form, [nombre]: valor })
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!form.nombre_titular) nuevosErrores.nombre_titular = 'Requerido'
    if (form.numero_tarjeta.replace(/\s/g, '').length !== 16) nuevosErrores.numero_tarjeta = 'Número inválido'
    if (form.fecha_vencimiento.length !== 5) nuevosErrores.fecha_vencimiento = 'Fecha inválida'
    if (form.cvv.length !== 3) nuevosErrores.cvv = 'CVV inválido'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handlePagar = async () => {
    if (!validar()) return
    setProcesando(true)
    try {
      // Simulamos un delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))
      await pagarReserva(id_reserva, token)
      setExito(true)
      setTimeout(() => navigate('/mis-reservas'), 3000)
    } catch (error) {
      console.error('Error al procesar pago:', error)
    } finally {
      setProcesando(false)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO')
  }

  if (!reserva) return null

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6, flex: 1 }}>

        <Typography variant="h4" fontFamily="Lato" fontWeight={700} mb={1}>
          Completar pago
        </Typography>
        <Typography variant="body1" fontFamily="Raleway" color="text.secondary" mb={4}>
          Reserva #{reserva.id_reserva}
        </Typography>

        {exito ? (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', p: 4 }}>
            <CreditCard sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontFamily="Lato" fontWeight={700} mb={1}>
              ¡Pago exitoso!
            </Typography>
            <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
              Tu reserva ha sido confirmada. Redirigiendo...
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>

            {/* Resumen de la reserva */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flex: 1, minWidth: 280 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontFamily="Lato" fontWeight={700} mb={2}>
                  Resumen
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Hotel sx={{ color: '#2890BD' }} />
                  <Box>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Habitación</Typography>
                    <Typography variant="body2" fontFamily="Raleway">
                      {reserva.nombre_sede} — Hab. {reserva.numero_habitacion} ({reserva.tipo_habitacion})
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CalendarMonth sx={{ color: '#2890BD' }} />
                  <Box>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">Fechas</Typography>
                    <Typography variant="body2" fontFamily="Raleway">
                      {formatearFecha(reserva.fecha_inicio)} → {formatearFecha(reserva.fecha_fin)}
                    </Typography>
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                      {reserva.total_noches} noches
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" fontFamily="Raleway" fontWeight={600}>
                    Total a pagar
                  </Typography>
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700} color="primary">
                    ${Number(reserva.precio_total).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Formulario de pago */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flex: 1, minWidth: 280 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Lock sx={{ color: '#2890BD', fontSize: 20 }} />
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                    Datos de pago
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Nombre del titular"
                    name="nombre_titular"
                    value={form.nombre_titular}
                    onChange={handleChange}
                    fullWidth
                    error={!!errores.nombre_titular}
                    helperText={errores.nombre_titular}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 18, color: '#2890BD' }} />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <TextField
                    label="Número de tarjeta"
                    name="numero_tarjeta"
                    value={form.numero_tarjeta}
                    onChange={handleChange}
                    fullWidth
                    placeholder="1234 5678 9012 3456"
                    error={!!errores.numero_tarjeta}
                    helperText={errores.numero_tarjeta}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard sx={{ fontSize: 18, color: '#2890BD' }} />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Vencimiento"
                      name="fecha_vencimiento"
                      value={form.fecha_vencimiento}
                      onChange={handleChange}
                      fullWidth
                      placeholder="MM/AA"
                      error={!!errores.fecha_vencimiento}
                      helperText={errores.fecha_vencimiento}
                    />
                    <TextField
                      label="CVV"
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      fullWidth
                      placeholder="123"
                      error={!!errores.cvv}
                      helperText={errores.cvv}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ fontSize: 18, color: '#2890BD' }} />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePagar}
                    disabled={procesando}
                    sx={{ fontFamily: 'Raleway', fontWeight: 700, py: 1.5, borderRadius: 2, mt: 1 }}
                  >
                    {procesando ? 'Procesando pago...' : `Pagar $${Number(reserva.precio_total).toLocaleString()}`}
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <Lock sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" fontFamily="Raleway" color="text.secondary">
                      Pago seguro y encriptado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  )
}

export default PagoPage