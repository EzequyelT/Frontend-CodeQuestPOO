import { lazy, Suspense } from "react";

//_______________________________Nivel 1_______________________________
import DSF1 from "./Nivel-1/dsf_1";

const DSF2 = lazy(() =>
  import("./Nivel-1/dsf_2")
);

const DSF3 = lazy(() =>
  import("./Nivel-1/dsf_3")
);


//_______________________________Nivel 2_______________________________
const DSF4 = lazy(() =>
  import("./Nivel-2/dsf_4")
);

const DSF5 = lazy(() =>
  import("./Nivel-2/dsf_5")
);

const DSF6 = lazy(() =>
  import("./Nivel-2/dsf_6")
);

//_______________________________Nivel 3_______________________________
const DSF7 = lazy(() =>
  import("./Nivel-3/dsf_7")
);

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
  //Nivel 1
  {
    path: "nivel-1/desafio-1",
    element: <DSF1 />
  },
  {
    path: "nivel-1/desafio-2",
    element: withSuspense(<DSF2 />) 
  },
  {
    path: "nivel-1/desafio-3",
    element: withSuspense(<DSF3 />) 
     
  },


  //Nivel 2
  {
    path: "nivel-2/desafio-4",
    element: withSuspense(<DSF4 />) 
  },
  {
    path: "nivel-2/desafio-5",
    element: withSuspense(<DSF5 />) 

  },
  {
    path: "nivel-2/desafio-6",
    element: withSuspense(<DSF6 />) 
       
  },
  
  //Nivel 3
  {
    path: "nivel-3/desafio-7",
     element: withSuspense(<DSF7 />) 
 
  },
  {
    path: "nivel-3/desafio-8",
    element: withSuspense(<DSF8 />) 
  },

];