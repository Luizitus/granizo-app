// backend/controllers/authController.js
const { queryOne, execute, isPg } = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = 'granizo_secret_2024'

const login = async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' })
  }

  try {
    const usuario = await queryOne('SELECT * FROM usuarios WHERE email = ?', [email])

    if (!usuario) return res.status(401).json({ erro: 'Email ou senha inválidos.' })

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha)
    if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha inválidos.' })

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nome: usuario.nome, perfil: usuario.perfil },
      SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      usuario: { id_usuario: usuario.id_usuario, nome: usuario.nome, perfil: usuario.perfil }
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login.' })
  }
}

const registrar = async (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' })
  }

  try {
    const existe = await queryOne('SELECT id_usuario FROM usuarios WHERE email = ?', [email])
    if (existe) return res.status(409).json({ erro: 'Email já cadastrado.' })

    const senhaCriptografada = bcrypt.hashSync(senha, 10)

    const sql = isPg
      ? `INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?) RETURNING id_usuario`
      : `INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)`

    const result = await execute(sql, [nome, email, senhaCriptografada, perfil || 'operador'])

    res.status(201).json({
      id_usuario: result.lastInsertRowid,
      nome, email, perfil: perfil || 'operador'
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar usuário.' })
  }
}

module.exports = { login, registrar }