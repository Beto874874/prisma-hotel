import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [rol, setRol] = useState(localStorage.getItem('rol') || null)

  const login = (token, rol) => {
    setToken(token)
    setRol(rol)
    localStorage.setItem('token', token)
    localStorage.setItem('rol', rol)
  }

  const logout = () => {
    setToken(null)
    setRol(null)
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
  }

  return (
    <AuthContext.Provider value={{ token, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)