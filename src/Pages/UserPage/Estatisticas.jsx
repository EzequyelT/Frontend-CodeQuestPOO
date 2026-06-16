import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../Services/users/userService";
import { buscarTempoNivel } from "../../Services/Gameplay/tempoService";
import { getProgresso } from "../../Services/users/userStatsService";
import { getMapas } from "../../Services/maps/mapasService";
import { getLevelsByMap } from "../../Services/maps/levelService";
import { gerarRelatorioPDF } from "../../Services/pdf/pdfService";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import loadingVideo from "../../assets/Loading/loading.webm";
import SideBar from "../../Components/SideBar/SideBar";
import map1 from "../../assets/Maps/FirstMap.png";
import map2 from "../../assets/Maps/SecondMap.png";
import map3 from "../../assets/Maps/ThirdMap.png";
import { 
    ArrowLeft, 
    Clock, 
    Map, 
    Trophy, 
    Target, 
    Star, 
    Lock, 
    ChevronRight, 
    TriangleAlert, 
    ImageOff, 
    FileText 
} from "lucide-react";

function formatTempo(segundos = 0) {
    if (!segundos) return "0s";

    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function pctColor(pct) {
    if (pct === 100) return "#22c55e";
    if (pct >= 50) return "#f59e0b";
    return "#3b82f6";
}

function StatCard({ icon: Icon, label, value, color = "#22c55e" }) {
    return (
        <div
            className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-current group"
            style={{ color: color }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{ background: color + "15", border: `1px solid ${color}33` }}
            >
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="text-neutral-500 font-medium uppercase tracking-wider text-[10px]">{label}</p>
                <p className="text-white font-black text-xl tracking-wide mt-0.5 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{value}</p>
            </div>
        </div>
    );
}

function ProgressRing({ pct, size = 65 }) {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const dash = circ * Math.min(pct / 100, 1);
    const color = pctColor(pct);
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 52 52" className="w-full h-full -rotate-90 filter drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#262626" strokeWidth="4.5" />
                <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4.5"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    strokeDasharray={`${dash} ${circ}`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <span className="text-[10px] font-black text-white  px-1 rounded-md">{Math.round(pct)}%</span>
            </div>
        </div>
    );
}

