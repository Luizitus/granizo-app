// src/pages/ListaClientes.tsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Cliente } from '../types'

interface FormCliente {
  nome: string
  telefone: string
  cidade: string
  endereco: string
  contato: string
  tipo_contato: string
}

const formVazio: FormCliente = { nome: '', telefone: '', cidade: '', endereco: '', contato: '', tipo_contato: '' }

function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [busca, setBusca] = useState<string>('')
  const [mostrarForm, setMostrarForm] = useState<boolean>(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<FormCliente>(formVazio)
  const [erro, setErro] = useState<string>('')
  const [enviando, setEnviando] = useState<boolean>(false)

  const carregar = () => {
    api.get<Cliente[]>('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregar() }, [])

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    (c.cidade?.toLowerCase().includes(busca.toLowerCase()) ?? false)
  )

  const handleEditar = (c: Cliente) => {
    setEditandoId(c.id_cliente)
    setForm({
      nome: c.nome,
      telefone: c.telefone,
      cidade: c.cidade || '',
      endereco: c.endereco || '',
      contato: c.contato || '',
      tipo_contato: c.tipo_contato || ''
    })
    setMostrarForm(true)
    setErro('')
  }

  const handleNovo = () => {
    setEditandoId(null)
    setForm(formVazio)
    setMostrarForm(!mostrarForm)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, form)
      } else {
        await api.post('/clientes', form)
      }
      setForm(formVazio)
      setMostrarForm(false)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro('Erro ao salvar cliente.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Clientes</h2>
        <button onClick={handleNovo} style={styles.botaoPrimario}>
          {mostrarForm && !editandoId ? 'Cancelar' : '+ Novo Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>{editandoId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          {erro && <p style={styles.erro}>{erro}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="linha-form-responsiva" style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Telefone *</label>
                <input style={styles.input} value={form.telefone}
                  onChange={e => setForm({ ...form, telefone: e.target.value })} required />
              </div>
            </div>
            <div className="linha-form-responsiva" style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Cidade</label>
                <input style={styles.input} value={form.cidade}
                  onChange={e => setForm({ ...form, cidade: e.target.value })} />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Endereço</label>
                <input style={styles.input} value={form.endereco}
                  onChange={e => setForm({ ...form, endereco: e.target.value })} />
              </div>
            </div>
            <div className="linha-form-responsiva" style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Contato (email ou outro)</label>
                <input style={styles.input} value={form.contato}
                  onChange={e => setForm({ ...form, contato: e.target.value })} />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Tipo de contato</label>
                <select style={styles.input} value={form.tipo_contato}
                  onChange={e => setForm({ ...form, tipo_contato: e.target.value })}>
                  <option value="">Selecione</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telefone">Telefone</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={styles.botaoPrimario} disabled={enviando}>
                {enviando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Salvar Cliente'}
              </button>
              <button type="button" style={styles.botaoCancelar}
                onClick={() => { setMostrarForm(false); setEditandoId(null); setForm(formVazio) }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
        <div className="tabela-wrapper">
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Cidade</th>
                <th style={styles.th}>Contato</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(c => (
                <tr key={c.id_cliente} style={styles.tr}>
                  <td style={styles.td}>{c.nome}</td>
                  <td style={styles.td}>{c.telefone}</td>
                  <td style={styles.td}>{c.cidade || '—'}</td>
                  <td style={styles.td}>{c.contato || '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEditar(c)} style={styles.botaoEditar}>
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  container: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px' },
  cardTitulo: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e' },
  form: { display: 'flex', flexDirection: 'column' },
  linha: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  campo: { display: 'flex', flexDirection: 'column', flex: 1 },
  label: { marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.9rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  busca: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' },
  botaoPrimario: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  botaoCancelar: { backgroundColor: '#e2e8f0', color: '#333', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  botaoEditar: { backgroundColor: '#f0f2f5', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tabela: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  erro: { color: 'red', marginBottom: '1rem', backgroundColor: '#fff5f5', padding: '0.75rem', borderRadius: '8px' },
}

export default ListaClientes