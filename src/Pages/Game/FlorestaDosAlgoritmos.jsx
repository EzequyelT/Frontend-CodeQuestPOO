import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Gem, Trophy, Users, ChevronLeft, Lock, Settings, Volume2, Loader2 } from "lucide-react";
import { getLevelsByMap } from "../../Services/levelService";
import { getProgresso } from "../../Services/UserService";

import map from "../../assets/Maps/Map1.png";
import Banner from "../../assets/Maps/Banner.jpg";
import Arrow from "../../assets/Maps/Arrow.png";


const CHALLENGEPOSITIONS = {
  1: { x: 22, y: 88 },
  2: { x: 42, y: 78 },
  3: { x: 62, y: 68 },
  4: { x: 30, y: 52 },
  5: { x: 65, y: 42 },
  6: { x: 90, y: 30 },
  7: { x: 10, y: 35 },
  8: { x: 46, y: 10 },
};

// Recebe mapaId como parâmetro (ex: 1 para a Floresta dos Algoritmos)
async function fetchLevels(mapaId, token) {
  const [niveisDB, progressoTotal] = await Promise.all([
    getLevelsByMap(mapaId),
    getProgresso(token),
  ]);

  const progressoMapa = progressoTotal.find(p => p.mapa === mapaId) || {};
  const desafiosCompletos = progressoMapa.desafios_completos || 0;

  // Calcula posição global de cada desafio (0, 1, 2, 3...)
  let posicaoGlobal = 0;

  const levels = niveisDB.map((nivel) => ({
    id: nivel.id,
    name: nivel.nome,
    challenges: nivel.desafios.map((desafio) => {
      const pos = CHALLENGEPOSITIONS[desafio.id] ?? { x: 50, y: 50 };
      const minhaPosicao = posicaoGlobal++;   // incrementa a cada desafio

      let state;
      if (minhaPosicao < desafiosCompletos) state = "completed";
      else if (minhaPosicao === desafiosCompletos) state = "available";
      else state = "locked";

      return {
        id: desafio.id,
        name: desafio.nome,
        description: desafio.descricao,
        xpReward: desafio.xp,
        x: pos.x,
        y: pos.y,
        state,
        stars: state === "completed" ? 3 : 0,
      };
    }),
  }));

  return {
    player: { stars: 0, gems: 0, xp: 0, xpMax: 500, level: 1 },
    levels,
  };
}



// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function allChallenges(levels) {
  return levels.flatMap(l => l.challenges);
}

/**
 * Camera Y: 0 = show bottom of map, 1 = show top of map.
 * Finds the furthest unlocked challenge (lowest y%) and positions the camera
 * so that challenge is roughly centred vertically.
 */
function computeCameraY(levels) {
  const all = allChallenges(levels);
  const frontier = all
    .filter(c => c.state !== "locked")
    .sort((a, b) => a.y - b.y)[0]; // smallest y = highest on map
  if (!frontier) return 0;
  // challenge.y: 88 (bottom) → camY 0 | challenge.y: 6 (top) → camY 1
  return Math.max(0, Math.min(1, 1 - frontier.y / 100));
}

// ─────────────────────────────────────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGE NODE
// ─────────────────────────────────────────────────────────────────────────────

