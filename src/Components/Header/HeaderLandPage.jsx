import React, { useState } from 'react';
import logo from '../../Assets/logo.png';

export default function HeaderLandPage() {
    const [isGameInfoOpen, setIsGameInfoOpen] = useState(false);

    return (
        <header className="bg-transparent backdrop-blur-md px-8 py-6 fixed top-0 left-0 right-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <div className="flex-shrink-0">
                    <img 
                        src={logo} 
                        alt="CodeQuest POO Logo" 
                        className="h-20  w-auto animate-pulse"
                    />
                </div>

                <nav className="flex-1 flex justify-center items-center gap-8">
                    <div className="relative">
                        <button 
                            onClick={() => setIsGameInfoOpen(!isGameInfoOpen)}
                            className="text-white font-medium hover:text-gray-300 transition-colors flex items-center gap-1 text-lg"
                        >
                            Informação do Jogo
                            <svg 
                                className={`w-5 h-5 transition-transform ${isGameInfoOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isGameInfoOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/90 border border-white/20 rounded-lg shadow-xl py-2 min-w-[180px]">
                                <a href="#" className="block px-4 py-2 text-white hover:bg-white/10 transition-colors">Features</a>
                                <a href="#" className="block px-4 py-2 text-white hover:bg-white/10 transition-colors">Gameplay</a>
                                <a href="#" className="block px-4 py-2 text-white hover:bg-white/10 transition-colors">Updates</a>
                            </div>
                        )}
                    </div>

                    <button className="text-white font-medium hover:text-gray-300 transition-colors text-lg">
                        Token
                    </button>
                    <button className="text-white font-medium hover:text-gray-300 transition-colors text-lg">
                        Sobre
                    </button>
                    <button className="text-white font-medium hover:text-gray-300 transition-colors text-lg">
                        História
                    </button>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="text-white font-medium px-4 py-2 hover:text-gray-300 transition-colors text-lg">
                        Login
                    </button>

                    <button className="bg-transparent border-2 border-white text-white font-bold px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg tracking-wide">
                        Criar conta
                    </button>
                </div>
            </div>
        </header>
    );
}
