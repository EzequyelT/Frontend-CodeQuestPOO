import api from "../API";

const TOKEN_KEY = "cq_token";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { token, user }
};

export const register = async (dados) => {
  const response = await api.post("/auth/register", dados);
  return response.data;
};

// --- token helpers -------------------------------------------------
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  // O interceptor em API.js vai adicionar o header automaticamente
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => !!getToken();

// apply existing token (if any) to axios default header
const existingToken = getToken();
if (existingToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

