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
  const progresso = await getProgresso(token);
  if (!Array.isArray(progresso) || progresso.length === 0) {
    return {
      xp_total: 0,
      xp_proximo_nivel: 3000,
      dias_seguidos: 0,
      dicas_usadas: 0,
      desafios_completos: 0,
      acertos: 0,
      nivel_atual: 1,
    };
  }

  const totalDesafios = progresso.reduce((acc, mapa) => acc + (mapa.total_desafios || 0), 0);
  const desafiosCompletos = progresso.reduce((acc, mapa) => acc + (mapa.desafios_completos || 0), 0);
  const totalXP = desafiosCompletos * 100;
  const acertos = totalDesafios > 0 ? Math.round((desafiosCompletos / totalDesafios) * 100) : 0;

  return {
    xp_total: totalXP,
    xp_proximo_nivel: 3000,
    dias_seguidos: 7,
    dicas_usadas: 15,
    desafios_completos: desafiosCompletos,
    acertos,
    nivel_atual: 1,
  };
};

