// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ListaVeiculos from './pages/ListaVeiculos'
import NovoVeiculo from './pages/NovoVeiculo'
import ListaClientes from './pages/ListaClientes'
import NovoCliente from './pages/NovoCliente'
import DetalheVeiculo from './pages/DetalheVeiculo'
import Marcas from './pages/Marcas'
import Modelos from './pages/Modelos'
import Tecnicos from './pages/Tecnicos'
import EditarVeiculo from './pages/EditarVeiculo'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veiculos" element={<ListaVeiculos />} />
          <Route path="/veiculos/novo" element={<NovoVeiculo />} />
          <Route path="/veiculos/:id" element={<DetalheVeiculo />} />
          <Route path="/clientes" element={<ListaClientes />} />
          <Route path="/clientes/novo" element={<NovoCliente />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/modelos" element={<Modelos />} />
          <Route path="/tecnicos" element={<Tecnicos />} />
          <Route path="/veiculos/:id/editar" element={<EditarVeiculo />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </>
  )
}

export default App