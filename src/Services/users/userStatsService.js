import api from "../api/axios";

export const getProgresso = async () => {

  try {

    const { data } = await api.get("/progresso");
    return data;

  } catch (err) {
    console.error("Erro ao ir buscar progresso: ", err)
    throw err
  }

};

export const getProgressoDashboard = async () => {

  try {

    const { data } = await api.get("/progresso/dashboard");
    return data;

  } catch(err) {
    console.error("Erro ao ir buscar progresso", err)
    throw err

  }
  
};