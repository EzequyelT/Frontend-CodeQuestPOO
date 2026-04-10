import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getProgressoDashboard } from "../../../../Services/users/userStatsService";
import { Settings, House, Undo2, Flame, DollarSign } from "lucide-react";

export default function LeftSideBar() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        coins: 0,
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
                    coins: 0,
                    streak: 0,
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <aside
            className="fixed top-0 mt-6 flex flex-col items-center gap-3 left-38 py-5 px-2"
            style={{
                width: "70",
                height: "700px",
                zIndex: 50,
                borderRadius: "30px",
                background: "linear-gradient(180deg, #2d1654 0%, #1e0f3d 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
        >
            {/* Avatar */}
            <button
                type="button"
                className="w-10 h-10 mb-2 rounded-full flex items-center justify-center font-bold text-white shrink-0 transition-all duration-200 hover:scale-105"
                style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    border: "2px solid #a78bfa",
                    boxShadow: "0 0 14px rgba(124,58,237,0.4)",
                }}
            >
                U
            </button>

            {/* XP Badge */}
            <div
                className="text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-xl flex items-center gap-1"
                style={{
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                    boxShadow: "0 0 10px rgba(147,51,234,0.4)",
                }}
            >
                <DollarSign className="h-4 w-4" /> 
                {stats.coins}
            </div>

            <div
                className="text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-xl flex items-center gap-1"
                style={{
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                    boxShadow: "0 0 10px rgba(147,51,234,0.4)",
                }}
            >
                <Flame className="h-4 w-4" />
                {stats.streak}
            </div>

            {/* Divider */}
            <div
                className="w-8 shrink-0"
                style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.1)",
                }}
            />

            {/* Settings */}
            <SidebarButton onClick={() => { }}>
                <Settings size={18} color="#f59e0b" />
            </SidebarButton>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Voltar / Undo */}
            <SidebarButton onClick={() => navigate(-1)}>
                <Undo2 size={18} color="#f59e0b" />
            </SidebarButton>

            {/* Home */}
            <SidebarButton onClick={() => navigate("/dashboard")}>
                <House size={18} color="#f59e0b" />
            </SidebarButton>
        </aside>
    );
}

function SidebarButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 hover:bg-white/10 active:scale-95"
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {children}
        </button>
    );
}