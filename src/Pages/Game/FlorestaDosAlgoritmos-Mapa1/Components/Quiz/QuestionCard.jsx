import { useState } from "react";
import { RotateCcw } from 'lucide-react';

export default function QuestionCard({
  children,
  label = "Solte aqui",
  onDrop,
  className = "",
}) {
  const [isOver, setIsOver] = useState(false);
  const [droppedItem, setDroppedItem] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  function handleDrop(e) {
    e.preventDefault();
    setIsOver(false);

    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    setDroppedItem(data);
    setIsCorrect(data.correct);
    onDrop?.(data);
  }

  function handleReset() {
    setDroppedItem(null);
    setIsCorrect(null);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      className={`
        relative w-45 min-h-[280px] rounded-2xl border-6 border-dashed
        flex flex-col items-center justify-center gap-4 p-4 text-center
        transition-all duration-200 select-none 
        ${isOver ? "border-[#7b5cff] bg-[#7b5cff20]" : "border-[#7b5cff] bg-white/[0.015]"}
        ${isCorrect === true ? "border-[#4a9a4a] bg-[#7b5cff20] animate-pulse-green" : ""}
        ${isCorrect === false ? "border-[#9a3a3a] bg-[#64282820]" : ""}
        ${className}
      `}
    >
      <span
        className="
          absolute -top-3 bg-[#0d1117] px-1
          font-cinzel text-[10px] tracking-widest text-[#ffffff] whitespace-nowrap
        "
      >
        {label}
      </span>

      {droppedItem ? (
        <>
          <p className="font-crimson text-lg font-semibold text-[#f0f0f0] leading-snug">
            {droppedItem.label}
          </p>
          <p
            className={`font-crimson text-[14px] tracking-wider ${
              isCorrect ? "text-[#19f027]" : "text-[#d32020]"
            }`}
          >
            {isCorrect ? "✦ Correto!" : "✗ Errado"}
          </p>
          <button
            onClick={handleReset}
            className="font-crimson text-[13px] animate-bounce mt-3 tracking-wide text-[#fdfdfd] underline hover:text-[#b4a9ff]"
          >
              <RotateCcw className="h-8 w-7" aria-placeholder="Tente de novo" />
          </button>
        </>
      ) : (
        <>
          <svg
            className="w-14 h-12 opacity-30 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7b5cff"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="font-crimson text-[14px] font-bold text-[#ffffff]">
            {children ?? "solte aqui"}
          </span>
        </>
      )}
    </div>
  );
}