import api from "../api/axios";

export const getAllAlunos = async () => {
  try {

    const { data } = await api.get("/alunos");
    return data;

  } catch (err) {
    console.error("Erro ao listar alunos: ", err)
    throw err
  }

};

export const registerUser = async (data) => {
  try {

    const { data: res } = await api.post("/alunos/registrar", data);
    return res;

  }catch (err) {
    console.error("Erro ao registrar utilizador: ", err)
    throw err
  }
};

export const getMe = async () => {
  try {
    const { data } = await api.get("/alunos/getMe");
    return data;
  } catch (error) {
    console.error("Erro ao buscar utilizador: ", error)
    throw error
  }
}