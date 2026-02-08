import React, { useState, useEffect } from "react";
import DashBoardHeader from "../Components/Header/HeaderDashBoard";
import BgDashBoard from "../Assets/DashBoard/BgDashBoard.png";
import BgDashBoardVideo from "../Assets/DashBoard/BgVideo.mp4";
import Heros from "../Assets/DashBoard/Heros.png";
import Achievements from "../Assets/DashBoard/Achievements.png";
import Settings from "../Assets/DashBoard/Settings.png";
import "../css/DashBoard.css";

export function DashBoard() {
    const [videoEnded, setVideoEnded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 7500);
        return () => clearTimeout(timer);
    }, []);

    const menuItems = [
        { title: "Heróis", image: Heros, alt: "Heros" },
        { title: "Conquistas", image: Achievements, alt: "Achievements" },
        { title: "Configurações", image: Settings, alt: "Settings" }
    ];

    return (
        <div className="relative min-h-screen">
            {/* Imagem de fundo - sempre presente */}
            <div
                className="absolute inset-0 w-full h-full bg-center bg-cover z-0"
                style={{ backgroundImage: `url(${BgDashBoard})` }}
            />

            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Vídeo com fade out */}
            <video
                autoPlay
                muted
                playsInline
                onEnded={() => setVideoEnded(true)}
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
                    videoEnded ? "opacity-0" : "opacity-100"
                }`}
            >
                <source src={BgDashBoardVideo} type="video/mp4" />
            </video>

            {/* Conteúdo - aparece rápido */}
            <div className={`relative z-20 transition-opacity duration-1000 ${
                showContent ? "opacity-100" : "opacity-0"
            }`}>
                <DashBoardHeader />

                <main className="p-6 pt-24">
                    {/* Menu lateral esquerdo */}
                    <div className="fixed left-8 top-32 flex flex-col gap-6 mt-9">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer transition-all duration-300 hover:scale-110"
                            >
                                <h2 
                                    className="text-white animate-pulse font-serif  text-lg mb-2 text-center group-hover:text-white transition-colors duration-300"
                                    style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
                                >
                                    {item.title}
                                </h2>
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-25  rounded-lg shadow-2xl group-hover:shadow-yellow-400/50 transition-all duration-300 border-2 border-transparent "
                                />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}