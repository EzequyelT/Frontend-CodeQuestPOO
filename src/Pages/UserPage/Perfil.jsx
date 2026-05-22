import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../Services/users/userService";
import { obterXPAluno } from "../../Services/Gameplay/xpProgressService";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { ArrowLeft, Settings, UserPlus, Mail, School, Hash, MapPin, Map, Clock, Search, SlidersHorizontal, Lock } from "lucide-react";

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function formatTempo(minutos = 0) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function LevelRing({ nivel, xpAtualNivel, xpProximoNivel, nivelMaximo, titulo }) {
    const r = 85;
    const circ = 2 * Math.PI * r;
    const pct = nivelMaximo ? 1 : Math.min((xpAtualNivel / (xpProximoNivel || 1)), 1);
    const dash = circ * pct;
    const gap = circ - dash;

    return (
        <div className="rounded-3xl backdrop-blur-sm mb-2">
            <div className="relative" style={{ width: 240, height: 240 }}>

                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90" style={{ overflow: "visible" }}>
                    <circle
                        cx="100"
                        cy="100"
                        r={r}
                        fill="none"
                        stroke="#161b22"
                        strokeWidth="8"
                    />

                    <circle
                        cx="100"
                        cy="100"
                        r={r}
                        fill="none"
                        stroke="#0891b2"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${gap}`}
                        className="opacity-40 animate-pulse"
                        style={{
                            filter: "blur(8px)",
                            transition: "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    />

                    <circle
                        cx="100"
                        cy="100"
                        r={r}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${gap}`}
                        style={{
                            filter: "drop-shadow(0 0 8px #0891b2) drop-shadow(0 0 2px #0891b2)",
                            transition: "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                    <span className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">
                        {nivelMaximo ? "MAX" : "Nível"}
                    </span>

                    <span className="text-white font-extrabold text-6xl tracking-tighter my-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        {nivel}
                    </span>

                    {!nivelMaximo && (
                        <div className="text-zinc-400 text-xs font-medium bg-zinc-900/60 px-2.5 py-0.5 rounded-md border border-zinc-800/50">
                            <span>{xpAtualNivel}</span>
                            <span className="text-zinc-600 font-normal"> / {xpProximoNivel}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center select-none">
                <span
                    className="text-white font-bold text-lg mt-2 tracking-[0.03rem] 
                    "
                >
                    {titulo}
                </span>
            </div>
        </div>
    );
}


function Avatar({ nome, avatar, size = 72 }) {
    const initials = nome
        ? nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
        : "U";
    return (
        <div
            className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{
                width: size,
                height: size,
                background: avatar ? "transparent" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                border: "5px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 14px rgba(6,182,212,0.3)",
                fontSize: size * 0.35,
                overflow: "hidden",
            }}
        >
            {avatar
                ? <img src={avatar} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials}
        </div>
    );
}

function StatRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-2"
            style={{
                height: 50,
                borderRadius: "10px",
                background: "repeating-linear-gradient(60deg,#191919 0px,#191919 3px,#141414 3px,#141414 8px)",
            }}
        >

            <div className="flex items-center gap-5">
                <Icon size={14} className="text-gray-600 flex-shrink-0 ml-4" />
                <span className="text-gray-400 text-sm">{label}</span>
            </div>
            <span className="text-white font-semibold text-sm mr-4">{value ?? "—"}</span>
        </div>
    );
}

function Trophy({ icon, unlocked }) {
    return (
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <span className="text-2xl" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>
                {unlocked ? icon : <Lock size={18} className="text-white     font-semibold" />}
            </span>
        </div>
    );
}

const TROPHIES = [
    { icon: "🏆", name: "Primeira Vitória", unlocked: false },
    { icon: "🌿", name: "Mestre Floresta", unlocked: false },
    { icon: "🎯", name: "Sem Erros", unlocked: false },
    { icon: "🔥", name: "Streak 7 dias", unlocked: false },
    { icon: "🎯", name: "Sem Erros", unlocked: false },
    { icon: "🔥", name: "Streak 7 dias", unlocked: false },
];

