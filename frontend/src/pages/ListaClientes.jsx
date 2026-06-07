// src/pages/ListaClientes.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function ListaClientes() {
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Clientes</h2>
        <Link to="/clientes/novo" style={styles.botao}>+ Novo Cliente</Link>
      </div>
      {clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Telefone</th>
              <th style={styles.th}>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id_cliente} style={styles.tr}>
                <td style={styles.td}>{c.nome}</td>
                <td style={styles.td}>{c.telefone}</td>
                <td style={styles.td}>{c.cidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles = {
  tabela: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' }
}

export default ListaClientes