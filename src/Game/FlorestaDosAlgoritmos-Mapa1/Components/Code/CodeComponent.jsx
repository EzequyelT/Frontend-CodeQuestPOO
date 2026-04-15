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
}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen mr-15">

      <CodeBox
        tituloDoDesafio={currentQuestion?.titulo}
        initialCode={currentQuestion?.initialCode}   // ← vem do desafio
        onRun={runCode}                           // ← vem do hook
        loading={loading}
        addLog={addLog}
      />

      <div className="flex flex-row mt-2 gap-4 mb-2">
        <MentorBox 
         status={mentorStatus}
          messages={currentQuestion?.hints?.mentorMessages}
         />
        <div className="flex flex-col gap-2">
          <Objectives items={objectives} />       {/* ← vem do hook */}
          <ConsoleBox logs={logs} loading={loading} />
        </div>
      </div>

    </div>
  )
}