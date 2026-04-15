import { useState, useEffect } from "react"
import { concluirDesafio } from "../../Services/Gameplay/xpProgressService"

export function useQuiz(perguntas = [], config = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)   // qual pergunta estamos
  const [currentResponse, setCurrentResponse] = useState(null) // { item, isCorrect }
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeSeconds, setTimeSeconds] = useState(0)
  const [finalResult, setFinalResult] = useState(null)

  //Estado para controlar a comunicação com a API para salvar o desempenho
  const [desempenhoGuardado, setDesempenhoGuardado] = useState(false)


  // Avançar para a próxima pergunta

  function advanceQuestion() {
    setCurrentResponse(null)
    if (isUltima) setFinished(true)   // ← só muda o estado
    else setCurrentIndex(i => i + 1)
  }
  // Timer
  useEffect(() => {
    if (finished) return
    const t = setInterval(() =>
      setTimeSeconds(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)
  }, [finished, startTime])

  useEffect(() => {
    if (!currentResponse) return
    const timer = setTimeout(() => advanceQuestion(), 2000)
    return () => clearTimeout(timer)
  }, [currentResponse])

  useEffect(() => {
    if (!finished) return
    if (!config.token || !config.desafio_id) return
    if (desempenhoGuardado) return

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

  }, [finished])

  const currentQuestion = perguntas[currentIndex]  // objeto { texto, opcoes, correctId }
  const isUltima = currentIndex + 1 >= perguntas.length
  const progress = Math.round(((currentIndex + 1) / perguntas.length) * 100)

  // Chamado quando o utilizador solta uma resposta no slot
  function response(item) {
    if (currentResponse) return // já respondeu, ignora

    const isCorrect = item.id === currentQuestion.correctId
    setCurrentResponse({ item, isCorrect })

    if (isCorrect) setCorrect(c => c + 1)
    else setWrong(w => w + 1)
  }

  // Resetar o slot atual (botão RotateCcw)
  function resetSlot() {
    if (!currentResponse) return
    if (currentResponse.isCorrect) setCorrect(c => c - 1)
    else setWrong(w => w - 1)
    setCurrentResponse(null)
  }


  return {
    currentQuestion,     // { id, texto, opcoes, correctId }
    currentIndex,
    progress,
    currentResponse,     // { item, isCorrect } ou null
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
  }
}