function ChallengeNode({ challenge, onHover, hoveredId }) {
  const isHovered = hoveredId === challenge.id;
  const S = 52;

  const style = {
    completed: {
      border: "3px solid #FFD700",
      bg: "radial-gradient(circle at 35% 35%, #4a3800, #1a1400)",
      glow: "0 0 18px rgba(255,215,0,0.45), 0 0 40px rgba(255,215,0,0.15)",
      numColor: "#FFD700",
    },
    available: {
      border: "3px solid #4fc3f7",
      bg: "radial-gradient(circle at 35% 35%, #0d2a3d, #061520)",
      glow: "0 0 22px rgba(79,195,247,0.65), 0 0 50px rgba(79,195,247,0.25)",
      numColor: "#4fc3f7",
    },
    locked: {
      border: "3px solid #2a2a2a",
      bg: "radial-gradient(circle at 35% 35%, #141414, #080808)",
      glow: "none",
      numColor: "#333",
    },
  }[challenge.state];

  return (
    <div
      onMouseEnter={() => onHover(challenge.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: "absolute",
        left: `${challenge.x}%`,
        top: `${challenge.y}%`,
        transform: isHovered && challenge.state !== "locked"
          ? "translate(-50%,-60%)" : "translate(-50%,-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        cursor: challenge.state === "locked" ? "not-allowed" : "pointer",
        zIndex: isHovered ? 30 : 10,
        transition: "transform 0.2s ease",
      }}
    >

      {/* Seta indicadora de fase atual */}
      {challenge.state === "available" && (
        <div style={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "bounceArrow 1s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 20,
        }}>
          {/* Seta SVG apontando para baixo */}
          <img src={Arrow} width={70} height={60} viewBox="0 0 24 24" fill="none"></img>
        </div>
      )}
      {/* Pulse rings */}
      {challenge.state === "available" && [0, 0.5].map(delay => (
        <div key={delay} style={{
          position: "absolute",
          width: S + 22, height: S + 22, borderRadius: "50%",
          border: `2px solid rgba(79,195,247,${delay === 0 ? 0.45 : 0.2})`,
          animation: `pulseRing 2s ease-out infinite ${delay}s`,
          top: "50%", left: "50%",
          transform: "translate(-50%,-54%)",
          pointerEvents: "none",
        }} />
      ))}

      {/* Circle */}
      <div style={{
        width: S, height: S, borderRadius: "50%",
        border: style.border, background: style.bg,
        boxShadow: isHovered && challenge.state !== "locked"
          ? style.glow + ", 0 10px 30px rgba(0,0,0,0.9)" : style.glow,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", transition: "box-shadow 0.3s",
      }}>
        <span style={{
          fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 20,
          color: style.numColor,
          textShadow: challenge.state !== "locked" ? `0 0 12px ${style.numColor}` : "none",
        }}>
          {challenge.id}
        </span>

        {challenge.state === "locked" && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={18} color="#444" />
          </div>
        )}

        {challenge.state === "completed" && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, borderRadius: "50%",
            background: "#FFD700",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 8px rgba(255,215,0,0.9)",
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke="#000" strokeWidth="3.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      <Stars count={challenge.stars} />

      {/* Tooltip */}
      {isHovered && challenge.state !== "locked" && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 14px)", left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg,#1a0e05,#0d0805)",
          border: "1.5px solid #8b5e1a", borderRadius: 10,
          padding: "10px 14px", width: 195,
          boxShadow: "0 8px 32px rgba(0,0,0,0.95)",
          zIndex: 50, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", bottom: -7, left: "50%",
            transform: "translateX(-50%)",
            width: 12, height: 7, background: "#8b5e1a",
            clipPath: "polygon(0 0,100% 0,50% 100%)",
          }} />
          <p style={{ margin: "0 0 4px", fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: 13, color: "#f5c878" }}>
            {challenge.name}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#a08060", lineHeight: 1.4 }}>
            {challenge.description}
          </p>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <Star size={11} style={{ fill: "#FFD700", color: "#FFD700" }} />
            <span style={{ fontSize: 11, color: "#f5c878", fontWeight: 600 }}>+{challenge.xpReward} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTING PATH (within a level)
// ─────────────────────────────────────────────────────────────────────────────

function LevelPath({ challenges }) {
  if (challenges.length < 2) return null;
  const pts = challenges.map(c => ({ x: c.x, y: c.y }));

  const buildD = (upTo) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < Math.min(upTo, pts.length - 1); i++) {
      const a = pts[i], b = pts[i + 1];
      d += ` C ${a.x + (b.x - a.x) * 0.4} ${a.y}, ${a.x + (b.x - a.x) * 0.6} ${b.y}, ${b.x} ${b.y}`;
    }
    return d;
  };

  const fullD = buildD(pts.length - 1);
  const litEnd = challenges.findIndex(c => c.state === "available");
  const litD = buildD(litEnd >= 0 ? litEnd : challenges.filter(c => c.state === "completed").length - 1);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4 }}>
      <path d={fullD} fill="none" stroke="#1a1008" strokeWidth="0.8" />
      <path d={fullD} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.4" strokeDasharray="2 2" />
      <path d={litD} fill="none" stroke="#6b4010" strokeWidth="0.65" />
      <path d={litD} fill="none" stroke="#FFD700" strokeWidth="0.28" opacity="0.8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL LABEL BANNER
