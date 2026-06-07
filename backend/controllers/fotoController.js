// backend/controllers/fotoController.js
const multer = require('multer')
const path = require('path')
const db = require('../database')

// Define onde e como salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + nome original
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

// Filtro — aceita apenas imagens
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Apenas imagens são permitidas.'), false)
  }
}

const upload = multer({ storage, fileFilter })

// Faz o upload e salva o caminho no banco
const enviarFoto = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado.' })
  }

  const { id_veiculo, tipo } = req.body

  if (!id_veiculo) {
    return res.status(400).json({ erro: 'id_veiculo é obrigatório.' })
  }

  const result = db.prepare(`
    INSERT INTO fotos (id_veiculo, caminho, tipo)
    VALUES (?, ?, ?)
  `).run(id_veiculo, req.file.filename, tipo || 'entrada')

  res.status(201).json({
    id_foto: result.lastInsertRowid,
    caminho: req.file.filename,
    tipo: tipo || 'entrada'
  })
}

// Lista fotos de um veículo
const listarFotos = (req, res) => {
  const fotos = db.prepare(`
    SELECT * FROM fotos WHERE id_veiculo = ?
  `).all(req.params.id_veiculo)

  res.json(fotos)
}

module.exports = { upload, enviarFoto, listarFotos }