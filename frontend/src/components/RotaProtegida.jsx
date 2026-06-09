
// src/components/RotaProtegida.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RotaProtegida({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" replace />
}

export default RotaProtegida