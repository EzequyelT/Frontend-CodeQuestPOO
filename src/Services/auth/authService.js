import api from "../api/axios";
import { saveToken, saveUser } from "./authStorage";

export const login = async (email, password) => {
  try {

    const { data } = await api.post("/auth/login", { email, password });

    saveToken(data.token);
    saveUser(data.user);

    return data;
    
  } catch (err) {
    console.error("Erro ao fazer login: ", err)
  }

};

export const register = async (dados) => {
  try {

    const { data } = await api.post("/auth/register", dados);
    return data;

  } catch(err){
    console.error("Erro ao criar conta:", err)
  }
 
};