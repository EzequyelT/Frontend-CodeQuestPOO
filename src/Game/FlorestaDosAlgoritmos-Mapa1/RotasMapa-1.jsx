import { lazy, Suspense } from "react";

//_______________________________Nivel 1_______________________________
import DSF1 from "./Nivel-1/dsf_1";

import DSF2 from "./Nivel-1/dsf_2"

import DSF3 from "./Nivel-1/dsf_3"


//_______________________________Nivel 2_______________________________
import DSF4 from "./Nivel-2/dsf_4";

import DSF5 from "./Nivel-2/dsf_5"

import DSF6 from "./Nivel-2/dsf_6";

//_______________________________Nivel 3_______________________________
import DSF7 from "./Nivel-3/dsf_7"

const DSF8 = lazy(() =>
  import("./Nivel-3/dsf_8")
);

const loader = () => <div>Carregando...</div>

const withSuspense = (element) => (
  <Suspense fallback={loader()}>
    {element}
  </Suspense>
)

export const gameRoutes = [
  {
    path: "nivel-1/desafio-1",
    element: <DSF1 />
  },
  {
    path: "nivel-1/desafio-2",
    element: <DSF2 /> 
  },
  {
    path: "nivel-1/desafio-3",
    element: <DSF3 />
     
  },


  //Nivel 2
  {
    path: "nivel-2/desafio-4",
    element: <DSF4 />
  },
  {
    path: "nivel-2/desafio-5",
    element: <DSF5 />

  },
  {
    path: "nivel-2/desafio-6",
    element: <DSF6 />
       
  },
  
  //Nivel 3
  {
    path: "nivel-3/desafio-7",
     element: <DSF7 />
  },
  {
    path: "nivel-3/desafio-8",
    element: withSuspense(<DSF8 />) 
  },

];