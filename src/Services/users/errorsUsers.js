import api from "../api/axios";

export const getTipoDeErrosUsers = async () => {
    try {
        const { data } = await api.get("/erros")
        return data;
    } catch (err) {
        throw new Error("Erro ao buscar erros do jogador.", err)
    }
}