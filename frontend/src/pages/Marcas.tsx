// src/pages/Marcas.tsx
import { useState, useEffect } from 'react'
import api from '../services/api'
import { Marca } from '../types'

function Marcas() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [novaMarca, setNovaMarca] = useState<string>('')
  const [erro, setErro] = useState<string>('')
  const [enviando, setEnviando] = useState<boolean>(false)

  const carregar = () => {
    api.get<Marca[]>('/marcas').then(res => setMarcas(res.data))
  }

  useEffect(() => { carregar() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      await api.post('/marcas', { marca: novaMarca })
      setNovaMarca('')
      carregar()
    } catch (err) {
      setErro('Erro ao cadastrar marca.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '1.5rem' }}>Marcas</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Nova Marca</h3>
        {erro && <p style={styles.erro}>{erro}</p>}
        <form onSubmit={handleSubmit} className="linha-form-responsiva" style={styles.form}>
          <input
            style={styles.input}
            value={novaMarca}
            onChange={e => setNovaMarca(e.target.value)}
            placeholder="Ex: Volkswagen"
            required
          />
          <button type="submit" style={styles.botao} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Marcas cadastradas</h3>
        {marcas.length === 0 ? (
          <p>Nenhuma marca cadastrada ainda.</p>
        ) : (
          <div className="tabela-wrapper">
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Marca</th>
                </tr>
              </thead>
              <tbody>
                {marcas.map(m => (
                  <tr key={m.id_marca} style={styles.tr}>
                    <td style={styles.td}>{m.id_marca}</td>
                    <td style={styles.td}>{m.marca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px' },
  cardTitulo: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e' },
  form: { display: 'flex', gap: '1rem' },
  input: { flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default Marcas