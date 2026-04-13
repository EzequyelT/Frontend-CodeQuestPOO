import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getProgressoDashboard } from "../../../../Services/users/userStatsService";
import { Settings, House, Undo2, Flame, DollarSign } from "lucide-react";

import ButtonImgBack from "../../../../assets/Buttons/Back.png"
import ButtonImgHouse from "../../../../assets/Buttons/House.png"
import ButtonImgInfo from "../../../../assets/Buttons/Info.png"
import ButtonImgConfig from "../../../../assets/Buttons/Config.png"



const Color = {
    primary: {
        dark: "#0a2a4a",
        main: "#1e5a8e",
        light: "#3b7ab8",
        lighter: "#5a96d8",
        brightest: "#7ab8ff",
    },
    secondary: {
        dark: "#3a2010",
        main: "#8b5e1a",
        light: "#a08060",
        lighter: "#c4a878",
    },
    glow: {
        blue: "rgba(79, 180, 255, 0.6)",
        blueSoft: "rgba(79, 180, 255, 0.3)",
        gold: "rgba(255, 215, 0, 0.6)",
    },
    neutral: {
        bg: "#000",
        darkBg: "#0a0a0a",
        card: "rgba(10, 30, 50, 0.4)",
        border: "rgba(30, 90, 142, 0.3)",
    },
};

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
                width: "70px",
                height: "700px",
                zIndex: 50,
                borderRadius: "30px",
                background: Color.neutral.card,
                borderColor: Color.neutral.border,
                backdropFilter: "blur(5px)",
            }}
        >
            {/* Avatar Button com novo gradiente */}
            <button
                type="button"
                className="w-10 h-10 mb-2 rounded-full flex items-center justify-center font-bold text-white shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                    background: `linear-gradient(135deg, ${Color.primary.light}, ${Color.primary.main})`,
                    border: `2px solid ${Color.primary.lightest}`,
                    boxShadow: `0 0 14px ${Color.glow.blue}, 0 0 28px rgba(30, 90, 142, 0.3)`,
                }}
            >
                U
            </button>

            {/* Coins Badge */}
            <div
                className="text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-xl flex items-center gap-1 transition-all duration-200 hover:scale-105"
                style={{
                    background: `linear-gradient(135deg, ${Color.secondary.main}, ${Color.secondary.light})`,
                    boxShadow: `0 0 10px ${Color.glow.gold}`,
                    border: `1px solid rgba(255, 215, 0, 0.2)`,
                }}
            >
                <DollarSign className="h-4 w-4" />
                {stats.coins}
            </div>

            {/* Streak Badge */}
            <div
                className="text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-xl flex items-center gap-1 transition-all duration-200 hover:scale-105"
                style={{
                    background: `linear-gradient(135deg, ${Color.primary.light}, ${Color.primary.lighter})`,
                    boxShadow: `0 0 12px ${Color.glow.blue}`,
                    border: `1px solid rgba(122, 184, 255, 0.3)`,
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
                    background: Color.neutral.border,
                }}
            />

            {/* Settings Button */}
            <SidebarButton onClick={() => { }}>
                <img src={ButtonImgConfig} size={18}  />
            </SidebarButton>

              <SidebarButton onClick={() => { }}>
                <img src={ButtonImgInfo} size={18}  />
            </SidebarButton>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Voltar / Undo Button */}
            <SidebarButton onClick={() => navigate(-1)}>
                <img src={ButtonImgBack} size={18}  />
            </SidebarButton>

            {/* Home Button */}
            <SidebarButton onClick={() => navigate("/dashboard")}>
                <img src={ButtonImgHouse} size={18}  />
            </SidebarButton>
        </aside>
    );
}

function SidebarButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-11 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
                backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${Color.primary.dark}, rgba(122, 184, 255, 0.1))`;
                e.currentTarget.style.boxShadow = `0 0 12px ${Color.glow.blueSoft}`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = Color.neutral.card;
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {children}
        </button>
    );
}