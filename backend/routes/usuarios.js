// backend/routes/usuarios.js
const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/usuarioController')

router.get('/',      ctrl.listar)
router.post('/',     ctrl.cadastrar)
router.put('/:id',   ctrl.atualizar)
router.delete('/:id', ctrl.deletar)

module.exports = router