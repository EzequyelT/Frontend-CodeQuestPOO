import axios from "axios";
import { getToken } from "../auth/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Erro ao obter token:", err);
    }

    // IMPORTANTE: sempre retornar config
    return config;
  },
  (error) => {
    // erro antes de enviar request
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token inválido ou expirado");
    }
    return Promise.reject(error);
  }
);

export default api;