function MapCard({ mapa, niveis = [], tempoNivel = [], user }) {
    const [open, setOpen] = useState(false);

    const totalNiveis = niveis.length;
    const nivelAtual = user?.progresso?.nivel_atual ?? 1;

    const borderColor = mapa.locked ? "border-neutral-900" : open ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.05)]" : "border-neutral-800 hover:border-neutral-700";

    return (
        <div className={`bg-neutral-900/40 border rounded-2xl overflow-hidden transition-all duration-300 ${borderColor}`}>
            <div
                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${mapa.locked ? "opacity-50 select-none" : "hover:bg-neutral-800/30"}`}
                onClick={() => !mapa.locked && setOpen(o => !o)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`w-18 h-15 rounded-2xl flex items-center justify-center flex-shrink-0  text-2xl shadow-inner transition-transform mb-2 mt-1 ${!mapa.locked && "group-hover:scale-105"}`}
                    >
                        {
                            mapa.locked
                                ? "🔒"
                                : mapa.id === 1
                                    ? <img src={map1}></img>
                                    : mapa.id === 2
                                        ? <img src={map2}></img>
                                        : mapa.id === 3
                                            ? <img src={map3}></img>
                                            : <ImageOff />
                        }
                    </div>

                    <div>
                        <h3 className={`font-bold text-base tracking-wide mt-2 ${mapa.locked ? "text-neutral-500" : "text-white"}`}>
                            {mapa.nome}
                        </h3>
                        <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1 max-w-md">
                            {mapa.descricao}
                        </p>
                        {!mapa.locked && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-2xl border border-yellow-500/20">
                                    {mapa.desafios}/{mapa.total} Desafios
                                </span>
                                <span className="text-[10px] font-extrabold  uppercase tracking-wider text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded-2xl">
                                    {nivelAtual}/{totalNiveis || "?"} Niveis
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {mapa.locked ? (
                        <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                            <Lock size={16} className="text-neutral-600" />
                        </div>
                    ) : (
                        <>
                            <ProgressRing pct={mapa.porcentagem} />
                            <div className="text-neutral-500 hover:text-white p-1 transition-colors">
                                <ChevronRight
                                    size={18}
                                    className="transition-transform duration-300"
                                    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!mapa.locked && (
                <div className="px-5 pb-4">
                    <div className="h-2 bg-neutral-950 rounded-full p-[2px] border border-neutral-800/60 mt-2">
                        <div
                            className="h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                            style={{
                                width: `${mapa.porcentagem}%`,
                                backgroundColor: pctColor(mapa.porcentagem),
                            }}
                        />
                    </div>
                </div>
            )}

            {open && !mapa.locked && niveis.length > 0 && (
                <div className="bg-neutral-950/60 border-t border-neutral-900 divide-y divide-neutral-900/50">
                    {niveis.map((nivel, i) => {
                        const tempoInfo = tempoNivel.find(
                            t => t.nivel?.nivel === nivel.ordem || t.nivel?.nome === nivel.nome
                        );
                        const concluido = tempoInfo?.tempo_total > 0;
                        return (
                            <div
                                key={i}
                                className="flex items-center justify-between px-6 py-3.5 hover:bg-neutral-900/40 transition-colors group/level"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 group-hover/level:scale-105 shadow-md"
                                        style={{
                                            background: concluido ? "linear-gradient(135deg, #166534 0%, #14532d 100%)" : "#171717",
                                            color: concluido ? "#4ade80" : "#737373",
                                            border: `1px solid ${concluido ? "#22c55e44" : "#262626"}`,
                                        }}
                                    >
                                        {nivel.ordem ?? i + 1}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-extrabold tracking-wide transition-colors ${concluido ? "text-white group-hover/level:text-white" : "text-white"}`}>
                                            {nivel.nome}
                                        </p>
                                        {nivel.descricao && (
                                            <p className="text-neutral-500 text-[11px] mt-0.5 line-clamp-1 max-w-sm">
                                                {nivel.descricao}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 text-right flex-shrink-0">
                                    {concluido ? (
                                        <>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="bg-neutral-900/80 px-2.5 py-1 rounded-xl border border-neutral-800/40">
                                                    <p className="text-neutral-500 text-[9px] uppercase tracking-wider font-semibold">Melhor</p>
                                                    <p className="text-yellow-400 text-xs font-bold mt-0.5">
                                                        {formatTempo(tempoInfo.melhor_tempo)}
                                                    </p>
                                                </div>
                                                <div className="bg-neutral-900/80 px-2.5 py-1 rounded-xl border border-neutral-800/40">
                                                    <p className="text-neutral-500 text-[9px] uppercase tracking-wider font-semibold">Total</p>
                                                    <p className="text-neutral-300 text-xs font-medium mt-0.5">
                                                        {formatTempo(tempoInfo.tempo_total)}
                                                    </p>
                                                </div>
                                                <div className="bg-neutral-900/80 px-2.5 py-1 rounded-xl border border-neutral-800/40">
                                                    <p className="text-neutral-500 text-[9px] uppercase tracking-wider font-semibold">Tentativas</p>
                                                    <p className="text-neutral-300 text-xs font-medium mt-0.5">
                                                        {tempoInfo.tentativas ?? "—"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="w-6 h-6 animate-pulse flex items-center justify-center text-xs font-black text-green-400 bg-green-500/10 border border-green-500/30 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                ✓
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider bg-neutral-900/50 px-2.5 py-1.5 rounded-xl border border-neutral-950">
                                            Bloqueado
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {mapa.locked && (
                <div className="px-5 pb-4 text-neutral-500 font-medium text-xs flex items-center gap-1.5 bg-neutral-950/20 py-2 border-t border-neutral-900/50">
                    <span><TriangleAlert size={15} /></span> Requer a conclusão do mapa anterior para desbloquear a jornada.
                </div>
            )}
        </div>
    );
}

function ExportPdf(userId) {
    try {
        if (!userId) {
            console.error("Id do utilizador não encontrado para exportação de PDF.");
            return;
        }
        const pdfUrl = async () => {
            await gerarRelatorioPDF(userId);
        }
        pdfUrl()
    } catch (error) {
        console.error("Erro ao exportar PDF", error);
    }
}

export default function Estatisticas() {
    const [user, setUser] = useState(null);
    const [tempoNivel, setTempoNivel] = useState([]);
    const [niveis, setNiveis] = useState([]);
    const [mapasProgresso, setMapasProgresso] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAll() {
            try {
                const [userData, tempo, mapas] = await Promise.all([
                    getMe(),
                    buscarTempoNivel(),
                    getMapas(),
                ]);
                setUser(userData);
                setTempoNivel(Array.isArray(tempo) ? tempo : []);

                console.log("Progresso", mapas)

                const progresso = await getProgresso(userData);
                const mapasComProgresso = mapas.map(m => {
                    const prog = progresso.find(p => p.mapa === m.id) || {};
                    return {
                        ...m,
                        desafios: prog.desafios_completos || 0,
                        total: prog.total_desafios || 0,
                        porcentagem: prog.porcentagem || 0,
                        locked: !prog.desbloqueado,
                        done: prog.porcentagem === 100,
                    };
                });
                setMapasProgresso(mapasComProgresso);

                const niveisPorMapa = await Promise.all(
                    mapasComProgresso.map(async m => ({
                        mapaId: m.id,
                        niveis: m.locked ? [] : await getLevelsByMap(m.id).catch(() => []),
                    }))
                );
                setNiveis(niveisPorMapa);
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
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

    console.log("Progresso", user?.progresso)

    const totalTempo = user?.progresso?.tempo_total_jogo ?? 0;
    const totalXp = user?.progresso?.xp ?? 0;
    const mapaAtual = user?.progresso?.mapa_atual ?? 1;
    const nivelAtual = user?.progresso?.nivel_atual ?? 1;
    const niveisFeitos = tempoNivel.filter(t => t.tempo_total > 0).length;
    const melhorTempo = tempoNivel.reduce((best, t) => Math.min(best, t.melhor_tempo ?? Infinity), Infinity);

    return (
        <div className="relative min-h-screen bg-neutral-950 text-neutral-100 selection:bg-yellow-500 selection:text-black antialiased">

            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <main className="ml-20 pt-24 px-8 pb-16 max-w-7xl mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 font-bold rounded-2xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-white font-black text-3xl tracking-tight uppercase filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                            Painel de Conquistas
                        </h1>
                        <p className="text-neutral-500 font-medium text-xs mt-0.5">
                            Jogador: <span className="text-neutral-300 font-bold">{user?.nome}</span> · Registro de Campanha
                        </p>

                    </div>
                    <button onClick={() => ExportPdf(user?.id)} className="ml-auto w-40 p-2 gap-2 font-bold rounded-2xl flex justify-center items-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md">
                        Exportar PDF <span><FileText /></span>
                    </button>
                </div>

                <div className="ml-35 mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard icon={Clock} label="Tempo Total de Jogo" value={formatTempo(totalTempo)} color="#06b6d4" />
                        <StatCard icon={Star} label="XP" value={`${totalXp.toLocaleString()} XP`} color="#eab308" />
                        <StatCard icon={Target} label="Niveis concluidos" value={`${niveisFeitos} `} color="#22c55e" />
                        <StatCard icon={Trophy} label="Best try" value={melhorTempo === Infinity ? "—" : formatTempo(melhorTempo)} color="#a855f7" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-neutral-900 pb-3">
                        <h2 className="text-neutral-300 font-extrabold text-base tracking-wider uppercase flex items-center gap-2">
                            Mapas da Campanha
                        </h2>
                        <span className="text-yellow-500 text-[11px] font-bold uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1 shadow-sm">
                            Localização Atual: Mapa {mapaAtual} · Nivel {nivelAtual}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {mapasProgresso.map(mapa => {
                            const niveisDoMapa = niveis.find(n => n.mapaId === mapa.id)?.niveis ?? [];
                            return (
                                <MapCard
                                    key={mapa.id}
                                    mapa={mapa}
                                    niveis={niveisDoMapa}
                                    tempoNivel={tempoNivel}
                                    user={user}
                                />
                            );
                        })}
                    </div>

                    {mapasProgresso.length === 0 && (
                        <div className="text-center py-20 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl mt-4">
                            <p className="text-neutral-600 font-bold uppercase tracking-widest text-sm">Nenhum registo de exploração encontrado.</p>
                            <p className="text-neutral-500 text-xs mt-1">Inicie uma partida para começar a computar seu progresso!</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
