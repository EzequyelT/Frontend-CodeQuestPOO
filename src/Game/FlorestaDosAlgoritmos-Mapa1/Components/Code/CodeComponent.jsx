import CodeBox from "./codeBox"
import ConsoleBox from "./ConsoleBox"
import Objectives from "./objectives"
import MentorBox from "./MentorBox"

export default function CodeComponent({
  currentQuestion,
  logs,
  loading,
  mentorStatus,
  objectives,
  runCode,
  addLog,
  hints,
  transitioning,
}) {

  return (

    <div className="relative flex flex-col justify-center items-center h-screen mr-15">

      {transitioning && (
        <div className="absolute inset-10 z-9 flex items-center justify-center">

          <div className="text-center text-white">

            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

            <p className="font-bold text-xl">
              Próxima pergunta...
            </p>

          </div>

        </div>
      )}

      <div
        className={`
          transition-all duration-300 ease-in-out
          ${transitioning
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
          }
        `}
      >

        <CodeBox
          tituloDoDesafio={currentQuestion?.titulo}
          initialCode={currentQuestion?.initialCode}
          onRun={runCode}
          loading={loading || transitioning}
          addLog={addLog}
        />

        <div className="flex flex-row mt-2 gap-4 mb-2">

          <MentorBox
            status={mentorStatus}
            messages={{
              phase: {
                error: hints?.error,
                success: hints?.success,
              }
            }}
          />

          <div className="flex flex-col gap-2">

            <Objectives items={objectives} />

            <ConsoleBox
              logs={logs}
              loading={loading || transitioning}
            />

          </div>

        </div>

      </div>

    </div>
  )
}