// ─────────────────────────────────────────────────────────────────────────────

function LevelBanner({ level }) {
  const first = level.challenges[0];
  return (
    <div style={{
      position: "absolute",
      left: `${first.x}%`,
      top: `${first.y + 7}%`,
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.75) 20%,rgba(0,0,0,0.75) 80%,transparent)",
      padding: "3px 14px",
      borderTop: "1px solid rgba(139,74,26,0.5)",
      borderBottom: "1px solid rgba(139,74,26,0.5)",
      whiteSpace: "nowrap",
      zIndex: 3, pointerEvents: "none",
    }}>
      <span style={{
        fontFamily: "Georgia,serif", fontWeight: "bold",
        fontSize: 10, letterSpacing: "0.1em",
        color: "#a08060", textTransform: "uppercase",
      }}>
        {level.name}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// XP BAR
// ─────────────────────────────────────────────────────────────────────────────

function XPBar({ xp, xpMax, level }) {
  const pct = Math.min((xp / xpMax) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "2px solid #8b5e1a",
        background: "radial-gradient(circle at 35% 35%,#3a2010,#1a0e05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: 14,
        color: "#f5c878", flexShrink: 0,
        boxShadow: "0 0 12px rgba(255,180,0,0.35)",
      }}>
        {level}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#a08060", fontFamily: "Georgia,serif" }}>Nível {level}</span>
          <span style={{ fontSize: 10, color: "#a08060" }}>{xp}/{xpMax} XP</span>
        </div>
        <div style={{ height: 9, borderRadius: 5, background: "#1a1008", border: "1px solid #3a2010", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 5,
            background: "linear-gradient(90deg,#8b4500,#FFD700,#fffacd)",
            boxShadow: "0 0 10px rgba(255,215,0,0.6)",
            transition: "width 0.6s ease", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.28) 50%,transparent)",
              animation: "shimmer 2.5s infinite",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS INDICATOR (right edge of map)
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ levels }) {
  const all = allChallenges(levels);
  const done = all.filter(c => c.state === "completed").length;
  const pct = Math.round((done / all.length) * 100);

  return (
    <div style={{
      position: "absolute", right: 12, top: "50%",
      transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      zIndex: 20, pointerEvents: "none",
    }}>
      <div style={{
        width: 7, height: 150, borderRadius: 3,
        background: "#1a1008", border: "1px solid #3a2010",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: `${pct}%`, borderRadius: 2,
          background: "linear-gradient(0deg,#8b4500,#FFD700)",
          boxShadow: "0 0 6px rgba(255,215,0,0.5)",
          transition: "height 1s ease",
        }} />
      </div>
      <span style={{ fontSize: 15, color: "#a08060", fontFamily: "Georgia,serif" }}>{pct}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function FlorestaDosAlgoritmos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [translateY, setTranslateY] = useState(0);   // pixels, ≤ 0
  const [dragging, setDragging] = useState(false);

  const mainRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartTrans = useRef(0);
  const navigate = useNavigate();

  const MAP_EXTRA = 1.8;

  // Compute initial camera position in pixels so the frontier node is centred
  function initialTranslate(levels, mainH) {
    const all = allChallenges(levels);
    const frontier = all.filter(c => c.state !== "locked").sort((a, b) => a.y - b.y)[0];
    if (!frontier) return -(MAP_EXTRA - 1) * mainH; // show bottom
    const nodeAbsY = (frontier.y / 100) * MAP_EXTRA * mainH;
    const raw = mainH / 2 - nodeAbsY;
    return Math.max(-(MAP_EXTRA - 1) * mainH, Math.min(0, raw));
  }

  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("cq_token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Passa o token para fetchLevels usar no getProgresso
        const resultado = await fetchLevels(1, token);
        setData(resultado);
      } catch (err) {
        console.error("Erro ao carregar o mapa:", err);
        setError(err.message); // <-- também tens um bug aqui: trocar por setLoading
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  function clampY(y) {
    const mainH = mainRef.current?.offsetHeight ?? 600;
    return Math.max(-(MAP_EXTRA - 1) * mainH, Math.min(0, y));
  }

  function onPointerDown(e) {
    // Ignore clicks on buttons/interactive nodes
    if (e.target.closest("button")) return;
    setDragging(true);
    dragStartY.current = e.clientY;
    dragStartTrans.current = translateY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dy = e.clientY - dragStartY.current;
    setTranslateY(clampY(dragStartTrans.current + dy));
  }

  function onPointerUp() {
    setDragging(false);
  }

  if (error) return (
    <div style={{
      height: "100dvh", background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{ color: "#f87171", fontFamily: "Georgia,serif" }}>Erro: {error}</p>
    </div>
  );

  if (loading) return (
    <div style={{
      height: "100dvh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
    }}>
      <Loader2 size={32} color="#8b5e1a" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ fontFamily: "Georgia,serif", color: "#a08060", fontSize: 14 }}>A carregar o mapa…</p>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const { player, levels } = data;
  const challenges = allChallenges(levels);
  const done = challenges.filter(c => c.state === "completed").length;


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&family=DM+Sans:wght@400;600&display=swap');
        @keyframes pulseRing {
          0%   { transform: translate(-50%,-54%) scale(1);   opacity: 0.7; }
          100% { transform: translate(-50%,-54%) scale(1.7); opacity: 0;   }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0px);   opacity: 0.5; }
          50%  { opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0;   }
        }
          @keyframes bounceArrow {
          0%, 100% { transform: translateX(-50%) translateY(0px);  }
          50%       { transform: translateX(-50%) translateY(-8px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        fontFamily: "DM Sans, sans-serif",
        background: "#000",
        height: "100dvh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* HEADER */}
        <header style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 20px",
          background: "linear-gradient(180deg,rgba(0,0,0,0.97),rgba(0,0,0,0.75))",
          borderBottom: "1.5px solid rgba(139,74,26,0.4)",
          zIndex: 20, flexShrink: 0,
        }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: 12,
            color: "#f5dfa0",
            background: "linear-gradient(180deg,#2a1508,#1a0d04)",
            border: "2px solid #8b4a1a", borderBottom: "3px solid #4a1800",
            padding: "6px 12px", borderRadius: 8, cursor: "pointer",
            boxShadow: "0 3px 0 #1a0800,inset 0 1px 0 rgba(255,220,120,0.1)",
          }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            onClick={() => navigate("/Maps")}
          >
            <ChevronLeft size={14} /> Voltar
          </button>

          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={Banner}
                alt="Banner"
                style={{
                  width: 210,
                  height: "auto",
                  display: "block",
                  borderRadius: 10,
                  opacity: 0.9,
                  marginTop: 4,
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "10px 14px",
              }}>
                <h1 style={{
                  fontFamily: "'IM Fell English',Georgia,serif",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#f5c878",
                  textShadow: "0 0 20px rgba(255,180,0,0.5),0 2px 4px rgba(0,0,0,0.8)",
                  letterSpacing: "0.05em",
                }}>
                  Floresta dos Algoritmos
                </h1>
                <p style={{
                  fontSize: 11,
                  color: "#f8deb0",
                  fontFamily: "Georgia,serif",
                  marginTop: 4,
                  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                }}>
                  {done}/{challenges.length} desafios completos
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[
              { icon: <Star size={13} style={{ fill: "#FFD700", color: "#FFD700" }} />, val: player.stars, border: "rgba(255,215,0,0.5)", color: "#f5e090" },
              { icon: <Gem size={13} style={{ fill: "#a78bfa", color: "#a78bfa" }} />, val: player.gems, border: "rgba(167,139,250,0.5)", color: "#c4b5fd" },
            ].map(({ icon, val, border, color }, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 20,
                background: "rgba(0,0,0,0.5)", border: `1.5px solid ${border}`,
              }}>
                {icon}
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span>
              </div>
            ))}
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
        <main
          ref={mainRef}
          style={{
            flex: 1, position: "relative", overflow: "hidden",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >

          {/* Scrollable map + nodes */}
          <div style={{
            position: "absolute", inset: 0,
            height: `${MAP_EXTRA * 100}%`,
            transform: `translateY(${translateY}px)`,
            transition: dragging ? "none" : "transform 1.6s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <img
              src={map}
              alt="Mapa"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                filter: "brightness(0.75) saturate(0.90)",
                display: "block", position: "absolute", inset: 0,
              }}
            />

            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.65) 100%)",
              pointerEvents: "none",
            }} />

            {/* Levels */}
            {levels.map(level => (
              <div key={level.id} style={{ position: "absolute", inset: 0 }}>
                <LevelPath challenges={level.challenges} />
                <LevelBanner level={level} />
                {level.challenges.map(challenge => (
                  <ChallengeNode
                    key={challenge.id}
                    challenge={challenge}
                    onHover={setHoveredId}
                    hoveredId={hoveredId}
                  />
                ))}
              </div>
            ))}

            {/* Particles */}
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${8 + i * 9}%`,
                bottom: `${8 + (i % 4) * 16}%`,
                width: i % 3 === 0 ? 5 : 3,
                height: i % 3 === 0 ? 5 : 3,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#FFD70088" : "#4fc3f788",
                animation: `floatUp ${3.5 + i * 0.55}s ease-in-out infinite ${i * 0.4}s`,
                pointerEvents: "none",
              }} />
            ))}
          </div>

          {/* Fixed fades */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 70,
            background: "linear-gradient(180deg,rgba(0,0,0,0.7),transparent)",
            pointerEvents: "none", zIndex: 15,
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(0deg,rgba(0,0,0,0.8),transparent)",
            pointerEvents: "none", zIndex: 15,
          }} />

          {/* Progress indicator */}
          <ProgressBar levels={levels} />

          {/* Drag hint — shown only briefly */}
          {!dragging && (
            <div style={{
              position: "absolute", bottom: 90, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              pointerEvents: "none", zIndex: 16,
              opacity: 0.45,
            }}>
              <svg width={18} height={22} viewBox="0 0 18 22" fill="none">
                <path d="M9 2 L9 20 M3 8 L9 2 L15 8" stroke="#f5c878" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width={18} height={22} viewBox="0 0 18 22" fill="none">
                <path d="M9 2 L9 20 M3 14 L9 20 L15 14" stroke="#f5c878" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 14px",
          background: "linear-gradient(0deg,rgba(0,0,0,0.98),rgba(0,0,0,0.82))",
          borderTop: "1.5px solid rgba(139,74,26,0.35)",
          flexShrink: 0, minHeight: 74,
        }}>
          {[
            { icon: <Users size={24} />, label: "Heróis", border: "#8b4a1a", color: "#f5c878", bg: "linear-gradient(180deg,#4a2a10,#2a1508)" },
            { icon: <Trophy size={24} />, label: "Conquistas", border: "#9b8a2a", color: "#f5e090", bg: "linear-gradient(180deg,#4a3a10,#2a2008)" },
            { icon: <Volume2 size={24} />, label: "Som", border: "#2a4a2a", color: "#90c890", bg: "linear-gradient(180deg,#1a3a1a,#0d200d)" },
          ].map(({ icon, label, border, color, bg }) => (
            <button key={label} style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              width: 64, height: 64, gap: 4,
              borderRadius: 10, cursor: "pointer",
              fontFamily: "Georgia,serif", fontWeight: "bold", fontSize: 9,
              letterSpacing: "0.05em",
              border: `2px solid ${border}`, borderBottom: `3px solid ${border}88`,
              color, background: bg,
              boxShadow: "0 4px 0 rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)",
              transition: "filter 0.15s,transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {icon}{label}
            </button>
          ))}

          <div style={{ flex: 1, paddingLeft: 6 }}>
            <XPBar xp={player.xp} xpMax={player.xpMax} level={player.level} />
          </div>
        </footer>
      </div>
    </>
  );
}