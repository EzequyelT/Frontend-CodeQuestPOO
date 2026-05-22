import { useState, useEffect } from "react";
import { getProgresso } from "../../Services/users/userStatsService";
import { getMapas } from "../../Services/maps/mapasService";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import map1 from "../../assets/Maps/FirstMap.png";
import { useNavigate } from "react-router-dom";
import { ChartBar, Search } from "lucide-react"
import { getMe } from "../../Services/users/userService";

export default function Maps() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mapasProgresso, setMapasProgresso] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const userData = async () => {
            try {
                const user = await getMe();
                if (!user) return;
                setUser(user);
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar utilizador:", error);
            }
        }
        userData()

        const carregarDados = async () => {
            try {
                const mapas = await getMapas();
                const progresso = await getProgresso(user);

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
                        bgColor: "#333",
                        color: "#22c55e",
                        emoji: "🗺️",
                        boss: "Boss",
                        bossEmoji: "👹"
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
            <div className="relative min-h-screen bg-black animate-fadeIn flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Carregando Mapas...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="maps min-h-screen bg-black flex flex-col">
            <DashBoardHeader user={user} />
            <SideBar user={user} />


            <div className="flex-1 flex flex-col justify-between mt-20 ml-20 px-6 pb-8">
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

                <div className="relative mt-3">
                    <img
                        src={map1}
                        alt="Mapa 1"
                        className="w-100 h-145 ml-125 transition-transform duration-300 hover:scale-105 cursor-pointer"
                    />
                    <button
                        className="absolute left-1/2 bottom-40 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 animate-bounce border-2 border-black font-semibold"
                        onClick={() => navigate('/FlorestaDosAlgoritmos')}
                    >
                        jogar
                    </button>
                </div>

                <footer className="w-full max-w-5xl mt-20 ml-50">
                    <div className="w-full flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#111] p-5">
                        {mapasProgresso.map((m, i) => {
                            const pct = m.porcentagem;
                            return (
                                <div key={i} className="flex flex-col gap-2 hover:scale-[1.01] transition-transform duration-300">
                                    <div
                                        className="rounded-lg h-14 flex items-center justify-between px-6 border"
                                        style={{
                                            backgroundColor: m.bgColor + "99",
                                            borderColor: m.color + "55",
                                            opacity: m.locked ? 0.5 : 1,
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{m.emoji}</span>
                                            <div>
                                                <p className="text-white text-xs font-semibold">{m.nome}</p>
                                                <p className="text-gray-400 text-[10px]">Boss: {m.bossEmoji} {m.boss}</p>
                                            </div>
                                        </div>
                                        {m.locked ? (
                                            <span>🔒</span>
                                        ) : m.done ? (
                                            <span className="text-[10px] font-bold text-white bg-green-600 rounded px-1.5 py-0.5">Completo</span>
                                        ) : (
                                            <span className="text-[10px] font-bold" style={{ color: m.color }}>{pct.toFixed(0)}%</span>
                                        )}
                                    </div>
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-1 rounded-full transition-all duration-1000"
                                            style={{ width: `${pct}%`, backgroundColor: m.color }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </footer>
            </div>
        </div>
    )
}