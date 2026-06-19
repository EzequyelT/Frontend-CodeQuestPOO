import api from "/src/Services/api/axios.js";

export async function getAdminDashboard() {
  const response = await api.get("/admin/dashboard");
  return response.data;
}

export async function getAdminAlunos() {
  const response = await api.get("/admin/alunos");
  return response.data;
}

export async function getAdminAlunoDetalhes(id) {
  const response = await api.get(`/admin/alunos/${id}`);
  return response.data;
}

export async function getAdminAlunoEstatisticas(id) {
  const response = await api.get(`/admin/alunos/${id}/estatisticas`);
  return response.data;
}

export async function updateAdminAlunoAtivo(id, ativo) {
  const response = await api.patch(`/admin/alunos/${id}/ativo`, { ativo });
  return response.data;
}

export async function updateAdminAlunoCoins(id, coins) {
  const response = await api.patch(`/admin/alunos/${id}/coins`, { coins });
  return response.data;
}

export async function getAdminConteudo() {
  const response = await api.get("/admin/conteudo");
  return response.data;
}