import { useState } from "react";
import { Bell, Settings, Map, Trophy, Library, ClipboardCheck } from "lucide-react";
import { sidebarLinks } from "../../config/sideBarLinks";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const [active, setActive] = useState("s1");
    const navigate = useNavigate();

    return (
        <aside
            className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-20 flex flex-col items-center py-4 gap-2"
            style={{
                background: "black",
                borderRight: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            {/* Top server icons */}
            <div className="flex flex-col items-center gap-2 flex-1">
                <Divider />

                {/* Game / server slots */}
                {sidebarLinks.map((server) => {
                    const IconComponent = server.icon;
                    return (
                        <SideButton
                            key={server.id}
                            onClick={() => navigate(server.path)}
                            setActive={setActive}
                            active={active === server.id}
                            tooltip={server.id}
                        >
                            <IconComponent size={18} />
                        </SideButton>
                    );
                })}

            </div>

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-2 pb-2">
                <Divider />
                <SideButton tooltip="Notifications">
                    <Bell size={18} />
                </SideButton>
                <SideButton tooltip="Settings">
                    <Settings size={18} />
                </SideButton>
            </div>
        </aside>
    );
}

function SideButton({ children, onClick, active, tooltip }) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group"
            style={{
                background: active
                    ? "linear-gradient(135deg, #06b6d4, #0891b2)"
                    : "rgba(255,255,255,0.05)",
                boxShadow: active ? "0 0 16px rgba(6,182,212,0.35)" : "none",
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
                border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }
            }}
        >
            {children}

            {/* Active indicator pill on the left */}
            {active && (
                <span
                    className="absolute left-0 rounded-r-full"
                    style={{
                        width: "3px",
                        height: "60%",
                        background: "#06b6d4",
                        boxShadow: "0 0 8px #06b6d4",
                        transform: "translateX(-100%)",
                    }}
                />
            )}
        </button>
    );
}

function Divider() {
    return (
        <div
            className="w-8 my-1"
            style={{
                height: "1px",
                background: "rgba(255,255,255,0.07)",
            }}
        />
    );
}