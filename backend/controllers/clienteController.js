const db = require('../database');

//Lista todos os clientes
const listar = (req, res) => {
    const clientes = db.prepare('SELECT * FROM cliente').all();
    res.json(clientes);
}

//Cadastra um novo cliente
const cadastrar = (req, res) => {
    const {nome, endereco, cidade, telefone, contato, tipo_contato} = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({error: 'Campos obrigatórios'});
    }

    const stmt = db.prepare('INSERT INTO cliente (nome, endereco, cidade, telefone, contato, tipo_contato) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(nome, endereco, cidade, telefone, contato, tipo_contato);
    res.status(201).json({id_cliente: result.lastInsertRowid, ...req.body});
};


//Busca o cliente pelo ID
const buscarPorId = (req, res) => {
    const cliente = db.prepare('SELECT * FROM cliente WHERE id_cliente = ?').get(req.params.id);
    if (!cliente) {
        return res.status(404).json({error: 'Cliente nao encontrado'});
    }
    res.json(cliente);
};

// adiciona no final, antes do module.exports
const deletar = (req, res) => {
    const result = db.prepare('DELETE FROM cliente WHERE id_cliente = ?').run(req.params.id)

    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' })
    }

    res.json({ mensagem: 'Cliente removido com sucesso.' })
  }

module.exports = {
    listar,
    cadastrar,
    buscarPorId,
    deletar
};
