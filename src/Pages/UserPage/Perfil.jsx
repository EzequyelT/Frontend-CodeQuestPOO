import { userRound } from "react-icons/fi";

export default function Perfil() {
    return (
        <div className="p-4">
            <userRound className="text-4xl text-blue-500 mb-4 rounded-full"/>
            <h1 className="text-2xl font-bold mb-4">Perfil do Utilizador</h1>
            <p>Esta é a página de perfil do utilizador. Aqui você pode ver suas informações e progresso.</p>
        </div>
    );
}