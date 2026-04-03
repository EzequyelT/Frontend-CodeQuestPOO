// RightSideBar.jsx
// 🔧 VARIÁVEIS LOCAIS — substituir por chamadas à BD depois
// Cada secção tem um comentário a indicar de onde virá o dado real

import { useState } from "react";
import mapImg from "../../assets/Maps/Map1.png"; // ajusta o caminho

// ─── DADOS LOCAIS (substituir por props/API) ────────────────────────────────

const JOGADOR = {
    nivel: 3,                       // TODO: progressao.nivel
    titulo: "Programador",          // TODO: progressao.titulo
    xpAtual: 210,                   // TODO: progressao.xpAtual
    xpProximo: 320,                 // TODO: progressao.xpProximoNivel
    percentagem: 21,                // TODO: progressao.percentagem
    streak: 5,                      // TODO: data.streak
    coins: 340,                     // TODO: data.coins
};

const OBJETIVO = {
    texto: "Complete 3 desafios sem usar dicas",
    atual: 1,                       // TODO: missao.atual
    total: 3,                       // TODO: missao.total
    recompensa: "+100 XP",
};

const FEEDBACK_IA = {
    dica: "Lembra-te de usar self como primeiro parâmetro em métodos de instância.",
    tipo: "💡 Feedback Inteligente",
};

const MINI_MAPA = {
    nome: "Floresta dos Algoritmos",
    proximoNome: "Trilha da Lógica",
    desafiosCompletos: 3,
    totalDesafios: 8,
};

// ────────────────────────────────────────────────────────────────────────────

function XPBar({ xpAtual, xpProximo, percentagem }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
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
                    {/* shimmer */}
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
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 flex flex-col gap-2">
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
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3 flex flex-col gap-2">
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
        if (onPedir) onPedir();     // TODO: chamar API de dica
    }

    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-3 flex items-center justify-between gap-2">
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

