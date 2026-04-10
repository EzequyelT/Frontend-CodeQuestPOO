import api from "../api/axios";

export const obterXPAluno = async () => {
  try {
    const { data } = await api.get("/desafios");
    return data;
  } catch (error) {
    console.error("Erro ao obter XP do aluno:", error);
    throw error;
  }
};

export const concluirDesafio = async (desafioId, payload) => {
  try {
    const { data } = await api.post(`/desafios/concluir/${desafioId}`, payload);
    return data;
  } catch (error) {
    console.error("Erro ao concluir desafio:", error);
    throw error;
  }
};