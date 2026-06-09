// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (carregando) return
    setCarregando(true)
    setErro('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.usuario, res.data.token)
      navigate('/')
    } catch (err) {
      setErro('Email ou senha inválidos.')
      setCarregando(false)
    }
  }

  return (
    <div style={styles.pagina}>
      <div style={styles.card}>
        <div style={styles.topo}>
          <h1 style={styles.titulo}>🚗 Granizo App</h1>
          <p style={styles.subtitulo}>Sistema de gestão de veículos</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {erro && <p style={styles.erro}>{erro}</p>}

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
            required
          />

          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            value={form.senha}
            onChange={e => setForm({ ...form, senha: e.target.value })}
            placeholder="••••••••"
            required
          />

          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  pagina: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
  },
  topo: { textAlign: 'center', marginBottom: '2rem' },
  titulo: { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitulo: { color: '#666', fontSize: '0.95rem' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' },
  input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', marginBottom: '1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.85rem', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  erro: { backgroundColor: '#fff5f5', color: '#c53030', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }
}

export default Login