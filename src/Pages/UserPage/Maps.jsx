import { useState, useEffect } from "react";
import { getProgresso } from "../../Services/progressoService";
import { getMapas } from "../../Services/mapasService";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import map1 from "../../assets/Maps/FirstMap.png";
import { useNavigate } from "react-router-dom";

export default function Maps() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [mapasProgresso, setMapasProgresso] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("cq_user");
        const token = localStorage.getItem("cq_token");

        if (!storedUser || !token) {
            setErro("Utilizador não autenticado");
            setLoading(false);
            console.error("[Maps] Sem utilizador ou token no localStorage");
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const carregarDados = async () => {
            try {
                // 1️⃣ Buscar mapas
                const mapas = await getMapas();
                // 2️⃣ Buscar progresso do aluno
                const progresso = await getProgresso(token);

                // 3️⃣ Combinar mapas e progresso
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
                        bgColor: "#333", // aqui você pode definir cores por mapa
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
                setErro("Erro ao carregar dados");
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-400">{erro}</div>
            </div>
        );
    }

    return (

        <div className="maps">
            <DashBoardHeader user={user} />
            <SideBar user={user} />
            <div className="flex items-start justify-center gap-8 mt-20">

                {/* Imagem + botão sobrepostos */}
                <div className="relative">
                    <img
                        src={map1}
                        alt="Mapa 1"
                        className="w-95 h-130 transition-transform duration-300 hover:scale-105 cursor-pointer"
                    />
                    <button
                        className="
        absolute bottom-6 left-1/2 -translate-x-1/2
        bg-green-600 text-white
        px-6 py-2 rounded-full
        hover:bg-green-700
        transition-colors duration-200
        animate-bounce
        border-2 border-black
        font-semibold
      "
                        onClick={() => navigate('/FlorestaDosAlgoritmos')}
                    >
                        jogar
                    </button>
                </div>

                {/* Barra de níveis ao lado */}
                <div className="w-[420px] flex flex-col gap-4 pt-4">
                    {mapasProgresso.map((m, i) => {
                        const pct = m.porcentagem;
                        return (
                            <div key={i} className="flex flex-col gap-2 hover:scale-105 transition-transform duration-300">
                                <div
                                    className="rounded-lg h-14 flex items-center justify-between px-3 border"
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
                                <div className="h-1 bg-gray-800 rounded-full">
                                    <div
                                        className="h-1 rounded-full transition-all duration-1000"
                                        style={{ width: `${pct}%`, backgroundColor: m.color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    )
}