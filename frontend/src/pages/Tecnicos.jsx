// src/pages/Tecnicos.jsx
import { useState, useEffect } from 'react'
import api from '../services/api'

const formVazio = { nome: '', cidade: '', endereco: '', telefone: '', email: '', iban: '' }

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([])
  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState(null)

  const carregar = () => {
    api.get('/tecnicos').then(res => setTecnicos(res.data))
  }

  useEffect(() => { carregar() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Abre o formulário preenchido com os dados do técnico
  const handleEditar = (tecnico) => {
    setEditandoId(tecnico.id_tecnico)
    setForm({
      nome:     tecnico.nome     || '',
      cidade:   tecnico.cidade   || '',
      endereco: tecnico.endereco || '',
      telefone: tecnico.telefone || '',
      email:    tecnico.email    || '',
      iban:     tecnico.iban     || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      if (editandoId) {
        // Edição — usa PUT
        await api.put(`/tecnicos/${editandoId}`, form)
      } else {
        // Cadastro — usa POST
        await api.post('/tecnicos', form)
      }
      setForm(formVazio)
      setMostrarForm(false)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro('Erro ao salvar técnico.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Técnicos</h2>
        <button onClick={handleNovo} style={styles.botaoPrimario}>
          {mostrarForm && !editandoId ? 'Cancelar' : '+ Novo Técnico'}
        </button>
      </div>

      {/* Formulário de cadastro/edição */}
      {mostrarForm && (
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>
            {editandoId ? 'Editar Técnico' : 'Novo Técnico'}
          </h3>
          {erro && <p style={styles.erro}>{erro}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} name="nome" value={form.nome} onChange={handleChange} required />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Telefone</label>
                <input style={styles.input} name="telefone" value={form.telefone} onChange={handleChange} />
              </div>
            </div>
            <div style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Cidade</label>
                <input style={styles.input} name="cidade" value={form.cidade} onChange={handleChange} />
              </div>
            </div>
            <div style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Endereço</label>
                <input style={styles.input} name="endereco" value={form.endereco} onChange={handleChange} />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>IBAN</label>
                <input style={styles.input} name="iban" value={form.iban} onChange={handleChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={styles.botaoPrimario} disabled={enviando}>
                {enviando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Salvar Técnico'}
              </button>
              <button type="button" onClick={() => { setMostrarForm(false); setEditandoId(null); setForm(formVazio) }}
                style={styles.botaoCancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Técnicos cadastrados</h3>
        {tecnicos.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum técnico cadastrado ainda.</p>
        ) : (
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Cidade</th>
                <th style={styles.th}>Endereço</th>  {/* linha nova */}
                <th style={styles.th}>IBAN</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map(t => (
                <tr key={t.id_tecnico} style={styles.tr}>
                  <td style={styles.td}>{t.nome}</td>
                  <td style={styles.td}>{t.telefone || '—'}</td>
                  <td style={styles.td}>{t.email || '—'}</td>
                  <td style={styles.td}>{t.cidade || '—'}</td>
                  <td style={styles.td}>{t.endereco || '—'}</td>  {/* linha nova */}
                  <td style={styles.td}>{t.iban || '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEditar(t)} style={styles.botaoEditar}>
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px' },
  cardTitulo: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e' },
  form: { display: 'flex', flexDirection: 'column' },
  linha: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  campo: { display: 'flex', flexDirection: 'column', flex: 1 },
  label: { marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.9rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  botaoPrimario: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  botaoCancelar: { backgroundColor: '#e2e8f0', color: '#333', padding: '0.6rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  botaoEditar: { backgroundColor: '#f0f2f5', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default Tecnicos