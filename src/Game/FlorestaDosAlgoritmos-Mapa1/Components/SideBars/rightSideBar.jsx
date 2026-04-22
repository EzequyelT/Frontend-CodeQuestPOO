import { useState, useEffect } from "react";
import mapImg from "../../../../assets/Maps/Map1.png";
import { getLevelsByMap } from "../../../../Services/maps/levelService";
import { obterXPAluno } from "../../../../Services/Gameplay/xpProgressService";

import { getProgresso } from "../../../../Services/users/userStatsService";
import { Lock, Trophy, CheckSquare } from "lucide-react";
import Button1 from "../../../../assets/Buttons/1.png"

import Button2 from "../../../../assets/Buttons/2.png"
import Button3 from "../../../../assets/Buttons/3.png"
import Button4 from "../../../../assets/Buttons/4.png"
import Button5 from "../../../../assets/Buttons/5.png"

import Button6 from "../../../../assets/Buttons/6.png"
import Button7 from "../../../../assets/Buttons/7.png"
import Button8 from "../../../../assets/Buttons/8.png"

// ─── PALETA DE CORES ────────────────────────────────────────────────────────

const Color = {
    primary: {
        dark: "#0a2a4a",
        main: "#1e5a8e",
        light: "#3b7ab8",
        lighter: "#5a96d8",
        brightest: "#7ab8ff",
    },
    secondary: {
        dark: "#3a2010",
        main: "#8b5e1a",
        light: "#a08060",
        lighter: "#c4a878",
    },
    glow: {
        blue: "rgba(79, 180, 255, 0.6)",
        blueSoft: "rgba(79, 180, 255, 0.3)",
        gold: "rgba(255, 215, 0, 0.6)",
    },
    neutral: {
        bg: "#000",
        darkBg: "#0a0a0a",
        card: "rgba(10, 30, 50, 0.4)",
        border: "rgba(30, 90, 142, 0.3)",
    },
};

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

const BUTTON_IMAGES = {
    1: Button1,
    2: Button2,
    3: Button3,
    4: Button4,
    5: Button5,
    6: Button6,
    7: Button7,
    8: Button8,
};

const OBJETIVO = {
    texto: "Complete 3 desafios sem usar dicas",
    atual: 1,
    total: 3,
    recompensa: "+100 XP",
};

const FEEDBACK_IA = {
    dica: "Em desenvolvimento.",
    tipo: "💡 Feedback Inteligente",
};


// ────────────────────────────────────────────────────────────────────────────

function XPBar({ xpAtual, xpProximo, percentagem }) {

    const safeCurrent = Number(xpAtual ?? 0);

    // tenta converter o xpProximo para número
    const parsedTotal = Number(xpProximo);
    const safeTotal = Number.isFinite(parsedTotal) ? parsedTotal : null;

    // garante percentagem válida
    const safePercent =
        typeof percentagem === "number" && Number.isFinite(percentagem)
            ? Math.min(percentagem, 100)
            : 100;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] rounded-full">
                <span className="text-gray-400">XP</span>

                <span style={{ color: Color.secondary.lighter }} className="font-bold">
                    {safeCurrent.toLocaleString()} /{" "}
                    {safeTotal ? safeTotal.toLocaleString() : "MAX"} XP
                </span>
            </div>

            <div
                className="h-2.5 rounded-full overflow-hidden border"
                style={{
                    background: Color.neutral.card,
                    borderColor: Color.neutral.border,
                    backdropFilter: "blur(5px)",
                }}
            >
                <div
                    className="h-full rounded-full relative overflow-hidden transition-all"
                    style={{
                        width: `${safePercent}%`,
                        background: `linear-gradient(90deg, ${Color.secondary.main}, ${Color.secondary.lighter})`,
                        boxShadow: `0 0 8px ${Color.glow.gold}`,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(90deg,transparent,rgba(255,255,255,0.25) 50%,transparent)",
                            animation: "shimmer 2s infinite",
                        }}
                    />
                </div>
            </div>

            <span className="text-gray-600 text-[10px] text-right">
                {safeTotal
                    ? `Faltam ${(safeTotal - safeCurrent).toLocaleString()} XP para o próximo nível`
                    : "👑 Nível Máximo Atingido!"}
            </span>
        </div>
    );
}

