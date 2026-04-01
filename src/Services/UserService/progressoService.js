const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getProgresso = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/progresso`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar progresso");
    }

    const data = await res.json();
    return data; // retorna array com progresso por mapa
  } catch (err) {
    console.error("[ProgressoService] ❌", err);
    return [];
  }
};

export const getProgressoDashboard = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/progresso/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar dashboard de progresso");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[ProgressoService] ❌", err);
    return {
      xp_total: 0,
      nivel_atual: 1,
      coins: 0,
      streak: 0,
      tempo_total_jogo: 0,
      desafios_completos: 0,
      total_desafios: 0,
      porcentagem_completa: 0,
    };
  }
};

