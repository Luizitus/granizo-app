// backend/server.js
const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./database')

const app = express()
const PORT = 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Serve as fotos como arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rotas
const clienteRoutes = require('./routes/clientes')
const marcaRoutes   = require('./routes/marcas')
const modeloRoutes  = require('./routes/modelos')
const veiculoRoutes = require('./routes/veiculos')
const tecnicoRoutes = require('./routes/tecnicos')
const fotosRoutes   = require('./routes/fotos')

app.use('/api/clientes', clienteRoutes)
app.use('/api/marcas',   marcaRoutes)
app.use('/api/modelos',  modeloRoutes)
app.use('/api/veiculos', veiculoRoutes)
app.use('/api/tecnicos', tecnicoRoutes)
app.use('/api/fotos',    fotosRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})