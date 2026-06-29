import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import { useNavigate } from "react-router-dom";
import { getProgresso, getProgressoDashboard } from "../../Services/users/userStatsService";
import { getTipoDeErrosUsers } from "../../Services/users/errorsUsers";
import { getDesempenhoCodigo } from "../../Services/users/performaceService";
import { getUserTempo } from "../../Services/users/jogTemService";
import { obterXPAluno } from "../../Services/Gameplay/xpProgressService";
import { getMapas } from "../../Services/maps/mapasService";
import map1 from "../../assets/Maps/FirstMap.png";
import map2 from "../../assets/Maps/SecondMap.png";
import map3 from "../../assets/Maps/ThirdMap.png";
import { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import mago from "../../assets/DashBoard/mago.png";
import loadingVideo from "../../assets/Loading/loading.webm";
import "../../css/DashBoard.css";
import {
    Target,
    Flame,
    Coins,
    Swords,
    BookOpen,
    ShieldCheck,
    ClipboardList,
    ChartNoAxesCombined,
    Map,
    Lock,
    Skull,
    CheckCircle2,
} from "lucide-react";

const PLAYER = {
    name: "CodeMaster",
    heroi: mago,
    rank: "Aprendiz",
    level: 12,
    memberSince: "Set 2024",
    accuracy: 78,
    errors: 22,
    totalXP: 2450,
    nextLevelXP: 3000,
    desafios: 23,
    dicasUsadas: 15,
    diasSeguidos: 7,
    hoursThisWeek: "16 H 32 M",
    maxPerDay: "5 H 21 M",
    weekActivity: [30, 55, 40, 70, 95, 50, 20],
};

const DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function getDayofWeek() {
    try {
        const today = new Date();
        const dayLisbon = new Intl.DateTimeFormat("pt-PT", {
            weekday: "long",
            timeZone: "Europe/Lisbon",
        }).format(today);

        const shortDay = dayLisbon.split("-")[0];
        const currentDayOfWeek = DAYS.indexOf(shortDay);

        console.log(`Dia: ${shortDay}, Índice: ${currentDayOfWeek}`);
        return currentDayOfWeek;
    } catch (erro) {
        console.error("Erro ao obter dia da semana:", erro);
        return -1;
    }
}

const ERROR_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#a855f7",
    "#3b82f6",
    "#22c55e",
];

function mapErrosToDB(quantidadeDeErros = [], tipoDeErros = []) {
    const total = quantidadeDeErros.reduce((sum, e) => sum + (e.quantidade ?? 0), 0);

    return tipoDeErros.map((tipo, i) => {
        const encontrado = quantidadeDeErros.find(e => e.tipo_erro_id === tipo.id);
        const count = encontrado?.quantidade ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return {
            name: tipo.nome,
            count,
            pct,
            color: ERROR_COLORS[i % ERROR_COLORS.length],
        };
    });
}

const DAILY_MISSION = {
    text: "Complete 3 desafios sem usar dicas",
    current: 1,
    total: 3,
    reward: "+100",
    streak: { active: true, daysLeft: 3, goal: "Streak 10 dias" },
};

