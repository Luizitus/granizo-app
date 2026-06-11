// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { Usuario } from '../types'

interface AuthContextData {
  usuario: Usuario | null
  login: (dados: Usuario, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const login = (dados: Usuario, token: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(dados))
    setUsuario(dados)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)