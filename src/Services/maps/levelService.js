import api from "../api/axios";

export const getLevelsByMap = async (mapaId) => {
  try {
    const { data } = await api.get(`/niveis/mapa/${mapaId}`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar níveis pelo mapa:", error);
    throw error; 
  }
};