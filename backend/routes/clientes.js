const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clienteController');

router.get('/',    ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/',   ctrl.cadastrar);
router.post('/:id', ctrl.deletar);

module.exports = router;