// backend/controllers/usuarioController.js
const { query, execute, isPg } = require('../db')
const bcrypt = require('bcryptjs')

const listar = async (req, res) => {
  try {
    const usuarios = await query('SELECT id_usuario, nome, email, perfil FROM usuarios')
    res.json(usuarios)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários.' })
  }
}

const cadastrar = async (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' })
  }

  try {
    const existe = await query('SELECT id_usuario FROM usuarios WHERE email = ?', [email])
    if (existe.length > 0) return res.status(409).json({ erro: 'Email já cadastrado.' })

    const senhaCriptografada = bcrypt.hashSync(senha, 10)

    const sql = isPg
      ? `INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?) RETURNING id_usuario`
      : `INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)`

    const result = await execute(sql, [nome, email, senhaCriptografada, perfil || 'operador'])
    res.status(201).json({ id_usuario: result.lastInsertRowid, nome, email, perfil: perfil || 'operador' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
  }
}

const atualizar = async (req, res) => {
  const { nome, email, perfil, senha } = req.body

  if (!nome || !email) return res.status(400).json({ erro: 'Nome e email são obrigatórios.' })

  try {
    if (senha) {
      const senhaCriptografada = bcrypt.hashSync(senha, 10)
      await execute(`
        UPDATE usuarios SET nome = ?, email = ?, perfil = ?, senha = ? WHERE id_usuario = ?
      `, [nome, email, perfil || 'operador', senhaCriptografada, req.params.id])
    } else {
      await execute(`
        UPDATE usuarios SET nome = ?, email = ?, perfil = ? WHERE id_usuario = ?
      `, [nome, email, perfil || 'operador', req.params.id])
    }
    res.json({ mensagem: 'Usuário atualizado com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário.' })
  }
}

const deletar = async (req, res) => {
  try {
    const result = await execute('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id])
    if (result.changes === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' })
    res.json({ mensagem: 'Usuário removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover usuário.' })
  }
}

module.exports = { listar, cadastrar, atualizar, deletar }