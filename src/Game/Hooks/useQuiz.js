import { useState, useEffect } from "react"

export function useQuiz(perguntas = []) {
  const [currentIndex, setCurrentIndex] = useState(0)   // qual pergunta estamos
  const [respostaAtual, setRespostaAtual] = useState(null) // { item, isCorrect }
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeSeconds, setTimeSeconds] = useState(0)
  // Avançar para a próxima pergunta

  function avancar() {
    setRespostaAtual(null)
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
    if (!respostaAtual) return
    const timer = setTimeout(() => avancar(), 2000)
    return () => clearTimeout(timer)
  }, [respostaAtual])

  const perguntaAtual = perguntas[currentIndex]  // objeto { texto, opcoes, correctId }
  const isUltima = currentIndex + 1 >= perguntas.length
  const progress = Math.round((currentIndex / perguntas.length) * 100)

  // Chamado quando o utilizador solta uma resposta no slot
  function responder(item) {
    if (respostaAtual) return // já respondeu, ignora

    const isCorrect = item.id === perguntaAtual.correctId
    setRespostaAtual({ item, isCorrect })

    if (isCorrect) setCorrect(c => c + 1)
    else setWrong(w => w + 1)
  }

  // Resetar o slot atual (botão RotateCcw)
  function resetSlot() {
    if (!respostaAtual) return
    if (respostaAtual.isCorrect) setCorrect(c => c - 1)
    else setWrong(w => w - 1)
    setRespostaAtual(null)
  }


  return {
    perguntaAtual,     // { id, texto, opcoes, correctId }
    currentIndex,
    progress,
    respostaAtual,     // { item, isCorrect } ou null
    correct,
    wrong,
    timeSeconds,
    finished,
    isUltima,
    totalQuestions: perguntas.length,
    responder,
    resetSlot,
    avancar,
  }
}