// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Home() {
  const [resumo, setResumo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/veiculos/resumo')
      .then(res => setResumo(res.data))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <p>Carregando...</p>
  if (!resumo) return <p>Erro ao carregar dados.</p>  // linha nova

  const cards = [
    { label: 'Total de veículos', valor: resumo.total,           cor: '#1a1a2e', rota: '/veiculos' },
    { label: 'Em análise',        valor: resumo.em_analise,      cor: '#f6ad55', rota: '/veiculos' },
    { label: 'Em serviço',        valor: resumo.em_servico,      cor: '#63b3ed', rota: '/veiculos' },
    { label: 'Aguardando peça',   valor: resumo.aguardando_peca, cor: '#fc8181', rota: '/veiculos' },
    { label: 'Concluídos',        valor: resumo.concluido,       cor: '#68d391', rota: '/veiculos' },
    { label: 'Entregues',         valor: resumo.entregue,        cor: '#a0aec0', rota: '/veiculos' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Painel de controle</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Visão geral do sistema</p>

      <div style={styles.grid}>
        {cards.map(card => (
          <div
            key={card.label}
            style={{ ...styles.card, borderTop: `4px solid ${card.cor}` }}
            onClick={() => navigate(card.rota)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ ...styles.valor, color: card.cor }}>{card.valor}</span>
            <span style={styles.label}>{card.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.acoes}>
        <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Ações rápidas</h3>
        <div style={styles.botoesGrid}>
          <button onClick={() => navigate('/veiculos/novo')} style={styles.botao}>
            🚗 Nova entrada de veículo
          </button>
          <button onClick={() => navigate('/clientes/novo')} style={styles.botao}>
            👤 Novo cliente
          </button>
          <button onClick={() => navigate('/marcas')} style={styles.botao}>
            🏷️ Gerenciar marcas
          </button>
          <button onClick={() => navigate('/modelos')} style={styles.botao}>
            📋 Gerenciar modelos
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  valor: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    lineHeight: 1
  },
  label: {
    marginTop: '0.5rem',
    color: '#666',
    fontSize: '0.9rem',
    textAlign: 'center'
  },
  acoes: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px'
  },
  botoesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  botao: {
    backgroundColor: '#f0f2f5',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s'
  }
}

export default Home