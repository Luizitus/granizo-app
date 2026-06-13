// backend/controllers/tecnicoController.js
const { query, execute, isPg } = require('../db')

const listar = async (req, res) => {
  try {
    const tecnicos = await query('SELECT * FROM tecnico')
    res.json(tecnicos)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar técnicos.' })
  }
}

const cadastrar = async (req, res) => {
  const { nome, cidade, endereco, telefone, email, iban } = req.body

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' })

  try {
    const sql = isPg
      ? `INSERT INTO tecnico (nome, cidade, endereco, telefone, email, iban)
         VALUES (?, ?, ?, ?, ?, ?) RETURNING id_tecnico`
      : `INSERT INTO tecnico (nome, cidade, endereco, telefone, email, iban)
         VALUES (?, ?, ?, ?, ?, ?)`

    const result = await execute(sql, [nome, cidade, endereco, telefone, email, iban])
    res.status(201).json({ id_tecnico: result.lastInsertRowid, nome, cidade, endereco, telefone, email, iban })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar técnico.' })
  }
}

const atualizar = async (req, res) => {
  const { nome, cidade, endereco, telefone, email, iban } = req.body

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório.' })

  try {
    const result = await execute(`
      UPDATE tecnico SET nome = ?, cidade = ?, endereco = ?, telefone = ?, email = ?, iban = ?
      WHERE id_tecnico = ?
    `, [nome, cidade, endereco, telefone, email, iban, req.params.id])

    if (result.changes === 0) return res.status(404).json({ erro: 'Técnico não encontrado.' })
    res.json({ mensagem: 'Técnico atualizado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar técnico.' })
  }
}

module.exports = { listar, cadastrar, atualizar }