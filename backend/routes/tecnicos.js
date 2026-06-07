const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/tecnicoController')

router.get('/',      ctrl.listar)
router.post('/',     ctrl.cadastrar)
router.put('/:id',   ctrl.atualizar)

module.exports = router