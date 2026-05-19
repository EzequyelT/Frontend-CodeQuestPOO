import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Landingpage from './Pages/landingPage';
import GameTest from './Pages/gameTest';
import { DashBoard } from './Pages/UserPage/dashBoard';
import Perfil from './Pages/UserPage/Perfil';
import Maps from './Pages/UserPage/Maps';
import Trophies from './Pages/UserPage/Trophies&Achievements';
import Login from "./Pages/Auth/login";
import CriarConta from "./Pages/Auth/criarConta";

// Components
import Desafio1GameTest from "./Components/GameTest/desafio1";
import Desafio2GameTest from "./Components/GameTest/desafio2";
import DesafioFinal from "./Components/GameTest/desafioFinal";

// Game
import FlorestaDosAlgoritmos from "./Game/FlorestaDosAlgoritmos-Mapa1/FlorestaDosAlgoritmos";
import Mapa1 from "./Game/Routes/game.routes";

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
          <Route path="/Trophies" element={<Trophies />} />
          <Route path="/Perfil" element={<Perfil />} />

          {/* DESAFIOS */}
          <Route path="/Desafio1GameTest" element={<Desafio1GameTest />} />
          <Route path="/Desafio2GameTest" element={<Desafio2GameTest />} />
          <Route path="/DesafioFinalGameTest" element={<DesafioFinal />} />

          {/* GAME */}
          <Route path="/FlorestaDosAlgoritmos" element={<FlorestaDosAlgoritmos />} />
          <Route path="/floresta/*" element={<Mapa1 />} />

          {/* fallback */}
          <Route path="*" element={<Landingpage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>
);