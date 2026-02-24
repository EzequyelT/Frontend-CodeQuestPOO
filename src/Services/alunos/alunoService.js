import axios from 'axios';

// URL do backend
const API_URL = 'http://localhost:3000/api/alunos'; // ⚠️ Use a porta do seu backend

// Função para criar um novo aluno
export const registerUser = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Função para listar todos os alunos (opcional)
export const getAllAlunos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};