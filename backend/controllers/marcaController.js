const db = require('../database');

const listar = (req, res) => {
    const marcas = db.prepare('SELECT * FROM marca').all();
    res.json(marcas);
}

const cadastrar = (req, res) => {
    const {marca} = req.body;
        if (!marca) {
            return res.status(400).json({error: 'Marca é obrigatorio'});
        }
    const result = db.prepare('INSERT INTO marca (marca) VALUES (?)').run(marca);
    res.status(201).json({id_marca: result.lastInsertRowid, marca});
};

module.exports = {
    listar,
    cadastrar
}