// backend/controllers/usuarioController.js
const db = require('../database')
const bcrypt = require('bcryptjs')

const listar = (req, res) => {
  const usuarios = db.prepare(`
    SELECT id_usuario, nome, email, perfil FROM usuarios
  `).all()
  res.json(usuarios)
}

const cadastrar = (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' })
  }

  const existe = db.prepare('SELECT id_usuario FROM usuarios WHERE email = ?').get(email)
  if (existe) {
    return res.status(409).json({ erro: 'Email já cadastrado.' })
  }

  const senhaCriptografada = bcrypt.hashSync(senha, 10)

  const result = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, perfil)
    VALUES (?, ?, ?, ?)
  `).run(nome, email, senhaCriptografada, perfil || 'operador')

  res.status(201).json({ id_usuario: result.lastInsertRowid, nome, email, perfil: perfil || 'operador' })
}

const atualizar = (req, res) => {
  const { nome, email, perfil, senha } = req.body

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios.' })
  }

  // Se enviou nova senha, criptografa — senão mantém a atual
  if (senha) {
    const senhaCriptografada = bcrypt.hashSync(senha, 10)
    db.prepare(`
      UPDATE usuarios SET nome = ?, email = ?, perfil = ?, senha = ?
      WHERE id_usuario = ?
    `).run(nome, email, perfil || 'operador', senhaCriptografada, req.params.id)
  } else {
    db.prepare(`
      UPDATE usuarios SET nome = ?, email = ?, perfil = ?
      WHERE id_usuario = ?
    `).run(nome, email, perfil || 'operador', req.params.id)
  }

  res.json({ mensagem: 'Usuário atualizado com sucesso.' })
}

const deletar = (req, res) => {
  const result = db.prepare('DELETE FROM usuarios WHERE id_usuario = ?').run(req.params.id)

  if (result.changes === 0) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' })
  }

  res.json({ mensagem: 'Usuário removido com sucesso.' })
}

module.exports = { listar, cadastrar, atualizar, deletar }