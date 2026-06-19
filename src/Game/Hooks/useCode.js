import { useState, useEffect, useRef } from "react"
import { concluirDesafio } from "../../Services/Gameplay/xpProgressService"
import { getPyodide } from "../../Python/pyodideEngine"
import formatError from "../../Python/ErrorPyton"
import classifyError from "../../Python/classifyError"
import classifyFeedback from "../../Python/classifyFeedback"
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
  const totalCorrectRef = useRef(0)

  const tipoErroAtualRef = useRef(null)
  const tipoFeedbackAtualRef = useRef(1)
  const feedbackIaAtualRef = useRef(null)

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

    totalAttemptsRef.current = 0

    if (currentHint.start) {
      addLog("info", currentHint.start)
    }
  }, [currentIndex])

  useEffect(() => {
    if (finished || showFailModal) return

    const t = setInterval(() => {
      setTimeSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 3000)

    return () => clearInterval(t)
  }, [finished, showFailModal, startTime])

  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return
    if (showFailModal) return

    setSaving(true)

    const totalTentativas = totalCorrectRef.current + totalWrongRef.current
    const score =
      totalTentativas > 0
        ? Math.round((totalCorrectRef.current / totalTentativas) * 100)
        : 0

    console.log("SAVE →", {
      erradas: totalWrongRef.current,
      tentativas: totalAttemptsRef.current,
      certas: totalCorrectRef.current,
      time: timeSeconds,
      streakAtual: streakAtual,
      tipo_erro_id: tipoErroAtualRef.current,
      tipo_feedback_id: tipoFeedbackAtualRef.current,
      feedback_ia: feedbackIaAtualRef.current,
    })

    concluirDesafio(config.desafio_id, {
      respostas_certas: totalCorrectRef.current,
      respostas_erradas: totalWrongRef.current,
      tentativas: totalAttemptsRef.current,
      tempo_desafio: timeSeconds,
      score,
      ajudas_usadas: 0,
      novo_streak: streakAtual,
      tipo_erro_id: tipoErroAtualRef.current,
      tipo_feedback_id: tipoFeedbackAtualRef.current,
      feedback_ia: feedbackIaAtualRef.current,
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
    totalAttemptsRef.current += 1

    setWrong(w => w + 1)
    setAttempts(a => a + 1)
    setTotalAttempts(a => a + 1)

    addLog("error", message)

    return totalAttemptsRef.current
  }

  async function gerarFeedbackErro({ code, finalOutput, erro, rawError, tentativa }) {
    try {
      const tipoErroId = classifyError(rawError)
      console.log("classifyError result →", classifyError(rawError))
      tipoErroAtualRef.current = tipoErroId

      // Calcula score parcial para determinar tipo de feedback
      const totalAteTentativa = totalCorrectRef.current + totalWrongRef.current + 1
      const scoreParcial = totalAteTentativa > 0
        ? Math.round((totalCorrectRef.current / totalAteTentativa) * 100)
        : 0
      const tipoFeedbackId = classifyFeedback(scoreParcial, tentativa)
      tipoFeedbackAtualRef.current = tipoFeedbackId

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
        tipo_erro_id: tipoErroId,
        tipo_feedback_id: tipoFeedbackId,
      })

      feedbackIaAtualRef.current = feedback
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

      console.log({
        output,
        finalOutput,
        isValid,
        consecutiveWrong,
      })

      if (isValid) {
        setMentorStatus("success")

        addLog(
          "success",
          currentHint.success || output || "Correto! 🎉"
        )

        setCorrect(c => c + 1)
        totalCorrectRef.current += 1

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

        const nextAttempts = addErrorLog(
          currentHint.error
            ? `❌ ${currentHint.error}`
            : `❌ ${finalOutput || "Output vazio"}`
        )

        setMentorStatus("typing")

        await gerarFeedbackErro({
          code,
          finalOutput,
          erro: finalOutput,
          rawError: error || finalOutput,
          tentativa: nextAttempts,
        })

        setMentorStatus("error")

        setStreakAtual(0)

        if (totalAttemptsRef.current >= 3) {
          totalWrongRef.current += 1
          setTotalWrong(t => t + 1)

          if (totalWrongRef.current >= 2) {
            setShowFailModal(true)
            setTransitioning(false)
            setLoading(false)
            return { success: false, output: finalOutput }
          }

          addLog("warning", "⚠️ Número máximo de tentativas atingido. Indo para próxima pergunta...")

          setTransitioning(true)
          setTimeout(() => {
            if (isUltima) setFinished(true)
            else setCurrentIndex(i => i + 1)
            setTransitioning(false)
          }, 1600)
        }

        return {
          success: false,
          output: finalOutput
        }
      }
    } catch (err) {
      const clean = formatError(err?.message || String(err))
      const tipoErroId = classifyError(err?.message || String(err))
      tipoErroAtualRef.current = tipoErroId

      setMentorStatus("error")

      await gerarFeedbackErro({
        code,
        erro: clean,
        rawError: err?.message || String(err),
        tentativa: attempts + 1,
      })
      addErrorLog(clean)

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
    transitioning,
  }
}