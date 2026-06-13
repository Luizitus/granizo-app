// backend/controllers/marcaController.js
const { query, execute, isPg } = require('../db')

const listar = async (req, res) => {
  try {
    const marcas = await query('SELECT * FROM marca')
    res.json(marcas)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar marcas.' })
  }
}

const cadastrar = async (req, res) => {
  const { marca } = req.body

  if (!marca) return res.status(400).json({ erro: 'Nome da marca é obrigatório.' })

  try {
    const sql = isPg
      ? 'INSERT INTO marca (marca) VALUES (?) RETURNING id_marca'
      : 'INSERT INTO marca (marca) VALUES (?)'

    const result = await execute(sql, [marca])
    res.status(201).json({ id_marca: result.lastInsertRowid, marca })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar marca.' })
  }
}

const deletar = async (req, res) => {
  try {
    const result = await execute('DELETE FROM marca WHERE id_marca = ?', [req.params.id])
    if (result.changes === 0) return res.status(404).json({ erro: 'Marca não encontrada.' })
    res.json({ mensagem: 'Marca removida com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover marca.' })
  }
}
module.exports = { listar, cadastrar, deletar }