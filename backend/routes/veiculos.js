const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/veiculoController')

router.get('/resumo',        ctrl.resumo)
router.get('/graficos',      ctrl.graficos)   // linha nova
router.get('/',              ctrl.listar)
router.get('/:id',           ctrl.buscarPorId)
router.post('/',             ctrl.cadastrar)
router.put('/:id',           ctrl.atualizar)
router.patch('/:id/status',  ctrl.atualizarStatus)
router.patch('/:id/tecnico', ctrl.atualizarTecnico)

module.exports = router