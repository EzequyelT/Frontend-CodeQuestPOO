import { useState, useEffect } from "react";

const CARD_STYLES = `
  @keyframes rotate-border {
    to { --angle: 360deg; }
  }
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes rotate-border-wrong {
    to { --angle-wrong: 360deg; }
  }
  @property --angle-wrong {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.7; }
    50%       { opacity: 1; }
  }
  @keyframes shake {
    10%, 90% { transform: translateX(-3px); }
    20%, 80% { transform: translateX(5px); }
    30%, 50%, 70% { transform: translateX(-6px); }
    40%, 60% { transform: translateX(6px); }
  }
  @keyframes flash-red {
    0%   { background: rgba(255,45,85,0.22); }
    100% { background: rgba(100,40,40,0.125); }
  }
  @keyframes pop-in {
    0%   { transform: scale(0.5) rotate(-6deg); opacity: 0; }
    70%  { transform: scale(1.15) rotate(2deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes slam-in {
    0%   { transform: scale(1.4); opacity: 0; }
    60%  { transform: scale(0.92); }
    100% { transform: scale(1); opacity: 1; }
  }

  .card-correct {
    border: 3px solid transparent !important;
    isolation: isolate;
  }
  .card-correct::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 24px;
    padding: 3px;
    background: conic-gradient(from var(--angle), #00ff88, #00e5ff, #a8ff78, #00ff88);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: rotate-border 1.6s linear infinite;
    z-index: -1;
  }
  .card-correct::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 28px;
    box-shadow: 0 0 18px 4px rgba(0,255,136,0.35), 0 0 40px 8px rgba(0,229,255,0.15);
    animation: glow-pulse 1.6s ease-in-out infinite;
    z-index: -2;
  }

  .card-wrong {
    border: 3px solid transparent !important;
    isolation: isolate;
    animation: shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both,
               flash-red 0.5s ease forwards;
  }
  .card-wrong::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 24px;
    padding: 3px;
    background: conic-gradient(from var(--angle-wrong), #ff2d55, #ff6b00, #d32020, #ff2d55);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: rotate-border-wrong 2s linear infinite;
    z-index: -1;
  }
  .card-wrong::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 28px;
    box-shadow: 0 0 18px 4px rgba(211,32,32,0.4), 0 0 40px 8px rgba(255,45,85,0.15);
    animation: glow-pulse 1.8s ease-in-out infinite;
    z-index: -2;
  }

  .result-correct {
    animation: pop-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97) both;
  }
  .result-wrong {
    animation: slam-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97) both;
  }
`;

export default function QuestionCard({
  children,
  label = "Solte aqui",
  onDrop,
  dropped = null,
  pergunta = "",
  className = "",
}) {
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!document.getElementById("question-card-styles")) {
      const style = document.createElement("style");
      style.id = "question-card-styles";
      style.textContent = CARD_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  const isCorrect = dropped?.isCorrect ?? null;
  const droppedItem = dropped?.item ?? null;

  function handleDrop(e) {
    e.preventDefault();
    setIsOver(false);
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    onDrop?.(data);
  }

  return (
    <div className="flex flex-col items-center gap-4">

      {pergunta && (
        <p className="font-crimson text-white text-2xl mb-2 mr-25 font-bold text-center max-w-sm">
          {pergunta}
        </p>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        className={`
          relative w-45 min-h-[280px] rounded-3xl border-6 border-dashed
          flex flex-col items-center justify-center gap-4 p-4 text-center
          transition-all duration-200 select-none mr-25
          ${isOver ? "border-[#f2f2f2] bg-[#7b5cff20]" : "border-[#ffffff] bg-white/[0.015]"}
          ${isCorrect === true  ? "card-correct bg-[#f4f4f420]" : ""}
          ${isCorrect === false ? "card-wrong bg-[#64282820]"   : ""}
          ${className}
        `}
      >
        <span className="absolute -top-3 bg-[#0d1117] px-2 font-cinzel text-[10px] tracking-widest text-white whitespace-nowrap">
          {label}
        </span>

        {droppedItem ? (
          <>
            <p className="font-crimson text-lg font-semibold text-[#f0f0f0] leading-snug">
              {droppedItem.label}
            </p>
            <p className={`font-bold text-[16px] tracking-wider ${isCorrect ? "text-[#19f027] result-correct" : "text-[#d32020] result-wrong"}`}>
              {isCorrect ? "✦ Correto!" : "✗ Errado"}
            </p>
          </>
        ) : (
          <>
            <svg className="w-14 h-12 opacity-30 animate-bounce" viewBox="0 0 24 24"
              fill="none" stroke="rgba(79, 180, 255, 0.6)" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <span className="font-crimson text-[16px] font-bold text-white">
              {children ?? "solte aqui"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}