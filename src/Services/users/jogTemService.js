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

export const getHistoricoSemanal = async () => {
  try {
    const { data } = await api.get("/jogadorTempo/historico");
    return data;
  } catch (error) {
    console.error("[TempoJogador] Erro ao buscar:", error);
    return null;
  }
}