export default function Perfil() {
    const [stats, setStats] = useState(null);
    const [xpData, setXpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAll() {
            try {
                const [userData, xpResult] = await Promise.all([
                    getMe(),
                    obterXPAluno(),
                ]);
                setStats(userData);
                setXpData(xpResult);
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
                    <p>Carregando Perfil...</p>
                </div>
            </div>
        );
    }

    const {
        nome, email, escola, id,
        data_registo, avatar,
        progresso = {},
    } = stats || {};

    const {
        mapa_atual = 1,
        nivel_atual = 1,
        tempo_total_jogo = 0,
        xp: xpBase = 0,
    } = progresso;

    const progressao = xpData?.progressao || {};
    const nivel = progressao.nivel ?? nivel_atual;
    const titulo = progressao.titulo ?? "Aprendiz";
    const xpAtualNivel = progressao.xpAtualNivel ?? xpBase;
    const xpProximoNivel = progressao.xpProximoNivel ?? 500;
    const nivelMaximo = progressao.nivelMaximo ?? false;

    return (
        <div className="relative min-h-screen bg-black">
            <DashBoardHeader user={stats} />
            <SideBar user={stats} />

            <main className="ml-100 pt-24 px-6 pb-10 w-210">

                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={17} />
                    </button>
                    <h1 className="text-white font-bold text-2xl">Perfil</h1>
                    <button
                        title="Adicionar amigo (em breve)"
                        disabled
                        className="ml-auto flex items-center gap-1.5 text-xs text-gray-600 border border-gray-800 rounded-lg px-3 py-1.5 cursor-not-allowed"
                    >
                        <UserPlus size={13} />
                        Adicionar amigo
                    </button>
                </div>

                <div
                    className="rounded-4xl border-2 border-gray-800 overflow-hidden mb-4"
                    style={{ background: "#151414" }}
                >

                    <div className="px-6 pb-6">
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4">
                                <Avatar nome={nome} avatar={avatar} size={72} />
                                <div>
                                    <h2 className="text-white font-bold text-xl leading-tight">{nome}</h2>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        Membro desde {formatDate(data_registo)}
                                    </p>
                                </div>
                            </div>

                            <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-700 rounded-2xl px-4 py-2 hover:border-gray-500 hover:text-gray-300 transition-colors">
                                <Settings size={12} />
                                Settings
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-8 mt-4">

                            <div className="flex-1 ml-1 max-w-[400px] w-full flex flex-col gap-2">
                                <StatRow icon={Hash} label="Id" value={id} />
                                <StatRow icon={Mail} label="Email" value={email} />
                                <StatRow icon={School} label="Escola" value={escola} />
                                <StatRow icon={Map} label="Mapa Atual" value={`Mapa ${mapa_atual}`} />
                                <StatRow icon={Clock} label="Tempo Total" value={formatTempo(tempo_total_jogo)} />
                            </div>

                            <div className="flex-shrink-0 pr-6">
                                <LevelRing
                                    nivel={nivel}
                                    xpAtualNivel={xpAtualNivel}
                                    xpProximoNivel={xpProximoNivel}
                                    nivelMaximo={nivelMaximo}
                                    titulo={titulo}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── SecondaryBoard: Achievements ── */}
                <div
                    className="rounded-4xl border-2 border-gray-800"
                    style={{ background: "#151414" }}
                >
                    <div className="flex items-center justify-between px-4 pt-4 ">
                        <h3 className="text-white text-base font-bold tracking-[0.03rem] ">Achievements</h3>
                        <div className="flex items-center gap-3 font-bold">
                            <button className="text-gray-600 hover:text-gray-400 transition-colors">
                                <Search size={18} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-400 transition-colors">
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-6 gap-20 ml-12 w-150">
                            {TROPHIES.map((t, i) => (
                                <div
                                    key={i}
                                    className={`relative p-4 flex items-center justify-center min-h-[70px] aspect-square rounded-sm
                                    transition-all duration-300 group cursor-pointer
                                    ${!t.unlocked ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-transparent'}`}
                                >
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-700 pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-700 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-700 pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-700 pointer-events-none" />

                                    <Trophy icon={t.icon} unlocked={t.unlocked} />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}