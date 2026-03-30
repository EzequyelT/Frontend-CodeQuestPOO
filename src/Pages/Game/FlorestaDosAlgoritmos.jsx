import { useState } from "react";
import { Star, Gem, Trophy, Users, ChevronLeft, Lock, Settings, Volume2 } from "lucide-react";

// ── Replace these with your real imports ──────────────────────────────────────
import map from "../../assets/Maps/Map1.png";
import banner from "../../assets/Maps/Banner.jpg";
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = [
  {
    id: 1,
    name: "Trilha da Iniciação",
    description: "Aprenda os primeiros passos dos algoritmos.",
    x: 18,   // % from left of map container
    y: 72,   // % from top  of map container
    state: "completed", // completed | available | locked
    stars: 3,
    xpReward: 120,
  },
  {
    id: 2,
    name: "Clareira dos Loops",
    description: "Domine estruturas de repetição.",
    x: 35,
    y: 52,
    state: "completed",
    stars: 2,
    xpReward: 150,
  },
  {
    id: 3,
    name: "Gruta das Condicionais",
    description: "Tome decisões com if/else e switch.",
    x: 55,
    y: 38,
    state: "available",
    stars: 0,
    xpReward: 180,
  },
  {
    id: 4,
    name: "Pico dos Recursivos",
    description: "Enfrente funções que chamam a si mesmas.",
    x: 73,
    y: 22,
    state: "locked",
    stars: 0,
    xpReward: 220,
  },
  {
    id: 5,
    name: "Santuário do Mestre",
    description: "O desafio final aguarda os dignos.",
    x: 84,
    y: 10,
    state: "locked",
    stars: 0,
    xpReward: 300,
  },
];

const PLAYER = {
  stars: 5,
  gems: 12,
  xp: 270,
  xpMax: 500,
  level: 3,
};

