import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";

export default function Perfil() {
    return (
        <div className="p-4">
            <DashBoardHeader />
            <SideBar />
            <h1 className="text-2xl font-bold mb-4">Perfil do Utilizador</h1>
            <p>Esta é a página de perfil do utilizador. Aqui você pode ver suas informações e progresso.</p>
        </div>
    );
}