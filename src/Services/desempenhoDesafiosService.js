import { getToken } from "./auth/authService";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


// Busca XP e progressão do aluno (para o dashboard com o nivel, xp proximo nivel, titulo)
export const obterXPAluno = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error("Utilizador não autenticado");

    const response = await fetch(`${API}/desafios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar progressão");
    }

    return await response.json(); // { xp, progressao: { nivel, titulo, xp, xpProximoNivel, ... } }
  } catch (err) {
    console.error("[BuscarProgressao] ❌", err);
    return null;
  }
};


//Aqui contem a lógica de processamento do desempenho dos desafios, como calcular o XP ganho, atualizar o progresso do aluno, etc. Esta função pode ser chamada após a conclusão de um desafio para atualizar o desempenho do aluno.
export  const processarConclusaoDesafio = async (desafioId, dados = {}) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Utilizador não autenticado");

    const response = await fetch(`${API}/desafios/concluir/${desafioId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao concluir desafio");
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("[ConcluirDesafio] ❌", err);
    return null;
  }
};
