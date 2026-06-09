// backend/middleware/auth.js
const jwt = require('jsonwebtoken')

const SECRET = 'granizo_secret_2024'

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não informado.' })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    req.usuario = decoded  // disponibiliza dados do usuário na requisição
    next()
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' })
  }
}

module.exports = verificarToken