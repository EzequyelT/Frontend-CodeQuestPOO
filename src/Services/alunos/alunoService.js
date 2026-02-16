import api from "./api";

export const fetchAlunos = async () => {
  try {
    const response = await api.get("/alunos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    throw error;
  }
};

export const fetchAlunoById = async (id) => {
  try {
    const response = await api.get(`/alunos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Aluno não encontrado:", error);
    throw error;
  }
};

export const criarAluno = async (utilizador_id, ano, turma, escola) => {
  try {
    const response = await api.post("/alunos", {
      utilizador_id,
      ano,
      turma,
      escola,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    throw error;
  }
};

export const atualizarAluno = async (id, ano, turma, escola) => {
  try {
    const response = await api.put(`/alunos/${id}`, {
      ano,
      turma,
      escola,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw error;
  }
};

export const eliminarAluno = async (id) => {
  try {
    const response = await api.delete(`/alunos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao eliminar aluno:", error);
    throw error;
  }
};
