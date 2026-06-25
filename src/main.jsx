import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Landingpage from './Pages/landingPage';
import GameTest from './Pages/gameTest';
import { DashBoard } from './Pages/UserPage/dashBoard';
import Perfil from './Pages/UserPage/Perfil';
import Maps from './Pages/UserPage/Maps';
import Amigos from "./Pages/UserPage/Amigos";

import Trophies from './Pages/UserPage/Trophies&Achievements';
import Login from "./Pages/Auth/login";
import CriarConta from "./Pages/Auth/criarConta";
import Mentores from "./Pages/UserPage/Mentores";

import HistoricoSemanal from "./Pages/UserPage/HistoricoSemanal";
import Estatisticas from './Pages/UserPage/Estatisticas';
import ErrosPage from './Pages/UserPage/Erros';
import LeaderBoard from './Pages/UserPage/leaderBoard';

// Admin
import AdminDashboard from "/src/Pages/Admin/AdminDashboard.jsx";

// Components
import Desafio1GameTest from "./Components/GameTest/desafio1";
import Desafio2GameTest from "./Components/GameTest/desafio2";
import DesafioFinal from "./Components/GameTest/desafioFinal";

// Game
import FlorestaDosAlgoritmos from "./Game/Mapas/FlorestaDosAlgoritmos-Mapa1/FlorestaDosAlgoritmos";
import VilaDaLogica from './Game/Mapas/VilaDaLogica-Mapa2/vilaDaLogica';

import Mapa1 from "./Game/Routes/mapa-1.routes";
import Mapa2 from "./Game/Routes/mapa-2.routes"

//context
import { SessionProvider } from './Context/SessionProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          {/* ROTAS PRINCIPAIS */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/gametest" element={<GameTest />} />
          <Route path="/Dashboard" element={<DashBoard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CriarConta" element={<CriarConta />} />
          <Route path="/Maps" element={<Maps />} />
          <Route path="/HistoricoSemanal" element={<HistoricoSemanal />} />
          <Route path="/Trophies" element={<Trophies />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Estatisticas" element={<Estatisticas />} />
          <Route path="/Erros" element={<ErrosPage />} />
          <Route path="/leaderBoard" element={<LeaderBoard />} />
          <Route path="/amigos" element={<Amigos />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/mentores" element={<Mentores />} />

          {/* TESTES */}

          {/* Teste */}
          <Route path="/Desafio1GameTest" element={<Desafio1GameTest />} />
          <Route path="/Desafio2GameTest" element={<Desafio2GameTest />} />
          <Route path="/DesafioFinalGameTest" element={<DesafioFinal />} />

          {/* GAME */}
          
          {/* Map-1 */}
          <Route path="/FlorestaDosAlgoritmos" element={<FlorestaDosAlgoritmos />} />
          <Route path="/floresta/*" element={<Mapa1 />} />
          {/* Map-2 */}
          <Route path="/VilaDaLogica" element={<VilaDaLogica />} />
          <Route path="/vila/*" element={<Mapa2 />} />
          
          <Route path="*" element={<Landingpage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>
);