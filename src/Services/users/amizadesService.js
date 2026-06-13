import api from "../api/axios";

export const getAmigos = async () => {
  const { data } = await api.get("/amizades");
  return data;
};

export const getPedidosAmizade = async () => {
  const { data } = await api.get("/amizades/pedidos");
  return data;
};

export const getEstadosAmizade = async () => {
  const { data } = await api.get("/amizades/estados");
  return data;
};

export const enviarPedidoAmizade = async (amigoId) => {
  const { data } = await api.post("/amizades", { amigoId });
  return data;
};

export const aceitarPedidoAmizade = async (amizadeId) => {
  const { data } = await api.patch(`/amizades/${amizadeId}/aceitar`);
  return data;
};

export const rejeitarPedidoAmizade = async (amizadeId) => {
  const { data } = await api.patch(`/amizades/${amizadeId}/rejeitar`);
  return data;
};

export const removerAmigo = async (amigoId) => {
  const { data } = await api.delete(`/amizades/${amigoId}`);
  return data;
};