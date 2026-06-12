export default function classifyFeedback(score, tentativas) {
  if (score >= 70 || tentativas <= 1) return 1
  if (score >= 40 || tentativas <= 3) return 2
  return 3
}