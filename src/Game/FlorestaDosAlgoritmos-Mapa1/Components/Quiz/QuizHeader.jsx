export default function QuizHeader({
  children,
  currentQuestion = 1,
  totalQuestions = 1,
  streak = 0,
}) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <header className="flex flex-col gap-3 px-5 py-4 w-200 mb-[30px]">
      <h1 className="text-white text-2xl font-bold">{children}</h1>

      <div className="flex items-center gap-3">
        <span className="text-[#4cde7f] text-sm font-medium whitespace-nowrap">
          Pergunta {currentQuestion} de {totalQuestions}
        </span>

        <div className="flex-1 bg-[#2e2e50] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300
             bg-[#4cde7f] animate-pulse
             shadow-[0_0_12px_#4cde7f,0_0_24px_#4cde7f]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-sm text-gray-400 whitespace-nowrap">
          → Streak: <strong className="text-amber-400">{streak}</strong>
        </span>
      </div>
    </header>
  );
}