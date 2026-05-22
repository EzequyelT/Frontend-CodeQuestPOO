import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import mago from "../../assets/DashBoard/mago.png";
import { getHistoricoSemanal } from "../../Services/users/jogTemService";
import { getMe } from "../../Services/users/userService";

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

function StatCard({ label, value, sub }) {
    return (
        <div className="bg-[#151414] border border-gray-800 rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-gray-500 text-[11px]">{label}</p>
            <p className="text-white font-bold text-2xl">
                {value}
                {sub && <span className="text-green-500 text-xs ml-1">{sub}</span>}
            </p>
        </div>
    );
}

function BarChart({ semanas }) {
    const max = Math.max(...semanas.map(s => s.tempo_semana), 1);

    return (
        <div className="flex items-end gap-2 h-48 mt-2">
            {semanas.map((s, i) => {
                const pct = (s.tempo_semana / max) * 100;
                const isBest = s.tempo_semana === max;
                return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                        <span className="text-[9px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatTempo(s.tempo_semana)}
                        </span>
                        <div
                            style={{ height: `${Math.max(pct, 3)}%` }}
                            className={`w-full rounded-t-md transition-all duration-700 ${isBest
                                    ? "bg-green-500"
                                    : "bg-yellow-700/60 hover:bg-yellow-600/80"
                                }`}
                        />
                        <span className="text-[9px] text-gray-600 text-center leading-tight">
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
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-gray-900 last:border-0">
                        <span className="text-gray-500 text-[10px] w-20 flex-shrink-0">
                            {formatarInicioSemana(s.semana_inicio)}
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${pct}%` }}
                                className="h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-green-400 transition-all duration-700"
                            />
                        </div>
                        <span className="text-gray-400 text-[10px] w-12 text-right flex-shrink-0">
                            {formatTempo(s.tempo_semana)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function MagoCard({ user }) {
    return (
        <div className="bg-[#151414] border border-gray-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-end min-h-[220px]">
            <img
                src={mago}
                alt="heroi"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
                style={{
                    maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                }}
            />
            <div className="relative z-10 text-center pb-4 px-4">
                <p className="text-yellow-400 font-bold text-sm">{user?.nome ?? "Jogador"}</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Ver histórico completo</p>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 text-sm">Ainda sem histórico semanal registado.</p>
            <p className="text-gray-600 text-xs mt-1">Começa a jogar para ver os teus dados aqui!</p>
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
            <div className="relative min-h-screen bg-black animate-fadeIn flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
                    <p>A carregar histórico...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black animate-fadeIn">
            <DashBoardHeader user={user} />
            <SideBar user={user} />

            <main className="ml-20 p-6 pt-24">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-white font-bold text-2xl">Histórico Semanal</h1>
                        <p className="text-gray-500 text-xs mt-1">
                            Acompanha a tua evolução ao longo das semanas, {user?.nome ?? ""}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xs text-gray-400 border border-gray-700 rounded-lg px-4 py-2 hover:border-yellow-600 hover:text-yellow-500 transition-colors"
                    >
                        ← Voltar ao dashboard
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                    <StatCard label="Total de semanas" value={`${totalSemanas}`} sub="semanas" />
                    <StatCard label="Melhor semana" value={formatTempo(melhorSemana)} />
                    <StatCard label="Média semanal" value={formatTempo(mediaSemanal)} />
                    <StatCard label="Tempo total" value={formatTempo(totalMinutos)} />
                </div>

                {historico.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="flex gap-4">

                        <div className="flex flex-col gap-4 flex-1">
                            <div className="bg-[#151414] border border-gray-800 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-white text-sm font-semibold">
                                        📊 Tempo de estudo por semana
                                    </h3>
                                    <span className="text-gray-600 text-[10px] border border-gray-800 rounded px-2 py-0.5">
                                        minutos
                                    </span>
                                </div>
                                <p className="text-gray-600 text-[10px] mb-4">
                                    A barra verde destaca a tua melhor semana
                                </p>
                                <BarChart semanas={historico} />
                            </div>

                            <div className="bg-[#151414] border border-gray-800 rounded-2xl p-5">
                                <h3 className="text-white text-sm font-semibold mb-4">
                                    🗓️ Detalhe por semana
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="text-gray-500 font-normal text-left pb-2">Período</th>
                                                <th className="text-gray-500 font-normal text-right pb-2">Tempo</th>
                                                <th className="text-gray-500 font-normal text-right pb-2">vs. média</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...historico].reverse().map((s, i) => {
                                                const diff = s.tempo_semana - mediaSemanal;
                                                const isBest = s.tempo_semana === melhorSemana;
                                                return (
                                                    <tr key={i} className="border-b border-gray-900 hover:bg-gray-800/20 transition-colors">
                                                        <td className="py-2.5 text-gray-300">
                                                            {formatarPeriodo(s.semana_inicio, s.semana_fim)}
                                                            {isBest && (
                                                                <span className="ml-2 text-[9px] bg-green-500/20 text-green-400 rounded px-1.5 py-0.5">
                                                                    melhor
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2.5 text-white font-bold text-right">
                                                            {formatTempo(s.tempo_semana)}
                                                        </td>
                                                        <td className={`py-2.5 text-right font-bold ${diff >= 0 ? "text-green-500" : "text-red-400"}`}>
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

                        <div className="flex flex-col gap-4 w-64 flex-shrink-0">
                            <MagoCard user={user} />

                            <div className="bg-[#151414] border border-gray-800 rounded-2xl p-4">
                                <h3 className="text-white text-sm font-semibold mb-3">
                                    🕒 Últimas semanas
                                </h3>
                                <WeeksDetail semanas={[...historico].reverse()} />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}