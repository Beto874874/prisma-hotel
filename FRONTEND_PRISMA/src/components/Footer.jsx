import { Box, Container, Typography, Divider } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Phone, Email, LocationOn } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ backgroundColor: '#2890BD', color: 'white', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* Columna 1 - Marca */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <img src="/favicon.jpg" alt="Prisma Hotel" style={{ height: 45, }} />
              <Typography variant="h6" fontFamily="Lato" fontWeight={700}>
                Prisma Hotel
              </Typography>
            </Box>
            <Typography variant="body2" fontFamily="Raleway" sx={{ opacity: 0.85, lineHeight: 1.8 }}>
              Ofrecemos experiencias únicas de hospedaje en los mejores destinos de Colombia. Confort, elegancia y servicio de primer nivel.
            </Typography>
          </Grid>

          {/* Columna 2 - Contacto */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontFamily="Lato" fontWeight={700} mb={2}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Phone sx={{ fontSize: 18, opacity: 0.85 }} />
              <Typography variant="body2" fontFamily="Raleway" sx={{ opacity: 0.85 }}>
                +57 315 762 5882
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Email sx={{ fontSize: 18, opacity: 0.85 }} />
              <Typography variant="body2" fontFamily="Raleway" sx={{ opacity: 0.85 }}>
                prismahotel88@gmail.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocationOn sx={{ fontSize: 18, opacity: 0.85 }} />
              <Typography variant="body2" fontFamily="Raleway" sx={{ opacity: 0.85 }}>
                Cartagena, Santa Marta, San Andrés
              </Typography>
            </Box>
          </Grid>

          {/* Columna 3 - Enlaces */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontFamily="Lato" fontWeight={700} mb={2}>
              Enlaces rápidos
            </Typography>
            {[
              { label: 'Inicio', ruta: '/home' },
              { label: 'Nuestras sedes', ruta: '/home#sedes' },
              { label: 'Mis reservas', ruta: '/mis-reservas' },
              { label: 'Mi perfil', ruta: '/perfil' },
            ].map((enlace) => (
              <Typography
                key={enlace.label}
                variant="body2"
                fontFamily="Raleway"
                sx={{
                  opacity: 0.85,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 1, textDecoration: 'underline' }
                }}
                onClick={() => navigate(enlace.ruta)}
              >
                {enlace.label}
              </Typography>
            ))}
          </Grid>

        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 3 }} />

        <Typography variant="body2" fontFamily="Raleway" textAlign="center" sx={{ opacity: 0.75 }}>
          © 2025 Prisma Hotel — Todos los derechos reservados
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer