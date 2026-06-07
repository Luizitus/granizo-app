// src/components/Navbar.jsx
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🚗 Granizo App</span>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Início</Link>
        <Link to="/veiculos" style={styles.link}>Veículos</Link>
        <Link to="/veiculos/novo" style={styles.link}>Nova Entrada</Link>
        <Link to="/clientes" style={styles.link}>Clientes</Link>
        <Link to="/tecnicos" style={styles.link}>Técnico</Link>
        <Link to="/marcas" style={styles.link}>Marcas</Link>
        <Link to="/modelos" style={styles.link}>Modelos</Link>
        <Link to="/relatorios" style={styles.link}>Relatórios</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: { backgroundColor: '#1a1a2e', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: '#a0aec0', textDecoration: 'none', fontSize: '0.95rem' }
}

export default Navbar