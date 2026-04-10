import api from "../api/axios";

export const getMapas = async () => {
  try {
    const { data } = await api.get("/mapas");
    return data;
  } catch (err) {
    console.error("Erro ao buscar Mapa: ", err)
    throw err; 
  }
};