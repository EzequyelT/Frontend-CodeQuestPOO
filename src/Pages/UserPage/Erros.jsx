import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { useEffect, useState } from "react";
import { getMe } from "../../Services/users/userService";
import { getDesempenhoCodigo } from "../../Services/users/performaceService";
import { useNavigate } from "react-router-dom";
import { exportExcel } from "../../Services/excel/excel"
import {
  ArrowLeft,
  Wand2,
  ChevronRight,
  FileText,
  Loader2
} from "lucide-react";
import loadingVideo from "../../assets/Loading/loading.webm";

const ERRO_COLORS = ["#7c3aed", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4", "#22c55e"];
const PAGE_SIZE = 5;

function formatDate(d) {
  return new Date(d).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function scoreColor(s) {
  if (s >= 70) return "#22c55e";
  if (s >= 40) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score = 0 }) {
  const r = 17;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(score / 100, 1);
  const color = scoreColor(score);
  return (
    <svg viewBox="0 0 44 44" className="w-11 h-11 flex-shrink-0 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#262626" strokeWidth="4" />
      <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} />
      <text x="22" y="27" textAnchor="middle" fontSize="10" fontWeight="600"
        fill={color} className="rotate-90 origin-center"
        transform="rotate(90 22 22)">
        {score}%
      </text>
    </svg>
  );
}

function ErroBadge({ nome }) {
  if (!nome) return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
      Sem erros
    </span>
  );
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
      {nome}
    </span>
  );
}

function FeedbackBadge({ nome }) {
  if (!nome) return null;
  const styles = {
    verificativo: "bg-green-500/10 text-green-400 border-green-500/20",
    explicativo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    estratégico: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const cls = styles[nome] ?? "bg-neutral-800 text-neutral-400 border-neutral-700";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${cls}`}>
      {nome}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
      <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-2xl font-black mt-1 tracking-tight" style={{ color }}>{value}</p>
    </div>
  );
}

function ErrosBars({ erros = [] }) {
  if (!erros.length) return (
    <p className="text-neutral-500 text-sm">Ainda não há dados de erros classificados.</p>
  );
  const max = erros[0].count;
  return (
    <div className="flex flex-col gap-3">
      {erros.map((e, i) => (
        <div key={e.id} className="flex items-center gap-3">
          <span className="text-sm text-neutral-300 w-40 flex-shrink-0">{e.nome}</span>
          <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round((e.count / max) * 100)}%`,
                backgroundColor: ERRO_COLORS[i % ERRO_COLORS.length]
              }}
            />
          </div>
          <span className="text-xs text-neutral-500 w-6 text-right">{e.count}</span>
        </div>
      ))}
    </div>
  );
}

