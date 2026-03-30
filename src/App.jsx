import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landingpage from './Pages/landingPage'
import GameTest from './Pages/gameTest'
import { DashBoard } from './Pages/UserPage/dashBoard'
import  Perfil  from './Pages/UserPage/Perfil'
import  Maps  from './Pages/UserPage/Maps'
import  Trophies  from './Pages/UserPage/Trophies&Achievements'
import Desafio1GameTest from "./Components/GameTest/desafio1"
import Desafio2GameTest from "./Components/GameTest/desafio2"
import DesafioFinal from "./Components/GameTest/desafioFinal"
import Login from "./Pages/auth/login"
import CriarConta from "./Pages/auth/criarConta"
import FlorestaDosAlgoritmos from "./Pages/Game/FlorestaDosAlgoritmos"
import './App.css'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/gametest" element={<GameTest />} />
          <Route path="/Desafio1GameTest" element={<Desafio1GameTest />} />
          <Route path="/Desafio2GameTest" element={<Desafio2GameTest />} />
          <Route path="/DesafioFinalGameTest" element={<DesafioFinal />} />
          <Route path="/Dashboard" element={<DashBoard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CriarConta" element={<CriarConta />} />
          <Route path="/Maps" element={<Maps />} />
          <Route path="/Trophies" element={<Trophies />} />
          <Route path="/FlorestaDosAlgoritmos" element={<FlorestaDosAlgoritmos />} />
          <Route path="/recent" element={<div>Página Recente - Em desenvolvimento</div>} />
          <Route path="/friends" element={<div>Página de Amigos - Em desenvolvimento</div>} />
          <Route path="/messages" element={<div>Página de Mensagens - Em desenvolvimento</div>} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="*" element={<h1 className="text-white">Página não encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
