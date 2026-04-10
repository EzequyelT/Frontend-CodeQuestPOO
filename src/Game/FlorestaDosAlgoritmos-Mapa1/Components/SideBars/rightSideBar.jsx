import { useState, useEffect } from "react";
import mapImg from "../../../../assets/Maps/Map1.png";
import { getLevelsByMap } from "../../../../Services/maps/levelService";
import { obterXPAluno } from "../../../../Services/Gameplay/xpProgressService";
import { getProgresso } from "../../../../Services/users/userStatsService";
import Arrow from "../../../../assets/Maps/Arrow.png";
import { Lock, Trophy, CheckSquare } from "lucide-react";

// ─── DADOS LOCAIS ────────────────────────────────────────────────────────────

const CHALLENGEPOSITIONS = {
    1: { x: 34, y: 88 },
    2: { x: 48, y: 78 },
    3: { x: 62, y: 68 },
    4: { x: 30, y: 52 },
    5: { x: 65, y: 42 },
    6: { x: 90, y: 30 },
    7: { x: 10, y: 35 },
    8: { x: 46, y: 18 },
};

const OBJETIVO = {
    texto: "Complete 3 desafios sem usar dicas",
    atual: 1,
    total: 3,
    recompensa: "+100 XP",
};

const FEEDBACK_IA = {
    dica: "Lembra-te de usar self como primeiro parâmetro em métodos de instância.",
    tipo: "💡 Feedback Inteligente",
};

// ────────────────────────────────────────────────────────────────────────────

function XPBar({ xpAtual, xpProximo, percentagem }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] rounded-full">
                <span className="text-gray-400">XP</span>
                <span className="text-yellow-400 font-bold">{xpAtual} / {xpProximo}</span>
            </div>
            <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        width: `${percentagem}%`,
                        background: "linear-gradient(90deg, #d4a017, #84cc16)",
                        boxShadow: "0 0 8px #d4a01766",
                        transition: "width 1s ease",
                    }}
                >
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25) 50%,transparent)",
                        animation: "shimmer 2s infinite",
                    }} />
                </div>
            </div>
            <span className="text-gray-600 text-[9px] text-right">
                Faltam {xpProximo - xpAtual} XP para o próximo nível
            </span>
        </div>
    );
}

