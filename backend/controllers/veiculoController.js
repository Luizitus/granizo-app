const db = require('../database');

const listar = (req, res) => {
  const veiculos = db.prepare(`
    SELECT v.*, c.nome as cliente_nome, c.telefone as cliente_telefone,
      ma.marca as marca_nome, mo.modelo as modelo_nome, t.nome as tecnico_nome
    FROM veiculo v
    JOIN cliente c ON v.id_cliente = c.id_cliente
    JOIN marca ma ON v.id_marca = ma.id_marca
    JOIN modelo mo ON v.id_modelo = mo.id_modelo
    LEFT JOIN tecnico t ON v.id_tecnico = t.id_tecnico
    ORDER BY v.data_entrada DESC
  `).all();
  res.json(veiculos);
}

const buscarPorId = (req, res) => {
  const veiculo = db.prepare(`
    SELECT v.*, c.nome as cliente_nome, c.telefone as cliente_telefone,
      ma.marca as marca_nome, mo.modelo as modelo_nome, t.nome as tecnico_nome
    FROM veiculo v
    JOIN cliente c ON v.id_cliente = c.id_cliente
    JOIN marca ma ON v.id_marca = ma.id_marca
    JOIN modelo mo ON v.id_modelo = mo.id_modelo
    LEFT JOIN tecnico t ON v.id_tecnico = t.id_tecnico
    WHERE v.id_veiculo = ?
  `).get(req.params.id);
  if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado.' });
  res.json(veiculo);
}

const cadastrar = (req, res) => {
  const { placa, id_cliente, id_marca, id_modelo, qtde_amassados, trabalho_a_frio,
    pintura, pecas_para_trocar, id_tecnico, riscos_amassados, faturar, data_entrada } = req.body;
  if (!placa || !id_cliente || !id_marca || !id_modelo || !data_entrada) {
    return res.status(400).json({ erro: 'Placa, cliente, marca, modelo e data de entrada são obrigatórios.' });
  }
  const result = db.prepare(`
    INSERT INTO veiculo (placa, id_cliente, id_marca, id_modelo, qtde_amassados,
      trabalho_a_frio, pintura, pecas_para_trocar, id_tecnico, riscos_amassados,
      faturar, data_entrada, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'em_analise')
  `).run(placa, id_cliente, id_marca, id_modelo, qtde_amassados || 0,
    trabalho_a_frio || 0, pintura || 0, pecas_para_trocar, id_tecnico,
    riscos_amassados, faturar || 0, data_entrada);
  res.status(201).json({ id_veiculo: result.lastInsertRowid, ...req.body });
}

const atualizar = (req, res) => {
  const { placa, id_cliente, id_marca, id_modelo, qtde_amassados, trabalho_a_frio,
    pintura, pecas_para_trocar, riscos_amassados, faturar } = req.body;
  if (!placa || !id_cliente || !id_marca || !id_modelo) {
    return res.status(400).json({ erro: 'Placa, cliente, marca e modelo são obrigatórios.' });
  }
  const result = db.prepare(`
    UPDATE veiculo SET placa = ?, id_cliente = ?, id_marca = ?, id_modelo = ?,
      qtde_amassados = ?, trabalho_a_frio = ?, pintura = ?,
      pecas_para_trocar = ?, riscos_amassados = ?, faturar = ?
    WHERE id_veiculo = ?
  `).run(placa, id_cliente, id_marca, id_modelo, qtde_amassados || 0,
    trabalho_a_frio || 0, pintura || 0, pecas_para_trocar, riscos_amassados,
    faturar || 0, req.params.id);
  if (result.changes === 0) return res.status(404).json({ erro: 'Veículo não encontrado.' });
  res.json({ mensagem: 'Veículo atualizado com sucesso.' });
}

const atualizarStatus = (req, res) => {
  const { status } = req.body;
  const statusValidos = ['em_analise', 'em_servico', 'aguardando_peca', 'concluido', 'entregue'];
  if (!statusValidos.includes(status)) return res.status(400).json({ erro: 'Status inválido.' });
  const dataEntrega = status === 'entregue' ? new Date().toISOString().split('T')[0] : null;
  if (status === 'entregue') {
    db.prepare('UPDATE veiculo SET status = ?, data_entrega = ? WHERE id_veiculo = ?')
      .run(status, dataEntrega, req.params.id);
  } else {
    db.prepare('UPDATE veiculo SET status = ?, data_entrega = NULL WHERE id_veiculo = ?')
      .run(status, req.params.id);
  }
  res.json({ mensagem: 'Status atualizado com sucesso.', data_entrega: dataEntrega });
}

const atualizarTecnico = (req, res) => {
  const { id_tecnico } = req.body;
  db.prepare('UPDATE veiculo SET id_tecnico = ? WHERE id_veiculo = ?')
    .run(id_tecnico, req.params.id);
  res.json({ mensagem: 'Técnico vinculado com sucesso.' });
}

const resumo = (req, res) => {
  const total      = db.prepare('SELECT COUNT(*) as total FROM veiculo').get();
  const emAnalise  = db.prepare("SELECT COUNT(*) as total FROM veiculo WHERE status = 'em_analise'").get();
  const emServico  = db.prepare("SELECT COUNT(*) as total FROM veiculo WHERE status = 'em_servico'").get();
  const aguardando = db.prepare("SELECT COUNT(*) as total FROM veiculo WHERE status = 'aguardando_peca'").get();
  const concluido  = db.prepare("SELECT COUNT(*) as total FROM veiculo WHERE status = 'concluido'").get();
  const entregue   = db.prepare("SELECT COUNT(*) as total FROM veiculo WHERE status = 'entregue'").get();
  res.json({
    total:           total.total,
    em_analise:      emAnalise.total,
    em_servico:      emServico.total,
    aguardando_peca: aguardando.total,
    concluido:       concluido.total,
    entregue:        entregue.total,
  });
}
const graficos = (req, res) => {
  // Veículos por status
  const porStatus = db.prepare(`
    SELECT status, COUNT(*) as total
    FROM veiculo
    GROUP BY status
  `).all()

  // Entradas por mês (últimos 6 meses)
  const porMes = db.prepare(`
    SELECT
      strftime('%Y-%m', data_entrada) as mes,
      COUNT(*) as total
    FROM veiculo
    WHERE data_entrada >= date('now', '-6 months')
    GROUP BY mes
    ORDER BY mes ASC
  `).all()

  // Veículos por marca
  const porMarca = db.prepare(`
    SELECT ma.marca, COUNT(*) as total
    FROM veiculo v
    JOIN marca ma ON v.id_marca = ma.id_marca
    GROUP BY ma.marca
    ORDER BY total DESC
    LIMIT 5
  `).all()

  // Tempo médio de serviço (em dias) dos entregues
  const tempoMedio = db.prepare(`
    SELECT ROUND(AVG(
      julianday(data_entrega) - julianday(data_entrada)
    ), 1) as media_dias
    FROM veiculo
    WHERE status = 'entregue'
    AND data_entrega IS NOT NULL
  `).get()

  res.json({ porStatus, porMes, porMarca, tempoMedio: tempoMedio.media_dias || 0 })
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, atualizarStatus, atualizarTecnico, resumo, graficos };