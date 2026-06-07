// backend/routes/fotos.js
const express = require('express')
const router = express.Router()
const { upload, enviarFoto, listarFotos } = require('../controllers/fotoController')

router.post('/', upload.single('foto'), enviarFoto)
router.get('/:id_veiculo', listarFotos)

module.exports = router