function ObjetivoBox({ objetivo }) {
    const pct = Math.min((objetivo.atual / objetivo.total) * 100, 100);
    const done = objetivo.atual >= objetivo.total;

    return (
        <div
            className="rounded-4xl p-3 flex flex-col gap-1"
            style={{
                background: Color.neutral.card,
                border: `1px solid ${Color.neutral.border}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(122, 184, 255, 0.1)`,
            }}
        >
            <div className="flex items-center gap-2">
                <span className="text-base"><CheckSquare className="h-8 w-5 text-blue-300" /></span>
                <span className="text-white text-[11px] font-semibold">Objetivo Atual</span>
            </div>
            <p className="text-gray-400 text-[10px] leading-relaxed">{objetivo.texto}</p>
            <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Progresso</span>
                <span style={{ color: done ? Color.secondary.lighter : Color.primary.brightest }} className="font-bold">
                    {objetivo.atual}/{objetivo.total}
                </span>
            </div>
            <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{
                    background: Color.neutral.card,
                    border: `0.5px solid ${Color.neutral.border}`,
                }}
            >
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${pct}%`,
                        background: done
                            ? `linear-gradient(90deg, ${Color.secondary.main}, ${Color.secondary.lighter})`
                            : `linear-gradient(90deg, ${Color.primary.light}, ${Color.primary.lighter})`,
                        boxShadow: done
                            ? `0 0 6px ${Color.glow.gold}`
                            : `0 0 6px ${Color.glow.blue}`,
                    }}
                />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 text-[9px]">Recompensa</span>
                <span style={{ color: Color.secondary.lighter }} className="text-[10px] font-bold">🪙 {objetivo.recompensa}</span>
            </div>
        </div>
    );
}

function FeedbackIA({ feedback }) {
    const [visivel, setVisivel] = useState(true);

    if (!visivel) return (
        <button
            onClick={() => setVisivel(true)}
            className="w-full text-10px rounded-xl py-2 font-bold transition-all"
            style={{
                color: Color.primary.brightest,
                background: Color.neutral.card,
                border: `1px solid ${Color.primary.dark}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(122, 184, 255, 0.1)`,
            }}
        >
            💡 Ver Feedback da IA
        </button>
    );

    return (
        <div
            className="rounded-4xl p-2.5 flex flex-col gap-1"
            style={{
                background: Color.neutral.card,
                border: `1px solid ${Color.neutral.border}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(122, 184, 255, 0.1)`,
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div
                        className="w-5 h-5 rounded-full border flex items-center justify-center"
                        style={{
                            background: `rgba(122, 184, 255, 0.15)`,
                            borderColor: `${Color.primary.light}`,
                        }}
                    >
                        <span className="text-[10px]" style={{ color: Color.primary.brightest }}>✓</span>
                    </div>
                    <span style={{ color: Color.primary.lighter }} className="text-[10px] font-semibold">{feedback.tipo}</span>
                </div>
                <button
                    onClick={() => setVisivel(false)}
                    className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
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
        <div
            className="rounded-4xl p-3 flex items-center justify-between gap-1"
            style={{
                background: Color.neutral.card,
                border: `1px solid ${Color.neutral.border}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(122, 184, 255, 0.1)`,
            }}
        >
            <div>
                <p className="text-white text-[11px] font-semibold">Pedir Dica</p>
                <p className="text-gray-500 text-[9px]">−5 coins por dica</p>
            </div>
            <button
                onClick={handlePedir}
                disabled={usado}
                className="text-[10px] font-bold px-3 py-1.5 rounded-4xl transition-all"
                style={{
                    background: usado
                        ? `rgba(122, 184, 255, 0.1)`
                        : `linear-gradient(135deg, ${Color.primary.light}, ${Color.primary.lighter})`,
                    color: usado ? "#888" : "#fff",
                    border: usado
                        ? `1px solid ${Color.neutral.border}`
                        : `1px solid ${Color.primary.main}`,
                    cursor: usado ? "not-allowed" : "pointer",
                    boxShadow: usado ? "none" : `0 0 10px ${Color.glow.blueSoft}`,
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

            <div className="absolute top-1.5 left-3 mb-6 inline-flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg px-4 py-[5px]"
                style={{
                    background: Color.neutral.card,
                    border: `1px solid ${Color.neutral.border}`,
                }}
            >
                <span
                    className="text-white text-[10px] font-bold leading-none"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                    Floresta dos Algoritmos
                </span>
            </div>

            <div className="absolute bottom-1.5 right-2 mb-1 inline-flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg px-3 py-[6px]"
                style={{
                    background: Color.neutral.card,
                    border: `1px solid ${Color.neutral.border}`,
                }}
            >
                <span
                    className="text-gray-300 text-[9px] leading-none"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                    {proximo?.name ?? "Fim do mapa"}
                </span>
            </div>

            <div className="absolute bottom-1.5 left-2 mb-1 inline-flex items-center justify-center backdrop-blur-sm rounded-full shadow-lg px-3 py-[6px]"
                style={{
                    background: Color.neutral.card,
                    border: `1px solid ${Color.neutral.border}`,
                }}
            >
                <span className="text-gray-400 text-[9px] font-bold leading-none">
                    {desafiosCompletos}/{progressoMapa} desafios
                </span>
            </div>

            {challenges.map(ch => {
                const S = 18;
                const buttonImage = BUTTON_IMAGES[ch.id] || Button1;

                const styles = {
                    completed: {
                        border: `2px solid ${Color.secondary.lighter}`,
                        bg: `radial-gradient(circle at 35% 35%, ${Color.secondary.light}, ${Color.secondary.dark})`,
                        glow: `0 0 12px ${Color.glow.gold}, 0 0 25px rgba(255, 215, 0, 0.2)`,
                        numColor: Color.secondary.lighter,
                    },
                    available: {
                        border: `3px solid ${Color.primary.brightest}`,
                        bg: `radial-gradient(circle at 35% 35%, ${Color.primary.lighter}, ${Color.primary.dark})`,
                        glow: `0 0 20px ${Color.glow.blue}, 0 0 40px ${Color.glow.blueSoft}, inset 0 0 15px rgba(122, 184, 255, 0.2)`,
                        numColor: "#fff",
                        transform: "scale(1.15)",
                        boxShadow: `0 0 25px ${Color.glow.blue}, 0 0 50px ${Color.glow.blueSoft}`,
                    },
                    locked: {
                        border: `2px solid ${Color.neutral.border}`,
                        bg: `radial-gradient(circle at 35% 35%, rgba(122, 184, 255, 0.1), ${Color.primary.dark})`,
                        glow: "none",
                        numColor: "#888",
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
                            transform: `translate(-50%, -50%) ${style.transform || "scale(1)"}`,
                            cursor: ch.state === "available" ? "pointer" : "default",
                            transition: "transform 0.3s ease-in-out",
                            zIndex: ch.state === "available" ? 40 : 10,
                        }}
                    >
                        {/* Anéis pulsantes para available */}
                        <div
                            style={{
                                width: S + 10,
                                height: S + 10,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            {/* 🔵 PULSO (só se available) - MELHORADO */}
                            {ch.state === "available" && [0, 50].map(delay => (
                                <div
                                    key={delay}
                                    style={{
                                        position: "absolute",
                                        width: S + 10,
                                        height: S + 10,
                                        borderRadius: "50%",
                                        border: `2px solid ${Color.primary.brightest}`,
                                        opacity: delay === 0 ? 0.7 : 0.4,
                                        animation: `pulseRing 2s ease-out infinite ${delay}s`,
                                        marginLeft: 25,
                                        marginTop: 28,
                                    }}
                                />
                            ))}


                            {/* 🎯 BOTÃO (imagem) */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={buttonImage}
                                    alt={`Fase ${ch.id}`}
                                    style={{
                                        width: "85%",
                                        height: "85%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        filter:
                                            ch.state === "locked"
                                                ? "grayscale(100%) opacity(0.5)"
                                                : ch.state === "available"
                                                    ? "brightness(1.2) contrast(1.1)"
                                                    : "brightness(1)",
                                    }}
                                />
                            </div>

                            {/* 🔒 LOCK */}
                            {ch.state === "locked" && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        background: "rgba(0,0,0,0.6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: `2px solid ${Color.neutral.border}`,
                                    }}
                                >
                                    <Lock size={10} color="#666" />
                                </div>
                            )}

                            {/* ✔ COMPLETED */}
                            {ch.state === "completed" && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: -4,
                                        right: -4,
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        background: Color.secondary.lighter,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: Color.secondary.dark,
                                        boxShadow: `0 0 8px ${Color.glow.gold}`,
                                    }}
                                >
                                    ✓
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

           @keyframes bounceArrow {
             0%, 100% {
               transform: translateX(-50%) translateY(0);
             }
             50% {
               transform: translateX(-50%) translateY(-10px);
             }
           }
          `}</style>
        </div>
    );
}

