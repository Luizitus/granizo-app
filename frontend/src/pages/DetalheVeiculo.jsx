// src/pages/DetalheVeiculo.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const statusValidos = [
  { valor: 'em_analise',      label: 'Em análise' },
  { valor: 'em_servico',      label: 'Em serviço' },
  { valor: 'aguardando_peca', label: 'Aguardando peça' },
  { valor: 'concluido',       label: 'Concluído' },
  { valor: 'entregue',        label: 'Entregue' },
]

const cores = {
  em_analise:      '#f6ad55',
  em_servico:      '#63b3ed',
  aguardando_peca: '#fc8181',
  concluido:       '#68d391',
  entregue:        '#a0aec0',
}

function DetalheVeiculo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [veiculo, setVeiculo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [novoStatus, setNovoStatus] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [fotos, setFotos] = useState([])
  const [fotoSelecionada, setFotoSelecionada] = useState(null)
  const [tipoFoto, setTipoFoto] = useState('entrada')
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [mensagemFoto, setMensagemFoto] = useState('')
  const [tecnicos, setTecnicos] = useState([])
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState('')
  const [salvandoTecnico, setSalvandoTecnico] = useState(false)
  const [mensagemTecnico, setMensagemTecnico] = useState('')

  useEffect(() => {
    api.get(`/veiculos/${id}`)
      .then(res => {
        setVeiculo(res.data)
        setNovoStatus(res.data.status)
        setTecnicoSelecionado(res.data.id_tecnico || '')
      })
      .catch(() => navigate('/veiculos'))
      .finally(() => setCarregando(false))

    carregarFotos()
    api.get('/tecnicos').then(res => setTecnicos(res.data))
  }, [id])

  const carregarFotos = () => {
    api.get(`/fotos/${id}`).then(res => setFotos(res.data))
  }

  const atualizarStatus = async () => {
    if (salvando) return
    setSalvando(true)
    setMensagem('')
    try {
      await api.patch(`/veiculos/${id}/status`, { status: novoStatus })
      setMensagem('Status atualizado com sucesso!')
      setTimeout(() => navigate('/veiculos'), 1500)
    } catch (err) {
      setMensagem('Erro ao atualizar status.')
      setSalvando(false)
    }
  }

  const atualizarTecnico = async () => {
    if (salvandoTecnico) return
    setSalvandoTecnico(true)
    setMensagemTecnico('')
    try {
      await api.patch(`/veiculos/${id}/tecnico`, { id_tecnico: tecnicoSelecionado || null })
      setMensagemTecnico('Técnico vinculado com sucesso!')
      setTimeout(() => navigate('/veiculos'), 1500)
    } catch (err) {
      setMensagemTecnico('Erro ao vincular técnico.')
      setSalvandoTecnico(false)
    }
  }

  const enviarFoto = async () => {
    if (!fotoSelecionada || enviandoFoto) return
    setEnviandoFoto(true)
    setMensagemFoto('')
    const formData = new FormData()
    formData.append('foto', fotoSelecionada)
    formData.append('id_veiculo', id)
    formData.append('tipo', tipoFoto)
    try {
      await api.post('/fotos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFotoSelecionada(null)
      setMensagemFoto('Foto enviada com sucesso!')
      carregarFotos()
      document.getElementById('inputFoto').value = ''
    } catch (err) {
      setMensagemFoto('Erro ao enviar foto.')
    } finally {
      setEnviandoFoto(false)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (!veiculo) return <p>Veículo não encontrado.</p>

  const fotosEntrada = fotos.filter(f => f.tipo === 'entrada')
  const fotosSaida   = fotos.filter(f => f.tipo === 'saida')

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
            <button onClick={() => navigate('/veiculos')} style={styles.botaoVoltar}>← Voltar</button>
            <h2 style={{ marginTop: '0.5rem' }}>Veículo {veiculo.placa}</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => navigate(`/veiculos/${id}/editar`)} style={styles.botaoEditar}>
            ✏️ Editar dados
            </button>
            <span style={{ ...styles.badge, backgroundColor: cores[veiculo.status] }}>
            {statusValidos.find(s => s.valor === veiculo.status)?.label}
            </span>
        </div>
        </div>
      <div style={styles.grid}>

        {/* Dados do veículo */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Dados do Veículo</h3>
          <div style={styles.info}><span style={styles.chave}>Placa</span><span>{veiculo.placa}</span></div>
          <div style={styles.info}><span style={styles.chave}>Marca</span><span>{veiculo.marca_nome}</span></div>
          <div style={styles.info}><span style={styles.chave}>Modelo</span><span>{veiculo.modelo_nome}</span></div>
          <div style={styles.info}><span style={styles.chave}>Data de entrada</span><span>{veiculo.data_entrada}</span></div>
          <div style={styles.info}><span style={styles.chave}>Data de entrega</span><span>{veiculo.data_entrega || '—'}</span></div>
        </div>

        {/* Dados do cliente */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Proprietário</h3>
          <div style={styles.info}><span style={styles.chave}>Nome</span><span>{veiculo.cliente_nome}</span></div>
          <div style={styles.info}><span style={styles.chave}>Telefone</span><span>{veiculo.cliente_telefone}</span></div>
          <div style={styles.info}><span style={styles.chave}>Técnico responsável</span><span>{veiculo.tecnico_nome || '—'}</span></div>
        </div>

        {/* Avaliação do serviço */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Avaliação do Serviço</h3>
          <div style={styles.info}><span style={styles.chave}>Amassados</span><span>{veiculo.qtde_amassados}</span></div>
          <div style={styles.info}><span style={styles.chave}>Riscos/Amassados</span><span>{veiculo.riscos_amassados || '—'}</span></div>
          <div style={styles.info}><span style={styles.chave}>Trabalho a frio</span><span>{veiculo.trabalho_a_frio ? 'Sim' : 'Não'}</span></div>
          <div style={styles.info}><span style={styles.chave}>Pintura</span><span>{veiculo.pintura ? 'Sim' : 'Não'}</span></div>
          <div style={styles.info}><span style={styles.chave}>Peças para trocar</span><span>{veiculo.pecas_para_trocar || '—'}</span></div>
          <div style={styles.info}><span style={styles.chave}>Faturar</span><span>{veiculo.faturar ? 'Sim' : 'Não'}</span></div>
        </div>

        {/* Atualizar status */}
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Atualizar Status</h3>
          <select style={styles.select} value={novoStatus} onChange={e => setNovoStatus(e.target.value)}>
            {statusValidos.map(s => (
              <option key={s.valor} value={s.valor}>{s.label}</option>
            ))}
          </select>
          <button onClick={atualizarStatus} style={styles.botao} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Status'}
          </button>
          {mensagem && (
            <p style={{ marginTop: '0.75rem', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>
              {mensagem}
            </p>
          )}
        </div>

        {/* Vincular técnico */}
        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h3 style={styles.cardTitulo}>Técnico Responsável</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              style={{ ...styles.select, marginBottom: 0, flex: 1 }}
              value={tecnicoSelecionado}
              onChange={e => setTecnicoSelecionado(e.target.value)}
            >
              <option value="">Sem técnico</option>
              {tecnicos.map(t => (
                <option key={t.id_tecnico} value={t.id_tecnico}>{t.nome}</option>
              ))}
            </select>
            <button onClick={atualizarTecnico} style={styles.botao} disabled={salvandoTecnico}>
              {salvandoTecnico ? 'Salvando...' : 'Vincular Técnico'}
            </button>
          </div>
          {mensagemTecnico && (
            <p style={{ marginTop: '0.75rem', color: mensagemTecnico.includes('sucesso') ? 'green' : 'red' }}>
              {mensagemTecnico}
            </p>
          )}
        </div>

        {/* Upload de fotos */}
        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h3 style={styles.cardTitulo}>Fotos</h3>
          <div style={styles.uploadArea}>
            <input id="inputFoto" type="file" accept="image/*"
              onChange={e => setFotoSelecionada(e.target.files[0])} style={{ flex: 1 }} />
            <select style={{ ...styles.select, width: 'auto', marginBottom: 0 }}
              value={tipoFoto} onChange={e => setTipoFoto(e.target.value)}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
            <button onClick={enviarFoto} style={styles.botao} disabled={!fotoSelecionada || enviandoFoto}>
              {enviandoFoto ? 'Enviando...' : 'Enviar Foto'}
            </button>
          </div>
          {mensagemFoto && (
            <p style={{ color: mensagemFoto.includes('sucesso') ? 'green' : 'red', marginTop: '0.5rem' }}>
              {mensagemFoto}
            </p>
          )}
          {fotosEntrada.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#666' }}>Fotos de Entrada</h4>
              <div style={styles.galeria}>
                {fotosEntrada.map(f => (
                  <a key={f.id_foto} href={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${f.caminho}`} target="_blank" rel="noreferrer">
                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${f.caminho}`} alt="Foto de entrada" style={styles.foto} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {fotosSaida.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#666' }}>Fotos de Saída</h4>
              <div style={styles.galeria}>
                {fotosSaida.map(f => (
                  <a key={f.id_foto} href={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${f.caminho}`} target="_blank" rel="noreferrer">
                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${f.caminho}`} alt="Foto de saída" style={styles.foto} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {fotos.length === 0 && (
            <p style={{ color: '#999', marginTop: '1rem' }}>Nenhuma foto registrada ainda.</p>
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px' },
  cardTitulo: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e' },
  info: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0f2f5' },
  chave: { fontWeight: 'bold', color: '#666', fontSize: '0.9rem' },
  badge: { padding: '0.4rem 1rem', borderRadius: '999px', color: '#fff', fontWeight: 'bold' },
  botaoVoltar: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.9rem' },
  select: { width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem', marginBottom: '1rem' },
  botao: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  uploadArea: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  galeria: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
  foto: { width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0', cursor: 'pointer' },
  botaoEditar: { backgroundColor: '#1a1a2e', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' },
  //botaoEditar: { backgroundColor: '#f0f2f5', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' },
}

export default DetalheVeiculo