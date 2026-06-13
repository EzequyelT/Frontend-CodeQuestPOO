import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { useEffect, useState } from "react";
import { getMe } from "../../Services/users/userService";
import { getLeaderBoardBestTime, getLeaderBoardByMapa } from "../../Services/users/leaderBoard";
import { getEstadosAmizade, enviarPedidoAmizade } from "../../Services/users/amizadesService";
import api from "../../Services/api/axios";
import { getLevelsByMap } from "../../Services/maps/levelService";
import { getMapas } from "../../Services/maps/mapasService";
import loadingVideo from "../../assets/Loading/loading.webm";
import socket from "../../Services/socket/socket";
import {
    ArrowLeft,
    Trophy,
    Clock,
    Sword,
    Map,
    Filter,
    Crown,
    Star,
    ChevronDown,
    Sparkles,
    UserPlus,
    Check,
    Wifi,
    WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function formatTempo(segundos = 0) {
    if (!segundos && segundos !== 0) return "—";
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function getRankStyle(pos) {
    if (pos === 0) return {
        badge: "🥇",
        color: "#d946ef",
        bg: "from-fuchsia-600/30 via-purple-600/5 to-neutral-950",
        glow: "rgba(217,70,239,0.4)",
        border: "border-fuchsia-500",
        text: "text-fuchsia-400"
    };

    if (pos === 1) return {
        badge: "🥈",
        color: "#22d3ee",
        bg: "from-cyan-500/25 via-blue-600/5 to-neutral-950",
        glow: "rgba(34,211,238,0.35)",
        border: "border-cyan-400",
        text: "text-cyan-400"
    };

    if (pos === 2) return {
        badge: "🥉",
        color: "#ec4899",
        bg: "from-pink-500/25 via-rose-600/5 to-neutral-950",
        glow: "rgba(236,72,153,0.3)",
        border: "border-pink-500/80",
        text: "text-pink-400"
    };

    return {
        badge: `#${pos + 1}`,
        color: "#a3a3a3",
        bg: "from-neutral-900 to-neutral-950",
        glow: "transparent",
        border: "border-neutral-800/60",
        text: "text-neutral-400"
    };
}

function getInitials(nome = "") {
    return nome
        .split(" ")
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase())
        .join("");
}

function Avatar({ nome, avatar, size = 42, isMe }) {
    return (
        <div
            className="rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 select-none relative group-hover:scale-105 transition-transform duration-300"
            style={{
                width: size,
                height: size,
                background: isMe
                    ? "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)"
                    : "linear-gradient(135deg, #262626 0%, #0a0a0a 100%)",
                border: isMe ? "2px solid #f59e0b" : "2px solid #404040",
                color: isMe ? "#000" : "#a3a3a3",
                boxShadow: isMe ? "0 0 15px rgba(245,158,11,0.4)" : "none",
            }}
        >
            {avatar
                ? <img src={avatar} alt={nome} className="w-full h-full object-cover rounded-full" />
                : getInitials(nome)}

            {isMe && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-[9px] px-2 rounded-full text-black font-extrabold animate-bounce">
                    TU
                </span>
            )}
        </div>
    );
}