// ── Star renderer ─────────────────────────────────────────────────────────────
function Stars({ count, max = 3, size = 11 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < count ? "#FFD700" : "none"}
          stroke={i < count ? "#FFD700" : "#555"} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

// ── Single level node ─────────────────────────────────────────────────────────
function LevelNode({ level, onHover, hoveredId }) {
  const isHovered = hoveredId === level.id;

  const stateStyles = {
    completed: {
      border: "3px solid #FFD700",
      background: "radial-gradient(circle at 35% 35%, #4a3800, #1a1400)",
      glow: "0 0 0px #FFD700, 0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.15)",
      numberColor: "#FFD700",
    },
    available: {
      border: "3px solid #4fc3f7",
      background: "radial-gradient(circle at 35% 35%, #0d2a3d, #061520)",
      glow: "0 0 0px #4fc3f7, 0 0 25px rgba(79,195,247,0.6), 0 0 50px rgba(79,195,247,0.25)",
      numberColor: "#4fc3f7",
    },
    locked: {
      border: "3px solid #333",
      background: "radial-gradient(circle at 35% 35%, #1a1a1a, #0a0a0a)",
      glow: "none",
      numberColor: "#444",
    },
  }[level.state];

  const NODE_SIZE = 56;

  return (
    <div
      onMouseEnter={() => onHover(level.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: "absolute",
        left: `${level.x}%`,
        top: `${level.y}%`,
        transform: isHovered && level.state !== "locked"
          ? "translate(-50%, -58%)"
          : "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        cursor: level.state === "locked" ? "not-allowed" : "pointer",
        zIndex: isHovered ? 30 : 10,
        transition: "transform 0.2s ease",
      }}
    >
      {/* Pulse rings for available */}
      {level.state === "available" && (
        <>
          <div style={{
            position: "absolute",
            width: NODE_SIZE + 20, height: NODE_SIZE + 20,
            borderRadius: "50%",
            border: "2px solid rgba(79,195,247,0.4)",
            animation: "pulseRing 2s ease-out infinite",
            top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            width: NODE_SIZE + 36, height: NODE_SIZE + 36,
            borderRadius: "50%",
            border: "2px solid rgba(79,195,247,0.2)",
            animation: "pulseRing 2s ease-out infinite 0.5s",
            top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* Node circle */}
      <div style={{
        width: NODE_SIZE, height: NODE_SIZE,
        borderRadius: "50%",
        border: stateStyles.border,
        background: stateStyles.background,
        boxShadow: isHovered && level.state !== "locked"
          ? stateStyles.glow + ", 0 8px 32px rgba(0,0,0,0.8)"
          : stateStyles.glow,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        transition: "box-shadow 0.3s",
      }}>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontWeight: "900",
          fontSize: 22,
          color: stateStyles.numberColor,
          textShadow: level.state !== "locked" ? `0 0 12px ${stateStyles.numberColor}` : "none",
          lineHeight: 1,
        }}>
          {level.id}
        </span>

        {/* Lock overlay */}
        {level.state === "locked" && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={20} color="#555" />
          </div>
        )}

        {/* Checkmark badge */}
        {level.state === "completed" && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, borderRadius: "50%",
            background: "#FFD700",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 8px rgba(255,215,0,0.8)",
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke="#000" strokeWidth="3.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Stars */}
      <Stars count={level.stars} />

      {/* Tooltip */}
      {isHovered && level.state !== "locked" && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 14px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #1a0e05, #0d0805)",
          border: "1.5px solid #8b5e1a",
          borderRadius: 10,
          padding: "10px 14px",
          width: 195,
          boxShadow: "0 8px 32px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,180,0,0.08)",
          zIndex: 50,
          pointerEvents: "none",
        }}>
          {/* Arrow */}
          <div style={{
            position: "absolute", bottom: -7, left: "50%",
            transform: "translateX(-50%)",
            width: 12, height: 7,
            background: "#8b5e1a",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }} />
          <p style={{
            margin: 0,
            fontFamily: "Georgia, serif", fontWeight: "bold",
            fontSize: 13, color: "#f5c878", marginBottom: 4,
          }}>
            {level.name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#a08060", lineHeight: 1.4 }}>
            {level.description}
          </p>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={11} style={{ fill: "#FFD700", color: "#FFD700" }} />
            <span style={{ fontSize: 11, color: "#f5c878", fontWeight: 600 }}>
              +{level.xpReward} XP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SVG connecting path ───────────────────────────────────────────────────────
function ConnectingPath({ levels }) {
  const pts = levels.map(l => ({ x: l.x, y: l.y }));

  const buildD = (upTo) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < Math.min(upTo, pts.length - 1); i++) {
      const c = pts[i], n = pts[i + 1];
      const cx1 = c.x + (n.x - c.x) * 0.4;
      const cy1 = c.y;
      const cx2 = c.x + (n.x - c.x) * 0.6;
      const cy2 = n.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${n.x} ${n.y}`;
    }
    return d;
  };

  const fullD = buildD(pts.length - 1);
  const litEnd = levels.findIndex(l => l.state === "available");
  const litD = buildD(litEnd >= 0 ? litEnd : levels.filter(l => l.state === "completed").length - 1);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
      {/* Full dim path */}
      <path d={fullD} fill="none" stroke="#1a1008" strokeWidth="0.9" />
      <path d={fullD} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5"
        strokeDasharray="2 2" strokeLinecap="round" />
      {/* Lit golden path */}
      <path d={litD} fill="none" stroke="#6b4010" strokeWidth="0.7" />
      <path d={litD} fill="none" stroke="#FFD700" strokeWidth="0.3" opacity="0.75" />
    </svg>
  );
}

// ── XP bar ────────────────────────────────────────────────────────────────────
function XPBar({ xp, xpMax, level }) {
  const pct = Math.min((xp / xpMax) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "2px solid #8b5e1a",
        background: "radial-gradient(circle at 35% 35%, #3a2010, #1a0e05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 14,
        color: "#f5c878", flexShrink: 0,
        boxShadow: "0 0 12px rgba(255,180,0,0.35)",
      }}>
        {level}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#a08060", fontFamily: "Georgia, serif" }}>Nível {level}</span>
          <span style={{ fontSize: 10, color: "#a08060" }}>{xp}/{xpMax} XP</span>
        </div>
        <div style={{
          width: "100%", height: 9, borderRadius: 5,
          background: "#1a1008", border: "1px solid #3a2010",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 5,
            background: "linear-gradient(90deg, #8b4500, #FFD700, #fffacd)",
            boxShadow: "0 0 10px rgba(255,215,0,0.6)",
            transition: "width 0.5s ease",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              animation: "shimmer 2.5s infinite",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FlorestaDosAlgoritmos() {
  const [hoveredId, setHoveredId] = useState(null);
  const completed = LEVELS.filter(l => l.state === "completed").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@400;600&display=swap');

        @keyframes pulseRing {
          0%   { transform: translate(-50%, -54%) scale(1);   opacity: 0.7; }
          100% { transform: translate(-50%, -54%) scale(1.6); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0)    opacity: 0.5; }
          50%  { opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        fontFamily: "DM Sans, sans-serif",
        background: "#000",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* HEADER */}
        <header style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 100%)",
          borderBottom: "1.5px solid rgba(139,74,26,0.4)",
          zIndex: 20,
          flexShrink: 0,
        }}>

          <button
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 12,
              color: "#f5dfa0",
              background: "linear-gradient(180deg, #2a1508, #1a0d04)",
              border: "2px solid #8b4a1a",
              borderBottom: "3px solid #4a1800",
              padding: "6px 12px", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 3px 0 #1a0800, inset 0 1px 0 rgba(255,220,120,0.1)",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            <ChevronLeft size={14} />
            Voltar
          </button>

          {/* Title */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <h1 style={{
              fontFamily: "'IM Fell English', Georgia, serif",
              fontSize: 20, fontWeight: "bold",
              color: "#f5c878",
              textShadow: "0 0 20px rgba(255,180,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
              letterSpacing: "0.05em", lineHeight: 1.1,
            }}>
              Floresta dos Algoritmos
            </h1>
            <p style={{ fontSize: 11, color: "#a08060", fontFamily: "Georgia, serif", letterSpacing: "0.08em" }}>
              {completed}/{LEVELS.length} desafios completos
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 20,
              background: "rgba(0,0,0,0.5)", border: "1.5px solid rgba(255,215,0,0.5)",
            }}>
              <Star size={13} style={{ fill: "#FFD700", color: "#FFD700" }} />
              <span style={{ fontSize: 13, fontWeight: "700", color: "#f5e090" }}>{PLAYER.stars}</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 20,
              background: "rgba(0,0,0,0.5)", border: "1.5px solid rgba(167,139,250,0.5)",
            }}>
              <Gem size={13} style={{ fill: "#a78bfa", color: "#a78bfa" }} />
              <span style={{ fontSize: 13, fontWeight: "700", color: "#c4b5fd" }}>{PLAYER.gems}</span>
            </div>
            <button style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(0,0,0,0.5)", border: "1.5px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#888",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f5c878"; e.currentTarget.style.borderColor = "#8b5e1a"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
            >
              <Settings size={14} />
            </button>
          </div>
        </header>

        {/* MAP */}
        <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img
            src={map}
            alt="Mapa da Floresta dos Algoritmos"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              filter: "brightness(0.55) saturate(0.8)",
              display: "block",
            }}
          />

          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* Nodes + path */}
          <div style={{ position: "absolute", inset: 0 }}>
            <ConnectingPath levels={LEVELS} />
            {LEVELS.map((level) => (
              <LevelNode
                key={level.id}
                level={level}
                onHover={setHoveredId}
                hoveredId={hoveredId}
              />
            ))}
          </div>

          {/* Ambient particles */}
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${8 + i * 10}%`,
              bottom: `${10 + (i % 4) * 18}%`,
              width: i % 3 === 0 ? 5 : 3,
              height: i % 3 === 0 ? 5 : 3,
              borderRadius: "50%",
              background: i % 2 === 0 ? "#FFD70088" : "#4fc3f788",
              animation: `floatUp ${3.5 + i * 0.6}s ease-in-out infinite ${i * 0.45}s`,
              pointerEvents: "none",
            }} />
          ))}
        </main>

        {/* FOOTER */}
        <footer style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.82) 100%)",
          borderTop: "1.5px solid rgba(139,74,26,0.35)",
          flexShrink: 0,
          minHeight: 74,
        }}>

          {[
            { icon: <Users size={24} />, label: "Heróis",     border: "#8b4a1a", color: "#f5c878", bg: "linear-gradient(180deg,#4a2a10,#2a1508)" },
            { icon: <Trophy size={24} />, label: "Conquistas", border: "#9b8a2a", color: "#f5e090", bg: "linear-gradient(180deg,#4a3a10,#2a2008)" },
            { icon: <Volume2 size={24} />, label: "Som",       border: "#2a4a2a", color: "#90c890", bg: "linear-gradient(180deg,#1a3a1a,#0d200d)" },
          ].map(({ icon, label, border, color, bg }) => (
            <button key={label} style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              width: 64, height: 64, gap: 4,
              borderRadius: 10, cursor: "pointer",
              fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 9,
              letterSpacing: "0.05em",
              border: `2px solid ${border}`,
              borderBottom: `3px solid ${border}88`,
              color,
              background: bg,
              boxShadow: "0 4px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              transition: "filter 0.15s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {icon}
              {label}
            </button>
          ))}

          <div style={{ flex: 1, paddingLeft: 6 }}>
            <XPBar xp={PLAYER.xp} xpMax={PLAYER.xpMax} level={PLAYER.level} />
          </div>
        </footer>
      </div>
    </>
  );
}