import { useState, useEffect, useRef } from "react";
import BossBannerImgMap1 from "../../../assets/Maps/BannerBoss-Map1.png";
import BossBannerImgMap2 from "../../../assets/Maps/BannerBoss-Map2.png";

import { obterXPAluno } from "../../../Services/Gameplay/xpProgressService";
import { Trophy, CheckSquare } from "lucide-react";

import loadingVideo from "../../../assets/Loading/loading.webm";

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

const GAP_FROM_CENTER_RIGHT = 350;

const BOSS_HP_CONFIG = {
    maxHp: 1000,
    barBottom: "78",
    barLeft: "25",
    barWidth: "160",
    barHeightClass: "h-4",
};

const OBJETIVO = {
    texto: "Complete 3 desafios sem usar dicas",
    atual: 1,
    total: 3,
    recompensa: "+100 XP",
};

const bossBarStyles = `
  @keyframes bossShimmer {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(250%); }
  }
  @keyframes bossFlash {
    0% { opacity: 1; }
    30% { opacity: 0.15; }
    60% { opacity: 0.85; }
    100% { opacity: 0; }
  }
  @keyframes bossShake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }
  @keyframes bossPulseLow {
    0%,100% { box-shadow: 0 0 6px 1px rgba(224,90,90,0.5); }
    50% { box-shadow: 0 0 18px 4px rgba(224,90,90,0.9); }
  }
  .boss-bar-fill.low { animation: bossPulseLow 1.2s ease-in-out infinite; }
  .boss-bar-track.shaking { animation: bossShake 0.4s ease-out; }
  .boss-flash.active { animation: bossFlash 0.45s ease-out forwards; }
`;

