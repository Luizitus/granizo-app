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

module.exports = { listar, cadastrar }