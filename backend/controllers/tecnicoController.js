const db = require('../database');

const listar = (req, res) => {
  const tecnicos = db.prepare('SELECT * FROM tecnico').all();
  res.json(tecnicos);
}

const cadastrar = (req, res) => {
  const { nome, cidade, endereco, telefone, email, iban } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório.' });
  }

  const result = db.prepare(`
    INSERT INTO tecnico (nome, cidade, endereco, telefone, email, iban)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(nome, cidade, endereco, telefone, email, iban);

  res.status(201).json({ id_tecnico: result.lastInsertRowid, nome, cidade, endereco, telefone, email, iban });
}

const atualizar = (req, res) => {
  const { nome, cidade, endereco, telefone, email, iban } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório.' });
  }

  const result = db.prepare(`
    UPDATE tecnico
    SET nome = ?, cidade = ?, endereco = ?, telefone = ?, email = ?, iban = ?
    WHERE id_tecnico = ?
  `).run(nome, cidade, endereco, telefone, email, iban, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Técnico não encontrado.' });
  }

  res.json({ mensagem: 'Técnico atualizado com sucesso.' });
}

module.exports = { listar, cadastrar, atualizar }