function XPBar({ xpAtual, xpProximo, percentagem }) {

    const safeCurrent = Number(xpAtual ?? 0);

    const parsedTotal = Number(xpProximo);
    const safeTotal = Number.isFinite(parsedTotal) ? parsedTotal : null;

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

function BossBanner({ correct = 0, totalFases = 5, mapaId = 1 }) {
    const [shaking, setShaking] = useState(false);
    const [flashing, setFlashing] = useState(false);
    const prevCorrect = useRef(correct);

    const BOSS_BANNERS = {
        1: BossBannerImgMap1,
        2: BossBannerImgMap2,
        // 3: BossBannerImgMap3, // adicionar quando existir o asset do mapa 3
    };
    const bossImg = BOSS_BANNERS[mapaId] ?? BossBannerImgMap1;

    const maxHp = BOSS_HP_CONFIG.maxHp;
    const hpAtual = Math.max(0, Math.round(maxHp - (correct / totalFases) * maxHp));
    const pct = (hpAtual / maxHp) * 100;

    useEffect(() => {
        if (correct > prevCorrect.current) {
            setFlashing(false);
            setShaking(false);

            requestAnimationFrame(() => {
                setFlashing(true);
                setShaking(true);
                setTimeout(() => setShaking(false), 1000);
                setTimeout(() => setFlashing(false), 1100);
            });
        }
        prevCorrect.current = correct;
    }, [correct]);

    const barStyle = pct <= 0
        ? { bg: "linear-gradient(90deg,#1a1a1a,#444)", state: "Derrotado" }
        : pct <= 30
            ? { bg: "linear-gradient(90deg,#6b1212,#b03030)", state: "Crítico!" }
            : pct <= 60
                ? { bg: "linear-gradient(90deg,#7a3a0a,#e08a2a)", state: "Ferido" }
                : { bg: "linear-gradient(90deg,#6b1212,#e05a5a)", state: "Saudável" };

    return (
        <div
            className="rounded-4xl w-full overflow-hidden"
            style={{
                height: "420px",
                border: `2px solid ${Color.neutral.border}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
                position: "relative",
            }}
        >
            <style>{bossBarStyles}</style>

            <img
                src={bossImg}
                alt="Boss Banner"
                style={{
                    width: "100%",
                    height: "100%",
                    objectPosition: "center 30%",
                    display: "block",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: `${BOSS_HP_CONFIG.barBottom}px`,
                    left: `${BOSS_HP_CONFIG.barLeft}px`,
                    width: `${BOSS_HP_CONFIG.barWidth}px`,
                    zIndex: 10,
                }}
            >
                <div
                    className={`boss-bar-track ${BOSS_HP_CONFIG.barHeightClass} rounded-full overflow-hidden border relative ${shaking ? "shaking" : ""}`}
                    style={{
                        background: Color.neutral.card,
                        borderColor: "rgba(224, 90, 90, 0.3)",
                    }}
                >
                    <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                            width: `${pct}%`,
                            background: "rgba(180,40,40,0.35)",
                            transition: "width 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s",
                        }}
                    />

                    <div
                        className={`boss-bar-fill h-full rounded-full relative overflow-hidden flex items-center justify-center ${pct <= 30 && pct > 0 ? "low" : ""}`}
                        style={{
                            width: `${pct}%`,
                            background: barStyle.bg,
                            transition: "width 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                        }}
                    >
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3) 50%,transparent)",
                            animation: "bossShimmer 2s ease-in-out infinite",
                        }} />
                        {pct > 15 && (
                            <span className="text-[10px] font-bold text-white relative z-10"
                                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                                {hpAtual} / {maxHp}
                            </span>
                        )}
                    </div>

                    <div
                        className={`boss-flash absolute inset-0 rounded-full bg-white pointer-events-none opacity-0 ${flashing ? "active" : ""}`}
                    />
                </div>

                <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: pct <= 30 ? "#e05a5a" : "rgba(255,255,255,0.3)" }}>
                        {barStyle.state}
                    </span>
                    <span className="text-[9px] text-gray-600">{Math.round(pct)}%</span>
                </div>
            </div>
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

export default function RightSideBarBoss({ time, attempts, wrong = 0, correct = 0, totalFases = 8, mapaId = 1 }) {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [progressaoXp, setProgressaoXp] = useState(null);

    const objetivo = OBJETIVO;

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

                const xpResult = await obterXPAluno();

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
    }, [mapaId]);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none">
                <div className="flex flex-col items-center gap-6 z-10">

                    <div className="relative w-40 h-40 flex items-center justify-center p-2 bg-[#080808]/50 rounded-xl">
                        <video
                            src={loadingVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-3 mt-2">
                        <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse">
                            Carregando
                        </p>

                        <div className="flex gap-1.5 justify-center">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-amber-500/80"
                                    style={{
                                        animation: `dot-pulse 1.4s ease-in-out infinite`,
                                        animationDelay: `${delay}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <aside
                className="fixed flex items-center justify-center"
                style={{
                    top: "30%",
                    left: "90%",
                    transform: `translate(${GAP_FROM_CENTER_RIGHT}px, -50%)`,
                    width: 340,
                    zIndex: 60,
                }}
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

    const SIDEBAR_WIDTH = 380;

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <aside
                className="fixed flex flex-col gap-3 overflow-y-auto py-6 px-6"
                style={{
                    top: "50%",
                    left: "50%",
                    // Centra verticalmente e empurra para a direita do centro do ecrã,
                    // mantendo sempre a mesma distância ao centro, independente da largura do monitor.
                    transform: `translate(${GAP_FROM_CENTER_RIGHT}px, -50%)`,
                    width: `${SIDEBAR_WIDTH}px`,
                    maxHeight: "900px",
                    height: "min(900px, 90vh)",
                    zIndex: 80,
                    scrollbarWidth: "none",
                    background: "transparent",
                }}
            >
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
                <PedirDica onPedir={() => console.log("TODO: chamar API de dica")} />

                <BossBanner correct={correct} totalFases={totalFases} mapaId={mapaId} />

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