function MiniMapa({ mapa }) {
    const pct = Math.round((mapa.desafiosCompletos / mapa.totalDesafios) * 100);

    return (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-3 pt-3 pb-2">
                <span className="text-white text-[11px] font-semibold">🗺️ Mini Mapa</span>
                <span className="text-gray-500 text-[9px]">{pct}% completo</span>
            </div>

            {/* Imagem do mapa */}
            <div className="relative mx-3 mb-2 rounded-lg overflow-hidden" style={{ height: 100 }}>
                <img
                    src={mapImg}
                    alt="mini mapa"
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.75) saturate(0.9)" }}
                />
                {/* overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.6) 100%)" }}
                />
                {/* nome mapa */}
                <div className="absolute top-1.5 left-2">
                    <span className="text-yellow-300 text-[9px] font-bold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                        {mapa.nome}
                    </span>
                </div>
                {/* próximo */}
                <div className="absolute bottom-1.5 right-2">
                    <span className="text-gray-300 text-[9px]" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                        {mapa.proximoNome} →
                    </span>
                </div>
                {/* desafios */}
                <div className="absolute bottom-1.5 left-2">
                    <span className="text-gray-400 text-[9px]">
                        {mapa.desafiosCompletos}/{mapa.totalDesafios} desafios
                    </span>
                </div>
            </div>

            {/* barra de progresso */}
            <div className="px-3 pb-3">
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${pct}%`,
                            background: "linear-gradient(90deg,#22c55e,#84cc16)",
                            boxShadow: "0 0 6px #22c55e66",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function RightSideBar() {

    // 🔧 TODO: substituir por useProgressao() ou props vindas do Dashboard
    const jogador = JOGADOR;
    const objetivo = OBJETIVO;
    const feedbackIA = FEEDBACK_IA;
    const miniMapa = MINI_MAPA;

    // 🔧 TODO: tempo virá de iniciarTempo / pararTempo do UserService
    const tempoJogo = "02h 14m";

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>

            <aside
                className="fixed right-0 top-0 h-screen flex flex-col gap-3 overflow-y-auto py-4 px-3"
                style={{
                    width: 220,
                    background: "linear-gradient(180deg,#0d0d14,#0a0a10)",
                    borderLeft: "1px solid rgba(255,255,255,0.06)",
                    zIndex: 40,
                    scrollbarWidth: "none",
                }}
            >

                {/* ── HEADER: Nível + XP ── */}
                <div
                    className="rounded-2xl p-3 flex flex-col gap-2"
                    style={{
                        background: "linear-gradient(135deg,#1a1025,#0f0a1a)",
                        border: "1px solid rgba(212,160,23,0.25)",
                        boxShadow: "0 0 20px rgba(212,160,23,0.08)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        {/* troféu */}
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
                                {/* TODO: progressao.nivel + progressao.titulo */}
                                <p className="text-yellow-400 text-[11px] font-bold leading-none">
                                    Nível {jogador.nivel}
                                </p>
                                <p className="text-gray-500 text-[9px] mt-0.5">{jogador.titulo}</p>
                            </div>
                        </div>
                        {/* XP badge */}
                        <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                                background: "rgba(132,204,22,0.15)",
                                color: "#84cc16",
                                border: "1px solid rgba(132,204,22,0.3)",
                            }}
                        >
                            +{jogador.xpProximo - jogador.xpAtual} XP
                        </span>
                    </div>

                    {/* XP Bar */}
                    {/* TODO: passar progressao.xpAtual, xpProximoNivel, percentagem */}
                    <XPBar
                        xpAtual={jogador.xpAtual}
                        xpProximo={jogador.xpProximo}
                        percentagem={jogador.percentagem}
                    />
                </div>

                {/* ── STREAK + COINS ── */}
                <div className="grid grid-cols-2 gap-2">
                    {/* TODO: data.streak */}
                    <div
                        className="rounded-xl p-2.5 flex flex-col items-center gap-1"
                        style={{
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.2)",
                        }}
                    >
                        <span className="text-xl">🔥</span>
                        <span className="text-white text-sm font-bold leading-none">{jogador.streak}</span>
                        <span className="text-gray-500 text-[9px]">dias seguidos</span>
                    </div>

                    {/* TODO: data.coins */}
                    <div
                        className="rounded-xl p-2.5 flex flex-col items-center gap-1"
                        style={{
                            background: "rgba(212,160,23,0.08)",
                            border: "1px solid rgba(212,160,23,0.2)",
                        }}
                    >
                        <span className="text-xl">🪙</span>
                        <span className="text-white text-sm font-bold leading-none">{jogador.coins}</span>
                        <span className="text-gray-500 text-[9px]">coins</span>
                    </div>
                </div>

                {/* ── OBJETIVO ── */}
                {/* TODO: missao diária da BD */}
                <ObjetivoBox objetivo={objetivo} />

                {/* ── FEEDBACK IA ── */}
                {/* TODO: ultimo feedback_ia da tabela desempenho_desafio */}
                <FeedbackIA feedback={feedbackIA} />

                {/* ── PEDIR DICA ── */}
                {/* TODO: chamar POST /desafios/dica/:id */}
                <PedirDica onPedir={() => console.log("TODO: chamar API de dica")} />

                {/* ── MINI MAPA ── */}
                {/* TODO: getProgresso() + getMapas() */}
                <MiniMapa mapa={miniMapa} />

                {/* ── FOOTER ── */}
                <div className="flex flex-col gap-2 mt-auto pt-2">
                    {/* Tempo total */}
                    {/* TODO: data.tempo_total_jogo do dashboard */}
                    <div
                        className="rounded-xl px-3 py-2 flex items-center justify-between"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="text-gray-500 text-[10px]">⏱ Tempo de jogo</span>
                        <span className="text-white text-[10px] font-bold">{tempoJogo}</span>
                    </div>

                    {/* Próxima Aventura */}
                    {/* TODO: navegar para o próximo desafio disponível */}
                    <button
                        className="w-full py-2.5 rounded-xl text-[11px] font-bold transition-all hover:brightness-110 active:scale-95"
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