import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";

const CATEGORIES = [
    { id: "all", label: "Todas", count: 998, icon: "◎" },
    { id: "progress", label: "Progresso", count: 156, icon: "⏱" },
    { id: "perf", label: "Perfeição", count: 312, icon: "☆" },
    { id: "streak", label: "Streak", count: 98, icon: "∞" },
    { id: "special", label: "Especial", count: 95, icon: "✦" },
];

const ACHIEVEMENTS = [
    { id: 1, title: "Primeira Vitória", desc: "Complete as tarefas do dia", icon: "🏆", xp: 100, pct: 100, done: 1, total: 1, color: "#facc15", cat: "progress", done_: true },
    { id: 2, title: "Início Dedicado", desc: "Complete 10 desafios", icon: "🎯", xp: 400, pct: 77, done: 7, total: 10, color: "#a855f7", cat: "progress", done_: false },
    { id: 3, title: "Lenda Viva", desc: "Complete 10% de Lendas da Vida", icon: "👑", xp: 600, pct: 55, done: 5, total: 10, color: "#facc15", cat: "special", done_: false },
    { id: 4, title: "Mestre dos Desafios", desc: "Complete 80 desafios", icon: "💧", xp: 200, pct: 54, done: 49, total: 90, color: "#22d3ee", cat: "progress", done_: false },
    { id: 5, title: "Zona Brava", desc: "Complete 15 desafios", icon: "⭐", xp: 579, pct: 20, done: 3, total: 15, color: "#22d3ee", cat: "special", done_: false },
    { id: 6, title: "Perfeccionista", desc: "Complete desafios sem falhas", icon: "⭐", xp: 300, pct: 100, done: 10, total: 10, color: "#ec4899", cat: "perf", done_: true },
    { id: 7, title: "Código Impecável", desc: "Complete 10 desafios", icon: "💎", xp: 250, pct: 75, done: 7, total: 10, color: "#a855f7", cat: "perf", done_: false },
    { id: 8, title: "Streak 3 dias", desc: "Complete 3 dias consecutivos", icon: "🔥", xp: 150, pct: 100, done: 5, total: 5, color: "#f97316", cat: "streak", done_: true },
    { id: 9, title: "Streak 30 dias", desc: "Iniciado", icon: "💧", xp: 500, pct: 100, done: 30, total: 30, color: "#22d3ee", cat: "streak", done_: true },
    { id: 10, title: "Maratonista", desc: "Complete maratonas de código", icon: "🏃", xp: 300, pct: 30, done: 3, total: 10, color: "#6366f1", cat: "progress", done_: false },
    { id: 11, title: "Programador Persistente", desc: "Complete 50 desafios", icon: "💪", xp: 400, pct: 68, done: 34, total: 50, color: "#facc15", cat: "progress", done_: false },
    { id: 12, title: "Mestre da Floresta", desc: "Complete 70% da Floresta", icon: "🌿", xp: 100000, pct: 100, done: 10, total: 10, color: "#22c55e", cat: "special", done_: true },
    { id: 13, title: "Streak 7 dias", desc: "Complete 7 dias consecutivos", icon: "🔥", xp: 200, pct: 57, done: 3, total: 5, color: "#f97316", cat: "streak", done_: false },
    { id: 14, title: "Boss Hunter", desc: "Derrote chefes do jogo", icon: "⚔️", xp: 450, pct: 10, done: 1, total: 10, color: "#ef4444", cat: "special", done_: false },
];



// SVG hexagon drawn with real polygon
function HexBorder({ color, completed, w, h }) {
    const pts = [
        [w * 0.25, 0], [w * 0.75, 0], [w, h * 0.5], [w * 0.75, h], [w * 0.25, h], [0, h * 0.5]
    ].map(p => p.join(",")).join(" ");
    const id = `g${color.replace("#", "")}`;
    return (
        <svg width={w} height={h} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {/* glow blur behind */}
            <polygon points={pts} fill="none" stroke={color} strokeWidth="10" style={{ opacity: 0.25, filter: `blur(8px)` }} />
            {/* fill */}
            <polygon points={pts} fill={completed ? `${color}18` : "#04040f"} />
            {/* border */}
            <polygon points={pts} fill="none" stroke={color} strokeWidth="2.5" filter={`url(#${id})`} />
        </svg>
    );
}

