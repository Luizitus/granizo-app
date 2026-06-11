// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🚗 Granizo App</span>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Início</Link>
        <Link to="/veiculos" style={styles.link}>Veículos</Link>
        <Link to="/veiculos/novo" style={styles.link}>Nova Entrada</Link>
        <Link to="/clientes" style={styles.link}>Clientes</Link>
        <Link to="/tecnicos" style={styles.link}>Técnicos</Link>
        <Link to="/marcas" style={styles.link}>Marcas</Link>
        <Link to="/modelos" style={styles.link}>Modelos</Link>
        <Link to="/relatorios" style={styles.link}>Relatórios</Link>
        {usuario?.perfil === 'admin' && (
          <Link to="/usuarios" style={styles.link}>Usuários</Link>
        )}
      </div>
      <div style={styles.usuario}>
        <span style={styles.nomeUsuario}>👤 {usuario?.nome}</span>
        <button onClick={handleLogout} style={styles.botaoLogout}>Sair</button>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: { backgroundColor: '#1a1a2e', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: '#a0aec0', textDecoration: 'none', fontSize: '0.95rem' },
  usuario: { display: 'flex', alignItems: 'center', gap: '1rem' },
  nomeUsuario: { color: '#a0aec0', fontSize: '0.9rem' },
  botaoLogout: { backgroundColor: 'transparent', color: '#fc8181', border: '1px solid #fc8181', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }
}

export default Navbar