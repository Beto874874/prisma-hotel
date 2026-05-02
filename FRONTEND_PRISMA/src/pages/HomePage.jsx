import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerSedes } from '../services/sedeService'
import {
  Box, Typography, Button, Card,
  CardContent, CardActions, Container
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { LocationOn, Phone, Home } from '@mui/icons-material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const getImageUrl = (ruta) => {
  if (!ruta) return null
  if (ruta.startsWith('uploads/')) return `http://localhost:5000/${ruta}`
  return `/${ruta}`
}

const HomePage = () => {
  const navigate = useNavigate()
  const [sedes, setSedes] = useState([])

  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const datos = await obtenerSedes()
        setSedes(datos)
      } catch (error) {
        console.error('Error al cargar sedes:', error)
      }
    }
    cargarSedes()
  }, [])

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>

      <Navbar />

      {/* Hero */}
      <Box sx={{
        height: '90vh',
        backgroundImage: 'url(/img/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)'
        }} />
        <Box sx={{ position: 'relative', textAlign: 'center', color: 'white', px: 4 }}>
          <Typography variant="h2" fontFamily="Lato" fontWeight={900} mb={2}>
            Bienvenido a Prisma Hotel
          </Typography>
          <Typography variant="h6" fontFamily="Raleway" mb={4} sx={{ opacity: 0.9 }}>
            Experiencias únicas en los mejores destinos de Colombia
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              borderRadius: 3,
              backgroundColor: '#2890BD',
              '&:hover': { backgroundColor: '#1a6fa0' }
            }}
            onClick={() => document.getElementById('sedes').scrollIntoView({ behavior: 'smooth' })}
          >
            Ver nuestras sedes
          </Button>
        </Box>
      </Box>

      {/* Sedes */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="sedes">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" fontFamily="Lato" fontWeight={700} mb={1}>
            Nuestras sedes
          </Typography>
          <Typography variant="body1" fontFamily="Raleway" color="text.secondary">
            Encuentra la sede perfecta para tu estadía
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {sedes.map((sede) => (
            <Grid size={{ xs: 12, md: 4 }} key={sede.id_sede}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '100%',
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
                  style={{ height: 220 }}
                >
                  {sede.imagenes.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={getImageUrl(img)}
                        alt={sede.nombre}
                        style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <CardContent>
                  <Typography variant="h6" fontFamily="Lato" fontWeight={700} mb={1}>
                    {sede.nombre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                      {sede.ciudad}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                      {sede.telefono}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Home sx={{ fontSize: 16, color: '#2890BD' }} />
                    <Typography variant="body2" fontFamily="Raleway" color="text.secondary">
                      {sede.direccion}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2 }}
                    onClick={() => navigate(`/sede/${sede.id_sede}`)}
                  >
                    Ver habitaciones
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  )
}

export default HomePage