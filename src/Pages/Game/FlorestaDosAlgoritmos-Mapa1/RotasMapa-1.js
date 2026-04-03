// src/routes/game.routes.jsx
import { lazy } from "react";

//_______________________________Nivel 1_______________________________
const DSF1 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-1/dsf_1")
);

const DSF2 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-1/dsf_2")
);

const DSF3 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-1/dsf_3")
);


//_______________________________Nivel 2_______________________________
const DSF4 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-2/dsf_4")
);

const DSF5 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-2/dsf_5")
);

const DSF6 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-2/dsf_6")
);

//_______________________________Nivel 3_______________________________
const DSF7 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-3/dsf_7")
);

const DSF8 = lazy(() =>
  import("../Pages/Game/FlorestaDosAlgoritmos-Mapa1/Nivel-3/dsf_8")
);



export const gameRoutes = [
  //Nivel 1
  {
    path: "/floresta/nivel-1/desafio-1",
    element: <DSF1 />,
  },
  {
    path: "/floresta/nivel-1/desafio-2",
    element: <DSF2 />,
  },
  {
    path: "/floresta/nivel-1/desafio-3",
    element: <DSF3 />,
  },


  //Nivel 2
   {
    path: "/floresta/nivel-2/desafio-4",
    element: <DSF4 />,
  },
  {
    path: "/floresta/nivel-2/desafio-5",
    element: <DSF5 />,
  },
  {
    path: "/floresta/nivel-2/desafio-6",
    element: <DSF6 />,

  //Nivel 3
  }, {
    path: "/floresta/nivel-3/desafio-7",
    element: <DSF7 />,
  },
  {
    path: "/floresta/nivel-3/desafio-8",
    element: <DSF8 />,
  },
  
];