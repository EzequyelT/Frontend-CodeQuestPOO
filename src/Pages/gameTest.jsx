import { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"
import GameTestHeader from '../Components/Header/HeaderGameTest.jsx';
import BgMapa from "../Assets/GameTest/bgMapa.png";

export default function GameTest() {
    const [selectedStage, setSelectedStage] = useState(null);
    const navigate = useNavigate();

    const stages = [
        {
            id: 1,
            name: "Início da Jornada",
            position: { top: '90%', left: '60%' }, // Início do caminho (parte inferior)
            size: 'small',
            showArrow: true
        },
        {
            id: 2,
            name: "Caminho da Floresta",
            position: { top: '65%', left: '66%' }, // Meio do caminho (curva)
            size: 'medium',
            showArrow: false
        },
        {
            id: 3,
            name: "Portal da Caverna",
            position: { top: '47%', left: '72%' }, // Perto da caverna iluminada
            size: 'large',
            showArrow: false
        }
    ];

    const getSizeClasses = (size) => {
        switch(size) {
            case 'small':
                return 'w-15 h-15 text-lg';
            case 'medium':
                return 'w-16 h-16 text-xl';
            case 'large':
                return 'w-17 h-17 text-xl';
            default:
                return 'w-16 h-16';
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-green-900 to-black">
            {/* Header */}
            <GameTestHeader />

            {/* Main Game Area */}
            <main className="h-[calc(100vh-88px)] w-full flex items-center justify-center p-8">
                {/* Container do Mapa */}
                <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center mt-40">
                    {/* Mapa */}
                    <img
                        src={BgMapa}
                        alt="Mapa do Jogo"
                        className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                        style={{
                            filter: `
                                drop-shadow(0 0 2px white)
                                drop-shadow(0 0 2px white)
                                drop-shadow(0 0 4px white)
                                drop-shadow(0 0 8px rgba(255,255,255,0.5))
                            `
                        }}
                    />

                    {/* Botões das Fases */}
                    {stages.map((stage) => (
                        <div key={stage.id} className="absolute" style={{
                            top: stage.position.top,
                            left: stage.position.left,
                            transform: 'translate(-50%, -50%)'
                        }}>
                            {/* Seta Indicadora */}
                            {stage.showArrow && (
                                <div className="absolute -top-15 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                    <FaArrowDown 
                                        className="text-white  text-6xl animate-bounce"
                                        style={{
                                            filter: `
                                                drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))
                                                drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))
                                            `
                                        }}
                                    />
                                </div>
                            )}

                            {/* Botão da Fase */}
                            <button
                                onClick={() => setSelectedStage(stage.id)}
                                className={`
                                    ${getSizeClasses(stage.size)}
                                    bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500
                                    rounded-full
                                    flex items-center justify-center
                                    font-bold text-white
                                    shadow-lg
                                    transform transition-all duration-300
                                    hover:scale-110 hover:shadow-2xl
                                    active:scale-95
                                    border-4 border-white
                                    ${selectedStage === stage.id ? 'ring-4 ring-blue-400 scale-110' : ''}
                                `}
                                style={{
                                    boxShadow: `
                                        0 0 20px rgba(251, 191, 36, 0.6),
                                        0 0 40px rgba(251, 191, 36, 0.4),
                                        inset 0 2px 10px rgba(255, 255, 255, 0.3)
                                    `,
                                    animation: 'pulse 2s infinite'
                                }}
                            >
                               
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Modal de Informação da Fase */}
            {selectedStage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-4 border-amber-500 max-w-md">
                        <h2 className="text-3xl font-bold text-amber-400 mb-4">
                            Fase {selectedStage}
                        </h2>
                        <p className="text-xl text-white mb-6">
                            {stages.find(s => s.id === selectedStage)?.name}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedStage(null)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                /* Navega para rota correspondente usando um mapeamento */
                                onClick={() => {
                                    const routes = {
                                        1: '/Desafio1GameTest',
                                        2: '/Desafio2GameTest',
                                        3: '/DesafioFinalGameTest'
                                    };
                                    const path = routes[selectedStage];

                                    if (path) {
                                        alert(`Iniciando Fase ${selectedStage}!`); 
                                        navigate(path);
                                    } else {
                                        alert('Nenhuma fase selecionada');
                                    }

                                    setSelectedStage(null);
                                }}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                            >
                                Jogar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
}