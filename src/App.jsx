import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landingpage from './Pages/landingPage'
import GameTest from './Pages/gameTest'
import { DashBoard } from './Pages/dashBoard'
import Desafio1GameTest from "./Components/GameTest/desafio1"
import Desafio2GameTest from "./Components/GameTest/desafio2"
import DesafioFinal from "./Components/GameTest/desafioFinal"
import Login from "./Pages/login"
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
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
