import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Lightbulb, 
  Coins, 
  Sparkles, 
  Flame, 
  Rocket 
} from "lucide-react";

import buttonMap from "../../../assets/Buttons/Mapa.png";
import buttonRemake from "../../../assets/Buttons/Refazer.png";
import Bg from "../../../assets/Maps/Bg-Map1.png";

function formatTime(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function getScoreLabel(score) {
  if (score >= 90) return { label: "Incrível!", color: "stroke-[#c4a878]", textColor: "text-[#c4a878]" };
  if (score >= 70) return { label: "Muito bom!", color: "stroke-[#7ab8ff]", textColor: "text-[#7ab8ff]" };
  if (score >= 50) return { label: "Bom esforço!", color: "stroke-[#f5c518]", textColor: "text-[#f5c518]" };
  return { label: "Continue tentando!", color: "stroke-[#e05c5c]", textColor: "text-[#e05c5c]" };
}

function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const { label, color, textColor } = getScoreLabel(score);

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
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-32">
        <div className="absolute inset-[-4px] rounded-full pointer-events-none shadow-[0_0_24px_6px_rgba(255,185,0,0.18),0_0_48px_12px_rgba(79,180,255,0.25)]" />
        
        <svg width={128} height={128} className="-rotate-90 block">
          <circle cx={64} cy={64} r={radius} fill="none" className="stroke-white/5" strokeWidth={10} />
          <circle 
            cx={64} cy={64} r={radius} fill="none" 
            className={`${color} transition-[stroke-dashoffset] duration-75 ease-linear`}
            strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} 
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <span className="text-3xl font-extrabold text-white leading-none">
            {displayed}
          </span>
          <span className="text-[10px] text-white/35 tracking-widest">
            SCORE
          </span>
        </div>
      </div>
      <span className={`text-trast text-sm font-bold mt-1 ${textColor}`}>{label}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex-1 min-w-[80px] bg-[#0a1e32]/45 border border-[#1e5a8e]/30 rounded-2xl p-3 flex flex-col items-center gap-1.5 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5">
      <Icon size={18} className={valueColor || "text-white"} />
      <span className={`text-base font-bold ${valueColor || "text-white"}`}>{value}</span>
      <span className="text-[9px] text-white/35 tracking-wider text-center uppercase">
        {label}
      </span>
    </div>
  );
}

function ProgressBar({ label, amount, suffix, colorClass, barGradient, shadowClass, max = 500 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min((amount / max) * 100, 100)), 200);
    return () => clearTimeout(t);
  }, [amount, max]);

  return (
    <div className="w-full px-0.5">
      <div className="flex justify-between text-xs text-white/40 mb-1.5">
        <span>{label}</span>
        <span className={`font-bold ${colorClass}`}>+{amount} {suffix}</span>
      </div>
      <div className="bg-white/5 border border-[#1e5a8e]/30 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} ${shadowClass} transition-all duration-[900ms] cubic-bezier(0.34,1.56,0.64,1)`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function ActionBtn({ onClick, children, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-full text-sm font-bold text-white tracking-wide cursor-pointer backdrop-blur-sm transition-all duration-150 hover:brightness-125 hover:-translate-y-0.5 ${
        primary 
          ? "bg-gradient-to-br from-[#3b7ab8] to-[#1e5a8e] border border-[#5a96d8] shadow-[0_4px_20px_rgba(79,180,255,0.25)]" 
          : "bg-[#0a1e32]/45 border border-[#1e5a8e]/30"
      }`}
    >
      {children}
    </button>
  );
}

export default function QuizResult({ result, onRepeat, onNextChallenge }) {
  const {
    correct,
    wrong,
    timeSeconds,
    hintsUsed,
    xpGained,
    coinsGained,
    score,
    streak,
    quizTitle
  } = result;

  const isPerfect = wrong === 0;
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${Bg})` }}
    >
      <div className="max-w-[500px] mx-auto px-5 py-7 flex flex-col items-center gap-6 font-sans">
        
        <div className="text-center w-full">
          <p className="text-[10px] text-white/30 tracking-widest mb-1 uppercase">
            Resultado Final
          </p>
          <h2 className="text-white text-lg font-bold m-0">
            {quizTitle}
          </h2>
          
          {isPerfect && (
            <div className="w-full mt-4 bg-gradient-to-br from-yellow-500/10 to-blue-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
              <p className="text-[#ffe08a] text-base font-bold mb-1 flex items-center justify-center gap-1.5">
                <Sparkles size={16} className="text-yellow-400" /> Pontuação Perfeita!
              </p>
              <p className="text-white/55 text-xs m-0 shelf-card leading-relaxed">
                Acertaste todas as questões sem errar nenhuma. Impressionante!
              </p>
            </div>
          )}

          {streak > 1 && (
            <span className="inline-flex items-center gap-1.5 mt-3 bg-gradient-to-br from-[#3a2010] to-[#8b5e1a] text-[#c4a878] text-[11px] font-bold px-4 py-1 rounded-full border border-yellow-500/25 shadow-[0_0_10px_rgba(255,185,0,0.18)]">
              <Flame size={13} className="fill-current" /> {streak} Streak totais! Continue assim
            </span>
          )}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e5a8e]/30 to-transparent" />

        <ScoreRing score={score} />

        <div className="flex gap-2.5 w-full flex-wrap">
          <Stat icon={CheckCircle2} label="Certas" value={correct} valueColor="text-[#4cde7f]" />
          <Stat icon={XCircle} label="Erradas" value={wrong} valueColor="text-[#e05c5c]" />
          <Stat icon={Timer} label="Tempo" value={formatTime(timeSeconds)} />
          <Stat icon={Lightbulb} label="Dicas" value={hintsUsed} valueColor="text-[#7ab8ff]" />
          <Stat icon={Coins} label="Moedas" value={coinsGained || 0} valueColor="text-[#fde047]" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <ProgressBar 
            label="⭐ XP ganho" 
            amount={xpGained} 
            suffix="XP" 
            colorClass="text-[#c4a878]" 
            barGradient="from-[#8b5e1a] to-[#c4a878]" 
            shadowClass="shadow-[0_0_8px_rgba(255,215,0,0.55)]"
          />
          <ProgressBar 
            label="💰 Moedas ganhas" 
            amount={coinsGained} 
            suffix="Coins" 
            colorClass="text-[#fde047]" 
            barGradient="from-[#ca8a04] to-[#fde047]" 
            shadowClass="shadow-[0_0_8px_rgba(255,215,0,0.5)]"
          />
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e5a8e]/30 to-transparent" />

        <div className="w-[65%] flex flex-col gap-2.5">
          <ActionBtn onClick={onNextChallenge} primary>
            <span className="flex items-center justify-center gap-2">
              Próximo Desafio <Rocket size={15} />
            </span>
          </ActionBtn>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onRepeat}
              className="bg-none border-none cursor-pointer p-2 transition-all duration-150 hover:brightness-125 hover:-translate-y-0.5 active:scale-95"
            >
              <img src={buttonRemake} alt="Refazer" className="h-16 w-16" />
            </button>

            <button
              onClick={() => navigate("/FlorestaDosAlgoritmos")}
              className="bg-none border-none cursor-pointer p-2 transition-all duration-150 hover:brightness-125 hover:-translate-y-0.5 active:scale-95"
            >
              <img src={buttonMap} alt="Mapa" className="h-16 w-16" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}