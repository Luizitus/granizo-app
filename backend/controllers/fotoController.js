// backend/controllers/fotoController.js
const multer = require('multer')
const path = require('path')
const { query, execute, isPg } = require('../db')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Apenas imagens são permitidas.'), false)
  }
}

const upload = multer({ storage, fileFilter })

const enviarFoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado.' })

  const { id_veiculo, tipo } = req.body
  if (!id_veiculo) return res.status(400).json({ erro: 'id_veiculo é obrigatório.' })

  try {
    const sql = isPg
      ? `INSERT INTO fotos (id_veiculo, caminho, tipo) VALUES (?, ?, ?) RETURNING id_foto`
      : `INSERT INTO fotos (id_veiculo, caminho, tipo) VALUES (?, ?, ?)`

    const result = await execute(sql, [id_veiculo, req.file.filename, tipo || 'entrada'])
    res.status(201).json({ id_foto: result.lastInsertRowid, caminho: req.file.filename, tipo: tipo || 'entrada' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar foto.' })
  }
}

const listarFotos = async (req, res) => {
  try {
    const fotos = await query('SELECT * FROM fotos WHERE id_veiculo = ?', [req.params.id_veiculo])
    res.json(fotos)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar fotos.' })
  }
}

module.exports = { upload, enviarFoto, listarFotos }