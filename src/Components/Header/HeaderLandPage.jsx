import React, { useState, useEffect } from 'react';
import logo from '../../Assets/logo.png';

export default function HeaderLandPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
            }`}>
            <nav className="w-full px-6 py-4">
                <div className="flex items-center justify-between max-w-full">

                    <div className="flex items-center flex-shrink-0">
                        <img
                            src={logo}
                            alt="CodeQuest POO Logo"
                            className="h-20 w-auto"
                        />
                    </div>

                    <div className="hidden md:flex items-center space-x-8 flex-grow justify-center ml-15">
                        <button className="text-white/90 hover:text-white px-4 py-2 rounded-3xl hover:bg-white/10 transition-all duration-200 font-medium text-lg">
                            Game Info
                        </button>
                        <button className="text-white/90 hover:text-white px-4 py-2 rounded-3xl hover:bg-white/10 transition-all duration-200 font-medium text-lg">
                            Sobre
                        </button>
                        <button className="text-white/90 hover:text-white px-4 py-2 rounded-3xl hover:bg-white/10 transition-all duration-200 font-medium text-lg">
                            História
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 mr-4">
                        <button className="text-white/90 hover:text-white bg-transparent border border-white/30 px-5 py-2 rounded-3xl hover:bg-white/10 hover:border-white/50 transition-all duration-200 font-medium">
                            Login
                        </button>
                        <button className="bg-transparent border border-white/30 relative group overflow-hidden px-6 py-2 rounded-3xl font-medium text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200">
                            Criar Conta
                        </button>
                    </div>
                </div>
            </nav>

        </header>
    );
}