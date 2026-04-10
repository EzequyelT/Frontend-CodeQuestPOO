import api from "../api/axios";

export const getDesempenhoAluno = async (alunoId) => {
  try {
    const { data } = await api.get(`/desempenho/aluno/${alunoId}`);
    return data;
  } catch (err) {
    console.error("[Performance] Erro ao buscar:", err);
    return null;
  }
};

export const saveDesempenho = async (payload) => {
  try {
    const { data } = await api.post("/desempenho", payload);
    return data;
  } catch (err) {
    console.error("[Performance] Erro ao salvar:", err);
    return null;
  }
};