import { FaUserPlus } from 'react-icons/fa';
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom"


export default function GameTestHeader() {
    const navigate = useNavigate();
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/20">
            <nav className="w-full px-6 py-1">
                <div className="flex items-center justify-between max-w-full">
                    {/* Logo - Esquerda */}
                    <div onClick={() => navigate("/")} className="flex items-center flex-shrink-0">
                        <img
                            src={logo}
                            alt="CodeQuest POO Logo"
                            className="h-20 w-auto hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Botões - Direita */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        {/* Login Button */}
                        <button className="text-white px-6 py-2.5 rounded-full border border-white/80 hover:border-white hover:bg-white/10 transition-all duration-300 font-medium">
                            Login
                        </button>

                        {/* Criar Conta Button */}
                        <button className="relative group overflow-hidden px-6 py-2.5 rounded-full font-medium text-white border border-white/80 hover:border-white hover:bg-white/10 transition-all duration-300">
                            <span className="relative z-10 flex items-center gap-2">
                                <FaUserPlus />
                                Criar Conta
                            </span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}