import API from "../API";

export const registerUser = async (data) => {
  const response = await API.post("/alunos", data);
  return response.data;
};

export const getAllAlunos = async () => {
  const response = await API.get("/alunos");
  return response.data;
};