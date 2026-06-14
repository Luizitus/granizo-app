// backend/controllers/modeloController.js
const { query, execute, isPg } = require('../db')

const listar = async (req, res) => {
  try {
    const modelos = await query(`
      SELECT modelo.*, marca.marca as nome_marca
      FROM modelo
      JOIN marca ON modelo.id_marca = marca.id_marca
    `)
    res.json(modelos)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar modelos.' })
  }
}

const cadastrar = async (req, res) => {
  const { modelo, id_marca } = req.body

  if (!modelo || !id_marca) {
    return res.status(400).json({ erro: 'Modelo e marca são obrigatórios.' })
  }

  try {
    const sql = isPg
      ? 'INSERT INTO modelo (modelo, id_marca) VALUES (?, ?) RETURNING id_modelo'
      : 'INSERT INTO modelo (modelo, id_marca) VALUES (?, ?)'

    const result = await execute(sql, [modelo, id_marca])
    res.status(201).json({ id_modelo: result.lastInsertRowid, modelo, id_marca })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar modelo.' })
  }
}
const atualizar = async (req, res) => {
  const { modelo, id_marca } = req.body

  if (!modelo || !id_marca) {
    return res.status(400).json({ erro: 'Modelo e marca são obrigatórios.' })
  }

  try {
    const result = await execute(
      'UPDATE modelo SET modelo = ?, id_marca = ? WHERE id_modelo = ?',
      [modelo, id_marca, req.params.id]
    )
    if (result.changes === 0) return res.status(404).json({ erro: 'Modelo não encontrado.' })
    res.json({ mensagem: 'Modelo atualizado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar modelo.' })
  }
}

const deletar = async (req, res) => {
  try {
    const result = await execute('DELETE FROM modelo WHERE id_modelo = ?', [req.params.id])
    if (result.changes === 0) return res.status(404).json({ erro: 'Modelo não encontrado.' })
    res.json({ mensagem: 'Modelo removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover modelo.' })
  }
}

module.exports = { listar, cadastrar, atualizar, deletar }