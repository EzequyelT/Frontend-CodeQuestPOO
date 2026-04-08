import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// 🔌 MOCK DATA — substituir por chamada à API
// ─────────────────────────────────────────────
const MOCK_RESULT = {
  correct: 4,          // ✅ respostas certas
  wrong: 1,            // ❌ respostas erradas
  timeSeconds: 87,     // ⏱ tempo total em segundos
  hintsUsed: 2,        // 💡 dicas usadas
  xpGained: 320,       // ⭐ XP ganho
  score: 84,           // 📊 score 0–100
  streak: 5,           // 🔥 streak atual
  quizTitle: "Classe Veículo",
};

// ─────────────────────────────────────────────
// 🔌 CALLBACKS — conectar à API depois
// ─────────────────────────────────────────────
const API_HOOKS = {
  onRepeat: () => console.log("🔁 API: reiniciar quiz"),
  onNextChallenge: () => console.log("🚀 API: próximo desafio"),
  onBackToMap: () => console.log("🗺️ API: voltar ao mapa"),
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function getScoreLabel(score) {
  if (score >= 90) return { label: "Incrível!", color: "#4cde7f" };
  if (score >= 70) return { label: "Muito bom!", color: "#7c5cff" };
  if (score >= 50) return { label: "Bom esforço!", color: "#f5c518" };
  return { label: "Continue tentando!", color: "#e05c5c" };
}

// ─────────────────────────────────────────────
// Score ring animado
// ─────────────────────────────────────────────
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const { label, color } = getScoreLabel(score);

  useEffect(() => {
    let start = null;
    const duration = 900;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setDisplayed(Math.round(p * score));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={128} height={128} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={64} cy={64} r={radius} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
        <circle cx={64} cy={64} r={radius} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }} />
      </svg>
      <div style={{
        position: "relative", marginTop: -96, width: 128, height: 128,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2,
      }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          {displayed}
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
          SCORE
        </span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color, marginTop: 48 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
function Stat({ icon, label, value, valueColor }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "12px 10px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      flex: "1 1 80px",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: valueColor || "#fff" }}>{value}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// XP bar
// ─────────────────────────────────────────────
function XPBar({ xp }) {
  const max = 500;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min((xp / max) * 100, 100)), 200);
    return () => clearTimeout(t);
  }, [xp]);

  return (
    <div style={{ width: "100%", padding: "0 4px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6,
      }}>
        <span>⭐ XP ganho</span>
        <span style={{ color: "#f5c518", fontWeight: 700 }}>+{xp} XP</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg,#f5c518,#ff9500)",
          width: `${width}%`, transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function QuizResult({
  // 🔌 Props — passar dados reais vindos da API
  result = MOCK_RESULT,
  onRepeat = API_HOOKS.onRepeat,
  onNextChallenge = API_HOOKS.onNextChallenge,
  onBackToMap = API_HOOKS.onBackToMap,
}) {
  const { correct, wrong, timeSeconds, hintsUsed, xpGained, score, streak, quizTitle } = result;

  return (
    <div style={{
      borderRadius: 24, fontFamily: "system-ui,sans-serif",
      padding: "24px 20px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 20, maxWidth: 400, margin: "0 auto",
    }}>

      {/* Title */}
      <div style={{ textAlign: "center", width: "100%" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", margin: "0 0 4px" }}>
          RESULTADO FINAL
        </p>
        <h2 style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 700 }}>
          {quizTitle}
        </h2>
        {streak > 1 && (
          <span style={{
            display: "inline-block", marginTop: 8,
            background: "rgba(245,197,24,0.12)", color: "#f5c518",
            fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
            border: "1px solid rgba(245,197,24,0.25)",
          }}>
            🔥 Streak {streak} dias
          </span>
        )}
      </div>

      {/* Score ring */}
      <ScoreRing score={score} />

      {/* Stats grid */}
      <div style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap" }}>
        <Stat icon="✅" label="CERTAS" value={correct} valueColor="#4cde7f" />
        <Stat icon="❌" label="ERRADAS" value={wrong} valueColor="#e05c5c" />
        <Stat icon="⏱" label="TEMPO" value={formatTime(timeSeconds)} />
        <Stat icon="💡" label="DICAS" value={hintsUsed} valueColor="#7c5cff" />
      </div>

      {/* XP bar */}
      <XPBar xp={xpGained} />

      {/* Divider */}
      <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* Buttons */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={onNextChallenge}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 999,
            fontSize: 14, fontWeight: 700, color: "#fff",
            background: "linear-gradient(135deg,#7c5cff 0%,#4c3ab0 100%)",
            border: "none", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(124,92,255,0.4)",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.12)"}
          onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
        >
          Próximo Desafio 🚀
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onRepeat}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 999,
              fontSize: 13, fontWeight: 700, color: "#f5c518",
              background: "linear-gradient(180deg,#2d1654 0%,#1e0f3d 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.15)"}
            onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
          >
            🔁 Repetir
          </button>

          <button
            onClick={onBackToMap}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 999,
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            🗺️ Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}