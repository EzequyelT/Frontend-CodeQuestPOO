import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Gem, Trophy, Users, ChevronLeft, Settings, Volume2, Loader2 } from "lucide-react";
import { getLevelsByMap } from "../../Services/maps/levelService";
 
import { getProgresso } from "../../Services/users/userStatsService";
import { obterXPAluno } from "../../Services/Gameplay/xpProgressService";
import map from "../../assets/Maps/Map1.png";
import Banner from "../../assets/Maps/Banner.jpg";
 
import Arrow from "../../assets/Maps/Arrow.png";
import ButtonImgtrophy from "../../assets/Buttons/Trofeu.png"
import ButtonImgHero from "../../assets/Buttons/Game.png"
import ButtonImgBack from "../../assets/Buttons/Back.png"
import Button1 from "../../assets/Buttons/1.png"
 
import Button2 from "../../assets/Buttons/2.png"
import Button3 from "../../assets/Buttons/3.png"
import Button4 from "../../assets/Buttons/4.png"
import Button5 from "../../assets/Buttons/5.png"
 
import Button6 from "../../assets/Buttons/6.png"
import Button7 from "../../assets/Buttons/7.png"
import Button8 from "../../assets/Buttons/8.png"
 
// ... (GLOBAL_CSS e CONSTANTS permanecem iguais)
 
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&family=DM+Sans:wght@400;600&display=swap');
 
@keyframes pulseRing {
  0%   { transform: translate(-50%,-56%) scale(0.85); opacity: 0.7; }
  100% { transform: translate(-50%,-56%) scale(1.55); opacity: 0; }
}
@keyframes bounceArrow {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(6px); }
}
@keyframes completedPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.2); }
}
@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes floatUp {
  0%   { transform: translateY(0px);   opacity: 0.5; }
  50%  { opacity: 1; }
  100% { transform: translateY(-40px); opacity: 0; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
`;
 
const CHALLENGE_POSITIONS = {
  1: { x: 22, y: 88 },
  2: { x: 42, y: 78 },
  3: { x: 62, y: 68 },
  4: { x: 30, y: 52 },
  5: { x: 65, y: 42 },
  6: { x: 90, y: 30 },
  7: { x: 10, y: 35 },
  8: { x: 46, y: 22 },
};
 
const BUTTON_IMAGES = {
  1: Button1,
  2: Button2,
  3: Button3,
  4: Button4,
  5: Button5,
  6: Button6,
  7: Button7,
  8: Button8,
};
 
 
const Color = {
  primary: {
    dark: "#0a2a4a",      // Fundo escuro do botão
    main: "#1e5a8e",       // Azul base
    light: "#3b7ab8",      // Azul claro
    lighter: "#5a96d8",    // Azul mais claro
    brightest: "#7ab8ff",  // Azul brilhante
  },
 
  // Secundário (Ouro/Bronze - mantém o tema)
  secondary: {
    dark: "#3a2010",
    main: "#8b5e1a",
    light: "#a08060",
    lighter: "#c4a878",
  },
 
  // Glow/Shadow
  glow: {
    blue: "rgba(79, 180, 255, 0.6)",
    blueSoft: "rgba(79, 180, 255, 0.3)",
    gold: "rgba(255, 215, 0, 0.6)",
  },
 
  // Neutros
  neutral: {
    bg: "#000",
    darkBg: "#0a0a0a",
    card: "rgba(10, 30, 50, 0.4)",
    border: "rgba(30, 90, 142, 0.3)",
  },
};
 
const NODE_SIZE = 56;
 
// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────
 
async function fetchLevels(mapaId, token) {
  const [niveisDB, progressoTotal] = await Promise.all([
    getLevelsByMap(mapaId),
    getProgresso(token),
  ]);
 
  const progressoMapa = progressoTotal.find(p => p.mapa === mapaId) || {};
  const desafiosCompletos = progressoMapa.desafios_completos || 0;
  let posicaoGlobal = 0;
 
  const levels = niveisDB.map(nivel => ({
    id: nivel.id,
    name: nivel.nome,
    challenges: nivel.desafios.map(desafio => {
      const pos = CHALLENGE_POSITIONS[desafio.id] ?? { x: 50, y: 50 };
      const minhaPosicao = posicaoGlobal++;
 
      let state;
      if (minhaPosicao < desafiosCompletos) state = "completed";
      else if (minhaPosicao === desafiosCompletos) state = "available";
      else state = "locked";
 
      return {
        id: desafio.id,
        name: desafio.nome,
        description: desafio.descricao,
        xpReward: desafio.xp,
        route: `/floresta/nivel-${nivel.id}/desafio-${desafio.id}`,
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
 
// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS — Challenge Node
// ─────────────────────────────────────────────────────────────────────────────
 
function NodeStars({ count }) {
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
      {[1, 2, 3].map(i => (
        <svg key={i} width={11} height={11} viewBox="0 0 24 24">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i <= count ? "#FFD700" : "#2a2a2a"}
            stroke={i <= count ? "#e6b800" : "#333"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}
 
function CompletedBadge() {
  return (
    <div style={{ position: "absolute", top: -10, right: -10, width: 26, height: 26, zIndex: 20 }}>
      <div style={{
        position: "absolute", inset: -4, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,215,0,0.35) 0%, transparent 70%)",
        animation: "completedPulse 2.5s ease-in-out infinite",
      }} />
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 25%, #ffe066, #e6a000)",
        border: "2px solid #fff5b0",
        boxShadow: "0 2px 8px rgba(255,200,0,0.7), inset 0 1px 0 rgba(255,255,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 2, left: 4, width: 8, height: 4,
          borderRadius: "50%", background: "rgba(255,255,255,0.5)",
          transform: "rotate(-20deg)",
        }} />
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none">
          <polyline points="4 13 9 18 20 7" stroke="#5a3000" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
 
function AvailableArrow() {
  return (
    <div style={{
      position: "absolute", top: -52, left: "50%",
      transform: "translateX(-50%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      animation: "bounceArrow 1.1s ease-in-out infinite",
      pointerEvents: "none", zIndex: 20,
    }}>
      <img src={Arrow} alt="h-10 w-20" />
    </div>
  );
}
 
function PulseRings({ color }) {
  return (
    <>
      {[0, 0.55, 1.1].map(delay => (
        <div key={delay} style={{
          position: "absolute",
          width: NODE_SIZE + 28, height: NODE_SIZE + 28,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          animation: `pulseRing 2.2s ease-out infinite ${delay}s`,
          top: "50%", left: "50%",
          transform: "translate(-50%, -56%)",
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}
 
function NodeTooltip({ challenge, onPlay }) {
  const isCompleted = challenge.state === "completed";
  const accentColor = isCompleted ? "#c8860a" : "#1e6fa8";
 
  return (
    <div
      onMouseEnter={e => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: "calc(100% + 18px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(160deg, #140d04, #0b0804)",
        border: `1.5px solid ${accentColor}`,
        borderRadius: 12,
        padding: "12px 15px",
        width: 210,
        boxShadow: "0 12px 40px rgba(0,0,0,0.97), 0 0 0 1px rgba(255,255,255,0.04)",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: 20, right: 20, height: 1, borderRadius: 1,
        background: isCompleted
          ? "linear-gradient(90deg, transparent, #FFD700, transparent)"
          : "linear-gradient(90deg, transparent, #4fc3f7, transparent)",
      }} />
 
      {/* Arrow tip */}
      <div style={{
        position: "absolute", bottom: -7, left: "50%",
        transform: "translateX(-50%)",
        width: 13, height: 7,
        background: accentColor,
        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
      }} />
 
      {/* Completed badge label */}
      {isCompleted && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "rgba(255,215,0,0.12)",
          border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: 4, padding: "2px 7px", marginBottom: 6,
        }}>
          <svg width={9} height={9} viewBox="0 0 24 24" fill="none">
            <polyline points="4 13 9 18 20 7" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 10, color: "#FFD700", fontWeight: 700, letterSpacing: "0.05em" }}>
            CONCLUÍDO
          </span>
        </div>
      )}
 
      <p style={{
        margin: "0 0 4px",
        fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 13,
        color: isCompleted ? "#ffd770" : "#8dd8f8",
        letterSpacing: "0.01em",
      }}>
        {challenge.name}
      </p>
      <p style={{ margin: 0, fontSize: 11, color: "#7a6045", lineHeight: 1.5 }}>
        {challenge.description}
      </p>
 
      <div style={{
        marginTop: 9, paddingTop: 8,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width={12} height={12} viewBox="0 0 24 24">
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill="#FFD700" stroke="#e6b800" strokeWidth="1"
            />
          </svg>
          <span style={{ fontSize: 12, color: "#f0c060", fontWeight: 700 }}>
            +{challenge.xpReward} XP
          </span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[1, 2, 3].map(i => (
            <svg key={i} width={10} height={10} viewBox="0 0 24 24">
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={i <= challenge.stars ? "#FFD700" : "#2a2520"}
                stroke={i <= challenge.stars ? "#b8900d" : "#333"}
                strokeWidth="1"
              />
            </svg>
          ))}
        </div>
      </div>
 
      <button
        onClick={onPlay}
        style={{
          marginTop: 10, width: "100%", padding: "7px 10px",
          borderRadius: 7,
          border: isCompleted
            ? "1px solid rgba(255,215,0,0.4)"
            : "1px solid rgba(79,195,247,0.4)",
          background: isCompleted
            ? "linear-gradient(135deg, rgba(255,180,0,0.12), rgba(180,100,0,0.08))"
            : "linear-gradient(135deg, rgba(79,195,247,0.12), rgba(20,80,140,0.08))",
          color: isCompleted ? "#ffd060" : "#88d8ff",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          letterSpacing: "0.06em", textTransform: "uppercase",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isCompleted
            ? "linear-gradient(135deg, rgba(255,180,0,0.22), rgba(180,100,0,0.16))"
            : "linear-gradient(135deg, rgba(79,195,247,0.22), rgba(20,80,140,0.16))";
          e.currentTarget.style.boxShadow = isCompleted
            ? "0 0 16px rgba(255,200,0,0.25)"
            : "0 0 16px rgba(79,195,247,0.25)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isCompleted
            ? "linear-gradient(135deg, rgba(255,180,0,0.12), rgba(180,100,0,0.08))"
            : "linear-gradient(135deg, rgba(79,195,247,0.12), rgba(20,80,140,0.08))";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isCompleted ? "⟳ Jogar Novamente" : "▶ Jogar"}
      </button>
    </div>
  );
}
function ChallengeNode({ challenge, onHover, hoveredId, navigate }) {
  const hoverTimeout = useRef(null);
  const isHovered = hoveredId === challenge.id;
  const isLocked = challenge.state === "locked";
  const isAvailable = challenge.state === "available";
  const isCompleted = challenge.state === "completed";
  const buttonImage = BUTTON_IMAGES[challenge.id] || Button1;
 
 
  useEffect(() => () => clearTimeout(hoverTimeout.current), []);
 
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    if (!isLocked) onHover(challenge.id);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => onHover(null), 400);
  };
 
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        left: `${challenge.x}%`,
        top: `${challenge.y}%`,
        transform: isHovered && !isLocked
          ? "translate(-50%, -56%)"
          : "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        cursor: isLocked ? "not-allowed" : "pointer",
        zIndex: isHovered ? 30 : 10,
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        userSelect: "none",
      }}
    >
      {isAvailable && <AvailableArrow />}
 
      {(isAvailable || isCompleted) && (
        <PulseRings color={isCompleted ? "rgba(255,215,0,0.3)" : "rgba(79,195,247,0.35)"} />
      )}
 
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 🎮 BOTÃO DO DESAFIO - SÓ A IMAGEM (SEM BORDERS) */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: "50%",
          position: "relative",
          transition: "transform 0.3s ease, filter 0.3s ease",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* IMAGEM DO BOTÃO - 100% DO TAMANHO */}
        <img
          src={buttonImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            position: "relative",
            zIndex: 2,
            filter: isLocked ? "grayscale(100%) opacity(0.5)" : "brightness(1)",
          }}
          alt={`Fase ${challenge.id}`}
        />
 
        {/* Lock overlay - aparece por cima da imagem */}
        {isLocked && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="#383838"
                strokeWidth="2"
                fill="#1a1a1a"
              />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="#383838"
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
 
        {/* Badge de concluído no canto */}
        {isCompleted && <CompletedBadge />}
      </div>
 
      {/* Stars abaixo do botão */}
      {!isLocked && <NodeStars count={challenge.stars} />}
 
      {/* Tooltip ao passar o mouse */}
      {isHovered && !isLocked && (
        <NodeTooltip
          challenge={challenge}
          onPlay={() => navigate(challenge.route)}
        />
      )}
    </div>
  );
}
 
// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS — Map decorations
// ─────────────────────────────────────────────────────────────────────────────
 
function LevelPath({ challenges }) {
  if (challenges.length < 2) return null;
  const pts = challenges.map(c => ({ x: c.x, y: c.y }));
 
  const buildD = upTo => {
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
      whiteSpace: "nowrap", zIndex: 3, pointerEvents: "none",
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
// SUB-COMPONENTS — HUD
// ─────────────────────────────────────────────────────────────────────────────
 
 
function XPBar({ xp, xpMax, level }) {
  const xpValido = xp ?? 0;
  const nivelValido = level ?? 1;
 
  const isMax = !xpMax || xpMax <= 0;
  const xpMaxValido = isMax ? xpValido : xpMax;          // nunca null na divisão
  const pct = isMax ? 100 : Math.min((xpValido / xpMaxValido) * 100, 100);
 
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      flex: 1
    }}>
      {/* Círculo do Nível */}
      <div style={{
        width: 35,
        height: 35,
        borderRadius: "50%",
        border: "2px solid #7ab8ff",
        background: `radial-gradient(circle at 35% 35%, ${Color.primary.light}, ${Color.primary.dark})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "cinzel",
        fontWeight: "bold",
        fontSize: 16,
        color: "#7ab8ff",
        flexShrink: 0,
        boxShadow: `0 0 16px ${Color.glow.blue}, inset 0 0 8px rgba(122, 184, 255, 0.2)`,
      }}>
        {nivelValido}
      </div>
 
      {/* Barra e Textos */}
      <div style={{ flex: 1 }}>
        {/* Labels */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6
        }}>
          <span style={{
            fontSize: 11,
            color: "#7ab8ff",
            fontFamily: "sans-serif",
            fontWeight: "600",
            letterSpacing: "0.05em",
          }}>
            Nível {nivelValido}
          </span>
          <span style={{
            fontSize: 11,
            color: "#5a96d8",
            fontWeight: "600",
            letterSpacing: "0.02em",
          }}>
            {isMax ? "👑 MAX" : `${xpValido} / ${xpMaxValido} XP`}
          </span>
        </div>
 
        {/* Barra de Progresso */}
        <div style={{
          height: 12,
          borderRadius: 6,
          background: Color.neutral.card,
          border: `1.5px solid ${Color.primary.main}`,
          overflow: "hidden",
          boxShadow: `inset 0 0 8px rgba(10, 42, 74, 0.8)`,
        }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 5,
              background: `linear-gradient(90deg,
                ${Color.primary.dark} 0%,
                ${Color.primary.main} 30%,
                ${Color.primary.light} 50%,
                ${Color.primary.lighter} 70%,
                ${Color.primary.brightest} 100%)`,
              boxShadow: `0 0 14px ${Color.glow.blue}, inset 0 1px 3px rgba(255,255,255,0.2)`,
              transition: "width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer Animation */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)",
                animation: "shimmer 2.5s infinite",
              }}
            />
 
            {/* Pulsing Light */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 70%)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
 
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
      <span style={{ fontSize: 10, color: "#a08060", fontFamily: "Georgia,serif" }}>{pct}%</span>
    </div>
  );
}
 
// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
 
const MAP_EXTRA = 1.8;
 
export default function FlorestaDosAlgoritmos() {
  const [data, setData] = useState(null);
  const [progressaoXp, setProgressaoXp] = useState({
    xpTotal: 0,
    xpProximoNivel: 320,
    nivel: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);
 
  const mainRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartTrans = useRef(0);
  const navigate = useNavigate();
 
 
  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("cq_token");
        if (!token) { navigate("/login"); return; }
        const resultado = await fetchLevels(1, token);
        setData(resultado);
      } catch (err) {
        console.error("Erro ao carregar o mapa:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);
 
  // ✅ CORRIGIDO: Extrai corretamente os dados da progressão
  useEffect(() => {
    async function fetchProgressao() {
      try {
        const resultado = await obterXPAluno();
        if (resultado) {
          console.log("[Dashboard] Progressão carregada:", resultado);
 
          // Acessa a estrutura aninhada corretamente
          const progressaoDados = resultado.progressao || resultado;
 
          setProgressaoXp({
            xpTotal: progressaoDados?.xpTotal || 0,
            xpProximoNivel: progressaoDados?.xpProximoNivel || null,
            nivel: progressaoDados?.nivel || 1,
          });
 
        }
      } catch (err) {
        console.error("Erro ao carregar progressão", err);
        // Define valores padrão em caso de erro
        setProgressaoXp({
          xp: 0,
          xpProximoNivel: 320,
          nivel: 1,
        });
      }
    }
    fetchProgressao();
  }, []);
 
  function clampY(y) {
    const mainH = mainRef.current?.offsetHeight ?? 600;
    return Math.max(-(MAP_EXTRA - 1) * mainH, Math.min(0, y));
  }
 
  function onPointerDown(e) {
    if (e.target.closest("button")) return;
    setDragging(true);
    dragStartY.current = e.clientY;
    dragStartTrans.current = translateY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    setTranslateY(clampY(dragStartTrans.current + (e.clientY - dragStartY.current)));
  }
  function onPointerUp() { setDragging(false); }
 
  if (error) return (
    <div style={{ height: "100dvh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#f87171", fontFamily: "Georgia,serif" }}>Erro: {error}</p>
    </div>
  );
 
  if (loading) return (
    <div style={{ height: "100dvh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <Loader2 size={32} color="#8b5e1a" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ fontFamily: "Georgia,serif", color: "#a08060", fontSize: 14 }}>A carregar o mapa…</p>
    </div>
  );
 
  const { player, levels } = data;
  const challenges = allChallenges(levels);
  const done = challenges.filter(c => c.state === "completed").length;
 
  return (
    <>
      <style>{GLOBAL_CSS}</style>
 
      <div style={{
        fontFamily: "DM Sans, sans-serif",
        background: "#000",
        height: "100dvh",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
 
        {/* ── HEADER ── */}
        <header style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1.5px solid rgba(139,74,26,0.4)",
          zIndex: 20, flexShrink: 0,
        }}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 3,
              color: "#f5dfa0",
              padding: "6px 12px", borderRadius: 8, cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            onClick={() => navigate("/Maps")}
          >
            <img src={ButtonImgBack} className="h-12 w-12" />
          </button>
 
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={Banner} alt="Banner" style={{
                width: 250, height: "auto", display: "block",
                borderRadius: 10, opacity: 0.9, marginTop: 4,
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "10px 14px",
              }}>
                <h1 style={{
                  fontFamily: "'IM Fell English',Georgia,serif",
                  fontSize: 16, fontWeight: "bold", color: "#f5c878",
                  textShadow: "0 0 20px rgba(255,180,0,0.5),0 2px 4px rgba(0,0,0,0.8)",
                  letterSpacing: "0.05em",
                }}>
                  Floresta dos Algoritmos
                </h1>
                <p style={{
                  fontSize: 11, color: "#f8deb0",
                  fontFamily: "Georgia,serif", marginTop: 4,
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
            <button
              style={{
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
 
        {/* ── MAP ── */}
        <main
          ref={mainRef}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            userSelect:"none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div style={{
            position: "absolute", inset: 0,
            height: `${MAP_EXTRA * 100}%`,
            transform: `translateY(${translateY}px)`,
            transition: dragging ? "none" : "transform 1.6s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <img src={map}
            alt="Mapa"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.75) saturate(0.90)",
              display: "block",
              position: "absolute",
              inset: 0,
              userSelect: "none",
              pointerEvents: "none",
            }} />
 
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.65) 100%)",
              pointerEvents: "none",
            }} />
 
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
                    navigate={navigate}
                  />
                ))}
              </div>
            ))}
 
            {/* Floating particles */}
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${8 + i * 9}%`,
                bottom: `${8 + (i % 4) * 16}%`,
                width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#FFD70088" : "#4fc3f788",
                animation: `floatUp ${3.5 + i * 0.55}s ease-in-out infinite ${i * 0.4}s`,
                pointerEvents: "none",
              }} />
            ))}
          </div>
 
          {/* Edge fades */}
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
 
          <ProgressBar levels={levels} />
 
          {!dragging && (
            <div style={{
              position: "absolute", bottom: 90, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              pointerEvents: "none", zIndex: 16, opacity: 0.4,
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
 
        {/* ── FOOTER ── */}
        <footer style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 12,
          padding: "12px 20px",
          background: "linear-gradient(0deg,rgba(0,0,0,0.98),rgba(0,0,0,0.82))",
          borderTop: "1.5px solid rgba(139,74,26,0.35)",
          flexShrink: 0,
          minHeight: 40
        }}>
          {/* Botões */}
          {[
            { id: "hero", icon: ButtonImgHero },
            { id: "trophy", icon: ButtonImgtrophy },
          ].map(({ id, icon }) => (
            <button
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 70,
                height: 70,
                gap: 2,
                padding: 0,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.3)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img src={icon} style={{ width: 80, height: 65, objectFit: "contain" }} alt={id} />
            </button>
          ))}
 
          {/* XP Bar */}
          <div style={{ flex: 1, paddingLeft: 20 }}>
            <XPBar
              xp={progressaoXp.xpTotal}
              xpMax={progressaoXp.xpProximoNivel}
              level={progressaoXp.nivel}
            />
          </div>
        </footer>
      </div>
    </>
  );
}