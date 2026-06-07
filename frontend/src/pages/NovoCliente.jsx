// src/pages/NovoCliente.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function NovoCliente() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '', telefone: '', cidade: '',
    endereco: '', contato: '', tipo_contato: ''
  })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)  // controle de envio

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('handleSubmit chamado')  // adiciona essa linha
    if (enviando) return   // bloqueia segundo clique
    setEnviando(true)
    setErro('')
    try {
      await api.post('/clientes', form)
      navigate('/clientes')
    } catch (err) {
      setErro('Erro ao cadastrar cliente. Verifique os dados.')
      setEnviando(false)  // libera só se der erro
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '1.5rem' }}>Novo Cliente</h2>
      {erro && <p style={styles.erro}>{erro}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Nome *</label>
        <input style={styles.input} name="nome" value={form.nome} onChange={handleChange} required />

        <label style={styles.label}>Telefone *</label>
        <input style={styles.input} name="telefone" value={form.telefone} onChange={handleChange} required />

        <label style={styles.label}>Cidade</label>
        <input style={styles.input} name="cidade" value={form.cidade} onChange={handleChange} />

        <label style={styles.label}>Endereço</label>
        <input style={styles.input} name="endereco" value={form.endereco} onChange={handleChange} />

        <label style={styles.label}>Contato (email ou outro)</label>
        <input style={styles.input} name="contato" value={form.contato} onChange={handleChange} />

        <label style={styles.label}>Tipo de contato</label>
        <select style={styles.input} name="tipo_contato" value={form.tipo_contato} onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telefone">Telefone</option>
        </select>

        <button type="submit" style={styles.botao} disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', maxWidth: '500px' },
  label: { marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.9rem' },
  input: { marginBottom: '1rem', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default NovoCliente