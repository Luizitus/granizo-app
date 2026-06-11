// src/components/RotaProtegida.tsx
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface RotaProtegidaProps {
  children: ReactNode
}

function RotaProtegida({ children }: RotaProtegidaProps) {
  const { usuario } = useAuth()
  return usuario ? <>{children}</> : <Navigate to="/login" replace />
}

export default RotaProtegida