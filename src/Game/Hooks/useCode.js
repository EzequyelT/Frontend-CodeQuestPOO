import { useState, useEffect } from "react"
import { concluirDesafio } from "../../Services/Gameplay/xpProgressService"
import { getPyodide } from "../../Python/pyodideEngine"
import formatError from "../../Python/ErrorPyton"

export function useCode(fases = [], config = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [mentorStatus, setMentorStatus] = useState("idle")

  const [objectives, setObjectives] = useState([])
  const [finished, setFinished] = useState(false)

  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const [startTime] = useState(() => Date.now())
  const [timeSeconds, setTimeSeconds] = useState(0)

  const [finalResult, setFinalResult] = useState(null)
  const [desempenhoGuardado, setDesempenhoGuardado] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentQuestion = fases[currentIndex]
  const isUltima = currentIndex + 1 >= fases.length
  const currentHint = currentQuestion?.hints || {}

  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [showFailModal, setShowFailModal] = useState(false)

  // RESET DA FASE
  useEffect(() => {
    if (!currentQuestion) return

    setObjectives(
      currentQuestion.objectives?.map(obj => ({ ...obj, done: false })) ?? []
    )

    setLogs([])
    setMentorStatus("idle")
    setConsecutiveWrong(0)

    if (currentHint.start) {
      addLog("info", currentHint.start)
    }
  }, [currentIndex])

  // TIMER
  useEffect(() => {
    if (finished || showFailModal) return

    const t = setInterval(() => {
      setTimeSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(t)
  }, [finished, showFailModal, startTime])

  // SALVAR RESULTADO FINAL
  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return
    if (showFailModal) return

    setSaving(true)

    const totalTentativas = correct + wrong
    const score =
      totalTentativas > 0
        ? Math.round((correct / totalTentativas) * 100)
        : 0

    concluirDesafio(config.desafio_id, {
      respostas_erradas: wrong,
      tentativas: attempts,
      tempo_desafio: timeSeconds,
      score,
      ajudas_usadas: 0,
    })
      .then((resultado) => {
        if (!resultado) return
        setDesempenhoGuardado(true)
        setFinalResult(resultado)
        console.log("✅ Desafio concluído!", resultado)
      })
      .catch((err) => {
        console.error("Erro ao guardar desempenho", err)
      })
      .finally(() => {
        setSaving(false)
      })
  }, [finished, showFailModal])

  // LOGS
  function addLog(type, message) {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { type, message, time }])
  }

  function addErrorLog(message) {
    setWrong(w => w + 1)
    addLog("error", message)
  }

  // RUN CODE
  async function runCode(code) {
    if (loading) return

    setLoading(true)
    setMentorStatus("typing")
    setAttempts(a => a + 1)

    addLog("info", "🐍 Executando código...")

    try {
      const pyodide = await getPyodide()

      let stdout = ""
      let stderr = ""

      pyodide.setStdout({
        batched: (text) => {
          stdout += text + "\n"
        }
      })

      pyodide.setStderr({
        batched: (text) => {
          stderr += text + "\n"
        }
      })

      await pyodide.runPythonAsync(code)

      const output = stdout.trim()
      const error = stderr.trim()
      const finalOutput = error ? formatError(error) : output

      const isValid = currentQuestion?.validate?.(output) ?? false

      if (isValid) {
        setMentorStatus("success")

        addLog(
          "success",
          currentHint.success || output || "Correto! 🎉"
        )

        setCorrect(c => c + 1)

        setConsecutiveWrong(0)

        setObjectives(prev =>
          prev.map(obj => ({ ...obj, done: true }))
        )

        setTimeout(() => {
          if (isUltima) setFinished(true)
          else setCurrentIndex(i => i + 1)
        }, 1500)

        return { success: true, output }
      } else {
        setMentorStatus("error")

        addErrorLog(
          currentHint.error
            ? `❌ ${currentHint.error}`
            : `❌ ${finalOutput || "Output vazio"}`
        )

        setConsecutiveWrong(prev => {
          const next = wrong + 1
          if (next >= 5) setShowFailModal(true)
          return next
        })

        return { success: false, output: finalOutput }
      }

    } catch (err) {
      const clean = formatError(err?.message || String(err))

      setMentorStatus("error")
      addErrorLog(clean)

      return { success: false, message: clean }

    } finally {
      setLoading(false)
    }
  }


  return {
    currentQuestion,
    currentIndex,
    logs,
    loading,
    mentorStatus,
    objectives,
    finished,
    timeSeconds,
    correct,
    wrong,
    attempts,
    finalResult,
    saving,
    addLog,
    runCode,
    showFailModal,
  }
}