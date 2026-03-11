import API from "../API";

// Get progresso e XP do aluno logado
export async function getProgressoAluno() {
  try {
    const token = localStorage.getItem("cq_token");
    console.log("[alunoProgress] Token guardado:", token ? "✓ Presente" : "✗ Falta");
    
    const res = await API.get(`/progresso`, {
      headers: { Authorization: `Bearer ${token}` }  // ← adiciona isto
    });
    console.log("[alunoProgress] Progresso carregado:", res.data);
    return res.data;
  } catch (error) {
    console.error("[alunoProgress] Erro:", error.response?.data || error.message);
    throw error;
  }
}

// Atualizar XP do aluno logado
export async function atualizarXP(xp) {
  const res = await API.put(`/progresso`, { xp });
  return res.data;
}

// Get ranking de alunos com XP
export async function getRankingAlunos() {
  const res = await API.get(`/progresso/ranking`);
  return res.data;
}