function DesafioCard({ d }) {
  const [open, setOpen] = useState(false);
  const total = (d.respostas_certas ?? 0) + (d.respostas_erradas ?? 0);

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-neutral-800/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">{d.desafio?.nome}</span>
          <span className="text-xs text-neutral-500">
            {d.mapa?.nome} · {d.nivel?.nome} · {formatDate(d.data_execucao)}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ScoreRing score={d.score ?? 0} />
          <ErroBadge nome={d.tipo_erro?.nome} />
          <ChevronRight
            size={16}
            className="text-neutral-600 transition-transform duration-200"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </div>
      </div>

      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-neutral-900 bg-neutral-950/40">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Certas", val: d.respostas_certas ?? 0, color: "#22c55e" },
              { label: "Erradas", val: d.respostas_erradas ?? 0, color: "#ef4444" },
              { label: "Tentativas", val: d.tentativas ?? 0, color: "#f59e0b" },
              { label: "Total resp.", val: total, color: "#94a3b8" },
            ].map(s => (
              <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
                <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-black mt-0.5" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>

          {d.tipo_feedback && (
            <div className="mb-3">
              <FeedbackBadge nome={d.tipo_feedback.nome} />
            </div>
          )}

          {d.feedback_ia ? (
            <div className="border border-neutral-800 border-l-2 border-l-violet-500 rounded-xl px-4 py-3 bg-neutral-900/50">
              <div className="flex items-center gap-1.5 mb-2">
                <Wand2 size={13} className="text-violet-400" />
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                  Eldrin — mentor
                </span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{d.feedback_ia}</p>
            </div>
          ) : (
            <p className="text-xs text-neutral-600">Sem feedback do mentor para este desafio.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-800 disabled:hover:text-neutral-400"
      >
        <ChevronRight size={15} className="rotate-180" />
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all
            ${page === current
              ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40"
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-800 disabled:hover:text-neutral-400"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default function DesempenhoCodigo() {
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      try {
        const [userData, desempenho] = await Promise.all([
          getMe(),
          getDesempenhoCodigo(),
        ]);
        setUser(userData);
        setDados(desempenho);
      } catch (err) {
        console.error("Erro ao carregar desempenho:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [dados]);

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

  const r = dados?.resumo;
  const taxaColor = !r ? "#94a3b8" : r.taxa_acerto >= 70 ? "#22c55e" : r.taxa_acerto >= 40 ? "#f59e0b" : "#ef4444";

  const desafios = dados?.por_desafio ?? [];
  const totalPages = Math.ceil(desafios.length / PAGE_SIZE);
  const paginatedDesafios = desafios.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleExportExcel() {
    try {
      setExportLoading(true);
      await exportExcel();
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
    } finally {
      setExportLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <DashBoardHeader user={user} />
      <SideBar user={user} />

      <main className="ml-20 pt-24 px-8 pb-16 flex justify-center">
        <div className="w-full max-w-5xl">

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-white font-black text-3xl tracking-tight uppercase">
                Desempenho de Código
              </h1>
              <p className="text-neutral-500 text-xs mt-0.5">
                Jogador: <span className="text-neutral-300 font-bold">{user?.nome}</span> · Análise de erros e feedback
              </p>
            </div>
            <button
              onClick={handleExportExcel}
              disabled={exportLoading}
              className={`ml-auto w-44 p-2 gap-2 font-bold rounded-2xl flex justify-center items-center bg-neutral-900 border border-neutral-800 transition-all shadow-md
                ${exportLoading
                  ? "text-neutral-500 cursor-not-allowed opacity-70"
                  : "text-neutral-400 hover:border-neutral-600 hover:text-white hover:scale-105 active:scale-95"
                }
              `}
            >
              {exportLoading ? (
                <>
                  Gerando...
                  <Loader2 className="animate-spin" size={20} />
                </>
              ) : (
                <>
                  Exportar Excel
                  <FileText size={20} />
                </>
              )}
            </button>
          </div>

          {!dados ? (
            <div className="text-center py-20 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl">
              <p className="text-neutral-600 font-bold uppercase tracking-widest text-sm">
                Ainda não há desempenho registado.
              </p>
              <p className="text-neutral-500 text-xs mt-1">
                Completa desafios de código para veres a tua análise aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <StatCard label="Desafios" value={r.total_desafios} color="#3b82f6" />
                <StatCard label="Respostas certas" value={r.total_certas} color="#22c55e" />
                <StatCard label="Respostas erradas" value={r.total_erradas} color="#ef4444" />
                <StatCard label="Taxa de acerto" value={`${r.taxa_acerto}%`} color={taxaColor} />
              </div>

              <div className="mb-8">
                <h2 className="text-neutral-400 font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-neutral-900">
                  Erros por categoria
                </h2>
                <ErrosBars erros={r.erros_por_tipo ?? []} />
              </div>

              <div>
                <h2 className="text-neutral-400 font-bold text-xs uppercase tracking-widest mb-4 pb-2 border-b border-neutral-900">
                  Desempenho por desafio
                </h2>
                <div className="flex flex-col gap-3">
                  {paginatedDesafios.map(d => (
                    <DesafioCard key={d.desempenho_id} d={d} />
                  ))}
                </div>
                <Pagination current={page} total={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}