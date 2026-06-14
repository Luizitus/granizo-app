// src/pages/Modelos.tsx
import { useState, useEffect } from 'react'
import api from '../services/api'
import { Modelo, Marca } from '../types'

interface FormModelo {
  modelo: string
  id_marca: string
}

interface EdicaoModelo {
  modelo: string
  id_marca: string
}

function Modelos() {
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [form, setForm] = useState<FormModelo>({ modelo: '', id_marca: '' })
  const [erro, setErro] = useState<string>('')
  const [enviando, setEnviando] = useState<boolean>(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [edicao, setEdicao] = useState<EdicaoModelo>({ modelo: '', id_marca: '' })

  const carregar = () => {
    api.get<Modelo[]>('/modelos').then(res => setModelos(res.data))
    api.get<Marca[]>('/marcas').then(res => setMarcas(res.data))
  }

  useEffect(() => { carregar() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      await api.post('/modelos', form)
      setForm({ modelo: '', id_marca: '' })
      carregar()
    } catch (err) {
      setErro('Erro ao cadastrar modelo.')
    } finally {
      setEnviando(false)
    }
  }

  const iniciarEdicao = (m: Modelo) => {
    setEditandoId(m.id_modelo)
    setEdicao({ modelo: m.modelo, id_marca: String(m.id_marca) })
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setEdicao({ modelo: '', id_marca: '' })
  }

  const salvarEdicao = async (id: number) => {
    if (!edicao.modelo.trim() || !edicao.id_marca) return
    try {
      await api.put(`/modelos/${id}`, edicao)
      setEditandoId(null)
      carregar()
    } catch (err) {
      alert('Erro ao atualizar modelo.')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '1.5rem' }}>Modelos</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Novo Modelo</h3>
        {erro && <p style={styles.erro}>{erro}</p>}
        <form onSubmit={handleSubmit} className="linha-form-responsiva" style={styles.form}>
          <select
            style={styles.input}
            value={form.id_marca}
            onChange={e => setForm({ ...form, id_marca: e.target.value })}
            required
          >
            <option value="">Selecione a marca</option>
            {marcas.map(m => (
              <option key={m.id_marca} value={m.id_marca}>{m.marca}</option>
            ))}
          </select>
          <input
            style={styles.input}
            value={form.modelo}
            onChange={e => setForm({ ...form, modelo: e.target.value })}
            placeholder="Ex: Gol"
            required
          />
          <button type="submit" style={styles.botao} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Modelos cadastrados</h3>
        {modelos.length === 0 ? (
          <p>Nenhum modelo cadastrado ainda.</p>
        ) : (
          <div className="tabela-wrapper">
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Marca</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {modelos.map(m => (
                  <tr key={m.id_modelo} style={styles.tr}>
                    <td style={styles.td}>{m.id_modelo}</td>
                    <td style={styles.td}>
                      {editandoId === m.id_modelo ? (
                        <input
                          style={styles.inputInline}
                          value={edicao.modelo}
                          onChange={e => setEdicao({ ...edicao, modelo: e.target.value })}
                          autoFocus
                        />
                      ) : (
                        m.modelo
                      )}
                    </td>
                    <td style={styles.td}>
                      {editandoId === m.id_modelo ? (
                        <select
                          style={styles.inputInline}
                          value={edicao.id_marca}
                          onChange={e => setEdicao({ ...edicao, id_marca: e.target.value })}
                        >
                          {marcas.map(ma => (
                            <option key={ma.id_marca} value={ma.id_marca}>{ma.marca}</option>
                          ))}
                        </select>
                      ) : (
                        m.nome_marca
                      )}
                    </td>
                    <td style={styles.td}>
                      {editandoId === m.id_modelo ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => salvarEdicao(m.id_modelo)} style={styles.botaoSalvar}>
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

export default Modelos