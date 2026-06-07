// src/pages/ListaVeiculos.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const cores = {
  em_analise:      '#f6ad55',
  em_servico:      '#63b3ed',
  aguardando_peca: '#fc8181',
  concluido:       '#68d391',
  entregue:        '#a0aec0',
}

const statusOpcoes = [
  { valor: '',               label: 'Todos' },
  { valor: 'em_analise',      label: 'Em análise' },
  { valor: 'em_servico',      label: 'Em serviço' },
  { valor: 'aguardando_peca', label: 'Aguardando peça' },
  { valor: 'concluido',       label: 'Concluído' },
  { valor: 'entregue',        label: 'Entregue' },
]

function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/veiculos')
      .then(res => setVeiculos(res.data))
      .catch(err => console.error(err))
      .finally(() => setCarregando(false))
  }, [])

  const veiculosFiltrados = veiculos.filter(v => {
    const buscaOk = (
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente_nome.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo_nome.toLowerCase().includes(busca.toLowerCase())
    )
    const statusOk = filtroStatus === '' || v.status === filtroStatus
    return buscaOk && statusOk
  })

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Veículos em gestão</h2>
        <Link to="/veiculos/novo" style={styles.botao}>+ Nova Entrada</Link>
      </div>

      {/* Barra de busca e filtro */}
      <div style={styles.barraBusca}>
        <input
          style={styles.busca}
          placeholder="🔍 Buscar por placa, cliente ou modelo..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <div style={styles.filtroStatus}>
          {statusOpcoes.map(s => (
            <button
              key={s.valor}
              onClick={() => setFiltroStatus(s.valor)}
              style={{
                ...styles.filtroBotao,
                backgroundColor: filtroStatus === s.valor
                  ? (cores[s.valor] || '#1a1a2e')
                  : '#fff',
                color: filtroStatus === s.valor ? '#fff' : '#333',
                borderColor: cores[s.valor] || '#1a1a2e',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {veiculosFiltrados.length === 0 ? (
        <p style={{ color: '#999', marginTop: '1rem' }}>
          {busca || filtroStatus ? 'Nenhum veículo encontrado para esse filtro.' : 'Nenhum veículo cadastrado ainda.'}
        </p>
      ) : (
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th style={styles.th}>Placa</th>
              <th style={styles.th}>Modelo</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Técnico</th>
              <th style={styles.th}>Entrada</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {veiculosFiltrados.map(v => (
              <tr key={v.id_veiculo} style={styles.tr}
                onClick={() => navigate(`/veiculos/${v.id_veiculo}`)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f7fafc'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
              >
                <td style={styles.td}>{v.placa}</td>
                <td style={styles.td}>{v.modelo_nome}</td>
                <td style={styles.td}>{v.cliente_nome}</td>
                <td style={styles.td}>{v.tecnico_nome || '—'}</td>
                <td style={styles.td}>{v.data_entrada}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: cores[v.status] || '#ccc' }}>
                    {v.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Contador de resultados */}
      {(busca || filtroStatus) && (
        <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {veiculosFiltrados.length} resultado(s) encontrado(s)
        </p>
      )}
    </div>
  )
}

const styles = {
  barraBusca: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  busca: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' },
  filtroStatus: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filtroBotao: { padding: '0.4rem 1rem', borderRadius: '999px', border: '1.5px solid', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabela: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' },
  td: { padding: '0.75rem 1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', color: '#fff' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' },
}

export default ListaVeiculos