function LeaderRow({
    entry,
    pos,
    isMe,
    timeKey = "melhorTempo",
    showContext = false,
    amizade,
    onAdicionarAmigo
}) {
    const rank = getRankStyle(pos);
    const isTop3 = pos < 3;

    let bgGradient = "from-neutral-900 to-neutral-950 border-neutral-800/60";

    if (isMe) {
        bgGradient = "from-emerald-500/25 via-emerald-600/5 to-neutral-950 border-emerald-400 shadow-lg shadow-emerald-500/10";
    } else if (pos === 0) {
        bgGradient = "from-fuchsia-600/30 via-purple-600/5 to-neutral-950 border-fuchsia-500";
    } else if (pos === 1) {
        bgGradient = "from-cyan-500/25 via-blue-600/5 to-neutral-950 border-cyan-400";
    } else if (pos === 2) {
        bgGradient = "from-pink-500/25 via-rose-600/5 to-neutral-950 border-pink-500/80";
    }

    const estadoAmizade = amizade?.estado;
    const avatarImagem = entry.avatar?.caminho_imagem ?? entry.avatar;

    return (
        <div
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border bg-gradient-to-r backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group ${bgGradient}`}
            style={{
                boxShadow: isTop3 && !isMe ? `0 4px 24px -4px ${rank.glow}` : undefined,
            }}
        >
            <div className="w-10 flex-shrink-0 flex items-center justify-center">
                {isTop3
                    ? <span className="text-2xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">{rank.badge}</span>
                    : <span className="text-xs font-black text-neutral-500">{rank.badge}</span>}
            </div>

            <Avatar nome={entry.nome} avatar={avatarImagem} isMe={isMe} />

            <div className="flex flex-col flex-1 min-w-0">
                <span className={`font-black text-sm truncate tracking-wide ${isMe ? "text-emerald-400" : isTop3 ? "text-white" : "text-neutral-300"}`}>
                    {entry.nome}
                    {isMe && (
                        <span className="ml-1 text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            (tu)
                        </span>
                    )}
                </span>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {entry.online ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                            <Wifi size={11} /> Online
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-neutral-500">
                            <WifiOff size={11} /> Offline
                        </span>
                    )}

                    <span className="text-neutral-600 text-[10px]">·</span>

                    <span className="text-[10px] font-bold text-amber-400">
                        Total: {formatTempo(entry.tempoTotal ?? 0)}
                    </span>
                </div>

                {showContext && entry.desafio && (
                    <span className="text-[10px] font-medium mt-1 opacity-90 truncate flex items-center gap-1">
                        <span className="text-neutral-400">{entry.mapa?.nome}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-400">{entry.nivel?.nome}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-500">{entry.desafio?.nome}</span>
                    </span>
                )}
            </div>

            {!isMe && (
                <div className="flex-shrink-0">
                    {estadoAmizade === "aceite" ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
                            <Check size={12} /> Amigo
                        </span>
                    ) : estadoAmizade === "pendente_enviado" ? (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl">
                            Pendente
                        </span>
                    ) : estadoAmizade === "pendente_recebido" ? (
                        <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-2 rounded-xl">
                            Pedido
                        </span>
                    ) : (
                        <button
                            onClick={() => onAdicionarAmigo(entry.alunoId)}
                            className="flex items-center gap-1 text-[10px] font-black text-neutral-200 bg-neutral-900 border border-neutral-700 hover:border-amber-500 hover:text-amber-400 px-3 py-2 rounded-xl transition-all"
                        >
                            <UserPlus size={12} />
                            Adicionar
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-neutral-800/60 flex-shrink-0 shadow-inner group-hover:border-neutral-600 transition-colors">
                <Clock size={12} className={pos === 0 ? "text-fuchsia-400" : pos === 1 ? "text-cyan-400" : pos === 2 ? "text-pink-400" : "text-neutral-500"} />
                <span className={`text-sm font-black tabular-nums tracking-wider ${isMe ? "text-emerald-400" : isTop3 ? "text-white" : "text-neutral-400"}`}>
                    {formatTempo(entry[timeKey])}
                </span>
            </div>
        </div>
    );
}

function Podium({ entries, myId, timeKey }) {
    if (entries.length < 3) return null;

    const [second, first, third] = [entries[1], entries[0], entries[2]];

    const PodiumSlot = ({ entry, pos, height, animationDelay }) => {
        const rank = getRankStyle(pos);
        const isMe = entry.alunoId === myId;
        const avatarImagem = entry.avatar?.caminho_imagem ?? entry.avatar;

        return (
            <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px] animate-fade-in-up" style={{ animationDelay }}>
                <div className="relative group">
                    <div className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" style={{ backgroundColor: rank.color }} />
                    <Avatar nome={entry.nome} avatar={avatarImagem} size={pos === 0 ? 64 : 52} isMe={isMe} />
                </div>

                <span className={`text-xs font-black truncate w-full text-center mt-1 ${isMe ? "text-amber-400" : "text-neutral-200"}`}>
                    {entry.nome?.split(" ")[0]}
                </span>

                <span className="text-[11px] font-black tabular-nums tracking-wider bg-neutral-900/90 px-2 py-0.5 rounded-full border border-neutral-800" style={{ color: rank.color }}>
                    {formatTempo(entry[timeKey])}
                </span>

                <div
                    className="w-full rounded-t-2xl flex flex-col items-center justify-end pb-4 border-t-2 border-x shadow-2xl relative overflow-hidden group transition-all duration-500 hover:brightness-110"
                    style={{
                        height,
                        background: `linear-gradient(to bottom, ${rank.glow}, rgba(10,10,10,0.8))`,
                        borderColor: pos === 0 ? "rgba(251,191,36,0.4)" : "rgba(64,64,64,0.3)",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                    <span className="text-4xl filter drop-shadow-md select-none transform group-hover:scale-110 transition-transform">
                        {rank.badge}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-end justify-center gap-3 pt-6 pb-2 mb-6 bg-neutral-900/20 rounded-3xl p-4 border border-neutral-900/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <PodiumSlot entry={second} pos={1} height="90px" animationDelay="100ms" />
            <PodiumSlot entry={first} pos={0} height="125px" animationDelay="0ms" />
            <PodiumSlot entry={third} pos={2} height="75px" animationDelay="200ms" />
        </div>
    );
}

function SelectFilter({ label, icon: Icon, value, onChange, options, disabled }) {
    return (
        <div className="relative flex-1 min-w-[140px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none transition-colors">
                <Icon size={14} className={value ? "text-amber-400" : ""} />
            </div>

            <select
                value={value ?? ""}
                onChange={e => onChange(Number(e.target.value) || null)}
                disabled={disabled}
                className="w-full bg-neutral-950/80 border border-neutral-800/80 rounded-xl pl-9 pr-9 py-3 text-xs font-bold text-neutral-200 appearance-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-inner"
            >
                <option value="" className="bg-neutral-950 text-neutral-400">{label}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value} className="bg-neutral-950 text-neutral-200">
                        {o.label}
                    </option>
                ))}
            </select>

            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="text-center py-16 border-2 border-dashed border-neutral-800/60 rounded-2xl bg-neutral-900/10 backdrop-blur-sm animate-pulse">
            <Trophy size={40} className="text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">{message}</p>
            <p className="text-neutral-500 text-xs mt-1.5">Completa desafios na campanha para deixares a tua marca aqui!</p>
        </div>
    );
}

export default function LeaderBoard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [globalEntries, setGlobalEntries] = useState([]);
    const [globalLoading, setGlobalLoading] = useState(false);

    const [tab, setTab] = useState("global");

    const [mapas, setMapas] = useState([]);
    const [niveis, setNiveis] = useState([]);
    const [desafios, setDesafios] = useState([]);

    const [selectedMapa, setSelectedMapa] = useState(null);
    const [selectedNivel, setSelectedNivel] = useState(null);
    const [selectedDesafio, setSelectedDesafio] = useState(null);

    const [filteredEntries, setFilteredEntries] = useState([]);
    const [filteredLoading, setFilteredLoading] = useState(false);
    const [filteredSearched, setFilteredSearched] = useState(false);

    const [userProgress, setUserProgress] = useState(null);
    const [amizadesMap, setAmizadesMap] = useState({});

    useEffect(() => {
        function atualizarPresenca({ alunoId, online }) {
            setGlobalEntries((prev) =>
                prev.map((entry) =>
                    entry.alunoId === alunoId
                        ? { ...entry, online }
                        : entry
                )
            );

            setFilteredEntries((prev) =>
                prev.map((entry) =>
                    entry.alunoId === alunoId
                        ? { ...entry, online }
                        : entry
                )
            );
        }

        socket.on("presenca-atualizada", atualizarPresenca);

        return () => {
            socket.off("presenca-atualizada", atualizarPresenca);
        };
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        async function bootstrap() {
            try {
                api.patch("/alunos/online").catch(() => { });

                const userData = await getMe();
                setUser(userData);

                const prog = userData?.progresso;
                if (prog) {
                    setUserProgress({
                        mapaId: prog.mapa_atual ?? 1,
                        nivelId: prog.nivel_atual ?? 1,
                    });
                }

                const mapasData = await getMapas();
                setMapas(mapasData.map(m => ({ value: m.id, label: m.nome, ...m })));

                setGlobalLoading(true);

                const [global, estados] = await Promise.all([
                    getLeaderBoardBestTime(),
                    getEstadosAmizade().catch(() => [])
                ]);

                const mapaEstados = {};
                estados.forEach(e => {
                    mapaEstados[e.alunoId] = e;
                });

                setAmizadesMap(mapaEstados);
                setGlobalEntries(Array.isArray(global) ? global : []);
            } catch (err) {
                console.error("Erro ao carregar LeaderBoard:", err);
            } finally {
                setLoading(false);
                setGlobalLoading(false);
            }
        }

        bootstrap();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            api.patch("/alunos/online").catch(() => { });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!selectedMapa) {
            setNiveis([]);
            setDesafios([]);
            setSelectedNivel(null);
            setSelectedDesafio(null);
            return;
        }

        setSelectedNivel(null);
        setSelectedDesafio(null);
        setDesafios([]);

        getLevelsByMap(selectedMapa)
            .then(data => setNiveis(Array.isArray(data) ? data.map(n => ({ value: n.id, label: n.nome, ...n })) : []))
            .catch(() => setNiveis([]));
    }, [selectedMapa]);

    useEffect(() => {
        if (!selectedNivel) {
            setDesafios([]);
            setSelectedDesafio(null);
            return;
        }

        setSelectedDesafio(null);

        const nivel = niveis.find(n => n.value === selectedNivel);
        const ds = nivel?.desafios ?? nivel?.challenges ?? [];

        setDesafios(ds.map(d => ({ value: d.id, label: d.nome ?? d.name })));
    }, [selectedNivel, niveis]);

    useEffect(() => {
        if (tab === "filtrado" && userProgress && !selectedMapa) {
            setSelectedMapa(userProgress.mapaId);
        }
    }, [tab]);

    async function handleSearch() {
        if (!selectedMapa) return;

        setFilteredLoading(true);
        setFilteredSearched(true);

        try {
            const data = await getLeaderBoardByMapa(
                selectedMapa,
                selectedNivel ?? null,
                selectedDesafio ?? null,
            );

            setFilteredEntries(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao filtrar leaderboard:", err);
            setFilteredEntries([]);
        } finally {
            setFilteredLoading(false);
        }
    }

    async function handleAdicionarAmigo(amigoId) {
        try {
            await enviarPedidoAmizade(amigoId);

            setAmizadesMap(prev => ({
                ...prev,
                [amigoId]: {
                    alunoId: amigoId,
                    estado: "pendente_enviado"
                }
            }));
        } catch (err) {
            console.error("Erro ao enviar pedido de amizade:", err);
            alert(err?.response?.data?.error ?? "Erro ao enviar pedido de amizade");
        }
    }

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 p-2 bg-neutral-950/50 rounded-xl">
                    <video src={loadingVideo} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                </div>

                <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse mt-4">
                    A carregar
                </p>

                <div className="flex gap-1.5 mt-2">
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-amber-500/80"
                            style={{
                                animation: "dot-pulse 1.4s ease-in-out infinite",
                                animationDelay: `${delay}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    const myId = user?.id ?? user?.alunoId;

    return (
        <div className="relative min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-amber-500/30 overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/5 via-emerald-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-t from-amber-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <main className="ml-20 pt-28 px-4 sm:px-8 pb-20 flex justify-center relative z-10">
                <div className="w-full max-w-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-1 p-6 rounded-3xl backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-neutral-400 bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:text-amber-400 active:scale-95 transition-all shadow-md group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>

                            <div>
                                <h1 className="text-white font-black text-3xl tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                                    Leaderboard
                                </h1>

                                <p className="text-neutral-400 text-xs mt-0.5 font-medium flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-amber-400" />
                                    Classificação em tempo real da campanha
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-neutral-900 pt-4 md:pt-0">
                            <DotLottieReact
                                src="https://lottie.host/a0da85ce-8c4f-436f-b412-9b67a2299ca0/9fAoiQM4Ef.lottie"
                                loop
                                autoplay
                                className="w-50 h-25 hidden sm:block"
                            />

                            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/20 border border-amber-500/30 rounded-2xl px-4 py-2.5 shadow-lg shadow-amber-500/5">
                                <Crown size={15} className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                                <span className="text-amber-300 text-xs font-black tracking-wide">
                                    {user?.nome}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 bg-neutral-900/40 border border-neutral-900 p-1.5 rounded-2xl mb-8 backdrop-blur-sm">
                        {[
                            { id: "global", label: "Ranking Global", icon: Trophy },
                            { id: "filtrado", label: "Por Desafio Específico", icon: Filter },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${tab === t.id
                                        ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5"
                                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30"
                                    }`}
                            >
                                <t.icon size={14} className={tab === t.id ? "text-amber-400" : "text-neutral-500"} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === "global" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-neutral-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <Sword size={13} className="text-amber-500" />
                                    Melhores Tempos Gerais
                                </h2>

                                <span className="bg-neutral-900 text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-neutral-800">
                                    {globalEntries.length} Combatentes
                                </span>
                            </div>

                            {globalLoading ? (
                                <div className="flex justify-center py-16">
                                    <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                </div>
                            ) : globalEntries.length === 0 ? (
                                <EmptyState message="Nenhum registo encontrado" />
                            ) : (
                                <>
                                    <Podium entries={globalEntries} myId={myId} timeKey="melhorTempo" />

                                    <div className="flex flex-col gap-2.5">
                                        {globalEntries.map((entry, i) => (
                                            <LeaderRow
                                                key={entry.alunoId}
                                                entry={entry}
                                                pos={i}
                                                isMe={entry.alunoId === myId}
                                                timeKey="melhorTempo"
                                                showContext
                                                amizade={amizadesMap[entry.alunoId]}
                                                onAdicionarAmigo={handleAdicionarAmigo}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {tab === "filtrado" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-3xl backdrop-blur-md shadow-lg">
                                <p className="text-neutral-400 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center gap-2">
                                    <Filter size={12} className="text-amber-500" />
                                    Filtros de Classificação
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2.5">
                                    <SelectFilter
                                        label="Selecionar Mapa"
                                        icon={Map}
                                        value={selectedMapa}
                                        onChange={setSelectedMapa}
                                        options={mapas}
                                        disabled={false}
                                    />

                                    <SelectFilter
                                        label="Selecionar Nível"
                                        icon={Star}
                                        value={selectedNivel}
                                        onChange={setSelectedNivel}
                                        options={niveis}
                                        disabled={!selectedMapa || niveis.length === 0}
                                    />

                                    <SelectFilter
                                        label="Selecionar Desafio"
                                        icon={Sword}
                                        value={selectedDesafio}
                                        onChange={setSelectedDesafio}
                                        options={desafios}
                                        disabled={!selectedNivel || desafios.length === 0}
                                    />
                                </div>

                                {userProgress && !selectedMapa && (
                                    <p className="text-neutral-400 text-[11px] font-medium mt-4 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-900 flex items-center gap-2">
                                        <span className="animate-pulse text-amber-400">💡</span>
                                        O teu progresso atual:
                                        <span className="text-amber-400 font-bold">Mapa {userProgress.mapaId}</span>
                                        ·
                                        <span className="text-neutral-300 font-bold">Nível {userProgress.nivelId}</span>
                                    </p>
                                )}

                                <button
                                    onClick={handleSearch}
                                    disabled={!selectedMapa || filteredLoading}
                                    className="mt-4 w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.99] shadow-md"
                                    style={{
                                        background: selectedMapa ? "linear-gradient(135deg, #f59e0b 0%, #84cc16 100%)" : "#171717",
                                        color: selectedMapa ? "#000" : "#737373",
                                        boxShadow: selectedMapa ? "0 4px 15px rgba(245,158,11,0.2)" : "none",
                                    }}
                                >
                                    {filteredLoading ? "A consultar registos..." : "Procurar Classificação"}
                                </button>
                            </div>

                            {filteredLoading ? (
                                <div className="flex justify-center py-16">
                                    <div className="w-8 h-8 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                </div>
                            ) : filteredSearched ? (
                                filteredEntries.length === 0 ? (
                                    <EmptyState message="Sem resultados para este filtro" />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <h2 className="text-neutral-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                <Trophy size={13} className="text-amber-500" />
                                                Resultados do Filtro
                                            </h2>

                                            <span className="bg-neutral-900 text-neutral-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-neutral-800">
                                                {filteredEntries.length} Jogadores
                                            </span>
                                        </div>

                                        <Podium entries={filteredEntries} myId={myId} timeKey="tempo" />

                                        <div className="flex flex-col gap-2.5">
                                            {filteredEntries.map((entry, i) => (
                                                <LeaderRow
                                                    key={entry.alunoId}
                                                    entry={entry}
                                                    pos={i}
                                                    isMe={entry.alunoId === myId}
                                                    timeKey="tempo"
                                                    amizade={amizadesMap[entry.alunoId]}
                                                    onAdicionarAmigo={handleAdicionarAmigo}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-16 border border-dashed border-neutral-800/60 rounded-3xl bg-neutral-900/5 backdrop-blur-sm">
                                    <Filter size={32} className="text-neutral-700 mx-auto mb-3" />
                                    <p className="text-neutral-400 text-xs font-bold">
                                        Define os critérios acima e clica em <span className="text-amber-500">"Procurar Classificação"</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}