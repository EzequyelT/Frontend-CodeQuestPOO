import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { useEffect, useState, useRef } from "react";
import { getMe } from "../../Services/users/userService";
import {
    getAllMentores,
    getMentorAluno,
    escolherMentor,
    trocarMentor,
} from "../../Services/mentores/mentores";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Swords, Check, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import loadingVideo from "../../assets/Loading/loading.webm";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
}


const HERO_THEMES = {
    Aurelia:  { from: "#fef3c7", via: "#f59e0b", accent: "#f59e0b", label: "Guardiã da Luz" },
    Bromm:    { from: "#fde68a", via: "#b45309", accent: "#d97706", label: "Guerreiro Inabalável" },
    Eldrin:   { from: "#ddd6fe", via: "#7c3aed", accent: "#8b5cf6", label: "Sábio Ancião" },
    Lyra:     { from: "#bbf7d0", via: "#059669", accent: "#10b981", label: "Arqueira Veloz" },
    Tharok:   { from: "#fecaca", via: "#dc2626", accent: "#ef4444", label: "Bárbaro Selvagem" },
    Vaelgrim: { from: "#e0e7ff", via: "#4338ca", accent: "#6366f1", label: "Cavaleiro Amaldiçoado" },
};

function getTheme(nome) {
    return HERO_THEMES[nome] ?? { from: "#f5f5f5", via: "#737373", accent: "#a3a3a3", label: "" };
}

