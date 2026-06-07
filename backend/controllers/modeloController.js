const db = require('../database');

const listar = (req, res) => {
    const modelos = db.prepare(`
        SELECT modelo.*, marca.marca as nome_marca
        FROM modelo
        JOIN marca ON modelo.id_marca = marca.id_marca
      `).all();
    res.json(modelos);
};

const cadastrar = (req, res) => {
    const {modelo, id_marca} = req.body;
    if (!modelo || !id_marca) {
        return res.status(400).json({error: 'Modelo e marca obrigatorio'});
    }
    const result = db.prepare('INSERT INTO modelo (modelo, id_marca) VALUES (?, ?)').run(modelo, id_marca);
    res.status(201).json({id_modelo: result.lastInsertRowid, modelo, id_marca});
};

module.exports = {
    listar,
    cadastrar
};