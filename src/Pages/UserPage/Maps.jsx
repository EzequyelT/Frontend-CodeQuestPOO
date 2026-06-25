import { useState, useEffect } from "react";

import { getProgresso } from "../../Services/users/userStatsService";

import { getMapas } from "../../Services/maps/mapasService";

import DashBoardHeader from "../../Components/Header/HeaderDashBoard";

import SideBar from "../../Components/SideBar/SideBar";

import map1 from "../../assets/Maps/FirstMap.png";

import map2 from "../../assets/Maps/SecondMap.png";

import map3 from "../../assets/Maps/ThirdMap.png";

import { useNavigate } from "react-router-dom";

import { ChartBar, Search, Lock, Swords, X } from "lucide-react";

import { getMe } from "../../Services/users/userService";

import loadingVideo from "../../assets/Loading/loading.webm";




function SemMentorModal({ onClose, onEscolher }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-7 h-7 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800 transition-all"
                >
                    <X size={14} />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                    <Swords size={28} className="text-yellow-500" />
                </div>

                <div className="text-center flex flex-col gap-2">
                    <h2 className="text-white font-black text-lg tracking-tight uppercase">
                        Herói não selecionado
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Precisas de escolher um herói antes de entrar em batalha. Seleciona o teu companheiro de jornada para continuar.
                    </p>
                </div>

                <button
                    onClick={onEscolher}
                    className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #d4a017 0%, #84cc16 100%)",
                        color: "#000",
                        boxShadow: "0 0 20px -4px rgba(212,160,23,0.5)",
                    }}
                >
                    <Swords size={15} />
                    Escolher Herói
                </button>
            </div>
        </div>
    );
}



function MapCard({ mapaData, imgSrc, route, imgClass = "", navigate, onBlockedClick }) {

    const locked = mapaData?.locked ?? true;

    const pct = mapaData?.porcentagem ?? 0;

    const done = mapaData?.done ?? false;

    const nome = mapaData?.nome ?? "";



    return (

        <div className="flex flex-col items-center gap-2">

            <div className="relative">

                <img

                    src={imgSrc}

                    alt={nome}

                    className={`transition-transform duration-300 ${imgClass} ${locked ? "grayscale opacity-50" : "hover:scale-105 cursor-pointer"}`}

                />



                {!locked && (

                    <button

                        className="absolute left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 animate-bounce border-2 border-black font-semibold"

                        style={{ bottom: "10rem" }}

                        onClick={() => onBlockedClick ? onBlockedClick() : navigate(route)}

                    >

                        jogar

                    </button>

                )}



                {locked && (

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">

                        <div className="bg-black/70 rounded-2xl p-4 flex flex-col items-center gap-1 border border-gray-700">

                            <Lock size={36} className="text-gray-400" />

                            <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Bloqueado</span>

                        </div>

                    </div>

                )}

            </div>



            <div className="w-full flex flex-col gap-1 px-2">

                <div className="flex justify-between items-center">

                    <span className="text-gray-400 text-[10px] font-semibold truncate">{nome}</span>

                    {locked ? (

                        <span className="text-gray-600 text-[10px]">🔒</span>

                    ) : done ? (

                        <span className="text-[10px] font-bold text-white bg-green-600 rounded px-1.5 py-0.5">Completo</span>

                    ) : (

                        <span className="text-[10px] font-bold text-green-400">{pct.toFixed(0)}%</span>

                    )}

                </div>

                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">

                    <div

                        className="h-1.5 rounded-full transition-all duration-1000"

                        style={{

                            width: `${pct}%`,

                            backgroundColor: locked ? "#4b5563" : done ? "#16a34a" : "#22c55e"

                        }}

                    />

                </div>

            </div>

        </div>

    );

}



