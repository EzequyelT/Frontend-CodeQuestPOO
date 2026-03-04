import DashBoardHeader from "../Components/Header/HeaderDashBoard";
import SideBar from "../Components/SideBar/SideBar";
import mago from "../assets/DashBoard/mago.png"
import "../css/DashBoard.css";

// ============================================================
// 🔷 DATA
// ============================================================
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
    currentDay: 4,
};

const MAPS = [
    { name: "Floresta Encantada", emoji: "🌲", desafios: 8, total: 8, boss: "Guardião da Floresta", bossEmoji: "🐉", color: "#16a34a", bgColor: "#14532d", done: true },
    { name: "Vila Misteriosa",    emoji: "🏡", desafios: 6, total: 8, boss: "Cavaleiro Sombrio",   bossEmoji: "⚔️", color: "#ea580c", bgColor: "#431407", done: false },
    { name: "Castelo do Dragão",  emoji: "🏰", desafios: 0, total: 10, boss: "Dragão Ancestral",  bossEmoji: "🐲", color: "#6b7280", bgColor: "#111827", locked: true },
];

const ERROR_TYPES = [
    { name: "Sintaxe",         count: 12, pct: 35, color: "#ef4444" },
    { name: "Lógica",          count: 8,  pct: 24, color: "#f97316" },
    { name: "Encapsulamento",  count: 7,  pct: 21, color: "#eab308" },
    { name: "Herança",         count: 7,  pct: 20, color: "#a855f7" },
];

const TROPHIES = [
    { icon: "🏆", name: "Primeira Vitória", unlocked: true },
    { icon: "🌿", name: "Mestre de Floresta", unlocked: true },
    { icon: "🎯", name: "Sem Erros", unlocked: true },
    { icon: "🔥", name: "Streak 7 dias", unlocked: true },
    { icon: "🧭", name: "Explorador", unlocked: false },
    { icon: "🧙", name: "Mestre POO", unlocked: false },
];

const DAILY_MISSION = {
    text: "Complete 3 desafios sem usar dicas",
    current: 1,
    total: 3,
    reward: "+100",
    streak: { active: true, daysLeft: 3, goal: "Streak 10 dias" },
};

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

