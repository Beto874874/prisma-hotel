import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import AdminSedesPage from './pages/AdminiSedePage'
import AdminHabitacionesPage from './pages/AdminHabitacionesPage'
import AdminReservasPage from './pages/AdminReservaPage'
import SedeHabitacionesPage from './pages/SedeHabitacionesPage'
import MisReservasPage from './pages/MisReservasPage'
import PerfilPage from './pages/PerfilPage'
import HabitacionPage from './pages/HabitacionPage'
import NotFoundPage from './pages/NotFoundPage'
import PagoPage from './pages/PagoPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas cliente */}
          <Route path="/home" element={<RutaProtegida><HomePage /></RutaProtegida>} />
          <Route path="/sede/:id_sede" element={<RutaProtegida><SedeHabitacionesPage /></RutaProtegida>} />
          <Route path="/habitacion/:id_habitacion" element={<RutaProtegida><HabitacionPage /></RutaProtegida>} />
          <Route path="/mis-reservas" element={<RutaProtegida rolRequerido="cliente"><MisReservasPage /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida rolRequerido="cliente"><PerfilPage /></RutaProtegida>} />
          <Route path="/pago/:id_reserva" element={<RutaProtegida rolRequerido="cliente"><PagoPage /></RutaProtegida>} />


          {/* Rutas admin */}
          <Route path="/admin" element={<RutaProtegida rolRequerido="admin"><AdminPage /></RutaProtegida>} />
          <Route path="/admin/sedes" element={<RutaProtegida rolRequerido="admin"><AdminSedesPage /></RutaProtegida>} />
          <Route path="/admin/habitaciones" element={<RutaProtegida rolRequerido="admin"><AdminHabitacionesPage /></RutaProtegida>} />
          <Route path="/admin/reservas" element={<RutaProtegida rolRequerido="admin"><AdminReservasPage /></RutaProtegida>} />

          {/* Ruta NotFound (Error 404)*/}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App