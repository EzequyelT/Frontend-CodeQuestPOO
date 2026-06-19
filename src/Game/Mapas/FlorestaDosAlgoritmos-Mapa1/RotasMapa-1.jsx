import { Suspense } from "react";

//_______________________________Nivel 1_______________________________
import DSF1 from "./Nivel-1/dsf_1";

if (!DSF1){
  loader()
}

import DSF2 from "./Nivel-1/dsf_2"

if (!DSF2){
  loader()
}

import DSF3 from "./Nivel-1/dsf_3"

if (!DSF3){
  loader()
}

//_______________________________Nivel 2_______________________________
import DSF4 from "./Nivel-2/dsf_4";

if (!DSF4){
  loader()
}

import DSF5 from "./Nivel-2/dsf_5"

if (!DSF5){
  loader()
}

import DSF6 from "./Nivel-2/dsf_6";

if (!DSF6){
  loader()
}

//_______________________________Nivel 3_______________________________
import DSF7 from "./Nivel-3/dsf_7"

if (!DSF7){
  loader()
}

import DSF8 from "./Nivel-3/dsf_8"

if (!DSF8){
  loader()
}

const loader = () => <div>Carregando...</div>

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
    element: <DSF8 />
  },

];