export default function Maps() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [mapasProgresso, setMapasProgresso] = useState([]);
    const [showSemMentor, setShowSemMentor] = useState(false);

    const navigate = useNavigate();

    const semMentor = !user?.mentor_id && user?.mentor === null;

    useEffect(() => {

        const userData = async () => {

            try {

                const u = await getMe();

                if (!u) return;

                setUser(u);

            } catch (error) {

                console.error("Erro ao buscar utilizador:", error);

            }

        };

        userData();



        const carregarDados = async () => {

            try {

                const mapas = await getMapas();

                const progresso = await getProgresso();



                const mapasComProgresso = mapas.map((m) => {

                    const prog = progresso.find(p => p.mapa === m.id) || {};

                    const pct = prog.porcentagem || 0;

                    const desbloqueado = prog.desbloqueado || false;



                    return {

                        ...m,

                        desafios: prog.desafios_completos || 0,

                        total: prog.total_desafios || 0,

                        porcentagem: pct,

                        locked: !desbloqueado,

                        done: pct === 100,

                    };

                });



                setMapasProgresso(mapasComProgresso);

                setLoading(false);

            } catch (err) {

                console.error("[Maps] Erro ao carregar mapas e progresso", err);

                setLoading(false);

            }

        };



        carregarDados();

    }, []);



    if (loading) {

        return (

            <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none">

                <div className="flex flex-col items-center gap-6 z-10">

                    <div className="relative w-40 h-40 flex items-center justify-center p-2 bg-[#080808]/50 rounded-xl">

                        <video src={loadingVideo} autoPlay loop muted playsInline className="w-full h-full object-contain" />

                    </div>

                    <div className="flex flex-col items-center gap-3 mt-2">

                        <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse">Carregando</p>

                        <div className="flex gap-1.5 justify-center">

                            {[0, 0.2, 0.4].map((delay, i) => (

                                <div key={i} className="w-1 h-1 rounded-full bg-amber-500/80"

                                    style={{ animation: `dot-pulse 1.4s ease-in-out infinite`, animationDelay: `${delay}s` }} />

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        );

    }



    const mapa1 = mapasProgresso[0];

    const mapa2 = mapasProgresso[1];

    const mapa3 = mapasProgresso[2];



    return (

        <div className="maps min-h-screen bg-black flex flex-col">

            <DashBoardHeader user={user} />

            <SideBar user={user} />

            {showSemMentor && (
                <SemMentorModal
                    onClose={() => setShowSemMentor(false)}
                    onEscolher={() => navigate("/mentores")}
                />
            )}

            <div className="flex-1 flex flex-col mt-20 ml-20 px-6 pb-8">

                <div className="flex justify-end items-center gap-3 mb-2 mr-10">

                    <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white transition-colors">

                        <Search size={20} />

                    </button>

                    <button

                        onClick={() => navigate("/Estatisticas")}

                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white transition-colors"

                    >

                        <ChartBar size={20} />

                    </button>

                </div>



                <div className="flex justify-center mt-3">

                    {mapa1 && (

                        <MapCard mapaData={mapa1} imgSrc={map1} route="/FlorestaDosAlgoritmos" imgClass="w-100 h-145" navigate={navigate}
                            onBlockedClick={semMentor ? () => setShowSemMentor(true) : null}
                        />

                    )}

                </div>



                <div className="flex flex-row justify-center gap-40 mt-5">

                    {mapa2 && (

                        <MapCard mapaData={mapa2} imgSrc={map2} route="/VilaDaLogica" imgClass="w-100 h-145" navigate={navigate}
                            onBlockedClick={semMentor ? () => setShowSemMentor(true) : null}
                        />

                    )}

                    {mapa3 && (

                        <MapCard mapaData={mapa3} imgSrc={map3} route="/FlorestaDosAlgoritmos" imgClass="w-100 h-145" navigate={navigate}
                            onBlockedClick={semMentor ? () => setShowSemMentor(true) : null}
                        />

                    )}

                </div>

            </div>

        </div>

    );

}