// ============================================================
// 🔷 AccuracyChart (DonutChart adaptado)
// ============================================================
function AccuracyChart({ accuracy, errors }) {
    const r = 50, circ = 2 * Math.PI * r;
    const aDash = circ * (accuracy / 100);
    const eDash = circ * (errors / 100);
    return (
        <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                    <circle cx="65" cy="65" r={r} fill="none" stroke="#1a1a1a" strokeWidth="11" />
                    <circle cx="65" cy="65" r={r} fill="none" stroke="#2a2a2a" strokeWidth="11"
                        strokeDasharray={`${eDash} ${circ}`} />
                    <circle cx="65" cy="65" r={r} fill="none" stroke="#c89a0e" strokeWidth="11"
                        strokeDasharray={`${aDash} ${circ}`} strokeDashoffset={-eDash}
                        style={{ filter: "drop-shadow(0 0 5px #d4a01788)" }} />
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
// 🔷 WeeklyBars (igual ao original)
// ============================================================
function WeeklyBars({ activity, currentDay }) {
    const max = Math.max(...activity);
    return (
        <div className="flex items-end gap-1.5 h-20">
            {activity.map((val, i) => {
                const h = (val / max) * 100;
                const active = i === currentDay;
                return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                        <div style={{ height: `${h}%` }}
                            className={`w-full rounded-sm transition-all ${active
                                ? "bg-gradient-to-t from-yellow-500 to-green-400 shadow-md shadow-green-500/40"
                                : "bg-gray-700 hover:bg-gray-600"}`} />
                        <span className={`text-[9px] font-medium ${active ? "text-green-400" : "text-gray-600"}`}>
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
        <div className="flex items-center justify-between bg-gradient-to-r from-yellow-700/80 via-yellow-600/70 to-orange-600/60 border border-yellow-600/40 rounded-2xl px-6 py-4 mb-5 animate-scaleUp animate-glow">
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
// 🔷 XP Bar
// ============================================================
function XPBar({ current, total }) {
    const pct = Math.min((current / total) * 100, 100);
    return (
        <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">Nível</span>
                <span className="text-yellow-400 font-bold">{current.toLocaleString()} / {total.toLocaleString()} XP</span>
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
            <span className="text-gray-600 text-[10px] text-right">Faltam {(total - current).toLocaleString()} XP para o próximo nível</span>
        </div>
    );
}

// ============================================================
// 🔷 MainCard
// ============================================================
function MainCard({ player }) {
    return (
        <div className="relative bg-[#161b16] rounded-2xl border border-gray-800 overflow-hidden animate-slideInLeft">

            {/* Topo: título + badge */}
            <div className="flex justify-between items-center px-6 pt-5 pb-4">
                <h2 className="text-white font-bold text-base tracking-wide">CodeQuestPOO</h2>
                <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5 mr-52">
                    Aprendizado
                </span>
            </div>

            {/* Corpo */}
            <div className="flex gap-0 px-6 pb-6" style={{ paddingRight: "240px" }}>

                {/* Coluna 1 — Stats */}
                <div className="flex flex-col gap-4 w-52 flex-shrink-0">
                    <AccuracyChart accuracy={player.accuracy} errors={player.errors} />
                    <div className="border-t border-gray-800" />
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-gray-500">Seu Nível:</span>
                        <span className="text-white font-bold text-right">{player.level}</span>
                        <span className="text-gray-500">Dias Seguidos:</span>
                        <span className="text-white font-bold text-right">{player.diasSeguidos} 🔥</span>
                    </div>
                </div>

                {/* Divisor */}
                <div className="w-px bg-gray-800 mx-6 self-stretch" />

                {/* Coluna 2 — Gráfico + XP */}
                <div className="flex flex-col gap-4 flex-1">
                    <WeeklyBars activity={player.weekActivity} currentDay={player.currentDay} />
                    <div className="border-t border-gray-800" />
                    <XPBar current={player.totalXP} total={player.nextLevelXP} />
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

            {/* Hero / Avatar */}
            <div
                className="absolute top-0 right-0 bottom-0 w-60 ml-4"
                style={{
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 28%)",
                    maskImage: "linear-gradient(to right, transparent 0%, black 28%)",
                }}
            >
               <img src={mago} alt="heroi" className="h-full w-full mb-4" />

                {/* Botões sobrepostos */}
               
            </div>

        </div>
    );
}

// ============================================================
// 🔷 MapsPanel (substitui WeaponsPanel)
// ============================================================
function MapsPanel({ maps }) {
    return (
        <div className="bg-[#161b16] rounded-2xl border border-gray-800 p-4 flex flex-col gap-3 flex-1 animate-slideInDown">
            <div className="flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold">🗺️ Mapas de Aprendizado</h3>
                <button className="w-5 h-5 rounded border border-gray-700 flex items-center justify-center text-gray-500 text-xs hover:text-white">+</button>
            </div>
            {maps.map((m, i) => {
                const pct = Math.min((m.desafios / m.total) * 100, 100);
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
                                    <p className="text-white text-xs font-semibold leading-none">{m.name}</p>
                                    <p className="text-gray-400 text-[10px] mt-0.5">
                                        Boss: {m.bossEmoji} {m.boss}
                                    </p>
                                </div>
                            </div>
                            {m.locked
                                ? <span className="text-gray-600 text-base">🔒</span>
                                : m.done
                                    ? <span className="text-[10px] font-bold text-white bg-green-600 rounded px-1.5 py-0.5">Completo</span>
                                    : <span className="text-[10px] font-bold" style={{ color: m.color }}>{pct.toFixed(0)}%</span>
                            }
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Progresso</span>
                            <span className="text-gray-400">{m.desafios}/{m.total} Desafios</span>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full">
                            <div
                                className="h-1 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: m.color,
                                    boxShadow: `0 0 6px ${m.color}66`,
                                    animation: m.done ? 'glow 2s ease-in-out infinite' : 'none'
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
// 🔷 ErrorTypesPanel (substitui FriendsPanel)
// ============================================================
function ErrorTypesPanel({ errors }) {
    const total = errors.reduce((s, e) => s + e.count, 0);
    return (
        <div className="bg-[#161b16] rounded-2xl border border-gray-800 p-4 flex flex-col gap-3 flex-1 animate-slideInDown delay-200">
            <div className="flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold">📈 Tipos de Erros</h3>
                <span className="text-gray-500 text-xs border border-gray-700 rounded px-2 py-0.5">{total} total</span>
            </div>
            <div className="flex flex-col gap-3">
                {errors.map((e, i) => (
                    <div key={i} className="flex flex-col gap-1.5 hover:bg-gray-800/30 p-2 rounded transition-colors">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-300 font-medium">{e.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-[10px]">{e.pct}% dos erros</span>
                                <span className="font-bold" style={{ color: e.color }}>{e.count}</span>
                            </div>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-1.5 rounded-full transition-all duration-700"
                                style={{
                                    width: `${e.pct}%`,
                                    backgroundColor: e.color,
                                    boxShadow: `0 0 6px ${e.color}66`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Mini resumo */}
            <div className="border-t border-gray-800 pt-3 mt-1">
                <div className="flex gap-1 flex-wrap">
                    {errors.map((e, i) => (
                        <span key={i} className="text-[10px] rounded px-2 py-0.5 font-medium"
                            style={{ backgroundColor: e.color + "22", color: e.color }}>
                            {e.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// 🔷 TrophiesAndMissionPanel (substitui GoalsPanel)
// ============================================================
function TrophiesAndMissionPanel({ trophies, mission }) {
    const pct = Math.min((mission.current / mission.total) * 100, 100);
    const done = mission.current >= mission.total;

    return (
        <div className="bg-[#161b16] rounded-2xl border border-gray-800 p-4 flex flex-col gap-4 flex-1 animate-slideInRight">

            {/* Troféus */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white text-sm font-semibold">🏆 Troféus</h3>
                    <span className="text-gray-500 text-xs border border-gray-700 rounded px-2 py-0.5">
                        {trophies.filter(t => t.unlocked).length}/{trophies.length}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {trophies.map((t, i) => (
                        <div key={i}
                            className="flex flex-col items-center gap-1 bg-gray-800/40 rounded-lg py-2.5 border border-gray-700/30 hover:border-gray-600/50 transition-all hover:scale-110 cursor-pointer"
                            style={{ opacity: t.unlocked ? 1 : 0.35 }}
                        >
                            <span className="text-xl" style={{ filter: t.unlocked ? "none" : "grayscale(1)", animation: t.unlocked ? 'bounce 2s ease-in-out infinite' : 'none' }}>{t.icon}</span>
                            <span className="text-[9px] text-gray-400 text-center leading-tight px-1">{t.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-800" />

            {/* Missão Diária */}
            <div>
                <h3 className="text-white text-sm font-semibold mb-2">🎯 Missão Diária</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                        <span className="text-gray-400 text-xs">{mission.text}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Progresso</span>
                        <span className="font-bold" style={{ color: done ? "#d4a017" : "#555" }}>{mission.current}/{mission.total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full">
                        <div className="h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: done ? "#d4a017" : "#3b82f6", boxShadow: done ? "0 0 6px #d4a01766" : "none" }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-500 text-[10px]">Recompensa:</span>
                        <span className="text-yellow-400 font-bold text-xs">🪙 {mission.reward}</span>
                    </div>
                </div>
            </div>

            {/* Streak ativo */}
            {mission.streak.active && (
                <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-lg p-2.5 flex items-start gap-2 animate-glow">
                    <span className="text-base flex-shrink-0 animate-bounce-custom">🔥</span>
                    <div>
                        <p className="text-yellow-400 text-xs font-semibold">Streak Ativo!</p>
                        <p className="text-gray-400 text-[10px] mt-0.5 leading-relaxed">
                            Continue jogando por mais <span className="text-white font-bold">{mission.streak.daysLeft} dias</span> para desbloquear o troféu "{mission.streak.goal}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function DashBoard() {
    return (
        <div className="relative min-h-screen bg-black animate-fadeIn">
            <DashBoardHeader />
            <SideBar />

            <main className="ml-20 mt-5 p-6 pt-24">
                <LoginRewardBanner />
                <MainCard player={PLAYER} />

                <div className="flex gap-4 mt-6">
                    <MapsPanel maps={MAPS} />
                    <ErrorTypesPanel errors={ERROR_TYPES} />
                    <TrophiesAndMissionPanel trophies={TROPHIES} mission={DAILY_MISSION} />
                </div>
            </main>
        </div>
    );
}