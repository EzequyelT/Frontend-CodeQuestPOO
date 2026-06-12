import api from "../api/axios";

export const getLeaderBoardBestTime = async () => {
    try {
        const { data } = await api.get("/leaderboard/");
        return data;
    } catch (error) {
        console.log("Erro ao buscar leaderboard", error)
    }
}

export const getLeaderBoardByMapa = async (mapaId, nivelId, desafioId) => {
    try {
        const { data } = await api.get(`/leaderboard/${mapaId}/${nivelId}/${desafioId}`);
        return data;
    } catch (error) {
        console.log("Erro ao buscar leaderboard", error)
    }
}


