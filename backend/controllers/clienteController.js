// backend/controllers/clienteController.js
const { query, queryOne, execute, isPg } = require('../db')

const listar = async (req, res) => {
  try {
    const clientes = await query('SELECT * FROM cliente')
    res.json(clientes)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar clientes.' })
  }
}

const cadastrar = async (req, res) => {
  const { nome, endereco, cidade, telefone, contato, tipo_contato } = req.body

  if (!nome || !telefone) {
    return res.status(400).json({ erro: 'Nome e telefone são obrigatórios.' })
  }

  try {
    const sql = isPg
      ? `INSERT INTO cliente (nome, endereco, cidade, telefone, contato, tipo_contato)
         VALUES (?, ?, ?, ?, ?, ?) RETURNING id_cliente`
      : `INSERT INTO cliente (nome, endereco, cidade, telefone, contato, tipo_contato)
         VALUES (?, ?, ?, ?, ?, ?)`

    const result = await execute(sql, [nome, endereco, cidade, telefone, contato, tipo_contato])
    res.status(201).json({ id_cliente: result.lastInsertRowid, ...req.body })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar cliente.' })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const cliente = await queryOne('SELECT * FROM cliente WHERE id_cliente = ?', [req.params.id])
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' })
    res.json(cliente)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cliente.' })
  }
}

const deletar = async (req, res) => {
  try {
    const result = await execute('DELETE FROM cliente WHERE id_cliente = ?', [req.params.id])
    if (result.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' })
    res.json({ mensagem: 'Cliente removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover cliente.' })
  }
}

const atualizar = async (req, res) => {
  const { nome, endereco, cidade, telefone, contato, tipo_contato } = req.body

  if (!nome || !telefone) {
    return res.status(400).json({ erro: 'Nome e telefone são obrigatórios.' })
  }

  try {
    const result = await execute(`
      UPDATE cliente SET nome = ?, endereco = ?, cidade = ?, telefone = ?, contato = ?, tipo_contato = ?
      WHERE id_cliente = ?
    `, [nome, endereco, cidade, telefone, contato, tipo_contato, req.params.id])

    if (result.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado.' })
    res.json({ mensagem: 'Cliente atualizado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente.' })
  }
}

module.exports = { listar, cadastrar, buscarPorId, deletar, atualizar }