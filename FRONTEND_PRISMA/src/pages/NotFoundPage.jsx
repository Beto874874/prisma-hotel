import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SentimentDissatisfied } from '@mui/icons-material'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { token, rol } = useAuth()

  const handleVolver = () => {
    if (!token) navigate('/login')
    else if (rol === 'admin') navigate('/admin')
    else navigate('/home')
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#F8F9FA',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      px: 4
    }}>
      <SentimentDissatisfied sx={{ fontSize: 100, color: '#2890BD', mb: 2 }} />
      <Typography variant="h1" fontFamily="Lato" fontWeight={900} sx={{ fontSize: 120, color: '#2890BD', lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" fontFamily="Lato" fontWeight={700} mt={2} mb={1}>
        Página no encontrada
      </Typography>
      <Typography variant="body1" fontFamily="Raleway" color="text.secondary" mb={4}>
        La página que buscas no existe o fue movida
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleVolver}
        sx={{ fontFamily: 'Raleway', fontWeight: 600, borderRadius: 2, px: 4 }}
      >
        Volver al inicio
      </Button>
    </Box>
  )
}

export default NotFoundPage