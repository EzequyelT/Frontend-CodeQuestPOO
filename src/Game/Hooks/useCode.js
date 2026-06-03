import { useState, useEffect, useRef } from "react"
import { concluirDesafio } from "../../Services/Gameplay/xpProgressService"
import { getPyodide } from "../../Python/pyodideEngine"
import formatError from "../../Python/ErrorPyton"
import { pedirFeedbackIA } from "../../Services/Gameplay/feedbackAIService"

export function useCode(fases = [], config = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [mentorStatus, setMentorStatus] = useState("idle")
  const [aiFeedback, setAiFeedback] = useState(null)

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

  const [totalWrong, setTotalWrong] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [streakAtual, setStreakAtual] = useState(config.streakInicial ?? 0)
  const [transitioning, setTransitioning] = useState(false)

  const totalWrongRef = useRef(0)
  const totalAttemptsRef = useRef(0)

  useEffect(() => {
    if (!currentQuestion) return

    setObjectives(
      currentQuestion.objectives?.map(obj => ({ ...obj, done: false })) ?? []
    )

    setLogs([])
    setMentorStatus("idle")
    setAiFeedback(null)
    setConsecutiveWrong(0)
    setShowFailModal(false)
    setWrong(0)
    setAttempts(0)

    if (currentHint.start) {
      addLog("info", currentHint.start)
    }
  }, [currentIndex])

  useEffect(() => {
    if (finished || showFailModal) return

    const t = setInterval(() => {
      setTimeSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(t)
  }, [finished, showFailModal, startTime])

  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return
    if (showFailModal) return

    setSaving(true)

    const totalTentativas = correct + totalWrongRef.current
    const score =
      totalTentativas > 0
        ? Math.round((correct / totalTentativas) * 100)
        : 0

    concluirDesafio(config.desafio_id, {
      respostas_erradas: totalWrong,
      tentativas: totalAttempts,
      tempo_desafio: timeSeconds,
      score,
      ajudas_usadas: 0,
      novo_streak: streakAtual,
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

  function addLog(type, message) {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { type, message, time }])
  }

  function addErrorLog(message) {
    totalWrongRef.current += 1
    totalAttemptsRef.current += 1
    setWrong(w => w + 1)
    setAttempts(a => a + 1)
    setTotalAttempts(a => a + 1)
    setTotalWrong(t => t + 1)
    addLog("error", message)
  }

  async function gerarFeedbackErro({ code, finalOutput, erro, tentativa }) {
    try {
      const feedback = await pedirFeedbackIA({
        titulo: currentQuestion?.title || currentQuestion?.titulo || currentQuestion?.name || "Desafio",
        objetivos:
          currentQuestion?.objectives?.map(obj =>
            obj.label || obj.text || obj.description || obj.title || String(obj)
          ) ?? [],
        codigo: code,
        output: finalOutput ?? "",
        erro: erro ?? "",
        tentativa,
      })

      setAiFeedback(feedback)
      return feedback
    } catch (err) {
      console.error("Erro ao pedir feedback IA:", err)
      return null
    }
  }

  async function runCode(code) {
    if (loading) return

    setLoading(true)
    setMentorStatus("typing")
    setAiFeedback(null)

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

      const isValid = currentQuestion?.validate?.(finalOutput) ?? false

      if (isValid) {
        setMentorStatus("success")

        addLog(
          "success",
          currentHint.success || output || "Correto! 🎉"
        )

        setCorrect(c => c + 1)
        setConsecutiveWrong(0)
        setStreakAtual(s => s + 1)

        setObjectives(prev =>
          prev.map(obj => ({ ...obj, done: true }))
        )

        setTransitioning(true)

        setTimeout(() => {
          if (isUltima) setFinished(true)
          else setCurrentIndex(i => i + 1)

          setTransitioning(false)
        }, 1500)

        return { success: true, output }
      } else {
        setMentorStatus("error")

        const nextAttempts = attempts + 1

        const feedbackIA = await gerarFeedbackErro({
          code,
          finalOutput,
          tentativa: nextAttempts,
        })

        addErrorLog(
          feedbackIA
            ? `🤖 ${feedbackIA}`
            : currentHint.error
              ? `❌ ${currentHint.error}`
              : `❌ ${finalOutput || "Output vazio"}`
        )

        setStreakAtual(0)

        if (nextAttempts >= 3) {
          addLog(
            "warning",
            "⚠️ Número máximo de tentativas atingido. Indo para próxima pergunta..."
          )

          setTransitioning(true)

          setTimeout(() => {
            if (isUltima) {
              setFinished(true)
            } else {
              setCurrentIndex(i => i + 1)
            }
            setTransitioning(false)
          }, 1500)
        }

        return { success: false, output: finalOutput }
      }
    } catch (err) {
      const clean = formatError(err?.message || String(err))

      setMentorStatus("error")

      const feedbackIA = await gerarFeedbackErro({
        code,
        erro: clean,
        tentativa: attempts + 1,
      })

      addErrorLog(feedbackIA ? `🤖 ${feedbackIA}` : clean)
      setStreakAtual(0)

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
    aiFeedback,
    objectives,
    finished,
    timeSeconds,
    correct,
    wrong,
    totalWrong,
    totalAttempts,
    attempts,
    finalResult,
    saving,
    addLog,
    runCode,
    showFailModal,
    streakAtual,
    transitioning
  }
}