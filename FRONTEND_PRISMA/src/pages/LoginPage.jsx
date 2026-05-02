import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginService, registroService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import {
  Box, TextField, Button, Typography,
  InputAdornment, IconButton, Divider
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginPage = () => {
  const [modo, setModo] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '',
    contraseña: '', telefono: '', documento: ''
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (modo === 'login') {
        const datos = await loginService(form.correo, form.contraseña)
        login(datos.token, datos.rol)
        navigate(datos.rol === 'admin' ? '/admin' : '/home')
      } else {
        await registroService(
          form.nombre, form.apellido, form.correo,
          form.contraseña, form.telefono, form.documento
        )
        setModo('login')
        setError(null)
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>

      {/* Lado izquierdo */}
      <Box sx={{
        flex: 1,
        backgroundColor: '#2890BD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: 6,
      }}>
        <img src="/logo.jpg" alt="Prisma Hotel" style={{ width: 180, marginBottom: 32 }} />
        <Typography variant="h3" fontFamily="Lato" fontWeight={700} textAlign="center">
          Bienvenido a Prisma Hotel
        </Typography>
        <Typography variant="body1" fontFamily="Raleway" mt={2} textAlign="center" sx={{ opacity: 0.85 }}>
          Vive una experiencia única de confort y elegancia
        </Typography>
      </Box>

      {/* Lado derecho */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        backgroundColor: '#F8F9FA'
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" fontFamily="Lato" fontWeight={700} mb={1}>
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </Typography>
          <Typography variant="body2" fontFamily="Raleway" color="text.secondary" mb={2}>
            {modo === 'login' ? 'Ingresa tus credenciales para continuar' : 'Completa el formulario para registrarte'}
          </Typography>

          {error && (
            <Typography color="error" variant="body2" mb={2}>{error}</Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} /*autoComplete='off'*/>
            {modo === 'registro' && (
              <>
                <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth required />
                <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} fullWidth required />
                <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth required />
                <TextField label="Documento" name="documento" value={form.documento} onChange={handleChange} fullWidth required />
              </>
            )}
            <TextField label="Correo"
              name="correo" 
              type="email" 
              value={form.correo} 
              onChange={handleChange} 
              fullWidth required
              //autoComplete='off'
              />
              
            <TextField
              label="Contraseña"
              name="contraseña"
              type={showPassword ? 'text' : 'password'}
              value={form.contraseña}
              onChange={handleChange}
              fullWidth
              required
              //autoComplete='new-password'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.5, fontFamily: 'Raleway', fontWeight: 600 }}>
              {modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" fontFamily="Raleway" textAlign="center">
            {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <Button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError(null) }}
              sx={{ fontFamily: 'Raleway', fontWeight: 600, textTransform: 'none' }}>
              {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage