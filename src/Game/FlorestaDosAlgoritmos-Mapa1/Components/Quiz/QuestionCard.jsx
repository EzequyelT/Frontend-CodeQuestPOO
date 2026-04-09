import { useState } from "react";
import { RotateCcw } from 'lucide-react';

export default function QuestionCard({
  children,
  label = "Solte aqui",
  onDrop,
  dropped = null,   // { item: { id, label }, isCorrect: true/false } | null
  pergunta = "",    
  className = "",
}) {
  const [isOver, setIsOver] = useState(false);

  // ✅ lê do objeto dropped, não de estado local
  const isCorrect = dropped?.isCorrect ?? null;
  const droppedItem = dropped?.item ?? null;

  function handleDrop(e) {
    e.preventDefault();
    setIsOver(false);
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    onDrop?.(data);   // ✅ delega para o hook — não guarda localmente
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
          ${isOver ? "border-[#7b5cff] bg-[#7b5cff20]" : "border-[#7b5cff] bg-white/[0.015]"}
          ${isCorrect === true  ? "border-[#4a9a4a] bg-[#7b5cff20] animate-pulse-green" : ""}
          ${isCorrect === false ? "border-[#9a3a3a] bg-[#64282820]" : ""}
          ${className}
        `}
      >
        <span className="absolute -top-3 bg-[#0d1117] px-1 font-cinzel text-[10px] tracking-widest text-white whitespace-nowrap">
          {label}
        </span>

        {droppedItem ? (
          <>
            <p className="font-crimson text-lg font-semibold text-[#f0f0f0] leading-snug">
              {droppedItem.label}
            </p>
            <p className={`font-crimson text-[14px] tracking-wider animate-pulse ${isCorrect ? "text-[#19f027]" : "text-[#d32020]"}`}>
              {isCorrect ? "✦ Correto!" : "✗ Errado"}
            </p>
          </>
        ) : (
          <>
            <svg className="w-14 h-12 opacity-30 animate-bounce" viewBox="0 0 24 24"
              fill="none" stroke="#7b5cff" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <span className="font-crimson text-[14px] font-bold text-white">
              {children ?? "solte aqui"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}