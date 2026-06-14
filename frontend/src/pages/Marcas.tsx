// src/pages/Marcas.tsx
import { useState, useEffect } from 'react'
import api from '../services/api'
import { Marca } from '../types'

function Marcas() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [novaMarca, setNovaMarca] = useState<string>('')
  const [erro, setErro] = useState<string>('')
  const [enviando, setEnviando] = useState<boolean>(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [valorEdicao, setValorEdicao] = useState<string>('')

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

  const iniciarEdicao = (m: Marca) => {
    setEditandoId(m.id_marca)
    setValorEdicao(m.marca)
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setValorEdicao('')
  }

  const salvarEdicao = async (id: number) => {
    if (!valorEdicao.trim()) return
    try {
      await api.put(`/marcas/${id}`, { marca: valorEdicao })
      setEditandoId(null)
      carregar()
    } catch (err) {
      alert('Erro ao atualizar marca.')
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
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {marcas.map(m => (
                  <tr key={m.id_marca} style={styles.tr}>
                    <td style={styles.td}>{m.id_marca}</td>
                    <td style={styles.td}>
                      {editandoId === m.id_marca ? (
                        <input
                          style={styles.inputInline}
                          value={valorEdicao}
                          onChange={e => setValorEdicao(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        m.marca
                      )}
                    </td>
                    <td style={styles.td}>
                      {editandoId === m.id_marca ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => salvarEdicao(m.id_marca)} style={styles.botaoSalvar}>
                            ✓ Salvar
                          </button>
                          <button onClick={cancelarEdicao} style={styles.botaoCancelar}>
                            ✕ Cancelar
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => iniciarEdicao(m)} style={styles.botaoEditar}>
                          ✏️ Editar
                        </button>
                      )}
                    </td>
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
  inputInline: { padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', width: '100%' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  botaoEditar: { backgroundColor: '#f0f2f5', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  botaoSalvar: { backgroundColor: '#68d391', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  botaoCancelar: { backgroundColor: '#e2e8f0', color: '#333', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default Marcas