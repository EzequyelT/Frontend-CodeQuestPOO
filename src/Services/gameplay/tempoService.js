import api from "../api/axios";

let tempo = 0;
let interval = null;
let ativo = true;

export const iniciarTempo = () => {

    try {

        if (interval) return;

        interval = setInterval(() => {
            if (ativo) tempo++;
        }, 1000);

        document.addEventListener("visibilitychange", () => {
            ativo = !document.hidden;
        });

        window.addEventListener("beforeunload", enviarTempo);

    } catch (err) {
        console.error("Erro ao iniciar Tempo", err)
        throw err
    }

};

const enviarTempo = async () => {
    if (tempo <= 0) return;

    try {
        await api.post("/tempo", { tempo });
        tempo = 0;
    } catch (err) {
        console.error("Erro ao enviar tempo:", err);
        throw err
    }
};

export const pararTempo = async () => {
    try {
        
        clearInterval(interval);
        interval = null;

        await enviarTempo();

        window.removeEventListener("beforeunload", enviarTempo);

    } catch(err) {
        console.error("Erro ao parar tempo: ", err)
        throw err
    }
  
};