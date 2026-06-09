// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import Home from './pages/Home'
import ListaVeiculos from './pages/ListaVeiculos'
import NovoVeiculo from './pages/NovoVeiculo'
import EditarVeiculo from './pages/EditarVeiculo'
import DetalheVeiculo from './pages/DetalheVeiculo'
import ListaClientes from './pages/ListaClientes'
import NovoCliente from './pages/NovoCliente'
import Marcas from './pages/Marcas'
import Modelos from './pages/Modelos'
import Tecnicos from './pages/Tecnicos'
import Relatorios from './pages/Relatorios'
import { useAuth } from './context/AuthContext'

function App() {
  const { usuario } = useAuth()

  return (
    <>
      {usuario && <Navbar />}
      <div style={usuario ? { maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' } : {}}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />
          <Route path="/veiculos" element={<RotaProtegida><ListaVeiculos /></RotaProtegida>} />
          <Route path="/veiculos/novo" element={<RotaProtegida><NovoVeiculo /></RotaProtegida>} />
          <Route path="/veiculos/:id" element={<RotaProtegida><DetalheVeiculo /></RotaProtegida>} />
          <Route path="/veiculos/:id/editar" element={<RotaProtegida><EditarVeiculo /></RotaProtegida>} />
          <Route path="/clientes" element={<RotaProtegida><ListaClientes /></RotaProtegida>} />
          <Route path="/clientes/novo" element={<RotaProtegida><NovoCliente /></RotaProtegida>} />
          <Route path="/marcas" element={<RotaProtegida><Marcas /></RotaProtegida>} />
          <Route path="/modelos" element={<RotaProtegida><Modelos /></RotaProtegida>} />
          <Route path="/tecnicos" element={<RotaProtegida><Tecnicos /></RotaProtegida>} />
          <Route path="/relatorios" element={<RotaProtegida><Relatorios /></RotaProtegida>} />
        </Routes>
      </div>
    </>
  )
}

export default App