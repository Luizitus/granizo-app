// src/pages/EditarVeiculo.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

function EditarVeiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const [modelosFiltrados, setModelosFiltrados] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const [form, setForm] = useState({
    placa: '', id_cliente: '', id_marca: '', id_modelo: '',
    qtde_amassados: 0, trabalho_a_frio: 0, pintura: 0,
    pecas_para_trocar: '', riscos_amassados: '', faturar: 0
  })

  useEffect(() => {
    // Carrega dados do veículo, clientes, marcas e modelos ao mesmo tempo
    Promise.all([
      api.get(`/veiculos/${id}`),
      api.get('/clientes'),
      api.get('/marcas'),
      api.get('/modelos')
    ]).then(([veiculoRes, clientesRes, marcasRes, modelosRes]) => {
      const v = veiculoRes.data
      setClientes(clientesRes.data)
      setMarcas(marcasRes.data)
      setModelos(modelosRes.data)

      // Filtra modelos da marca do veículo
      const filtrados = modelosRes.data.filter(m => m.id_marca === v.id_marca)
      setModelosFiltrados(filtrados)

      // Preenche o formulário com os dados atuais
      setForm({
        placa:             v.placa,
        id_cliente:        v.id_cliente,
        id_marca:          v.id_marca,
        id_modelo:         v.id_modelo,
        qtde_amassados:    v.qtde_amassados,
        trabalho_a_frio:   v.trabalho_a_frio,
        pintura:           v.pintura,
        pecas_para_trocar: v.pecas_para_trocar || '',
        riscos_amassados:  v.riscos_amassados  || '',
        faturar:           v.faturar
      })
    }).catch(() => navigate('/veiculos'))
      .finally(() => setCarregando(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'id_marca') {
      const filtrados = modelos.filter(m => m.id_marca === parseInt(value))
      setModelosFiltrados(filtrados)
      setForm({ ...form, id_marca: value, id_modelo: '' })
      return
    }

    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked ? 1 : 0 })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro('')
    try {
      await api.put(`/veiculos/${id}`, form)
      navigate(`/veiculos/${id}`)
    } catch (err) {
      setErro('Erro ao atualizar veículo. Verifique os dados.')
      setEnviando(false)
    }
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(`/veiculos/${id}`)} style={styles.botaoVoltar}>← Voltar</button>
      <h2 style={{ margin: '0.5rem 0 1.5rem' }}>Editar Veículo</h2>
      {erro && <p style={styles.erro}>{erro}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <h3 style={styles.secao}>Dados do Veículo</h3>
        <div style={styles.linha}>
          <div style={styles.campo}>
            <label style={styles.label}>Placa *</label>
            <input style={styles.input} name="placa" value={form.placa} onChange={handleChange} required />
          </div>
        </div>

        <div style={styles.linha}>
          <div style={styles.campo}>
            <label style={styles.label}>Marca *</label>
            <select style={styles.input} name="id_marca" value={form.id_marca} onChange={handleChange} required>
              <option value="">Selecione a marca</option>
              {marcas.map(m => (
                <option key={m.id_marca} value={m.id_marca}>{m.marca}</option>
              ))}
            </select>
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Modelo *</label>
            <select style={styles.input} name="id_modelo" value={form.id_modelo} onChange={handleChange} required disabled={!form.id_marca}>
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
          <select style={styles.input} name="id_cliente" value={form.id_cliente} onChange={handleChange} required>
            <option value="">Selecione o cliente</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nome} — {c.telefone}</option>
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
              value={form.riscos_amassados} onChange={handleChange} />
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
            value={form.pecas_para_trocar} onChange={handleChange} />
        </div>

        <button type="submit" style={styles.botao} disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar Alterações'}
        </button>

      </form>
    </div>
  )
}

const styles = {
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
  botaoVoltar: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.9rem' },
  erro: { color: 'red', marginBottom: '1rem' }
}

export default EditarVeiculo