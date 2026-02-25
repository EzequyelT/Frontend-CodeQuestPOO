import { useState } from 'react';
import { FaChevronDown, FaGamepad, FaUserPlus } from 'react-icons/fa';
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom"


export default function HeaderLandingPage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate()

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDropdownSelect = (valor) => {
        if (valor === 'recursos') scrollToSection('recursos');
        if (valor === 'herois') scrollToSection('herois');
        setIsDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
            <nav className="relative w-full px-6 py-4">
                <div className="flex items-center justify-between max-w-full">
                    <div className="flex items-center flex-shrink-0">
                        <img
                            src={logo}
                            alt="CodeQuest POO Logo"
                            className="h-20 w-auto hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                        {/* Dropdown Customizado */}
                        <div className="relative group">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-white/90 hover:text-white bg-gradient-to-r from-white/5 to-transparent px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 font-medium text-lg backdrop-blur-sm"
                            >
                                <FaGamepad className="text-emerald-400" />
                                <span>Game Info</span>
                                <FaChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 w-56 bg-black/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden animate-dropdown">
                                    <div className="p-2">
                                        <button
                                            onClick={() => handleDropdownSelect('recursos')}
                                            className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-200 flex items-center gap-3 group/item"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="font-medium">Recursos de Jogo</span>
                                        </button>
                                        <button
                                            onClick={() => handleDropdownSelect('herois')}
                                            className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-200 flex items-center gap-3 group/item"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="font-medium">Heróis</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => scrollToSection('historia')}
                            className="relative text-white/90 hover:text-white px-5 py-2.5 rounded-full border border-transparent hover:border-white/20 hover:bg-white/10 transition-all duration-300 font-medium text-lg group overflow-hidden"
                        >
                            <span className="relative z-10">História</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <button
                            onClick={() => scrollToSection('cta')}
                            className="relative text-white/90 hover:text-white px-5 py-2.5 rounded-full border border-transparent hover:border-white/20 hover:bg-white/10 transition-all duration-300 font-medium text-lg group overflow-hidden"
                        >
                            <span className="relative z-10">Jogue agora</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 mr-4">
                        <button onClick={() => navigate('/Login')} className="relative group overflow-hidden px-6 py-2.5 rounded-full font-medium text-white bg-gradient-to-r from-white/10 to-white/5 border border-white/30 hover:border-white/50 hover:from-white/15 hover:to-white/10 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10">
                            <span className="relative z-10">
                                Login
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}