export default function Mentores() {
    const [user, setUser] = useState(null);
    const [mentores, setMentores] = useState([]);
    const [mentorAtual, setMentorAtual] = useState(null); 
    const [selected, setSelected] = useState(null);       
    const [transitioning, setTransitioning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const prevSelected = useRef(null);

    useEffect(() => {
        async function fetchAll() {
            try {
                const [userData, allMentores] = await Promise.all([
                    getMe(),
                    getAllMentores(),
                ]);
                setUser(userData);
                setMentores(Array.isArray(allMentores) ? allMentores : []);
                console.log(allMentores)
                 
                try {
                    const { getMentorAluno: _ } = await import("../../Services/mentores/mentores");
                    const atual = await getMentorAluno();
                    if (atual?.id) {
                        setMentorAtual(atual);
                        const found = allMentores.find(m => m.id === atual.id);
                        setSelected(found ?? allMentores[0] ?? null);
                    } else {
                        setSelected(allMentores[0] ?? null);
                    }
                } catch {
                    setSelected(allMentores[0] ?? null);
                }
            } catch (err) {
                console.error("Erro ao carregar mentores:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    function selectMentor(mentor) {
        if (transitioning || mentor.id === selected?.id) return;
        prevSelected.current = selected;
        setTransitioning(true);
        setTimeout(() => {
            setSelected(mentor);
            setTransitioning(false);
        }, 180);
    }

    function prev() {
        if (!mentores.length) return;
        const idx = mentores.findIndex(m => m.id === selected?.id);
        selectMentor(mentores[(idx - 1 + mentores.length) % mentores.length]);
    }

    function next() {
        if (!mentores.length) return;
        const idx = mentores.findIndex(m => m.id === selected?.id);
        selectMentor(mentores[(idx + 1) % mentores.length]);
    }

    async function handleEscolher() {
        if (!selected || saving) return;
        setSaving(true);
        try {
            if (mentorAtual) {
                await trocarMentor(selected.id);
            } else {
                await escolherMentor(selected.id);
            }
            setMentorAtual(selected);
            setSuccessMsg(mentorAtual ? "Mentor trocado com sucesso!" : "Mentor escolhido com sucesso!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error("Erro ao escolher mentor:", err);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 p-2 bg-neutral-950/50 rounded-xl">
                    <video src={loadingVideo} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                </div>
                <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse mt-4">Carregando</p>
                <div className="flex gap-1.5 mt-2">
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-amber-500/80"
                            style={{ animation: "dot-pulse 1.4s ease-in-out infinite", animationDelay: `${delay}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    const theme = selected ? getTheme(selected.nome) : null;
    const isCurrentMentor = mentorAtual?.id === selected?.id;
    const hasMentor = !!mentorAtual;

    return (
        <div className="relative min-h-screen bg-neutral-950 text-neutral-100 antialiased overflow-hidden">
            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <div
                className="fixed inset-0 pointer-events-none transition-all duration-700"
                style={{
                    background: theme
                        ? `radial-gradient(ellipse 60% 50% at 65% 40%, ${theme.accent}12 0%, transparent 70%)`
                        : "transparent",
                }}
            />

            <main className="ml-20 pt-20 pb-12 flex justify-center min-h-screen">
            <div className="w-full max-w-6xl px-6 flex flex-col">

                <div className="flex items-center gap-4 mb-10 mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white hover:scale-105 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-white font-black text-3xl tracking-tight uppercase">
                            Escolhe o teu Mentor
                        </h1>
                        <p className="text-neutral-500 text-xs mt-0.5">
                            O teu guia nesta jornada · {mentores.length} guerreiros disponíveis
                        </p>
                    </div>
                    {hasMentor && (
                        <div className="ml-auto flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-2xl px-3 py-2">
                            <Shield size={13} className="text-yellow-500" />
                            <span className="text-neutral-400 text-xs">Atual:</span>
                            <span className="text-neutral-200 text-xs font-bold">{mentorAtual.nome}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-8 flex-1">

                    <div className="flex flex-col gap-2 w-44 flex-shrink-0 self-start sticky top-28">
                        <p className="text-neutral-600 text-[9px] uppercase tracking-widest font-bold mb-1 pl-1">Heróis</p>
                        {mentores.map((m) => {
                            const t = getTheme(m.nome);
                            const isActive = m.id === selected?.id;
                            const isMine = m.id === mentorAtual?.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => selectMentor(m)}
                                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all duration-200 text-left group overflow-hidden"
                                    style={{
                                        background: isActive
                                            ? `linear-gradient(135deg, ${t.accent}22 0%, ${t.accent}08 100%)`
                                            : "rgba(15,15,15,0.8)",
                                        borderColor: isActive ? t.accent + "66" : "#262626",
                                        boxShadow: isActive ? `0 0 16px -4px ${t.accent}44` : "none",
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border"
                                        style={{ borderColor: isActive ? t.accent + "55" : "#2a2a2a" }}
                                    >
                                        {m.imagem
                                            ? <img src={getImageUrl(m.imagem)} alt={m.nome} className="w-full h-full object-cover object-top" />
                                            : <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs font-black text-neutral-500">{m.nome[0]}</div>
                                        }
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className="text-xs font-black truncate"
                                            style={{ color: isActive ? t.accent : "#a3a3a3" }}
                                        >
                                            {m.nome}
                                        </span>
                                        <span className="text-[9px] text-neutral-600 truncate">{t.label}</span>
                                    </div>

                                    {isMine && (
                                        <div
                                            className="absolute right-2 top-2 w-4 h-4 rounded-full flex items-center justify-center"
                                            style={{ background: t.accent }}
                                        >
                                            <Check size={9} className="text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selected && (
                        <div className="flex-1 flex flex-col gap-6">

                            <div
                                className="relative rounded-3xl border overflow-hidden flex gap-0"
                                style={{
                                    borderColor: theme.accent + "33",
                                    background: `linear-gradient(135deg, #0a0a0a 0%, #111 60%, ${theme.accent}0a 100%)`,
                                    boxShadow: `0 0 60px -20px ${theme.accent}30`,
                                    minHeight: 420,
                                }}
                            >
                                <button
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-600 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>

                                <div
                                    className="relative flex-shrink-0 flex items-end justify-center overflow-hidden"
                                    style={{ width: 300 }}
                                >
                                    <div
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
                                        style={{ background: theme.accent }}
                                    />
                                    <img
                                        key={selected.id}
                                        src={getImageUrl(selected.imagem)}
                                        alt={selected.nome}
                                        className="relative z-10 h-full max-h-96 mb-3 rounded-3xl w-auto object-contain object-bottom select-none"
                                        style={{
                                            opacity: transitioning ? 0 : 1,
                                            transform: transitioning ? "translateY(12px) scale(0.97)" : "translateY(0) scale(1)",
                                            transition: "opacity 0.18s ease, transform 0.18s ease",
                                            filter: `drop-shadow(0 8px 32px ${theme.accent}55)`,
                                        }}
                                        draggable={false}
                                    />
                                </div>

                                <div
                                    className="flex flex-col justify-center px-8 py-10 flex-1"
                                    style={{
                                        opacity: transitioning ? 0 : 1,
                                        transform: transitioning ? "translateX(8px)" : "translateX(0)",
                                        transition: "opacity 0.18s ease, transform 0.18s ease",
                                    }}
                                >
                                    <span
                                        className="text-[10px] font-black uppercase tracking-widest mb-3 inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full border"
                                        style={{
                                            color: theme.accent,
                                            borderColor: theme.accent + "44",
                                            background: theme.accent + "15",
                                        }}
                                    >
                                        <Sparkles size={10} />
                                        {theme.label}
                                    </span>

                                    <h2
                                        className="font-black text-5xl tracking-tight uppercase mb-4 leading-none"
                                        style={{
                                            background: `linear-gradient(135deg, #fff 30%, ${theme.accent} 100%)`,
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        {selected.nome}
                                    </h2>

                                    <div
                                        className="w-12 h-0.5 mb-5 rounded-full"
                                        style={{ background: `linear-gradient(to right, ${theme.accent}, transparent)` }}
                                    />

                                    <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                                        {selected.descricao}
                                    </p>

                                    {isCurrentMentor && (
                                        <div
                                            className="mt-6 flex items-center gap-2 px-3 py-2 rounded-xl border w-fit"
                                            style={{
                                                borderColor: theme.accent + "44",
                                                background: theme.accent + "15",
                                                color: theme.accent,
                                            }}
                                        >
                                            <Shield size={13} />
                                            <span className="text-xs font-bold">O teu mentor atual</span>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-4  left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {mentores.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => selectMentor(m)}
                                            className="rounded-full transition-all duration-300"
                                            style={{
                                                width: m.id === selected.id ? 16 : 5,
                                                height: 5,
                                                background: m.id === selected.id ? theme.accent : "#3a3a3a",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleEscolher}
                                    disabled={saving || isCurrentMentor}
                                    className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{
                                        background: isCurrentMentor
                                            ? "#1a1a1a"
                                            : `linear-gradient(135deg, ${theme.accent} 0%, ${theme.via ?? theme.accent} 100%)`,
                                        color: isCurrentMentor ? "#525252" : "#000",
                                        boxShadow: !isCurrentMentor ? `0 0 20px -4px ${theme.accent}66` : "none",
                                    }}
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : isCurrentMentor ? (
                                        <><Shield size={15} /> Mentor ativo</>
                                    ) : hasMentor ? (
                                        <><RefreshCw size={15} /> Trocar para {selected.nome}</>
                                    ) : (
                                        <><Swords size={15} /> Escolher {selected.nome}</>
                                    )}
                                </button>

                                {successMsg && (
                                    <div
                                        className="px-4 py-3.5 rounded-2xl border flex items-center gap-2 text-sm font-bold animate-pulse"
                                        style={{
                                            borderColor: theme.accent + "44",
                                            background: theme.accent + "15",
                                            color: theme.accent,
                                        }}
                                    >
                                        <Check size={15} />
                                        {successMsg}
                                    </div>
                                )}
                            </div>

                            {hasMentor && !isCurrentMentor && (
                                <p className="text-neutral-600 text-[11px] text-center -mt-2">
                                    Ao trocar, perdes o vínculo com <span className="text-neutral-400 font-bold">{mentorAtual.nome}</span> e passas a ser guiado por <span style={{ color: theme.accent }} className="font-bold">{selected.nome}</span>.
                                </p>
                            )}
                        </div>
                    )}
                </div>

            </div>
            </main>
        </div>
    );
}