let tempoSessao = 0;
let contador = null;
let sender = null;
let ativo = true;
let tokenGlobal = null;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


// ===============================
// 🚀 INICIAR CONTAGEM
// ===============================
export function iniciarTempo(token) {
    tokenGlobal = token;

    if (contador) return; // evita duplicar timers

    // conta segundos
    contador = setInterval(() => {
        if (ativo) tempoSessao++;
    }, 1000);

    // envia a cada 30s
    sender = setInterval(enviarTempo, 30000);

    // pausa se aba não estiver ativa
    document.addEventListener("visibilitychange", () => {
        ativo = !document.hidden;
    });

    // envia ao fechar aba
    window.addEventListener("beforeunload", enviarTempoBeacon);
}


// ===============================
// 📤 ENVIAR TEMPO NORMAL
// ===============================
async function enviarTempo() {
    if (!tempoSessao || !tokenGlobal) return;

    try {
        await fetch(`${API_URL}/api/tempo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenGlobal}`
            },
            body: JSON.stringify({
                tempo: tempoSessao
            })
        });
        console.log("📡 A enviar para:", `${API_URL}/api/tempo`)
        tempoSessao = 0;

    } catch (err) {
        console.error("Erro ao enviar tempo:", err);
    }

    function formatarTempo(segundos) {
        const h = Math.floor(segundos / 3600);
        const m = Math.floor((segundos % 3600) / 60);
        const s = segundos % 60;
        return `${h}h ${m}m ${s}s`;
    }

    console.log(formatarTempo(531)); 
}


// ===============================
// 🚪 ENVIAR AO SAIR (FIX DO ERRO)
// ===============================
function enviarTempoBeacon() {
    if (!tempoSessao) return;

    const payload = JSON.stringify({ tempo: tempoSessao, token: tokenGlobal });
    const blob = new Blob([payload], { type: "application/json" }); // 👈 fix

    navigator.sendBeacon(`${API_URL}/api/tempo`, blob);
    tempoSessao = 0;
}


// ===============================
// 🛑 PARAR CONTAGEM
// ===============================
export function pararTempo() {
    clearInterval(contador);
    clearInterval(sender);

    contador = null;
    sender = null;

    window.removeEventListener("beforeunload", enviarTempoBeacon);
}