import api from "../api/axios"

export async function pedirFeedbackIA(payload) {
  try {
    const response = await api.post("/feedback-ai", payload)
    return response.data.feedback
  } catch (error) {
    console.error("Erro ao pedir feedback da IA:", error);
    throw error
  }
}