// ============================================================
// 🔷 AccuracyChart
// ============================================================
function AccuracyChart({ accuracy, errors }) {
    const r = 50;
    const circ = 2 * Math.PI * r;
    const aDash = circ * (accuracy / 100);
    const eDash = circ * (errors / 100);

    return (
        <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                    <circle cx="65" cy="65" r={r} fill="none" stroke="#1a1a1a" strokeWidth="11" />
                    <circle
                        cx="65" cy="65" r={r}
                        fill="none" stroke="#2a2a2a" strokeWidth="11"
                        strokeDasharray={`${eDash} ${circ}`}
                    />
                    <circle
                        cx="65" cy="65" r={r}
                        fill="none" stroke="#c89a0e" strokeWidth="11"
                        strokeDasharray={`${aDash} ${circ}`}
                        strokeDashoffset={-eDash}
                        style={{ filter: "drop-shadow(0 0 5px #d4a01788)" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-bold text-base leading-none">{accuracy}%</span>
                    <span className="text-gray-500 text-[10px]">acerto</span>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-600 flex-shrink-0" />
                    <span className="text-gray-400 text-xs">Acertos:</span>
                    <span className="text-white font-bold text-xs ml-1">{accuracy}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-600 flex-shrink-0" />
                    <span className="text-gray-400 text-xs">Erros:</span>
                    <span className="text-white font-bold text-xs ml-1">{errors}%</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 🔷 WeeklyBars
// ============================================================
function WeeklyBars({ activity, currentDayOfWeek }) {
    const max = Math.max(...activity, 1);

    return (
        <div className="flex items-end gap-1.5 h-32">
            {activity.map((val, i) => {
                const h = (val / max) * 100;
                const active = i === currentDayOfWeek;
                const past = i < currentDayOfWeek;

                const barClass = active
                    ? "bg-gradient-to-t from-yellow-500 to-green-400 shadow-md shadow-green-500/40"
                    : past
                        ? "bg-gradient-to-t from-yellow-600/70 to-green-500/50"
                        : "bg-gray-700/40 hover:bg-gray-600/50";

                const labelClass = active
                    ? "text-green-400"
                    : past
                        ? "text-gray-600"
                        : "text-gray-600";

                return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                        <div
                            style={{ height: `${Math.max(h, 2)}%` }}
                            className={`w-full rounded-sm transition-all ${barClass}`}
                        />
                        <span className={`text-[9px] font-medium ${labelClass}`}>
                            {DAYS[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// 🔷 LoginRewardBanner
// ============================================================
function LoginRewardBanner() {
    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-700/80 via-yellow-600/70 to-orange-600/60 border border-yellow-600/40 rounded-4xl px-6 py-4 mb-5 animate-scaleUp animate-glow">
            <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce-custom">🎁</span>
                <div>
                    <p className="text-white font-bold text-sm">Recompensa de Login – Dia 71 ⚡</p>
                    <p className="text-yellow-200 text-xs mt-0.5">+150 moedas • Dobro de XP por 1 hora</p>
                </div>
            </div>
            <button className="bg-white text-yellow-800 font-bold text-xs rounded-lg px-5 py-2 hover:bg-yellow-100 transition-colors shadow-sm">
                Resgatar
            </button>
        </div>
    );
}

// ============================================================
// 🔷 XPBar
// ============================================================
function XPBar({ current = 0, total = 0 }) {
    const safeCurrent = current ?? 0;
    const safeTotal = total ?? 0;
    const pct = safeTotal > 0 ? Math.min((safeCurrent / safeTotal) * 100, 100) : 100;

    return (
        <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">Nível</span>
                <span className="text-yellow-400 font-bold">
                    {safeCurrent.toLocaleString()} / {safeTotal > 0 ? safeTotal.toLocaleString() : "MAX"} XP
                </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-2 rounded-full transition-all duration-1000 animate-shimmer"
                    style={{
                        width: `${pct}%`,
                        background: "linear-gradient(to right, #d4a017, #84cc16)",
                        boxShadow: "0 0 8px #d4a01755",
                    }}
                />
            </div>
            <span className="text-gray-600 text-[10px] text-right">
                {safeTotal > 0
                    ? `Faltam ${(safeTotal - safeCurrent).toLocaleString()} XP para o próximo nível`
                    : "👑 Nível Máximo Atingido!"}
            </span>
        </div>
    );
}

// ============================================================
// 🔷 MainCard
// ============================================================
function MainCard({ player, calculoXp, currentDayOfWeek, navigate }) {
    console.log("Desempenho recebido no MainCard:", calculoXp);

    const progressaoXp = calculoXp?.progressao || {};

    return (
        <div className="relative bg-[#151414] rounded-3xl border border-gray-800 overflow-hidden animate-slideInLeft">

            {/* Topo: título + badge */}
            <div className="flex justify-between items-center px-6 pt-5 pb-2">
                <h2 className="text-white font-bold text-2xl tracking-wide animate-pulse">
                    Bem-vindo, {player.name}!
                </h2>
                <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5 mr-52">
                    {progressaoXp.titulo}
                </span>
            </div>

            <div className="flex gap-0 px-6 pb-6" style={{ paddingRight: "290px" }}>

                <div className="flex flex-col gap-4 w-58 flex-shrink-0">
                    <AccuracyChart accuracy={player.accuracy} errors={player.errors} />
                    <div className="border-t border-gray-800" />

                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-[10px]">Semana reseta em</p>
                                <p className="text-white font-bold text-xl mt-0.5">
                                    {player.diasAteReset} {player.diasAteReset === 1 ? "dia" : "dias"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-600 text-[10px]">Semana Iniciada    </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    {player.ultimaAtualizado
                                        ? new Date(player.ultimaAtualizado).toLocaleDateString("pt-PT")
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${((7 - player.diasAteReset) / 7) * 100}%` }}
                                className="h-1.5 bg-gradient-to-r from-yellow-500 to-green-400 transition-all duration-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-xs mt-4">
                        <span className="text-gray-500 mr-6">Seu Nível:</span>
                        <span className="text-white font-bold text-right">{progressaoXp.nivel} 🎖️</span>
                        <span className="text-gray-500">Dias Seguidos:</span>
                        <span className="text-white font-bold text-right">{player.diasSeguidos} 🔥</span>
                    </div>
                    <div className="flex items-center justify-between ml-4 px-6 pb-3">
                        <button
                            onClick={() => navigate("/HistoricoSemanal")}
                            className="flex items-center gap-1.5 text-[11px] text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5 hover:border-yellow-600 hover:text-yellow-500 transition-colors"
                        >
                            Ver histórico semanal
                        </button>
                    </div>
                </div>

                <div className="w-px bg-gray-800 mx-6 self-stretch" />

                <div className="flex flex-col gap-4 mt-10 flex-1">
                    <WeeklyBars activity={player.weekActivity} currentDayOfWeek={currentDayOfWeek} />
                    <div className="border-t border-gray-800" />
                    <XPBar current={progressaoXp.xpTotal} total={progressaoXp.xpProximoNivel} />
                    <div className="grid grid-cols-3 gap-2 text-xs mt-1">
                        <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/30">
                            <p className="text-white font-bold text-base">{player.desafios}</p>
                            <p className="text-gray-500 text-[10px]">Desafios</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/30">
                            <p className="text-white font-bold text-base">{player.accuracy}%</p>
                            <p className="text-gray-500 text-[10px]">Acerto</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/30">
                            <p className="text-white font-bold text-base">{player.dicasUsadas}</p>
                            <p className="text-gray-500 text-[10px]">Dicas Usadas</p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="absolute top-0 right-0 bottom-0 w-70 ml-4"
                style={{
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 28%)",
                    maskImage: "linear-gradient(to right, transparent 0%, black 28%)",
                }}
            >
                <img src={mago} alt="heroi" className="h-full w-full mb-4" />
            </div>
        </div>
    );
}

// ============================================================
// 🔷 MapsPanel
// ============================================================

function MapsPanel({ maps }) {
    return (
        <div className="bg-[#151414] rounded-4xl border border-gray-800 p-4 flex flex-col gap-3 flex-1 animate-slideInDown">
            <div className="flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold flex items-center gap-1">
                    <Map size={18} />
                    Mapas de Aprendizado
                </h3>
                <button className="w-5 h-5 rounded border border-gray-700 flex items-center justify-center text-gray-500 text-xs hover:text-white">
                    +
                </button>
            </div>

            {maps.map((m, i) => {
                const pct = m.total > 0 ? Math.min((m.desafios / m.total) * 100, 100) : 0;

                return (
                    <div key={i} className="flex flex-col gap-2 hover:scale-105 transition-transform duration-300 mt-3">
                        <div
                            className="rounded-lg h-14 flex items-center justify-between px-3 mt-3"
                        >
                            <div className="flex items-center gap-2">
                                <div className="relative w-18 h-22 mb-4 flex-shrink-0">
                                    <img
                                        src={m.mapImg}
                                        alt={m.nome}
                                        className={`w-full h-full rounded-2xl mb-2 transition-all duration-300 ${m.locked ? "grayscale opacity-40" : ""
                                            }`}
                                    />
                                    {m.locked && (
                                        <div className="absolute inset-0 flex items-center justify-center mb-2">
                                            <Lock size={14} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className={`text-xs font-semibold leading-none ${m.locked ? "text-gray-600" : "text-white"}`}>
                                        {m.nome}
                                    </p>
                                    <p className="text-gray-500 text-[10px] mt-0.5 flex items-center gap-1">
                                        <Skull size={10} />
                                        Boss: {m.boss}
                                    </p>
                                </div>
                            </div>

                            {m.locked ? (
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Lock size={13} />
                                    <span className="text-[10px] font-semibold">Bloqueado</span>
                                </div>
                            ) : m.done ? (
                                <div className="flex items-center gap-1 text-green-400">
                                    <CheckCircle2 size={13} />
                                    <span className="text-[10px] font-bold">Completo</span>
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold" style={{ color: m.color }}>
                                    {pct.toFixed(0)}%
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Progresso</span>
                            <span className={m.locked ? "text-gray-700" : "text-gray-400"}>
                                {m.locked ? "— / —" : `${m.desafios}/${m.total} Desafios`}
                            </span>
                        </div>

                        <div className="h-1 bg-gray-800 rounded-full">
                            <div
                                className="h-1 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${m.locked ? 0 : pct}%`,
                                    backgroundColor: m.locked ? "#374151" : m.color,
                                    boxShadow: (!m.locked && pct > 0) ? `0 0 6px ${m.color}66` : "none",
                                    animation: m.done ? "glow 2s ease-in-out infinite" : "none",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// 🔷 AnimatedBar — barra com entrada progressiva
// ============================================================
function AnimatedBar({ pct, color, delay = 0 }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(pct), 120 + delay);
        return () => clearTimeout(timer);
    }, [pct, delay]);

    return (
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
                className="h-1.5 rounded-full"
                style={{
                    width: `${width}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}88`,
                    transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            />
        </div>
    );
}

// ============================================================
// 🔷 ErrorTypesPanel — dados reais da BD
// ============================================================
function ErrorTypesPanel({ errors }) {
    const navigate = useNavigate();

    const safeErrors = Array.isArray(errors) ? errors : [];

    return (
        <div className="bg-[#151414] rounded-4xl border border-gray-800 p-4 flex flex-col gap-3 flex-1 animate-slideInDown delay-200">
            <div className="flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold flex items-center gap-1">
                    <ChartNoAxesCombined size={18} />
                    Tipos de Erros
                </h3>
                <button
                    onClick={() => navigate("/Erros")}
                    className="w-20 h-5 p-3 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500 text-xs hover:text-white"
                >
                    Ver mais
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {safeErrors.map((e, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-1.5 hover:bg-gray-800/30 p-2 rounded transition-colors"
                    >
                        <div className="flex justify-between items-center text-xs">
                            <span className={e.count > 0 ? "text-gray-300 font-medium" : "text-gray-600 font-medium"}>
                                {e.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-[10px]">{e.pct}% dos erros</span>
                                <span className="font-bold text-xs" style={{ color: e.count > 0 ? e.color : "#444" }}>
                                    {e.count}×
                                </span>
                            </div>
                        </div>
                        <AnimatedBar pct={e.pct} color={e.color} delay={i * 120} />
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-800 pt-3 mt-1">
                <div className="flex gap-1 flex-wrap">
                    {safeErrors.map((e, i) => (
                        <span
                            key={i}
                            className="text-[10px] rounded px-2 py-0.5 font-medium"
                            style={{
                                backgroundColor: e.color + (e.count > 0 ? "22" : "0a"),
                                color: e.count > 0 ? e.color : e.color + "55",
                            }}
                        >
                            {e.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 🔷 TrophiesAndMissionPanel
// ============================================================
function TrophiesAndMissionPanel({ mission }) {
    const pct = Math.min((mission.current / mission.total) * 100, 100);
    const done = mission.current >= mission.total;

    return (
        <div className="bg-[#151414] rounded-4xl border border-gray-800 p-5 flex flex-col gap-4 flex-1 animate-slideInRight">

            <div className="flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                    <Target size={15} className="text-yellow-500" />
                    Missão Diária
                </h3>
                <span className="text-gray-600 text-[11px] border border-gray-800 rounded-lg px-2 py-0.5">
                    {mission.current}/{mission.total}
                </span>
            </div>

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        1
                    </span>
                    <span className="text-gray-400 text-xs leading-relaxed">{mission.text}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-semibold" style={{ color: done ? "#d4a017" : "#555" }}>
                            {mission.current} / {mission.total}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                        <div
                            className="h-1.5 rounded-full transition-all duration-700"
                            style={{
                                width: `${pct}%`,
                                background: done ? "#d4a017" : "#3b82f6",
                            }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-gray-800">
                    <span className="text-gray-600 text-[10px]">Recompensa</span>
                    <span className="text-yellow-400 font-bold text-xs flex items-center gap-1">
                        <Coins size={13} />
                        {mission.reward}
                    </span>
                </div>
            </div>

            {mission.streak.active && (
                <div className="bg-yellow-500/[0.06] border border-yellow-500/20 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <Flame size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <p className="text-yellow-400 text-xs font-semibold">Streak Ativo!</p>
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                            Continue jogando por mais{" "}
                            <span className="text-gray-200 font-bold">{mission.streak.daysLeft} dias</span>{" "}
                            para desbloquear o troféu{" "}
                            <em className="text-gray-400 not-italic">"{mission.streak.goal}"</em>
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 flex-1">
                <p className="text-gray-600 text-[11px] flex items-center gap-1.5">
                    <ClipboardList size={13} />
                    Próximas missões
                </p>
                {[
                    { icon: <Swords size={14} />, text: "Vence 2 batalhas seguidas", xp: "+80" },
                    { icon: <BookOpen size={14} />, text: "Estuda 30 min sem pausa", xp: "+60" },
                    { icon: <ShieldCheck size={14} />, text: "Completa um mapa sem erros", xp: "+120" },
                ].map((m, i) => (
                    <div key={i} className="flex items-center gap-2.5 opacity-50">
                        <span className="text-gray-500">{m.icon}</span>
                        <span className="text-gray-500 text-[11px] flex-1">{m.text}</span>
                        <span className="text-gray-600 text-[10px] font-bold">{m.xp}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}

// ============================================================
// 🔷 Helpers
// ============================================================
function formatTempo(minutos = 0) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h} H ${m} M`;
}

function mapProgressToPlayer(userData, data, tempo) {
    const progressao = data.progressao || {};

    return {
        name: userData.nome,
        heroi: mago,
        memberSince: userData.data_registo,

        weekActivity: tempo?.weekActivity || [0, 0, 0, 0, 0, 0, 0],
        hoursThisWeek: tempo?.hoursThisWeek || "0 H 0 M",
        maxPerDay: tempo?.maxPerDay || "0 H 0 M",
        diasAteReset: tempo?.diasAteReset || 7,
        ultimaAtualizado: tempo?.ultimaAtualizado || null,

        currentDay: 5,
        diasSeguidos: data.streak_dias ?? 0,
        dicasUsadas: data.dicas_usadas ?? 0,
        desafios: data.desafios_completos ?? 0,
        accuracy: data.acertos ?? 80,
        errors: data.errors ?? 20,

        totalXP: progressao.xpAtual ?? 0,
        nextLevelXP: progressao.xpProximoNivel ?? 500,
        level: progressao.nivel ?? 1,
        rank: progressao.titulo ?? "Aprendiz",
    };
}

function mapTempoToUI(apiTempo) {
    const tempo = apiTempo?.getTempo;

    if (!tempo) {
        return {
            hoursThisWeek: "0 H 0 M",
            maxPerDay: "0 H 0 M",
            tempoTotal: "0 H 0 M",
            weekActivity: [0, 0, 0, 0, 0, 0, 0],
            ultimaAtualizado: null,
            diasAteReset: 7,
        };
    }

    return {
        hoursThisWeek: formatTempo(tempo.horas_semana || 0),
        maxPerDay: formatTempo(tempo.max_tempo_dia || 0),
        tempoTotal: formatTempo(tempo.tempo_total || 0),
        weekActivity: tempo.atividade_semana || [0, 0, 0, 0, 0, 0, 0],
        ultimaAtualizado: tempo.ultimoAtualizado || null,
        diasAteReset: tempo.diasAteReset || 7,
    };
}

// ============================================================
// 🔷 DashBoard (componente principal)
// ============================================================
export function DashBoard() {
    const [user, setUser] = useState(null);
    const [progresso, setProgresso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mapasProgresso, setMapasProgresso] = useState([]);
    const [progressaoXp, setProgressaoXp] = useState(null);
    const [errors, setErrors] = useState(/** @type {Array} */([]));
    const [desempenho, setDesempenho] = useState(null);
    // Helper para garantir que errors é sempre array antes de fazer set
    const safeSetErrors = (val) => setErrors(Array.isArray(val) ? val : []);

    const navigate = useNavigate();
    const token = localStorage.getItem("cq_token");

    useEffect(() => {
        try {
            if (!token) {
                navigate("/login");
            }
        } catch (err) {
            console.error("Erro ao verificar autenticação", err.response || err);
        }
    }, [token]);

    useEffect(() => {
        async function fetchProgressao() {
            try {
                const resultado = await obterXPAluno();
                if (resultado) {
                    console.log("[Dashboard] Progressão carregada:", resultado);
                    setProgressaoXp(resultado);
                }
            } catch (err) {
                console.error("Erro ao carregar progressão", err);
            }
        }
        fetchProgressao();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("cq_user");

        if (!storedUser) {
            queueMicrotask(() => setLoading(false));
            queueMicrotask(() => {
                setLoading(false);
                console.error("[Dashboard] Sem utilizador no localStorage");
            });
            return;
        }

        const userData = JSON.parse(storedUser);
        console.log("[Dashboard] User data:", userData);
        queueMicrotask(() => setUser(userData));

        const token = localStorage.getItem("cq_token");

        Promise.all([
            getProgressoDashboard(token),
            getUserTempo(),
        ])
            .then(([dashboardData, tempoData]) => {
                const tempoUI = mapTempoToUI(tempoData);
                console.log("Tempo vindo da Api", tempoUI);
                const player = mapProgressToPlayer(userData, dashboardData, tempoUI);
                setProgresso(player);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.error || err.message || "Erro desconhecido";
                console.error("[Dashboard] Erro ao carregar progresso:", errorMsg);
                setProgresso({ ...PLAYER, name: userData.nome });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("cq_token");
        const MAP_IMAGES = [map1, map2, map3];
        try {
            getMapas()
                .then(mapas => getProgresso(token).then(progresso => ({ mapas, progresso })))
                .then(({ mapas, progresso }) => {

                    const combinados = mapas.map((m, index) => {
                        const prog = progresso.find(p => p.mapa === m.id) || {};
                        return {
                            ...m,
                            mapImg: MAP_IMAGES[index] || map1,   
                            desafios: prog.desafios_completos || 0,
                            total: prog.total_desafios || 0,
                            locked: !prog.desbloqueado,
                            done: prog.porcentagem === 100,
                            color: "#22c55e",
                            bgColor: "#333",
                            boss: "Boss",
                        };
                    });
                    console.log("Mapas e progresso:", combinados);
                    setMapasProgresso(combinados);
                });
        } catch (err) {
            console.error("Erro ao carregar mapas e progresso", err.response || err);
        }
    }, []);

    useEffect(() => {
        const fetchErros = async () => {
            try {
                const data = await getTipoDeErrosUsers();
                console.log("Erros da BD:", data);
                // Usa apenas quantidadeDeErros — é o que importa para o painel
                safeSetErrors(mapErrosToDB(data?.quantidadeDeErros, data?.TipoDeErros));
            } catch (err) {
                console.error("Erro ao carregar erros", err.response || err);
                safeSetErrors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchErros();
    }, []);

    useEffect(() => {
        async function fetchDesempenho() {
            try {
                const data = await getDesempenhoCodigo();
                setDesempenho(data?.resumo ?? null);
            } catch (err) {
                console.error("Erro ao carregar desempenho:", err);
            }
        }
        fetchDesempenho();
    }, []);

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
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentDayOfWeek = getDayofWeek();

    const totalRespostas = (desempenho?.total_certas ?? 0) + (desempenho?.total_erradas ?? 0);
    const accuracyPct = totalRespostas > 0
        ? Math.round((desempenho.total_certas / totalRespostas) * 100)
        : (progresso?.accuracy ?? 0);
    const errorsPct = 100 - accuracyPct;

    return (
        <div className="relative min-h-screen bg-black animate-fadeIn">
            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <main className="ml-20 mt-4 p-6 pt-24">
                <LoginRewardBanner />

                {progresso && progressaoXp && (
                    <MainCard
                        player={{
                            ...progresso,
                            accuracy: accuracyPct,
                            errors: errorsPct,
                        }}
                        calculoXp={progressaoXp}
                        currentDayOfWeek={currentDayOfWeek}
                        navigate={navigate}
                    />
                )}

                <div className="flex gap-4 mt-6">
                    <MapsPanel maps={mapasProgresso} />
                    <ErrorTypesPanel errors={errors} />
                    <TrophiesAndMissionPanel mission={DAILY_MISSION} />
                </div>
            </main>
        </div>
    );
}