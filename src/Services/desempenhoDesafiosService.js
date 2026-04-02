import { getToken } from "./auth/authService";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getDesempenhoDesafios = async () => {
  try {
    // Pega o token salvo no authService
    const token = getToken();
    if (!token) throw new Error("Utilizador não autenticado");

    // Faz a requisição para o endpoint correto
    const response = await fetch(`${API}/progresso/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Se der erro no fetch
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar progresso");
    }

    // Converte para JSON
    const data = await response.json();
    return data; // Aqui vem o XP, progressão, etc.

  } catch (err) {
    console.error("[DesempenhoDesafiosService] ❌", err);
    return null; 
  }
};

export  const concluirDesafio = async (desafioId, dados = {}) => {
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
