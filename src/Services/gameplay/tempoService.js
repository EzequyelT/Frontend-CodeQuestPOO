import api from "../api/axios";

export const buscarTempoNivel = async () => {
    try {
        const { data } = await api.get("/tempo");
        return data;
    } catch (err) {
        console.error("Erro ao buscar tempo:", err);
        throw err
    }
};
