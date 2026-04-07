import { useState, useEffect } from "react";
import mapImg from "../../../../assets/Maps/Map1.png";
import { getLevelsByMap } from "../../../../Services/levelService";
import { obterXPAluno } from "../../../../Services/desempenhoDesafiosService";
import { getProgresso } from "../../../../Services/UserService";

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
        <div className="bg-gray-900/60 border border-gray-800 rounded-4xl p-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="text-base">🎯</span>
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
            className="w-full text-[10px] text-blue-400 border border-blue-900/40 rounded-xl py-2 hover:bg-blue-900/20 transition-colors"
        >
            💡 Ver Feedback da IA
        </button>
    );

    return (
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-4xl p-2.5 flex flex-col gap-1">
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
        <div className="bg-gray-900/40 border border-gray-800 rounded-4xl p-3 flex items-center justify-between gap-1">
            <div>
                <p className="text-white text-[11px] font-semibold">Pedir Dica</p>
                <p className="text-gray-500 text-[9px]">−5 coins por dica</p>
            </div>
            <button
                onClick={handlePedir}
                disabled={usado}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
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
                className="w-full h-full object-cover brightness-[0.75] saturate-[0.90]"
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
                // Definir estilo baseado no estado do challenge
                const style = {
                    completed: {
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: "3px solid #FFD700",
                        background: "radial-gradient(circle at 35% 35%, #FFD700, #b38600)",
                        boxShadow: "0 0 12px #FFD700aa, 0 0 25px #FFD70044",
                    },
                    available: {
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "3px solid #4fc3f7",
                        background: "radial-gradient(circle at 35% 35%, #4fc3f7, #0d2a3d)",
                        boxShadow: "0 0 15px #4fc3f7cc, 0 0 35px #4fc3f722",
                        animation: "pulse 1.5s infinite alternate",
                    },
                    locked: {
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        border: "2px solid #2a2a2a",
                        background: "radial-gradient(circle at 35% 35%, #444, #111)",
                        boxShadow: "none",
                    },
                }[ch.state];

                return (
                    <div
                        key={ch.id}
                        className="absolute"
                        style={{
                            left: `${ch.x}%`,
                            top: `${ch.y}%`,
                            transform: "translate(-50%, -50%)",
                            cursor: ch.state === "available" ? "pointer" : "default",
                            ...style,
                        }}
                    />
                );
            })}

            <style>{`
    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        100% { transform: translate(-50%, -50%) scale(1.2); }
    }
`}</style>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function RightSideBar() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [desafiosCompletos, setDesafiosCompletos] = useState(0);
    const [progressoMapa, setProgressoMapa] = useState(0);
    const [levels, setLevels] = useState([]);
    const [progressaoXp, setProgressaoXp] = useState(null);

    const objetivo = OBJETIVO;
    const feedbackIA = FEEDBACK_IA;
    const tempoJogo = "02h 14m";

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
                className="fixed right-20 top-1 h-screen flex flex-col gap-3 overflow-y-auto py-6 px-4"
                style={{
                    width: 340,
                    zIndex: 60,
                    scrollbarWidth: "none",
                    background: "transparent",
                }}
            >
                {/* HEADER: Nível + XP */}
                <div
                    className="rounded-4xl p-3 flex flex-col gap-1"
                    style={{
                        background: "linear-gradient(135deg,#1a1025,#0f0a1a)",
                        border: "1px solid rgba(212,160,23,0.25)",
                        boxShadow: "0 0 20px rgba(212,160,23,0.08)",
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
                                🏆
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
                <div className="flex flex-col gap-2 mt-auto pt-1">
                    <div
                        className="rounded-4xl px-4 py-2 flex items-center justify-between"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="text-gray-500 text-[10px]">⏱ Tempo de jogo</span>
                        <span className="text-white text-[10px] font-bold">{tempoJogo}</span>
                    </div>

                    <button
                        className="w-full mb-2 py-2.5 rounded-4xl text-[13px] font-bold transition-all hover:brightness-110 active:scale-95"
                        style={{
                            background: "linear-gradient(135deg,#16a34a,#15803d)",
                            color: "#fff",
                            border: "1px solid rgba(22,163,74,0.4)",
                            boxShadow: "0 0 16px rgba(22,163,74,0.25)",
                        }}
                    >
                        ⚔️ Próxima Aventura
                    </button>
                </div>
            </aside>
        </>
    );
}
