import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cq_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[API Interceptor] ✅ Token adicionado ao header");
    } else {
      console.warn("[API Interceptor] ⚠️ Nenhum token encontrado no localStorage");
    }
    return config;
  },
  (error) => {
    console.error("[API Interceptor] Erro:", error);
    return Promise.reject(error);
  }
);

// Interceptor de erro
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error("[API] Token inválido ou expirado (401)");
    }
    return Promise.reject(error);
  }
);

export default api;