// src/pages/Relatorios.tsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Veiculo, StatusVeiculo } from '../types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const statusLabel: Record<StatusVeiculo, string> = {
  em_analise:      'Em análise',
  em_servico:      'Em serviço',
  aguardando_peca: 'Aguardando peça',
  concluido:       'Concluído',
  entregue:        'Entregue',
}

const cores: Record<StatusVeiculo, string> = {
  em_analise:      '#f6ad55',
  em_servico:      '#63b3ed',
  aguardando_peca: '#fc8181',
  concluido:       '#68d391',
  entregue:        '#a0aec0',
}

function Relatorios() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')

  useEffect(() => {
    api.get<Veiculo[]>('/veiculos')
      .then(res => setVeiculos(res.data))
      .finally(() => setCarregando(false))
  }, [])

  const veiculosFiltrados = veiculos.filter(v => {
    const statusOk = filtroStatus === '' || v.status === filtroStatus
    const inicioOk = dataInicio === '' || v.data_entrada >= dataInicio
    const fimOk    = dataFim === ''    || v.data_entrada <= dataFim
    return statusOk && inicioOk && fimOk
  })

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Relatório de Veículos — Granizo App', 14, 15)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22)
    doc.text(`Total de registros: ${veiculosFiltrados.length}`, 14, 28)

    autoTable(doc, {
      startY: 35,
      head: [['Placa', 'Modelo', 'Cliente', 'Técnico', 'Entrada', 'Entrega', 'Status']],
      body: veiculosFiltrados.map(v => [
        v.placa,
        v.modelo_nome || '—',
        v.cliente_nome || '—',
        v.tecnico_nome || '—',
        v.data_entrada,
        v.data_entrega || '—',
        statusLabel[v.status] || v.status,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [26, 26, 46] },
      alternateRowStyles: { fillColor: [240, 242, 245] },
    })

    doc.save(`relatorio-granizo-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportarExcel = () => {
    const dados = veiculosFiltrados.map(v => ({
      Placa:         v.placa,
      Modelo:        v.modelo_nome || '—',
      Marca:         v.marca_nome  || '—',
      Cliente:       v.cliente_nome || '—',
      Telefone:      v.cliente_telefone || '—',
      Tecnico:       v.tecnico_nome || '—',
      Amassados:     v.qtde_amassados,
      Trabalho_Frio: v.trabalho_a_frio ? 'Sim' : 'Não',
      Pintura:       v.pintura ? 'Sim' : 'Não',
      Pecas:         v.pecas_para_trocar || '—',
      Faturar:       v.faturar ? 'Sim' : 'Não',
      Data_Entrada:  v.data_entrada,
      Data_Entrega:  v.data_entrega || '—',
      Status:        statusLabel[v.status] || v.status,
    }))

    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Veículos')
    XLSX.writeFile(wb, `relatorio-granizo-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (carregando) return <p>Carregando...</p>

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Relatórios</h2>

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Filtros</h3>
        <div className="filtros-responsivos" style={styles.filtros}>
          <div style={styles.campo}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="em_analise">Em análise</option>
              <option value="em_servico">Em serviço</option>
              <option value="aguardando_peca">Aguardando peça</option>
              <option value="concluido">Concluído</option>
              <option value="entregue">Entregue</option>
            </select>
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Data de entrada — início</label>
            <input style={styles.input} type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
          </div>
          <div style={styles.campo}>
            <label style={styles.label}>Data de entrada — fim</label>
            <input style={styles.input} type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={styles.card}>
      <div className="cabecalho-card-responsivo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={styles.cardTitulo}>{veiculosFiltrados.length} veículo(s) encontrado(s)</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={exportarPDF} style={styles.botaoPDF}>📄 Exportar PDF</button>
            <button onClick={exportarExcel} style={styles.botaoExcel}>📊 Exportar Excel</button>
          </div>
        </div>

        {veiculosFiltrados.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum veículo encontrado para esse filtro.</p>
        ) : (
          <div className="tabela-wrapper">
            <table style={styles.tabela}>
              <thead>
                <tr>
                  <th style={styles.th}>Placa</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Técnico</th>
                  <th style={styles.th}>Entrada</th>
                  <th style={styles.th}>Entrega</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {veiculosFiltrados.map(v => (
                  <tr key={v.id_veiculo} style={styles.tr}>
                    <td style={styles.td}>{v.placa}</td>
                    <td style={styles.td}>{v.modelo_nome}</td>
                    <td style={styles.td}>{v.cliente_nome}</td>
                    <td style={styles.td}>{v.tecnico_nome || '—'}</td>
                    <td style={styles.td}>{v.data_entrada}</td>
                    <td style={styles.td}>{v.data_entrega || '—'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: cores[v.status] || '#ccc' }}>
                        {statusLabel[v.status]}
                      </span>
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
  card: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' },
  cardTitulo: { color: '#1a1a2e', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #1a1a2e' },
  filtros: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  campo: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' },
  label: { marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.9rem' },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#1a1a2e', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', color: '#fff' },
  botaoPDF:   { backgroundColor: '#e53e3e', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' },
  botaoExcel: { backgroundColor: '#38a169', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' },
}

export default Relatorios