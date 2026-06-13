// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Resumo, DadosGraficos } from '../types'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const STATUS_CORES: Record<string, string> = {
  em_analise:      '#f6ad55',
  em_servico:      '#63b3ed',
  aguardando_peca: '#fc8181',
  concluido:       '#68d391',
  entregue:        '#a0aec0',
}

const STATUS_LABEL: Record<string, string> = {
  em_analise:      'Em análise',
  em_servico:      'Em serviço',
  aguardando_peca: 'Aguard. peça',
  concluido:       'Concluído',
  entregue:        'Entregue',
}

interface CardResumo {
  label: string
  valor: number
  cor: string
  rota: string
}

function Home() {
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [graficos, setGraficos] = useState<DadosGraficos | null>(null)
  const [carregando, setCarregando] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get<Resumo>('/veiculos/resumo'),
      api.get<DadosGraficos>('/veiculos/graficos')
    ]).then(([resumoRes, graficosRes]) => {
      setResumo(resumoRes.data)
      setGraficos(graficosRes.data)
    }).finally(() => setCarregando(false))
  }, [])

  if (carregando) return <p style={{ padding: '2rem' }}>Carregando...</p>
  if (!resumo) return <p style={{ padding: '2rem' }}>Erro ao carregar dados.</p>

  const cards: CardResumo[] = [
    { label: 'Total de veículos', valor: resumo.total,           cor: '#1a1a2e', rota: '/veiculos' },
    { label: 'Em análise',        valor: resumo.em_analise,      cor: '#f6ad55', rota: '/veiculos' },
    { label: 'Em serviço',        valor: resumo.em_servico,      cor: '#63b3ed', rota: '/veiculos' },
    { label: 'Aguardando peça',   valor: resumo.aguardando_peca, cor: '#fc8181', rota: '/veiculos' },
    { label: 'Concluídos',        valor: resumo.concluido,       cor: '#68d391', rota: '/veiculos' },
    { label: 'Entregues',         valor: resumo.entregue,        cor: '#a0aec0', rota: '/veiculos' },
  ]

  const dadosPizza = graficos?.porStatus?.map(s => ({
    name: STATUS_LABEL[s.status] || s.status,
    value: s.total,
    cor: STATUS_CORES[s.status] || '#ccc'
  })) || []

  const dadosMes = graficos?.porMes?.map(m => ({
    mes: m.mes,
    total: m.total
  })) || []

  const dadosMarca = graficos?.porMarca || []

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Painel de controle</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Visão geral do sistema</p>

      {/* Cards de resumo */}
      <div className="grid-responsivo grid-3-responsivo" style={styles.grid}>
      {cards.map(card => (
          <div
            key={card.label}
            style={{ ...styles.card, borderTop: `4px solid ${card.cor}` }}
            onClick={() => navigate(card.rota)}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{ ...styles.valor, color: card.cor }}>{card.valor}</span>
            <span style={styles.cardLabel}>{card.label}</span>
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <div style={{ ...styles.cardGrafico, marginBottom: '1rem' }}>
        <h3 style={styles.tituloGrafico}>Ações rápidas</h3>
        <div className="acoes-responsivas" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          <button onClick={() => navigate('/veiculos/novo')} style={styles.botao}>🚗 Nova entrada de veículo</button>
          <button onClick={() => navigate('/clientes/novo')} style={styles.botao}>👤 Novo cliente</button>
          <button onClick={() => navigate('/marcas')} style={styles.botao}>🏷️ Gerenciar marcas</button>
          <button onClick={() => navigate('/relatorios')} style={styles.botao}>📊 Relatórios</button>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid-2-responsivo" style={styles.gridGraficos}>

        <div style={styles.cardGrafico}>
          <h3 style={styles.tituloGrafico}>Veículos por status</h3>
          {dadosPizza.length === 0 ? (
            <p style={styles.semDados}>Nenhum dado disponível</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dadosPizza} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {dadosPizza.map((entry, index) => (
                    <Cell key={index} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} veículos`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={styles.cardGrafico}>
          <h3 style={styles.tituloGrafico}>Entradas por mês</h3>
          {dadosMes.length === 0 ? (
            <p style={styles.semDados}>Nenhum dado disponível</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} veículos`]} />
                <Bar dataKey="total" fill="#63b3ed" radius={[4, 4, 0, 0]} name="Veículos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={styles.cardGrafico}>
          <h3 style={styles.tituloGrafico}>Top marcas</h3>
          {dadosMarca.length === 0 ? (
            <p style={styles.semDados}>Nenhum dado disponível</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosMarca} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="marca" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value) => [`${value} veículos`]} />
                <Bar dataKey="total" fill="#68d391" radius={[0, 4, 4, 0]} name="Veículos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={styles.cardGrafico}>
          <h3 style={styles.tituloGrafico}>Tempo médio de serviço</h3>
          <div style={styles.metrica}>
            <span style={styles.metricaValor}>{graficos?.tempoMedio || '—'}</span>
            <span style={styles.metricaLabel}>dias em média por veículo entregue</span>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  valor: { fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 },
  cardLabel: { marginTop: '0.5rem', color: '#666', fontSize: '0.9rem', textAlign: 'center' },
  gridGraficos: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  cardGrafico: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  tituloGrafico: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e', fontSize: '1rem' },
  semDados: { color: '#999', textAlign: 'center', padding: '2rem 0' },
  metrica: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' },
  metricaValor: { fontSize: '3rem', fontWeight: 'bold', color: '#1a1a2e' },
  metricaLabel: { color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' },
  botao: { backgroundColor: '#f0f2f5', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left' }
}

export default Home