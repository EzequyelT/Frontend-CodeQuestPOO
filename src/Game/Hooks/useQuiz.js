import { useState, useEffect, useCallback } from "react"
import { concluirDesafio } from "../../Services/Gameplay/xpProgressService"

export function useQuiz(perguntas = [], config = {}) {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentResponse, setCurrentResponse] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)

  const [finished, setFinished] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeSeconds, setTimeSeconds] = useState(0)
  const [finalResult, setFinalResult] = useState(null)
  const [desempenhoGuardado, setDesempenhoGuardado] = useState(false)

  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [showFailModal, setShowFailModal] = useState(false)
  const [streakAtual, setStreakAtual] = useState(config.streakInicial ?? 0);
  const [transitioning, setTransitioning] = useState(false)

  function advanceQuestion() {
    setCurrentResponse(null)
    if (isUltima) setFinished(true)
    else setCurrentIndex(i => i + 1)
  }

  useEffect(() => {
    if (finished || showFailModal) return

    const t = setInterval(() =>
      setTimeSeconds(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)

  }, [finished, startTime, showFailModal])

  useEffect(() => {
    if (!currentResponse) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransitioning(true)

    const timer = setTimeout(() => {
      advanceQuestion()
      setTransitioning(false)
    }, 1600)

    return () => clearTimeout(timer)

  }, [currentResponse])


  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return
    if (showFailModal) return

    const score = Math.round((correct / perguntas.length) * 100)

    concluirDesafio(config.desafio_id, {
      respostas_certas: correct,
      respostas_erradas: wrong,
      tentativas: 1,
      tempo_desafio: timeSeconds,
      score: score,
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
        console.error("Erro no desempenho", err)
      })

  }, [
    finished,
    showFailModal,
    correct,
    wrong,
    timeSeconds,
    perguntas.length,
    desempenhoGuardado,
    config,
    streakAtual
  ])

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0)
    setCurrentResponse(null)
    setCorrect(0)
    setWrong(0)
    setFinished(false)
    setFinalResult(null)
    setDesempenhoGuardado(false)
    setConsecutiveWrong(0)
    setShowFailModal(false)
    setStreakAtual(config.streakInicial ?? 0)
  }, [config.streakInicial])

  // Este efeito é intencional: precisamos sincronizar o estado local
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetQuiz()
  }, [config.desafio_id, resetQuiz])

  const currentQuestion = perguntas[currentIndex]
  const isUltima = currentIndex + 1 >= perguntas.length
  const progress = Math.round(((currentIndex + 1) / perguntas.length) * 100)

  function startTransition(callback) {
    setTransitioning(true)

    setTimeout(() => {
      callback?.()
      setTransitioning(false)
    }, 1500)
  }

  function response(item) {
    if (currentResponse) return

    const isCorrect = item.id === currentQuestion.correctId
    setCurrentResponse({ item, isCorrect })

    if (isCorrect) {
      setCorrect(c => c + 1)
      setConsecutiveWrong(0)
      setStreakAtual(s => s + 1)

      startTransition()
    } else {
      setWrong(w => w + 1)
      setStreakAtual(0)
      setConsecutiveWrong(prev => {
        const next = prev + 1
        const perguntasRestantes = perguntas.length - currentIndex
        if (next >= 4 && perguntasRestantes <= 2) setShowFailModal(true), setTransitioning(false)
        return next
      })
      startTransition()
    }
  }

  function resetSlot() {
    if (!currentResponse) return
    if (currentResponse.isCorrect) setCorrect(c => c - 1)
    else setWrong(w => w - 1)
    setCurrentResponse(null)
  }

  return {
    currentQuestion,
    currentIndex,
    progress,
    currentResponse,
    correct,
    wrong,
    timeSeconds,
    finished,
    isUltima,
    totalQuestions: perguntas.length,
    response,
    resetSlot,
    advanceQuestion,
    finalResult,
    showFailModal,
    resetQuiz,
    consecutiveWrong,
    streakAtual,
    transitioning
  }
}