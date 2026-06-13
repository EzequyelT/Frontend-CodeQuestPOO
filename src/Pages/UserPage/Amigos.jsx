import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { useEffect, useState } from "react";
import { getMe } from "../../Services/users/userService";
import {
  getAmigos,
  getPedidosAmizade,
  aceitarPedidoAmizade,
  rejeitarPedidoAmizade,
  removerAmigo,
} from "../../Services/users/amizadesService";
import { ArrowLeft, Check, X, Trash2, Wifi, WifiOff, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getInitials(nome = "") {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function Avatar({ nome, avatar }) {
  const imagem = avatar?.caminho_imagem ?? avatar;

  return (
    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden text-xs font-black text-neutral-300">
      {imagem ? (
        <img src={imagem} alt={nome} className="w-full h-full object-cover" />
      ) : (
        getInitials(nome)
      )}
    </div>
  );
}

export default function Amigos() {
  const [user, setUser] = useState(null);
  const [amigos, setAmigos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("amigos");

  const navigate = useNavigate();

  async function carregarDados() {
    try {
      const [me, amigosData, pedidosData] = await Promise.all([
        getMe(),
        getAmigos(),
        getPedidosAmizade(),
      ]);

      setUser(me);
      setAmigos(Array.isArray(amigosData) ? amigosData : []);
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
    } catch (err) {
      console.error("Erro ao carregar amigos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function aceitar(id) {
    try {
      await aceitarPedidoAmizade(id);
      await carregarDados();
    } catch (err) {
      alert(err?.response?.data?.error ?? "Erro ao aceitar pedido");
    }
  }

  async function rejeitar(id) {
    try {
      await rejeitarPedidoAmizade(id);
      await carregarDados();
    } catch (err) {
      alert(err?.response?.data?.error ?? "Erro ao rejeitar pedido");
    }
  }

  async function remover(id) {
    try {
      await removerAmigo(id);
      await carregarDados();
    } catch (err) {
      alert(err?.response?.data?.error ?? "Erro ao remover amigo");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        A carregar amigos...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
      <DashBoardHeader user={user} />
      <SideBar user={user} />

      <main className="ml-20 pt-28 px-6 pb-20 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-neutral-400 bg-neutral-950 border border-neutral-800 hover:border-amber-500 hover:text-amber-400 transition-all"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-3xl font-black uppercase text-white flex items-center gap-3">
                <Users className="text-amber-400" />
                Amigos
              </h1>
              <p className="text-neutral-400 text-sm">
                Vê os teus amigos e pedidos de amizade.
              </p>
            </div>
          </div>

          <div className="flex gap-2 bg-neutral-900/50 border border-neutral-800 p-1.5 rounded-2xl mb-6">
            <button
              onClick={() => setTab("amigos")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase ${
                tab === "amigos"
                  ? "bg-amber-500 text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Amigos ({amigos.length})
            </button>

            <button
              onClick={() => setTab("pedidos")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase ${
                tab === "pedidos"
                  ? "bg-amber-500 text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Pedidos ({pedidos.length})
            </button>
          </div>

          {tab === "amigos" && (
            <div className="space-y-3">
              {amigos.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl text-neutral-500">
                  Ainda não tens amigos.
                </div>
              ) : (
                amigos.map((amigo) => (
                  <div
                    key={amigo.alunoId}
                    className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
                  >
                    <Avatar nome={amigo.nome} avatar={amigo.avatar} />

                    <div className="flex-1">
                      <h3 className="font-black text-white">{amigo.nome}</h3>

                      {amigo.online ? (
                        <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Wifi size={12} /> Online
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-500 font-bold flex items-center gap-1">
                          <WifiOff size={12} /> Offline
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => remover(amigo.alunoId)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-black hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={14} />
                      Remover
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "pedidos" && (
            <div className="space-y-3">
              {pedidos.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl text-neutral-500">
                  Não tens pedidos pendentes.
                </div>
              ) : (
                pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4"
                  >
                    <Avatar
                      nome={pedido.aluno?.nome}
                      avatar={pedido.aluno?.avatar}
                    />

                    <div className="flex-1">
                      <h3 className="font-black text-white">
                        {pedido.aluno?.nome}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Quer adicionar-te como amigo.
                      </p>
                    </div>

                    <button
                      onClick={() => aceitar(pedido.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black hover:bg-emerald-500/20 transition"
                    >
                      <Check size={14} />
                      Aceitar
                    </button>

                    <button
                      onClick={() => rejeitar(pedido.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-black hover:bg-red-500/20 transition"
                    >
                      <X size={14} />
                      Rejeitar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}