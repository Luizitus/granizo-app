const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marcaController');

router.get('/',  ctrl.listar);
router.post('/', ctrl.cadastrar);
router.put('/:id',   ctrl.atualizar)
router.delete('/:id', ctrl.deletar)

module.exports = router;