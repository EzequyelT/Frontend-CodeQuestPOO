import api from "../api/axios";

export const getUserTempo = async () => {
  try {
    const { data } = await api.get("/jogadorTempo");
    return data;
  } catch (err) {
    console.error("[TempoJogador] Erro ao buscar:", err);
    return null;
  }
};