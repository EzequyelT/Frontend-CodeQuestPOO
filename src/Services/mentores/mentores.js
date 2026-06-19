import api from "../api/axios"

export const getAllMentores = async () => {
    try {
        const { data } = await api.get("/mentores")
        return data
    } catch (error) {
        console.error("Erro ao buscar mentores:", error);
        throw error;
    }
}

export const getMentorAluno = async () => {
    try {
        const { data } = await api.get("/mentores/aluno")
        return data
    } catch (error) {
        console.error("Erro ao buscar mentor do aluno:", error);
        throw error;
    }
}

export const getReactionMentor = async (mentorId) => {
    try {
        if (!mentorId) {
            return console.log("Mentor não encontrado")
        }
        const { data } = await api.get(`/mentores/mentor/${mentorId}`)
        return data
    } catch (error) {
        console.error("Erro ao buscar reação do mentor", error);
        throw error;
    }
}

export const getMentorById = async (mentorId) => {
    try {
        if (!mentorId) {
            return console.log("Mentor não encontrado")
        }
        const { data } = await api.get(`/mentores/${mentorId}`)
        return data
    } catch (error) {
        console.error("Erro ao buscar mentor", error);
        throw error;
    }
}

export const escolherMentor = async (mentorId) => {
    try {
        const { data } = await api.post(`/mentores/escolher/${mentorId}`)
        return data
    } catch (error) {
        console.error("Erro ao escolher mentor", error);
        throw error;
    }
}

export const trocarMentor = async (novoMentorId) => {
    try {
        console.log("TROCAR MENTOR ID:", novoMentorId);
        const { data } = await api.patch(`/mentores/trocar/${novoMentorId}`)
        return data
    } catch (error) {
        console.error("Erro ao trocar mentor", error);
        throw error;
    }
}