function ObjetivoBox({ objetivo }) {
    const pct = Math.min((objetivo.atual / objetivo.total) * 100, 100);
    const done = objetivo.atual >= objetivo.total;

    return (
        <div className="rounded-4xl p-3 flex flex-col gap-1 flex flex-col gap-1"
            style={{
                background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
        >
            <div className="flex items-center gap-2">
                <span className="text-base"><CheckSquare className="h-8 w-5 text-amber-50" /></span>
                <span className="text-white text-[11px] font-semibold">Objetivo Atual</span>
            </div>
            <p className="text-gray-400 text-[10px] leading-relaxed">{objetivo.texto}</p>
            <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Progresso</span>
                <span style={{ color: done ? "#d4a017" : "#4fc3f7" }} className="font-bold">
                    {objetivo.atual}/{objetivo.total}
                </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${pct}%`,
                        background: done ? "#d4a017" : "#4fc3f7",
                        boxShadow: done ? "0 0 6px #d4a01766" : "0 0 6px #4fc3f766",
                    }}
                />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 text-[9px]">Recompensa</span>
                <span className="text-yellow-400 text-[10px] font-bold">🪙 {objetivo.recompensa}</span>
            </div>
        </div>
    );
}

function FeedbackIA({ feedback }) {
    const [visivel, setVisivel] = useState(true);

    if (!visivel) return (
        <button
            onClick={() => setVisivel(true)}
            className="w-full text-10px rounded-xl py-2 text-amber-400 font-bold"
            style={{
                background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                border: "1px solid rgba(124,58,237,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
        >
            💡 Ver Feedback da IA
        </button>
    );

    return (
        <div className="rounded-4xl p-2.5 flex flex-col gap-1"
            style={{
                background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center">
                        <span className="text-[10px]">✓</span>
                    </div>
                    <span className="text-blue-300 text-[10px] font-semibold">{feedback.tipo}</span>
                </div>
                <button
                    onClick={() => setVisivel(false)}
                    className="text-gray-600 hover:text-gray-400 text-xs"
                >✕</button>
            </div>
            <p className="text-gray-300 text-[10px] leading-relaxed">
                Dica: {feedback.dica}
            </p>
        </div>
    );
}

function PedirDica({ onPedir }) {
    const [usado, setUsado] = useState(false);

    function handlePedir() {
        setUsado(true);
        if (onPedir) onPedir();
    }

    return (
        <div className="rounded-4xl p-3 flex items-center justify-between gap-1"
            style={{
                background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
        >
            <div>
                <p className="text-white text-[11px] font-semibold">Pedir Dica</p>
                <p className="text-gray-500 text-[9px]">−5 coins por dica</p>
            </div>
            <button
                onClick={handlePedir}
                disabled={usado}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all rounded-4xl"
                style={{
                    background: usado
                        ? "rgba(255,255,255,0.05)"
                        : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    color: usado ? "#555" : "#fff",
                    border: usado ? "1px solid #333" : "1px solid rgba(124,58,237,0.5)",
                    cursor: usado ? "not-allowed" : "pointer",
                    boxShadow: usado ? "none" : "0 0 10px rgba(124,58,237,0.3)",
                }}
            >
                {usado ? "Usada ✓" : "Usar 💡"}
            </button>
        </div>
    );
}

function MiniMapa({ levels, desafiosCompletos, progressoMapa }) {
    const challenges = levels.flatMap(l => l.challenges) ?? [];
    const currentIdx = challenges.findIndex(c => c.state === "available");
    const proximo = challenges[currentIdx + 1];


    return (
        <div className="relative w-full h-[200px]">
            <img
                src={mapImg}
                alt="mini mapa"
                className="w-full h-full object-cover brightness-[0.80] saturate-[1]"
            />

            <div className="absolute top-1.5 left-3 mb-6 inline-flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-full shadow-lg px-4 py-[5px]">
                <span
                    className="text-white text-[10px] font-bold leading-none"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                    Floresta dos Algoritmos
                </span>
            </div>

            <div className="absolute bottom-1.5 right-2 mb-1 inline-flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-full shadow-lg px-3 py-[6px]">
                <span
                    className="text-gray-300 text-[9px] leading-none"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                    {proximo?.name ?? "Fim do mapa"}
                </span>
            </div>

            <div className="absolute bottom-1.5 left-2 mb-1 inline-flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-full shadow-lg px-3 py-[6px]">
                <span className="text-gray-400 text-[9px] font-bold leading-none">
                    {desafiosCompletos}/{progressoMapa} desafios
                </span>
            </div>

            {challenges.map(ch => {
                const S = 18; // tamanho base para mini mapa

                const styles = {
                    completed: {
                        border: "2px solid #FFD700",
                        bg: "radial-gradient(circle at 35% 35%, #FFD700, #b38600)",
                        glow: "0 0 12px #FFD700aa, 0 0 25px #FFD70044",
                        numColor: "#1a0e00",
                    },
                    available: {
                        border: "2px solid #4fc3f7",
                        bg: "radial-gradient(circle at 35% 35%, #4fc3f7, #0d2a3d)",
                        glow: "0 0 15px #4fc3f7cc, 0 0 35px #4fc3f722",
                        numColor: "#fff",
                    },
                    locked: {
                        border: "2px solid #2a2a2a",
                        bg: "radial-gradient(circle at 35% 35%, #444, #111)",
                        glow: "none",
                        numColor: "#555",
                    },
                };

                const style = styles[ch.state];
                return (
                    <div
                        key={ch.id}
                        className="absolute"
                        style={{
                            left: `${ch.x}%`,
                            top: `${ch.y}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: ch.state === "available" ? "pointer" : "default",
                        }}
                    >
                        {/* Anéis pulsantes para available */}
                        {ch.state === "available" && [0, 0.5].map(delay => (
                            <div key={delay} style={{
                                position: "absolute",
                                width: S + 12,
                                height: S + 12,
                                borderRadius: "50%",
                                border: `1.5px solid rgba(79,195,247,${delay === 0 ? 0.5 : 0.25})`,
                                animation: `pulseRing 2s ease-out infinite ${delay}s`,
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }} />
                        ))}
                        {ch.state === "available" && (
                            <div style={{
                                position: "absolute",
                                top: -20,
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                animation: "bounceArrow 2s ease-in-out infinite",
                                pointerEvents: "auto",
                                zIndex: 40,
                                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))"
                            }}>
                                {/* Seta SVG apontando para baixo */}
                                <img src={Arrow} width={80} height={60} viewBox="0 0 24 24" fill="none"></img>
                            </div>
                        )}
                        {/* Círculo principal */}
                        <div style={{
                            width: S,
                            height: S,
                            borderRadius: "50%",
                            border: style.border,
                            background: style.bg,
                            boxShadow: style.glow,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            transition: "all 0.3s ease",
                        }}>
                            {/* Número */}
                            <span style={{
                                fontFamily: "Georgia, serif",
                                fontWeight: 900,
                                fontSize: 9,
                                color: style.numColor,
                                textShadow: ch.state !== "locked" ? `0 0 6px ${style.numColor}` : "none",
                            }}>
                                {ch.id}
                            </span>
                            {/* Overlay de locked */}
                            {ch.state === "locked" && (
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Lock size={8} color="#444" />
                                </div>
                            )}
                            {/* Badge de completed */}
                            {ch.state === "completed" && (
                                <div style={{
                                    position: "absolute",
                                    top: -3,
                                    right: -3,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: "#FFD700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 0 6px rgba(255,215,0,0.9)",
                                }}>
                                    <svg width={6} height={6} viewBox="0 0 24 24" fill="none"
                                        stroke="#000" strokeWidth="4" strokeLinecap="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            <style>{`
             @keyframes pulseRing {
               0% {
               transform: translate(-50%, -50%) scale(1);
               opacity: 1;
               }
             100% {
              transform: translate(-50%, -50%) scale(1.8);
              opacity: 0;
               }
           }
          `}</style>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function RightSideBar({ time }) {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [desafiosCompletos, setDesafiosCompletos] = useState(0);
    const [progressoMapa, setProgressoMapa] = useState(0);
    const [levels, setLevels] = useState([]);
    const [progressaoXp, setProgressaoXp] = useState(null);

    const objetivo = OBJETIVO;
    const feedbackIA = FEEDBACK_IA;

    function formatTime(totalSeconds) {
        const horas = Math.floor(totalSeconds / 3600);
        const minutos = Math.floor((totalSeconds % 3600) / 60);
        const segundos = totalSeconds % 60;

        const partes = [];
        if (horas > 0) partes.push(`${horas}h`);
        if (minutos > 0 || horas > 0) partes.push(`${minutos}m`);
        partes.push(`${segundos}s`);

        return partes.join(" ");
    }

    // Função para buscar níveis e progresso
    async function fetchLevelsData(mapaId, token) {
        const [niveisDB, progressoTotal] = await Promise.all([
            getLevelsByMap(mapaId),
            getProgresso(token),
        ]);

        const progressoMapaData = progressoTotal.find(p => p.mapa === mapaId) || {};
        const desafiosCompletosData = progressoMapaData.desafios_completos || 0;

        let posicaoGlobal = 0;

        const levelsData = niveisDB.map((nivel) => ({
            id: nivel.id,
            name: nivel.nome,
            challenges: nivel.desafios.map((desafio) => {
                const pos = CHALLENGEPOSITIONS[desafio.id] ?? { x: 50, y: 50 };
                const minhaPosicao = posicaoGlobal++;

                let state;
                if (minhaPosicao < desafiosCompletosData) state = "completed";
                else if (minhaPosicao === desafiosCompletosData) state = "available";
                else state = "locked";

                return {
                    id: desafio.id,
                    name: desafio.nome,
                    description: desafio.descricao,
                    xpReward: desafio.xp,
                    route: `/floresta/nivel-${nivel.id}/desafio-${desafio.id}`,
                    x: pos.x,
                    y: pos.y,
                    state,
                    stars: state === "completed" ? 3 : 0,

                };
            }),
        }));

        return {
            levels: levelsData,
            desafiosCompletos: desafiosCompletosData,
            totalDesafios: niveisDB.reduce((acc, n) => acc + n.desafios.length, 0),
        };
    }

    // Carregar todos os dados
    useEffect(() => {
        async function loadData() {
            try {
                const token = localStorage.getItem("cq_token");
                const storedUser = localStorage.getItem("cq_user");

                if (!storedUser || !token) {
                    setErro("Utilizador não autenticado");
                    setLoading(false);
                    return;
                }

                // Carregar dados em paralelo
                const [levelsResult, xpResult] = await Promise.all([
                    fetchLevelsData(1, token),
                    obterXPAluno()
                ]);

                // Aqui você pode logar os dados
                console.log("Levels Result:", levelsResult);
                console.log("XP Result:", xpResult);

                setLevels(levelsResult.levels);
                setDesafiosCompletos(levelsResult.desafiosCompletos);
                setProgressoMapa(levelsResult.totalDesafios);

                if (xpResult) {
                    setProgressaoXp(xpResult);
                }

                setErro(null);
            } catch (err) {
                console.error("Erro ao carregar dados do sidebar:", err);
                setErro(err.message || "Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <aside
                className="fixed right-20 top-1 h-screen flex items-center justify-center"
                style={{ width: 340, zIndex: 60 }}
            >
                <div className="text-gray-500 text-sm">Carregando...</div>
            </aside>
        );
    }

    if (erro) {
        return (
            <aside
                className="fixed right-20 top-1 h-screen flex items-center justify-center"
                style={{ width: 340, zIndex: 60 }}
            >
                <div className="text-red-400 text-sm">{erro}</div>
            </aside>
        );
    }

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <aside
                className="fixed right-10 mt-4 h-screen flex flex-col gap-3 overflow-y-auto py-6 px-4"
                style={{
                    width: 340,
                    zIndex: 80,
                    scrollbarWidth: "none",
                    background: "transparent",
                }}
            >
                {/* HEADER: Nível + XP */}
                <div
                    className="rounded-4xl p-3 flex flex-col gap-1"
                    style={{
                        background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",

                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                style={{
                                    background: "radial-gradient(circle,#3a2800,#1a1000)",
                                    border: "1.5px solid #d4a017",
                                    boxShadow: "0 0 8px rgba(212,160,23,0.4)",
                                }}
                            >
                                <Trophy className="h-9 w-4 items-center text-amber-50" />
                            </div>
                            <div>
                                <p className="text-yellow-400 text-[11px] font-bold leading-none">
                                    Nível {progressaoXp?.progressao?.nivel ?? 1}
                                </p>
                                <p className="text-gray-500 text-[9px] mt-0.5">
                                    {progressaoXp?.progressao?.titulo ?? "Iniciante"}
                                </p>
                            </div>
                        </div>
                        <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                                background: "rgba(132,204,22,0.15)",
                                color: "#84cc16",
                                border: "1px solid rgba(132,204,22,0.3)",
                            }}
                        >
                        </span>
                    </div>

                    <XPBar
                        xpAtual={progressaoXp?.progressao?.xp ?? 0}
                        xpProximo={progressaoXp?.progressao?.xpProximoNivel ?? 100}
                        percentagem={
                            progressaoXp?.progressao?.xpProximoNivel
                                ? (progressaoXp.progressao.xp / progressaoXp.progressao.xpProximoNivel) * 100
                                : 0
                        }
                    />
                </div>

                <ObjetivoBox objetivo={objetivo} />
                <FeedbackIA feedback={feedbackIA} />
                <PedirDica onPedir={() => console.log("TODO: chamar API de dica")} />

                <MiniMapa
                    levels={levels}
                    desafiosCompletos={desafiosCompletos}
                    progressoMapa={progressoMapa}
                />

                {/* FOOTER */}
                <div className="flex flex-col gap-2 mb-5 pt-0">
                    <div
                        className="rounded-4xl px-4 py-2 flex items-center justify-between"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="text-gray-500 text-[10px]">⏱ Tempo de jogo</span>
                        <span className="text-white text-[10px] font-bold">
                            {formatTime(time)}
                        </span>
                    </div>

                </div>
            </aside>
        </>
    );
}
