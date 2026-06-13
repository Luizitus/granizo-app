// src/components/Navbar.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLinkClick = () => {
    setMenuAberto(false)
  }

  return (
    <nav style={styles.nav}>
      <div className="navbar-topo" style={styles.topo}>
        <span style={styles.logo}>🚗 Granizo App</span>
        <button
          className="navbar-botao-menu"
          style={styles.botaoMenu}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          {menuAberto ? '✕' : '☰'}
        </button>
      </div>

      <div className={`navbar-links ${menuAberto ? 'aberto' : ''}`} style={styles.links}>
        <Link to="/" style={styles.link} onClick={handleLinkClick}>Início</Link>
        <Link to="/veiculos" style={styles.link} onClick={handleLinkClick}>Veículos</Link>
        <Link to="/veiculos/novo" style={styles.link} onClick={handleLinkClick}>Nova Entrada</Link>
        <Link to="/clientes" style={styles.link} onClick={handleLinkClick}>Clientes</Link>
        <Link to="/tecnicos" style={styles.link} onClick={handleLinkClick}>Técnicos</Link>
        <Link to="/marcas" style={styles.link} onClick={handleLinkClick}>Marcas</Link>
        <Link to="/modelos" style={styles.link} onClick={handleLinkClick}>Modelos</Link>
        <Link to="/relatorios" style={styles.link} onClick={handleLinkClick}>Relatórios</Link>
        {usuario?.perfil === 'admin' && (
          <Link to="/usuarios" style={styles.link} onClick={handleLinkClick}>Usuários</Link>
        )}

        <div className="navbar-user-mobile" style={styles.usuarioMobile}>
          <span style={styles.nomeUsuario}>👤 {usuario?.nome}</span>
          <button onClick={handleLogout} style={styles.botaoLogout}>Sair</button>
        </div>
      </div>

      <div className="navbar-user-desktop" style={styles.usuarioDesktop}>
        <span style={styles.nomeUsuario}>👤 {usuario?.nome}</span>
        <button onClick={handleLogout} style={styles.botaoLogout}>Sair</button>
      </div>
    </nav>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '1rem 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' },
  botaoMenu: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: { color: '#a0aec0', textDecoration: 'none', fontSize: '0.95rem' },
  usuarioDesktop: { display: 'flex', alignItems: 'center', gap: '1rem' },
  usuarioMobile: { display: 'none' },
  nomeUsuario: { color: '#a0aec0', fontSize: '0.9rem' },
  botaoLogout: { backgroundColor: 'transparent', color: '#fc8181', border: '1px solid #fc8181', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }
}

export default Navbar