import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { getHistoricoSemanal } from "../../Services/users/jogTemService";
import { getMe } from "../../Services/users/userService";
import loadingVideo from "../../assets/Loading/loading.webm";
import {
    BarChart2,
    CalendarDays,
    Clock,
    Star,
    ArrowLeft,
    Layers,
    TrendingUp,
    Flame,
} from "lucide-react";

function formatTempo(minutos = 0) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
}

function formatarPeriodo(inicio, fim) {
    const opts = { day: "2-digit", month: "short", timeZone: "Europe/Lisbon" };
    const i = new Date(inicio).toLocaleDateString("pt-PT", opts);
    const f = new Date(fim).toLocaleDateString("pt-PT", opts);
    return `${i} – ${f}`;
}

function formatarInicioSemana(inicio) {
    return new Date(inicio).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
        timeZone: "Europe/Lisbon",
    });
}

function StatCard({ icon: Icon, label, value, color = "#22c55e" }) {
    return (
        <div
            className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 group"
            style={{ color }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{ background: color + "15", border: `1px solid ${color}33` }}
            >
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="text-neutral-500 font-medium uppercase tracking-wider text-[10px]">{label}</p>
                <p className="text-white font-black text-xl tracking-wide mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function BarChart({ semanas }) {
    const max = Math.max(...semanas.map(s => s.tempo_semana), 1);

    return (
        <div className="flex items-end gap-2 mt-2" style={{ height: "192px" }}>
            {semanas.map((s, i) => {
                const pct = (s.tempo_semana / max) * 100;
                const isBest = s.tempo_semana === max;
                return (
                    <div
                        key={i}
                        className="flex flex-col items-center gap-1 flex-1 justify-end group"
                        style={{ height: "100%" }}
                    >
                        <span className="text-[9px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatTempo(s.tempo_semana)}
                        </span>
                        <div
                            style={{ height: `${Math.max(pct, 3)}%` }}
                            className={`w-full rounded-t-md transition-all duration-700 ${
                                isBest
                                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                    : "bg-yellow-700/50 hover:bg-yellow-600/70"
                            }`}
                        />
                        <span className="text-[9px] text-neutral-600 text-center leading-tight">
                            {formatarInicioSemana(s.semana_inicio)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function WeeksDetail({ semanas }) {
    const max = Math.max(...semanas.map(s => s.tempo_semana), 1);
    const recentes = [...semanas].slice(0, 6);

    return (
        <div className="flex flex-col gap-1">
            {recentes.map((s, i) => {
                const pct = Math.round((s.tempo_semana / max) * 100);
                return (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-neutral-900 last:border-0">
                        <span className="text-neutral-500 text-[10px] w-20 flex-shrink-0">
                            {formatarInicioSemana(s.semana_inicio)}
                        </span>
                        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${pct}%` }}
                                className="h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-green-400 transition-all duration-700"
                            />
                        </div>
                        <span className="text-neutral-400 text-[10px] w-12 text-right flex-shrink-0">
                            {formatTempo(s.tempo_semana)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-20 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl mt-4">
            <p className="text-neutral-600 font-bold uppercase tracking-widest text-sm">Ainda sem histórico semanal registado.</p>
            <p className="text-neutral-500 text-xs mt-1">Começa a jogar para ver os teus dados aqui!</p>
        </div>
    );
}

export default function HistoricoSemanal() {
    const [historico, setHistorico] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getMe();
                setUser(data);
            } catch (err) {
                console.error("Erro ao buscar utilizador:", err);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchHistorico() {
            try {
                const data = await getHistoricoSemanal();
                const ordenado = (data ?? []).sort(
                    (a, b) => new Date(a.semana_inicio) - new Date(b.semana_inicio)
                );
                setHistorico(ordenado);
            } catch (err) {
                console.error("Erro ao buscar histórico semanal:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistorico();
    }, []);

    const totalSemanas = historico.length;
    const melhorSemana = totalSemanas > 0 ? Math.max(...historico.map(s => s.tempo_semana)) : 0;
    const mediaSemanal = totalSemanas > 0
        ? Math.round(historico.reduce((acc, s) => acc + s.tempo_semana, 0) / totalSemanas)
        : 0;
    const totalMinutos = historico.reduce((acc, s) => acc + s.tempo_semana, 0);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden select-none">
                <div className="flex flex-col items-center gap-6 z-10">
                    <div className="relative w-40 h-40 flex items-center justify-center p-2 bg-neutral-950/50 rounded-xl">
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

    return (
        <div className="relative min-h-screen bg-neutral-950 text-neutral-100 antialiased">
            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <main className="ml-20 pt-24 px-8 pb-16">
                <div className="w-full max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 font-bold rounded-2xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-white font-black text-3xl tracking-tight uppercase">
                                Histórico Semanal
                            </h1>
                            <p className="text-neutral-500 text-xs mt-0.5">
                                Jogador: <span className="text-neutral-300 font-bold">{user?.nome}</span> · Evolução ao longo das semanas
                            </p>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard icon={CalendarDays} label="Total de semanas" value={`${totalSemanas} semanas`} color="#3b82f6" />
                        <StatCard icon={Star}         label="Melhor semana"    value={formatTempo(melhorSemana)}  color="#22c55e" />
                        <StatCard icon={TrendingUp}   label="Média semanal"    value={formatTempo(mediaSemanal)}  color="#f59e0b" />
                        <StatCard icon={Flame}        label="Tempo total"      value={formatTempo(totalMinutos)}  color="#a855f7" />
                    </div>

                    {historico.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="flex gap-4">

                            {/* Left column */}
                            <div className="flex flex-col gap-4 flex-1 min-w-0">

                                {/* Bar chart */}
                                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white text-sm font-bold flex items-center gap-2">
                                            <BarChart2 size={15} className="text-yellow-500" />
                                            Tempo de estudo por semana
                                        </h3>
                                        <span className="text-neutral-600 text-[10px] border border-neutral-800 rounded px-2 py-0.5 flex items-center gap-1">
                                            <Clock size={10} />
                                            minutos
                                        </span>
                                    </div>
                                    <p className="text-neutral-600 text-[10px] mb-4">
                                        A barra verde destaca a tua melhor semana
                                    </p>
                                    <BarChart semanas={historico} />
                                </div>

                                {/* Table */}
                                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                                    <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                                        <CalendarDays size={15} className="text-yellow-500" />
                                        Detalhe por semana
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-neutral-800">
                                                    <th className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] text-left pb-2">Período</th>
                                                    <th className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] text-right pb-2">Tempo</th>
                                                    <th className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] text-right pb-2">vs. média</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...historico].reverse().map((s, i) => {
                                                    const diff = s.tempo_semana - mediaSemanal;
                                                    const isBest = s.tempo_semana === melhorSemana;
                                                    return (
                                                        <tr key={i} className="border-b border-neutral-900 hover:bg-neutral-800/20 transition-colors">
                                                            <td className="py-3 text-neutral-300">
                                                                {formatarPeriodo(s.semana_inicio, s.semana_fim)}
                                                                {isBest && (
                                                                    <span className="ml-2 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded px-1.5 py-0.5 inline-flex items-center gap-0.5">
                                                                        <Star size={8} />
                                                                        melhor
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 text-white font-black text-right">
                                                                {formatTempo(s.tempo_semana)}
                                                            </td>
                                                            <td className={`py-3 text-right font-bold ${diff >= 0 ? "text-green-500" : "text-red-400"}`}>
                                                                {diff >= 0 ? "+" : ""}{formatTempo(Math.abs(diff))}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right sidebar */}
                            <div className="flex flex-col gap-4 w-64 flex-shrink-0">
                                <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4">
                                    <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                                        <Layers size={14} className="text-yellow-500" />
                                        Últimas semanas
                                    </h3>
                                    <WeeksDetail semanas={[...historico].reverse()} />
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}