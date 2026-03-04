import { useState } from "react";
import logo from '../../Assets/logo.png';
import { Home, Clock, Users, MessageSquare, Search, Settings, Star, Flame, Coins } from "lucide-react";

export default function DashBoardHeader() {
    const [activeNav, setActiveNav] = useState("home");
    const [searchFocused, setSearchFocused] = useState(false);

    const navItems = [
        { id: "home", icon: <Home size={20} />, label: "Home" },
        { id: "recent", icon: <Clock size={20} />, label: "Recent" },
        { id: "friends", icon: <Users size={20} />, label: "Friends" },
        { id: "messages", icon: <MessageSquare size={20} />, label: "Messages" },
    ];

    return (
        <>
            <style>{`
                @keyframes statPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 6px rgba(6,182,212,0.4); }
                    50% { box-shadow: 0 0 14px rgba(6,182,212,0.9); }
                }
                .stat-pill {
                    transition: all 0.2s ease;
                    animation: fadeSlideIn 0.4s ease both;
                }
                .stat-pill:hover {
                    animation: statPop 0.3s ease;
                    background: rgba(6,182,212,0.12) !important;
                    border-color: rgba(6,182,212,0.35) !important;
                    transform: translateY(-1px);
                }
                .stat-pill:hover span {
                    color: #67e8f9 !important;
                }
                .active-dot {
                    animation: glow-pulse 1.8s ease-in-out infinite;
                }
                .search-bar {
                    transition: all 0.25s ease;
                }
                .search-bar:focus-within {
                    transform: scaleX(1.01);
                }
            `}</style>

            <header
                className="fixed top-0 left-0 w-full h-20 flex items-center gap-4 px-6 py-4"
                style={{
                    background: "rgba(15, 17, 21, 0.97)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 4px 32px rgba(0,0,0,0.5)"
                }}
            >
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <img
                        src={logo}
                        alt="CodeQuest POO Logo"
                        className="h-14 w-auto hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Nav */}
                <nav className="flex items-center gap-2 ml-40">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            title={item.label}
                            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                            style={{
                                color: activeNav === item.id ? "#06b6d4" : "rgba(255,255,255,0.4)",
                                background: activeNav === item.id ? "rgba(6,182,212,0.12)" : "transparent",
                                animation: activeNav === item.id ? "glow-pulse 1.8s ease-in-out infinite" : "none",
                                
                            }}
                            onMouseEnter={(e) => {
                                if (activeNav !== item.id) {
                                    e.currentTarget.style.color = "#0891b2";
                                    e.currentTarget.style.background = "rgba(8,145,178,0.12)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeNav !== item.id) {
                                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            {item.icon}
                            {activeNav === item.id && (
                                <span
                                    className="active-dot absolute bottom-0.5 left-1/2 w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: "#06b6d4",
                                        transform: "translateX(-50%)",
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="w-px h-8 mx-3 bg-white/10" />

                {/* Stats — rounded-full pills */}
                <div className="flex items-center gap-2">
                    <Stat icon={<Clock size={14} color="#06b6d4" />} value="1284 H" delay="0ms" />
                    <Stat icon={<Star size={14} color="#facc15" />} value="23245 XP" delay="60ms" />
                    <Stat icon={<Coins size={14} color="#a78bfa" />} value="23245" delay="120ms" />
                    <Stat icon={<Flame size={14} color="#f97316" />} value="3" delay="180ms" />
                </div>

                {/* Right group — search + settings + avatar pushed to far right */}
                <div className="ml-auto flex items-center gap-3">

                    {/* Search */}
                    <div className="w-52">
                        <div
                            className="search-bar flex items-center gap-2 px-3 py-2 rounded-full cursor-text"
                            style={{
                                background: searchFocused ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${searchFocused ? "rgba(6,182,212,0.45)" : "rgba(255,255,255,0.08)"}`,
                                boxShadow: searchFocused ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
                            }}
                            onClick={() => document.getElementById("header-search").focus()}
                        >
                            <Search size={14} color={searchFocused ? "#06b6d4" : "rgba(255,255,255,0.3)"} />
                            <input
                                id="header-search"
                                type="text"
                                placeholder="Tap '/' to search"
                                className="bg-transparent outline-none text-xs w-full"
                                style={{ color: "rgba(255,255,255,0.7)", caretColor: "#06b6d4" }}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {!searchFocused && (
                                <kbd
                                    className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                                    style={{
                                        color: "rgba(255,255,255,0.2)",
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        fontFamily: "monospace",
                                        fontSize: "10px",
                                    }}
                                >
                                    /
                                </kbd>
                            )}
                        </div>
                    </div>

                    {/* Settings + Avatar */}
                    <div className="flex items-center gap-4 mr-2">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-cyan-600/10 hover:text-cyan-500 text-white/40">
                            <Settings size={20} />
                        </button>

                        <button
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-200 hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                                border: "2px solid rgba(255,255,255,0.1)",
                                boxShadow: "0 0 14px rgba(6,182,212,0.3)",
                            }}
                        >
                            U
                        </button>
                    </div>
                </div>{/* end ml-auto right group */}
            </header>
        </>
    );
}

function Stat({ icon, value, delay }) {
    return (
        <div
            className="stat-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10"
            style={{
                background: "rgba(255,255,255,0.04)",
                animationDelay: delay,
            }}
        >
            {icon}
            <span className="text-xs font-semibold" style={{ color: "#67e8f9" }}>
                {value}
            </span>
        </div>
    );
}