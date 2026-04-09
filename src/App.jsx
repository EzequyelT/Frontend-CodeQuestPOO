import { Routes, Route } from "react-router-dom";
import Landingpage from './Pages/landingPage';
import GameTest from './Pages/gameTest';
import { DashBoard } from './Pages/UserPage/dashBoard';
import Perfil from './Pages/UserPage/Perfil';
import Maps from './Pages/UserPage/Maps';
import Trophies from './Pages/UserPage/Trophies&Achievements';
import Desafio1GameTest from "./Components/GameTest/desafio1";
import Desafio2GameTest from "./Components/GameTest/desafio2";
import DesafioFinal from "./Components/GameTest/desafioFinal";
import Login from "./Pages/Auth/login";
import CriarConta from "./Pages/Auth/criarConta";
import FlorestaDosAlgoritmos from "./Game/FlorestaDosAlgoritmos-Mapa1/FlorestaDosAlgoritmos";
import Mapa1 from "./Game/Routes/game.routes"

import './App.css';

function App() {
  return (
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
      <Route path="/Perfil" element={<Perfil />} />
      <Route path="/floresta/*" element={<Mapa1 />} />

      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;