// src/pages/NovoVeiculo.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Cliente, Marca, Modelo } from '../types'

interface FormVeiculo {
  placa: string
  id_cliente: string
  id_marca: string
  id_modelo: string
  qtde_amassados: number
  trabalho_a_frio: number
  pintura: number
  pecas_para_trocar: string
  riscos_amassados: string
  faturar: number
  data_entrada: string
}

function NovoVeiculo() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [modelosFiltrados, setModelosFiltrados] = useState<Modelo[]>([])
  const [enviando, setEnviando] = useState<boolean>(false)
  const [erro, setErro] = useState<string>('')

  const [form, setForm] = useState<FormVeiculo>({
    placa: '',
    id_cliente: '',
    id_marca: '',
    id_modelo: '',
    qtde_amassados: 0,
    trabalho_a_frio: 0,
    pintura: 0,
    pecas_para_trocar: '',
    riscos_amassados: '',
    faturar: 0,
    data_entrada: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    api.get<Cliente[]>('/clientes').then(res => setClientes(res.data))
    api.get<Marca[]>('/marcas').then(res => setMarcas(res.data))
    api.get<Modelo[]>('/modelos').then(res => setModelos(res.data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name === 'id_marca') {
      const filtrados = modelos.filter(m => m.id_marca === parseInt(value))
      setModelosFiltrados(filtrados)
      setForm({ ...form, id_marca: value, id_modelo: '' })
      return
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm({ ...form, [name]: checked ? 1 : 0 })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      await api.post('/veiculos', form)
      navigate('/veiculos')
    } catch (err) {
      setErro('Erro ao cadastrar veículo. Verifique os dados.')
      setEnviando(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '1.5rem' }}>Nova Entrada de Veículo</h2>
      {erro && <p style={styles.erro}>{erro}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <h3 style={styles.secao}>Dados do Veículo</h3>
        <div style={styles.linha}>
          <div style={styles.campo}>
            <label style={styles.label}>Placa *</label>
            <input style={styles.input} name="placa" value={form.placa}
              onChange={handleChange} required placeholder="ABC1234" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Data de entrada *</label>
            <input style={styles.input} type="date" name="data_entrada"
              value={form.data_entrada} onChange={handleChange} required />
          </div>
        </div>

        <div style={styles.linha}>
          <div style={styles.campo}>
            <label style={styles.label}>Marca *</label>
            <select style={styles.input} name="id_marca" value={form.id_marca}
              onChange={handleChange} required>
              <option value="">Selecione a marca</option>
              {marcas.map(m => (
                <option key={m.id_marca} value={m.id_marca}>{m.marca}</option>
              ))}
            </select>
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Modelo *</label>
            <select style={styles.input} name="id_modelo" value={form.id_modelo}
              onChange={handleChange} required disabled={!form.id_marca}>
              <option value="">Selecione o modelo</option>
              {modelosFiltrados.map(m => (
                <option key={m.id_modelo} value={m.id_modelo}>{m.modelo}</option>
              ))}
            </select>
          </div>
        </div>

        <h3 style={styles.secao}>Proprietário</h3>
        <div style={styles.campo}>
          <label style={styles.label}>Cliente *</label>
          <select style={styles.input} name="id_cliente" value={form.id_cliente}
            onChange={handleChange} required>
            <option value="">Selecione o cliente</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nome} — {c.telefone}
              </option>
            ))}
          </select>
        </div>

        <h3 style={styles.secao}>Avaliação do Serviço</h3>
        <div style={styles.linha}>
          <div style={styles.campo}>
            <label style={styles.label}>Quantidade de amassados</label>
            <input style={styles.input} type="number" name="qtde_amassados"
              value={form.qtde_amassados} onChange={handleChange} min="0" />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Riscos e amassados (descrição)</label>
            <input style={styles.input} name="riscos_amassados"
              value={form.riscos_amassados} onChange={handleChange}
              placeholder="Ex: teto, capô, porta direita" />
          </div>
        </div>

        <div style={styles.checkboxLinha}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="trabalho_a_frio"
              checked={form.trabalho_a_frio === 1} onChange={handleChange} />
            Trabalho a frio
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="pintura"
              checked={form.pintura === 1} onChange={handleChange} />
            Necessita pintura
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="faturar"
              checked={form.faturar === 1} onChange={handleChange} />
            Faturar
          </label>
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Peças para trocar</label>
          <input style={styles.input} name="pecas_para_trocar"
            value={form.pecas_para_trocar} onChange={handleChange}
            placeholder="Ex: para-choque, retrovisor" />
        </div>

        <button type="submit" style={styles.botao} disabled={enviando}>
          {enviando ? 'Salvando...' : 'Registrar Entrada'}
        </button>

      </form>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column' },
  secao: { margin: '1.5rem 0 1rem', color: '#1a1a2e', borderBottom: '2px solid #1a1a2e', paddingBottom: '0.5rem' },
  linha: { display: 'flex', gap: '1rem' },
  campo: { display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '1rem' },
  label: { marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.9rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  checkboxLinha: { display: 'flex', gap: '2rem', marginBottom: '1rem' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default NovoVeiculo