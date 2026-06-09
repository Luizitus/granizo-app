// backend/server.js
const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./database')
const verificarToken = require('./middleware/auth')

const app = express()
const PORT = 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rotas públicas — não precisam de token
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// Rotas protegidas — precisam de token
const clienteRoutes = require('./routes/clientes')
const marcaRoutes   = require('./routes/marcas')
const modeloRoutes  = require('./routes/modelos')
const veiculoRoutes = require('./routes/veiculos')
const tecnicoRoutes = require('./routes/tecnicos')
const fotosRoutes   = require('./routes/fotos')

app.use('/api/clientes', verificarToken, clienteRoutes)
app.use('/api/marcas',   verificarToken, marcaRoutes)
app.use('/api/modelos',  verificarToken, modeloRoutes)
app.use('/api/veiculos', verificarToken, veiculoRoutes)
app.use('/api/tecnicos', verificarToken, tecnicoRoutes)
app.use('/api/fotos',    verificarToken, fotosRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})