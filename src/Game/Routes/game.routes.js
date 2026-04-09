import { useRoutes } from "react-router-dom"
import { gameRoutes } from "../FlorestaDosAlgoritmos-Mapa1/RotasMapa-1.jsx"

export default function Mapa1(){
    const routes = useRoutes( gameRoutes )

    return routes;
}