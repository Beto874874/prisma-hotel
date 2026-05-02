import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const RutaProtegida = ({ children, rolRequerido }) => {
  const { token, rol } = useAuth()

  if (!token) return <Navigate to="/login" />
  if (rolRequerido && rol !== rolRequerido) return <Navigate to="/login" />

  return children
}

export default RutaProtegida