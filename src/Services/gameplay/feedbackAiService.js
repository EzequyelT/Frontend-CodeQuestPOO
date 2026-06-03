import api from "../api/axios"

export async function pedirFeedbackIA(payload) {
  const response = await api.post("/feedback-ai", payload)
  return response.data.feedback
}