import { useEffect, useState } from "react";
import { getProgressoDashboard } from "../../services/UserService/progressoService";
import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import { ArrowLeft } from "lucide-react";

export default function Perfil({ user }) {
    const [stats, setStats] = useState({
        tempo_total_jogo: 0,
        xp_total: 0,
        streak: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("cq_token");
                if (!token) return;

                const data = await getProgressoDashboard(token);
                setStats(data);
            } catch (err) {
                console.error("Erro ao carregar stats:", err);

                setStats({
                    tempo_total_jogo: 0,
                    xp_total: 0,
                    streak: 0,
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-4">
            <DashBoardHeader />
            <SideBar />

            <div>
                {/* Em cima do container do Perfil */}
                <h1 className="text-white">Perfil</h1>
                <button className="text-white rounded-4xl">
                    <ArrowLeft />
                </button>
            </div>

            <div>
                {/* Header do container do Perfil */}
                <div>
                    {user?.avatar_id ? (
                        <img
                            src={user.avatar_id}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover"
                            style={{
                                border: "2px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 0 14px rgba(6,182,212,0.3)",
                            }}
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, #06b6d4, #0891b2)",
                                border: "2px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 0 14px rgba(6,182,212,0.3)",
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                    )}
                    <h1>membro desde {user?.data_registo ? new Date(user.data_registo).toLocaleDateString() : "Data não disponível"}</h1>
                    <button>Configurações</button>
                </div>
                 
                 {/* Corpo do container do Perfil */}
                <div>
                    <table>
                       
                        <tbody>

                            <tr>
                                <td>Progresso</td>
                                <td>{stats.tempo_total_jogo} minutos</td>
                                <td>{stats.xp_total}</td>
                                <td>{stats.streak}</td>
                                <td>{stats.mapaAtual}</td>
                                <td>{stats.nivelAtual}</td>
                                <td>{stats.desafiosConcluidos}</td>
                            </tr>

                            <tr>
                                <td>Desempenho de jogo</td>
                                <td>{stats.acertos}</td>
                                <td>{stats.erros}</td>
                                <td>{stats.ajudas}</td>
                                <td>{stats.tentativas}%</td>
                            </tr>

                            <tr>
                                <td>{stats.errosComuns}</td>
                                <td>{stats.Sugestão}</td>
                            </tr>

                        </tbody>

                    </table>
                </div>
            </div>

            <div>
                {/* Footer do container do Perfil */}
                <h1>Aqui vai ser as conquistas</h1>
            </div>
        </div>
    );
}