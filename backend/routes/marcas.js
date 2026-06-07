const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marcaController');

router.get('/',  ctrl.listar);
router.post('/', ctrl.cadastrar);

module.exports = router;