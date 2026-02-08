import { FaUser, FaChevronDown } from "react-icons/fa";
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function DashBoardHeader() {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20">
            <nav className="w-full px-6 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    >
                        <img
                            src={logo}
                            alt="CodeQuest POO Logo"
                            className="h-18 w-auto hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Botões Centrais */}
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-1  text-white hover:text-white transition-colors duration-300 font-medium text-lg hover:underline drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)' }}>
                            Aprenda a jogar
                            <FaChevronDown className="text-sm" />
                        </button>

                        <button className="flex items-center gap-1  text-white hover:text-white transition-colors duration-300 font-medium text-lg hover:underline drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)' }}>
                            Jogue agora
                            <FaChevronDown className="text-sm" />
                        </button>
                    </div>

                    {/* Conta do Usuário */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                        onClick={() => navigate("/conta")}
                        style={{ textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)' }}
                    >
                        <div className="border-2 border-yellow-400 rounded-full p-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                            <FaUser className="text-xl text-white" />
                        </div>
                        <span className="font-medium">Minha Conta</span>
                        <FaChevronDown className="text-sm" />
                    </button>
                </div>
            </nav>
        </header>
    );
}