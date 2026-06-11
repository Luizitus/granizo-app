// src/pages/ListaClientes.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Cliente } from '../types'

function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [busca, setBusca] = useState<string>('')

  useEffect(() => {
    api.get<Cliente[]>('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
      .finally(() => setCarregando(false))
  }, [])

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    (c.cidade?.toLowerCase().includes(busca.toLowerCase()) ?? false)
  )

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Clientes</h2>
        <Link to="/clientes/novo" style={styles.botao}>+ Novo Cliente</Link>
      </div>

      <input
        style={styles.busca}
        placeholder="🔍 Buscar por nome, telefone ou cidade..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      {clientesFiltrados.length === 0 ? (
        <p style={{ color: '#999', marginTop: '1rem' }}>
          {busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
        </p>
      ) : (
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Telefone</th>
              <th style={styles.th}>Cidade</th>
              <th style={styles.th}>Contato</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(c => (
              <tr key={c.id_cliente} style={styles.tr}>
                <td style={styles.td}>{c.nome}</td>
                <td style={styles.td}>{c.telefone}</td>
                <td style={styles.td}>{c.cidade || '—'}</td>
                <td style={styles.td}>{c.contato || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {busca && (
        <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          {clientesFiltrados.length} resultado(s) encontrado(s)
        </p>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  busca: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' },
  tabela: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' },
}

export default ListaClientes