function HexCard({ a, onClick }) {
    const W = 190, H = Math.round(190 * 0.866);
    const [hov, setHov] = useState(false);
    const Navigate = useNavigate();

    return (
        <div onClick={() => onClick(a)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            className="relative cursor-pointer flex-shrink-0 transition-transform duration-200"
            style={{ width: W, height: H, transform: hov ? "scale(1.05)" : "scale(1)" }}>
            <HexBorder color={a.color} completed={a.done_} w={W} h={H} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 z-10" style={{ padding: "12px 20px" }}>
                <span className="text-[28px] leading-none">{a.icon}</span>
                <span className="text-white font-bold text-[11px] text-center leading-snug mt-1">{a.title}</span>
                <span className="text-white/40 text-[9px] text-center leading-tight">{a.desc}</span>
                <div className="flex items-center gap-0.5 mt-1">
                    <span className="text-[10px] font-bold" style={{ color: a.color }}>✦ {a.xp >= 1000 ? `${a.xp / 1000}K` : a.xp} XP</span>
                </div>
                <div className="w-[70px] h-[5px] rounded-full bg-white/10 overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
                <span className="text-[9px] text-white/35">⬡ {a.done}/{a.total} Concluído</span>
            </div>
            {a.done_ && (
                <div className="absolute top-3 right-8 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-20"
                    style={{ background: a.color, color: "#000" }}>✓</div>
            )}
        </div>
    );
}

function StatBadge({ icon, value, label, color, showBar }) {
    return (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border"
            style={{ background: `${color}0d`, borderColor: `${color}40`, boxShadow: `0 0 18px ${color}25`, minWidth: 130 }}>
            <span className="text-xl">{icon}</span>
            <div>
                <div className="text-white font-black text-xl leading-tight">{value}</div>
                <div className="text-[11px] font-semibold" style={{ color }}>{label}</div>
                {showBar && (
                    <div className="w-16 h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "68%", background: color }} />
                    </div>
                )}
            </div>
        </div>
    );
}

function Modal({ a, onClose }) {
    if (!a) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="relative w-96 rounded-3xl p-8 border" onClick={e => e.stopPropagation()}
                style={{ background: "linear-gradient(145deg,#0d0d22,#1a1a3a)", borderColor: a.color, boxShadow: `0 0 60px ${a.color}55,0 0 120px ${a.color}22` }}>
                <button onClick={onClose} className="absolute top-4 right-5 text-white/30 hover:text-white text-3xl leading-none">×</button>
                <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl">{a.icon}</div>
                    <h2 className="text-white text-2xl font-black text-center">{a.title}</h2>
                    <p className="text-white/45 text-sm text-center">{a.desc}</p>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${a.pct}%`, background: a.color }} />
                    </div>
                    <div className="flex justify-between w-full text-xs text-white/35">
                        <span>{a.done}/{a.total} concluídos</span><span>{a.pct}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 text-xl">✦</span>
                        <span className="text-white font-black text-xl">+{a.xp.toLocaleString()} XP</span>
                    </div>
                    <span className="px-5 py-2 rounded-full text-sm font-bold mt-1"
                        style={{ background: `${a.color}22`, color: a.color, border: `1.5px solid ${a.color}66` }}>
                        {a.done_ ? "✓ Conquistado!" : "Em progresso..."}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Trophies() {
    const [cat, setCat] = useState("all");
    const [sel, setSel] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("cq_user");

        if (!storedUser) {
            setErro("Utilizador não autenticado");
            setLoading(false);
            console.error("[Trophies] Sem utilizador no localStorage");
            return;
        }

        const userData = JSON.parse(storedUser);
        console.log("[Trophies] User data:", userData);
        setUser(userData);
        setLoading(false);
    }, []);

    const list = cat === "all" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === cat);
    const rows = [];
    for (let i = 0; i < list.length; i += 3) rows.push(list.slice(i, i + 3));

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-400">{erro}</div>
            </div>
        );
    }

    return (

        <>
           <DashBoardHeader user={user} />

            <div className="min-h-screen w-full pt-20" style={{ background: "#030310", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
                {/* dot grid */}
                <div className="fixed inset-0 pointer-events-none z-0"
                    style={{ backgroundImage: "radial-gradient(circle,#ffffff07 1px,transparent 1px)", backgroundSize: "38px 38px" }} />

                {/* HEADER */}
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 py-4 gap-4 border-b border-white/5">
                    <div>
                        <h1 className="font-black text-3xl leading-tight"
                            style={{ background: "linear-gradient(90deg,#f0abfc,#a78bfa,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            — Trofeus &amp; Conquistas
                        </h1>
                        <p className="text-white/35 text-sm">Mostre suas conquistas e aprimore este Veículo</p>
                    </div>


                </div>

                {/* BODY */}
                <div className="relative z-10 flex flex-col lg:flex-row gap-4 p-4">

                    {/* SIDEBAR */}
                    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
                        {/* categories */}
                        <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: "#07071a" }}>
                            {CATEGORIES.map(c => (
                                <button key={c.id} onClick={() => setCat(c.id)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 transition-all duration-150 hover:bg-white/4"
                                    style={{
                                        background: cat === c.id ? "linear-gradient(90deg,#0e4f6e30,#06b6d410)" : "transparent",
                                        borderLeft: cat === c.id ? "3px solid #06b6d4" : "3px solid transparent",
                                    }}>
                                    <div className="flex items-center gap-2.5">
                                        <span style={{ color: cat === c.id ? "#06b6d4" : "#ffffff44" }}>{c.icon}</span>
                                        <span className="text-sm font-medium" style={{ color: cat === c.id ? "#06b6d4" : "#ffffffaa" }}>{c.label}</span>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: cat === c.id ? "#06b6d420" : "#ffffff0d", color: cat === c.id ? "#06b6d4" : "#ffffff44" }}>
                                        {c.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* recentes */}
                        <div className="rounded-2xl p-4 border border-cyan-500/15" style={{ background: "#07071a" }}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-cyan-400 text-sm">ⓘ</span>
                                <span className="text-white/50 text-sm font-medium">Recentes</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {ACHIEVEMENTS.slice(0, 4).map((a, i) => (
                                    <div key={i} onClick={() => setSel(a)}
                                        className="rounded-xl p-2.5 cursor-pointer hover:bg-white/5 transition border border-white/5"
                                        style={{ background: "#ffffff06" }}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-base">{a.icon}</span>
                                            <span className="text-white text-[10px] font-semibold leading-tight line-clamp-1">{a.title}</span>
                                        </div>
                                        <div className="text-[9px] text-white/30 mb-1.5">{a.done_ ? "Concluído" : "Inacabado"}</div>
                                        <div className="h-[4px] rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                                        </div>
                                        <div className="text-[9px] mt-1 font-bold" style={{ color: a.color }}>✦ {a.pct}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* HEXAGON GRID */}
                    <div className="flex-1 overflow-auto pb-6 ml-50">
                        <div style={{ paddingLeft: 5, paddingTop: 5, minWidth: 600 }}>
                            {rows.map((row, ri) => (
                                <div key={ri} className="flex"
                                    style={{
                                        marginTop: ri === 0 ? 0 : -46,
                                        marginLeft: ri % 2 === 1 ? 97 : 0,
                                        gap: 150,
                                    }}>
                                    {row.map(a => <HexCard key={a.id} a={a} onClick={setSel} />)}
                                </div>
                            ))}
                            {list.length === 0 && (
                                <div className="flex items-center justify-center h-48 text-white/25 text-sm">
                                    Nenhuma conquista nesta categoria.
                                    <button className="ml-2 text-blue-500 hover:text-blue-400" onClick={() => navigate("/Maps")}>
                                        começe essa jornada agora!
                                    </button>
                                </div>
                                
                            )}
                        </div>
                    </div>

                </div>
                <div className="absolute flex right-0 flex-wrap gap-4" style={{ background: "#030310" }}>
                    <StatBadge icon="🏆" value="45" label="Total de Troféus" color="#a78bfa" />
                    <StatBadge icon="🟢" value="22" label="Conquistas" color="#4ade80" />
                    <StatBadge icon="📊" value="68%" label="Progresso" color="#a78bfa" showBar />
                    <StatBadge icon="🪙" value="3120" label="XP Total" color="#facc15" />
                </div>
                <Modal a={sel} onClose={() => setSel(null)} />
            </div>
        </>

    );
}