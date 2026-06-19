import { useRoutes } from "react-router-dom"
import { gameRoutesMapa2 } from "../Mapas/VilaDaLogica-Mapa2/RotaMapa-2"

export default function Mapa1(){
    const routes = useRoutes( gameRoutesMapa2 )
    return routes;
}
