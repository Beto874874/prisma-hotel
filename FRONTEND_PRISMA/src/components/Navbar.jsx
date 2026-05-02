import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button, IconButton } from '@mui/material'
import { Person, EventNote, Hotel, MeetingRoom } from '@mui/icons-material'

const Navbar = () => {
  const { rol, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2890BD', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
          onClick={() => navigate(rol === 'admin' ? '/admin' : '/home')}>
          <img src="/favicon.jpg" alt="Prisma Hotel" style={{ height: 40 }} />
          <Typography variant="h6" fontFamily="Lato" fontWeight={700} color="white">
            Prisma Hotel
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {rol === 'cliente' && (
            <>
              <IconButton onClick={() => navigate('/perfil')} sx={{ color: 'white' }}>
                <Person />
              </IconButton>
              <Button
                onClick={() => navigate('/mis-reservas')}
                startIcon={<EventNote />}
                sx={{ color: 'white', fontFamily: 'Raleway', textTransform: 'none' }}
              >
                Mis reservas
              </Button>
            </>
          )}

          {rol === 'admin' && (
            <>
              <Button
                onClick={() => navigate('/admin/sedes')}
                startIcon={<Hotel />}
                sx={{ color: 'white', fontFamily: 'Raleway', textTransform: 'none' }}
              >
                Sedes
              </Button>
              <Button
                onClick={() => navigate('/admin/habitaciones')}
                startIcon={<MeetingRoom />}
                sx={{ color: 'white', fontFamily: 'Raleway', textTransform: 'none' }}
              >
                Habitaciones
              </Button>
              <Button
                onClick={() => navigate('/admin/reservas')}
                startIcon={<EventNote />}
                sx={{ color: 'white', fontFamily: 'Raleway', textTransform: 'none' }}
              >
                Reservas
              </Button>
            </>
          )}

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', fontFamily: 'Raleway' }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar