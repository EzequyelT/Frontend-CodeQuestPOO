import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import buttonMap from "../../../assets/Buttons/Mapa.png";
import buttonRemake from "../../../assets/Buttons/Refazer.png";
import Bg from "../../../assets/Maps/Bg-Map1.png"


// ── Paleta idêntica ao LeftSideBar ──────────────────────────
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
    blueSoft: "rgba(79, 180, 255, 0.25)",
    gold: "rgba(255, 215, 0, 0.55)",
    goldSoft: "rgba(255, 185, 0, 0.18)",
  },
  neutral: {
    bg: "#000",
    darkBg: "#0a0a0a",
    card: "rgba(10, 30, 50, 0.45)",
    border: "rgba(30, 90, 142, 0.3)",
  },
};

// ── Mock ────────────────────────────────────────────────────
function formatTime(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function getScoreLabel(score) {
  if (score >= 90) return { label: "Incrível!", color: Color.secondary.lighter };
  if (score >= 70) return { label: "Muito bom!", color: Color.primary.brightest };
  if (score >= 50) return { label: "Bom esforço!", color: "#f5c518" };
  return { label: "Continue tentando!", color: "#e05c5c" };
}

// ── Score Ring ──────────────────────────────────────────────
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const { label, color } = getScoreLabel(score);

  useEffect(() => {
    let start = null;
    const dur = 900;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplayed(Math.round(p * score));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: 128, height: 128 }}>
        {/* glow ring por baixo */}
        <div style={{
          position: "absolute", inset: -4, borderRadius: "50%",
          boxShadow: `0 0 24px 6px ${Color.glow.goldSoft}, 0 0 48px 12px ${Color.glow.blueSoft}`,
          pointerEvents: "none",
        }} />
        <svg width={128} height={128} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={64} cy={64} r={radius} fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
          <circle cx={64} cy={64} r={radius} fill="none"
            stroke={color} strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            {displayed}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>
            SCORE
          </span>
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, marginTop: 4 }}>{label}</span>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function Stat({ icon, label, value, valueColor }) {
  return (
    <div style={{
      flex: "1 1 80px",
      background: Color.neutral.card,
      border: `1px solid ${Color.neutral.border}`,
      borderRadius: 16, padding: "12px 8px",
      backdropFilter: "blur(8px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 5,
      transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 17, fontWeight: 700, color: valueColor || "#fff" }}>{value}</span>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

// ── XP Bar ───────────────────────────────────────────────────
function XPBar({ xp }) {
  const max = 500;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min((xp / max) * 100, 100)), 200);
    return () => clearTimeout(t);
  }, [xp]);

  return (
    <div style={{ width: "100%", padding: "0 2px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 7,
      }}>
        <span>⭐ XP ganho</span>
        <span style={{ color: Color.secondary.lighter, fontWeight: 700 }}>+{xp} XP</span>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${Color.neutral.border}`,
        borderRadius: 99, height: 8, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${Color.secondary.main}, ${Color.secondary.lighter})`,
          boxShadow: `0 0 8px ${Color.glow.gold}`,
          width: `${width}%`,
          transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>
    </div>
  );
}

// ── Action Button ────────────────────────────────────────────
function ActionBtn({ onClick, children, primary = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "12px 0", borderRadius: 999,
        fontSize: 13, fontWeight: 700, color: "#fff",
        background: primary
          ? `linear-gradient(135deg, ${Color.primary.light}, ${Color.primary.main})`
          : Color.neutral.card,
        border: primary
          ? `1px solid ${Color.primary.lighter}`
          : `1px solid ${Color.neutral.border}`,
        boxShadow: primary ? `0 4px 20px ${Color.glow.blueSoft}` : "none",
        backdropFilter: "blur(6px)",
        cursor: "pointer", letterSpacing: "0.03em",
        transition: "filter 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.filter = "brightness(1.18)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = "brightness(1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function QuizResult({
  result ,
  onRepeat,
  onNextChallenge,
  onBackToMap,
}) {
  const { correct, wrong, timeSeconds, hintsUsed, xpGained, score, streak, quizTitle } = result;
  const navigate = useNavigate();
  const bgDim = (0.65)

  return (
    <>
      <div style={{
        minHeight: "100vh",
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `
    linear-gradient(rgba(0,0,0,${bgDim}), rgba(0,0,0,${bgDim})),
    url(${Bg})
  `,

      }}>
        <div style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: "28px 22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          fontFamily: "system-ui, sans-serif",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", margin: "0 0 5px" }}>
              RESULTADO FINAL
            </p>
            <h2 style={{ color: "#fff", margin: 0, fontSize: 17, fontWeight: 700 }}>
              {quizTitle}
            </h2>

            {streak > 1 && (
              <span style={{
                display: "inline-block", marginTop: 10,
                background: `linear-gradient(135deg, ${Color.secondary.dark}, ${Color.secondary.main})`,
                color: Color.secondary.lighter,
                fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 999,
                border: `1px solid rgba(255,185,0,0.25)`,
                boxShadow: `0 0 10px ${Color.glow.goldSoft}`,
              }}>
                🔥 Streak {streak} dias
              </span>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${Color.neutral.border}, transparent)` }} />

          {/* Ring */}
          <ScoreRing score={score} />

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
            <Stat icon="✅" label="CERTAS" value={correct} valueColor="#4cde7f" />
            <Stat icon="❌" label="ERRADAS" value={wrong} valueColor="#e05c5c" />
            <Stat icon="⏱" label="TEMPO" value={formatTime(timeSeconds)} />
            <Stat icon="💡" label="DICAS" value={hintsUsed} valueColor={Color.primary.brightest} />
          </div>

          {/* XP */}
          <XPBar xp={xpGained} />

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${Color.neutral.border}, transparent)` }} />

          {/* Buttons */}
          <div style={{ width: "65%", display: "flex", flexDirection: "column", gap: 10 }}>
            <ActionBtn onClick={onNextChallenge} primary>
              Próximo Desafio 🚀
            </ActionBtn>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={onRepeat}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 8,
                  transition: "filter 0.15s, transform 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <img src={buttonRemake} alt="Refazer" style={{ height: 65, width: 65 }} />
              </button>

              <button
                onClick={() => navigate("/FlorestaDosAlgoritmos")}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 8,
                  transition: "filter 0.15s, transform 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <img src={buttonMap} alt="Mapa" style={{ height: 65, width: 65 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}