function getWrongStyle(wrong, limit = 5) {
    const ratio = wrong / limit

    if (ratio === 0) return { color: "text-white", pulse: "", glow: "" }
    if (ratio <= 0.4) return { color: "text-yellow-300", pulse: "animate-pulse", glow: "" }
    if (ratio <= 0.6) return { color: "text-orange-400", pulse: "animate-pulse", glow: "drop-shadow-[0_0_4px_rgba(251,146,60,0.8)]" }
    if (ratio < 1) return { color: "text-red-400", pulse: "animate-[pulse_0.6s_ease-in-out_infinite]", glow: "drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]" }
    return { color: "text-red-500", pulse: "animate-[pulse_0.3s_ease-in-out_infinite]", glow: "drop-shadow-[0_0_8px_rgba(239,68,68,1)]" }
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function RightSideBar({ time, attempts, wrong = 0 }) {
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

                const [levelsResult, xpResult] = await Promise.all([
                    fetchLevelsData(1, token),
                    obterXPAluno()
                ]);

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

    const xpAtual = Number(progressaoXp?.progressao?.xpAtualNivel ?? 0);
    const xpProximoRaw = progressaoXp?.progressao?.xpProximoNivel;

    const xpProximo =
        Number.isFinite(Number(xpProximoRaw))
            ? Number(xpProximoRaw)
            : null;

    const percentagem =
        xpProximo && xpProximo > 0
            ? Math.min((xpAtual / xpProximo) * 100, 100)
            : 100;

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
                        background: Color.neutral.card,
                        border: `1px solid ${Color.neutral.border}`,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(122, 184, 255, 0.1)`,
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                style={{
                                    background: `linear-gradient(135deg, ${Color.secondary.dark}, ${Color.secondary.main})`,
                                    border: `1.5px solid ${Color.secondary.lighter}`,
                                    boxShadow: `0 0 8px ${Color.glow.gold}`,
                                }}
                            >
                                <Trophy className="h-9 w-4 items-center text-amber-50" />
                            </div>
                            <div>
                                <p style={{ color: Color.secondary.lighter }} className="text-[11px] font-bold leading-none">
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
                                background: `rgba(139, 94, 26, 0.15)`,
                                color: Color.secondary.lighter,
                                border: `1px solid ${Color.secondary.dark}`,
                            }}
                        >
                        </span>
                    </div>




                    <XPBar
                        xpAtual={progressaoXp?.progressao?.xpAtualNivel ?? 0}
                        xpProximo={progressaoXp?.progressao?.xpProximoNivel ?? "👑 Nível Máximo Atingido!"}
                        percentagem={percentagem}
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
                            background: Color.neutral.card,
                            border: `1px solid ${Color.neutral.border}`,
                        }}
                    >
                        <span className="text-gray-500 text-[10px]">⏱ Tempo de jogo</span>
                        <span className="text-white text-[10px] font-bold">
                            {formatTime(time)}
                        </span>
                        <span className="text-gray-600 text-[10px]">|</span>
                        {attempts !== undefined ? (
                            <>
                                <span className="text-gray-500 text-[10px]">🎯 Tentativas</span>
                                <span className="text-white text-[10px] font-bold">{attempts}</span>
                            </>
                        ) : (() => {
                            const { color, pulse, glow } = getWrongStyle(wrong)
                            return (
                                <>
                                    <span className="text-gray-500 text-[10px]">❌ Erradas</span>
                                    <span className={`text-[10px] font-bold transition-colors duration-500 ${color} ${pulse} ${glow}`}>
                                        {wrong ?? 0}
                                    </span>
                                </>
                            )
                        })()}
                    </div>

                </div>
            </aside>
        </>
    );
}