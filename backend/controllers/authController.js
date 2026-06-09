// backend/controllers/authController.js
const db = require('../database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = 'granizo_secret_2024'  // em produção usar variável de ambiente

const login = (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' })
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)

  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha inválidos.' })
  }

  const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Email ou senha inválidos.' })
  }

  // Gera o token JWT com validade de 8 horas
  const token = jwt.sign(
    { id_usuario: usuario.id_usuario, nome: usuario.nome, perfil: usuario.perfil },
    SECRET,
    { expiresIn: '8h' }
  )

  res.json({
    token,
    usuario: { id_usuario: usuario.id_usuario, nome: usuario.nome, perfil: usuario.perfil }
  })
}

const registrar = (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' })
  }

  // Verifica se email já existe
  const existe = db.prepare('SELECT id_usuario FROM usuarios WHERE email = ?').get(email)
  if (existe) {
    return res.status(409).json({ erro: 'Email já cadastrado.' })
  }

  // Criptografa a senha
  const senhaCriptografada = bcrypt.hashSync(senha, 10)

  const result = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, perfil)
    VALUES (?, ?, ?, ?)
  `).run(nome, email, senhaCriptografada, perfil || 'operador')

  res.status(201).json({
    id_usuario: result.lastInsertRowid,
    nome,
    email,
    perfil: perfil || 'operador'
  })
}

module.exports = { login, registrar }