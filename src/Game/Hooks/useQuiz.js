import { useState, useEffect } from "react"
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

    const timer = setTimeout(() => advanceQuestion(), 2000)
    return () => clearTimeout(timer)
    
  }, [currentResponse, currentIndex])

  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return
    if (showFailModal) return

    const score = Math.round((correct / perguntas.length) * 100)

    concluirDesafio(config.desafio_id, {
      respostas_erradas: wrong,
      tentativas: 1,
      tempo_desafio: timeSeconds,
      score: score,
      ajudas_usadas: 0,
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

  }, [finished, showFailModal])

  function resetQuiz() {
    setCurrentIndex(0)
    setCurrentResponse(null)
    setCorrect(0)
    setWrong(0)
    setFinished(false)
    setFinalResult(null)
    setDesempenhoGuardado(false)
    setConsecutiveWrong(0)
    setShowFailModal(false)
  }

  useEffect(() => {
    resetQuiz()
  }, [config.desafio_id])

  const currentQuestion = perguntas[currentIndex]
  const isUltima = currentIndex + 1 >= perguntas.length
  const progress = Math.round(((currentIndex + 1) / perguntas.length) * 100)

  function response(item) {
    if (currentResponse) return

    const isCorrect = item.id === currentQuestion.correctId
    setCurrentResponse({ item, isCorrect })

    if (isCorrect) {
      setCorrect(c => c + 1)
      setConsecutiveWrong(0) // ✅ acertou, reset do contador
    } else {
      setWrong(w => w + 1)
      setConsecutiveWrong(prev => {
        const next = prev + 1
        const perguntasRestantes = perguntas.length - currentIndex  
        if (next >= 4 && perguntasRestantes <= 2) setShowFailModal(true) // ✅ 4 erros + perto do fim
        return next
      })
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
  }
}