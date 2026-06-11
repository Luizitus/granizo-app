// src/pages/Usuarios.tsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Usuario } from '../types'

interface FormUsuario {
  nome: string
  email: string
  senha: string
  perfil: 'admin' | 'operador'
}

const formVazio: FormUsuario = { nome: '', email: '', senha: '', perfil: 'operador' }

function Usuarios() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [form, setForm] = useState<FormUsuario>(formVazio)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState<boolean>(false)
  const [erro, setErro] = useState<string>('')
  const [enviando, setEnviando] = useState<boolean>(false)

  const carregar = () => {
    api.get<Usuario[]>('/usuarios').then(res => setUsuarios(res.data))
  }

  useEffect(() => { carregar() }, [])

  const handleEditar = (u: Usuario) => {
    setEditandoId(u.id_usuario)
    setForm({ nome: u.nome, email: u.email, senha: '', perfil: u.perfil })
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
        await api.put(`/usuarios/${editandoId}`, form)
      } else {
        await api.post('/usuarios', form)
      }
      setForm(formVazio)
      setMostrarForm(false)
      setEditandoId(null)
      carregar()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { erro?: string } } }
      setErro(error.response?.data?.erro || 'Erro ao salvar usuário.')
    } finally {
      setEnviando(false)
    }
  }

  const handleDeletar = async (id: number, nome: string) => {
    if (id === usuario?.id_usuario) {
      alert('Você não pode remover seu próprio usuário.')
      return
    }
    if (!confirm(`Remover o usuário "${nome}"?`)) return
    try {
      await api.delete(`/usuarios/${id}`)
      carregar()
    } catch (err) {
      alert('Erro ao remover usuário.')
    }
  }

  if (usuario?.perfil !== 'admin') {
    return (
      <div style={styles.card}>
        <p style={{ color: '#c53030' }}>Acesso restrito a administradores.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Usuários</h2>
        <button onClick={handleNovo} style={styles.botaoPrimario}>
          {mostrarForm && !editandoId ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {mostrarForm && (
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>{editandoId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          {erro && <p style={styles.erro}>{erro}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>Nome *</label>
                <input style={styles.input} value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Email *</label>
                <input style={styles.input} type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div style={styles.linha}>
              <div style={styles.campo}>
                <label style={styles.label}>
                  {editandoId ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}
                </label>
                <input style={styles.input} type="password" value={form.senha}
                  onChange={e => setForm({ ...form, senha: e.target.value })}
                  required={!editandoId} />
              </div>
              <div style={styles.campo}>
                <label style={styles.label}>Perfil</label>
                <select style={styles.input} value={form.perfil}
                  onChange={e => setForm({ ...form, perfil: e.target.value as 'admin' | 'operador' })}>
                  <option value="operador">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={styles.botaoPrimario} disabled={enviando}>
                {enviando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
              <button type="button" style={styles.botaoCancelar}
                onClick={() => { setMostrarForm(false); setEditandoId(null); setForm(formVazio) }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Usuários cadastrados</h3>
        {usuarios.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum usuário cadastrado.</p>
        ) : (
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Perfil</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario} style={styles.tr}>
                  <td style={styles.td}>
                    {u.nome}
                    {u.id_usuario === usuario?.id_usuario && (
                      <span style={styles.voce}> (você)</span>
                    )}
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: u.perfil === 'admin' ? '#1a1a2e' : '#63b3ed'
                    }}>
                      {u.perfil === 'admin' ? 'Administrador' : 'Operador'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditar(u)} style={styles.botaoEditar}>
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(u.id_usuario, u.nome)}
                        style={styles.botaoDeletar}
                        disabled={u.id_usuario === usuario?.id_usuario}>
                        🗑️ Remover
                      </button>
                    </div>
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

const styles: Record<string, React.CSSProperties> = {
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
  botaoDeletar: { backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #fc8181', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', color: '#fff' },
  voce: { color: '#999', fontSize: '0.85rem' },
  erro: { color: '#c53030', backgroundColor: '#fff5f5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }
}

export default Usuarios