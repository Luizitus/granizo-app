// backend/controllers/veiculoController.js
const { query, queryOne, execute, isPg } = require('../db')

const listar = async (req, res) => {
  try {
    const veiculos = await query(`
      SELECT
        v.*,
        c.nome        as cliente_nome,
        c.telefone    as cliente_telefone,
        ma.marca      as marca_nome,
        mo.modelo     as modelo_nome,
        t.nome        as tecnico_nome
      FROM veiculo v
      JOIN cliente c  ON v.id_cliente = c.id_cliente
      JOIN marca ma   ON v.id_marca   = ma.id_marca
      JOIN modelo mo  ON v.id_modelo  = mo.id_modelo
      LEFT JOIN tecnico t ON v.id_tecnico = t.id_tecnico
      ORDER BY v.data_entrada DESC
    `)
    res.json(veiculos)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar veículos.' })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const veiculo = await queryOne(`
      SELECT
        v.*,
        c.nome        as cliente_nome,
        c.telefone    as cliente_telefone,
        ma.marca      as marca_nome,
        mo.modelo     as modelo_nome,
        t.nome        as tecnico_nome
      FROM veiculo v
      JOIN cliente c  ON v.id_cliente = c.id_cliente
      JOIN marca ma   ON v.id_marca   = ma.id_marca
      JOIN modelo mo  ON v.id_modelo  = mo.id_modelo
      LEFT JOIN tecnico t ON v.id_tecnico = t.id_tecnico
      WHERE v.id_veiculo = ?
    `, [req.params.id])

    if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado.' })
    res.json(veiculo)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar veículo.' })
  }
}

const cadastrar = async (req, res) => {
  const {
    placa, id_cliente, id_marca, id_modelo,
    qtde_amassados, trabalho_a_frio, pintura,
    pecas_para_trocar, id_tecnico, riscos_amassados,
    faturar, data_entrada
  } = req.body

  if (!placa || !id_cliente || !id_marca || !id_modelo || !data_entrada) {
    return res.status(400).json({ erro: 'Placa, cliente, marca, modelo e data de entrada são obrigatórios.' })
  }

  try {
    const sql = isPg
      ? `INSERT INTO veiculo (
          placa, id_cliente, id_marca, id_modelo, qtde_amassados,
          trabalho_a_frio, pintura, pecas_para_trocar, id_tecnico,
          riscos_amassados, faturar, data_entrada, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'em_analise') RETURNING id_veiculo`
      : `INSERT INTO veiculo (
          placa, id_cliente, id_marca, id_modelo, qtde_amassados,
          trabalho_a_frio, pintura, pecas_para_trocar, id_tecnico,
          riscos_amassados, faturar, data_entrada, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'em_analise')`

    const result = await execute(sql, [
      placa, id_cliente, id_marca, id_modelo,
      qtde_amassados || 0, trabalho_a_frio || 0, pintura || 0,
      pecas_para_trocar, id_tecnico, riscos_amassados,
      faturar || 0, data_entrada
    ])

    res.status(201).json({ id_veiculo: result.lastInsertRowid, ...req.body })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar veículo.' })
  }
}

const atualizar = async (req, res) => {
  const {
    placa, id_cliente, id_marca, id_modelo,
    qtde_amassados, trabalho_a_frio, pintura,
    pecas_para_trocar, riscos_amassados, faturar
  } = req.body

  if (!placa || !id_cliente || !id_marca || !id_modelo) {
    return res.status(400).json({ erro: 'Placa, cliente, marca e modelo são obrigatórios.' })
  }

  try {
    const result = await execute(`
      UPDATE veiculo SET
        placa = ?, id_cliente = ?, id_marca = ?, id_modelo = ?,
        qtde_amassados = ?, trabalho_a_frio = ?, pintura = ?,
        pecas_para_trocar = ?, riscos_amassados = ?, faturar = ?
      WHERE id_veiculo = ?
    `, [
      placa, id_cliente, id_marca, id_modelo,
      qtde_amassados || 0, trabalho_a_frio || 0, pintura || 0,
      pecas_para_trocar, riscos_amassados, faturar || 0,
      req.params.id
    ])

    if (result.changes === 0) return res.status(404).json({ erro: 'Veículo não encontrado.' })
    res.json({ mensagem: 'Veículo atualizado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar veículo.' })
  }
}

const atualizarStatus = async (req, res) => {
  const { status } = req.body
  const statusValidos = ['em_analise', 'em_servico', 'aguardando_peca', 'concluido', 'entregue']

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido.' })
  }

  try {
    const dataEntrega = status === 'entregue' ? new Date().toISOString().split('T')[0] : null

    if (status === 'entregue') {
      await execute(
        'UPDATE veiculo SET status = ?, data_entrega = ? WHERE id_veiculo = ?',
        [status, dataEntrega, req.params.id]
      )
    } else {
      await execute(
        'UPDATE veiculo SET status = ?, data_entrega = NULL WHERE id_veiculo = ?',
        [status, req.params.id]
      )
    }

    res.json({ mensagem: 'Status atualizado com sucesso.', data_entrega: dataEntrega })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status.' })
  }
}

const atualizarTecnico = async (req, res) => {
  const { id_tecnico } = req.body

  try {
    await execute(
      'UPDATE veiculo SET id_tecnico = ? WHERE id_veiculo = ?',
      [id_tecnico, req.params.id]
    )
    res.json({ mensagem: 'Técnico vinculado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao vincular técnico.' })
  }
}

const resumo = async (req, res) => {
  try {
    const [total, emAnalise, emServico, aguardando, concluido, entregue] = await Promise.all([
      queryOne("SELECT COUNT(*) as total FROM veiculo"),
      queryOne("SELECT COUNT(*) as total FROM veiculo WHERE status = 'em_analise'"),
      queryOne("SELECT COUNT(*) as total FROM veiculo WHERE status = 'em_servico'"),
      queryOne("SELECT COUNT(*) as total FROM veiculo WHERE status = 'aguardando_peca'"),
      queryOne("SELECT COUNT(*) as total FROM veiculo WHERE status = 'concluido'"),
      queryOne("SELECT COUNT(*) as total FROM veiculo WHERE status = 'entregue'"),
    ])

    res.json({
      total:           parseInt(total.total),
      em_analise:      parseInt(emAnalise.total),
      em_servico:      parseInt(emServico.total),
      aguardando_peca: parseInt(aguardando.total),
      concluido:       parseInt(concluido.total),
      entregue:        parseInt(entregue.total),
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar resumo.' })
  }
}

const graficos = async (req, res) => {
  try {
    const [porStatus, porMes, porMarca, tempoMedio] = await Promise.all([
      query(`SELECT status, COUNT(*) as total FROM veiculo GROUP BY status`),
      query(
        isPg
          ? `SELECT TO_CHAR(data_entrada::date, 'YYYY-MM') as mes, COUNT(*) as total
             FROM veiculo
             WHERE data_entrada::date >= (NOW() - INTERVAL '6 months')::date
             GROUP BY mes
             ORDER BY mes ASC`
          : `SELECT strftime('%Y-%m', data_entrada) as mes, COUNT(*) as total
             FROM veiculo
             WHERE data_entrada >= date('now', '-6 months')
             GROUP BY mes
             ORDER BY mes ASC`
      ),
      query(`
        SELECT ma.marca, COUNT(*) as total
        FROM veiculo v
        JOIN marca ma ON v.id_marca = ma.id_marca
        GROUP BY ma.marca
        ORDER BY total DESC
        LIMIT 5
      `),
      queryOne(
        isPg
          ? `SELECT ROUND(AVG(data_entrega::date - data_entrada::date)::numeric, 1) as media_dias
             FROM veiculo
             WHERE status = 'entregue' AND data_entrega IS NOT NULL`
          : `SELECT ROUND(AVG(julianday(data_entrega) - julianday(data_entrada)), 1) as media_dias
             FROM veiculo
             WHERE status = 'entregue' AND data_entrega IS NOT NULL`
      )
    ])

    res.json({
      porStatus: porStatus.map(s => ({ ...s, total: Number(s.total) })),
      porMes: porMes.map(m => ({ ...m, total: Number(m.total) })),
      porMarca: porMarca.map(m => ({ ...m, total: Number(m.total) })),
      tempoMedio: Number(tempoMedio?.media_dias) || 0
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar gráficos.' })
  }
}

module.exports = {
  listar, buscarPorId, cadastrar, atualizar,
  atualizarStatus, atualizarTecnico, resumo, graficos
}