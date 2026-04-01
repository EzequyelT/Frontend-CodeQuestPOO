import API from "./API";

const TOKEN_KEY = "cq_token";

// ===============================
// 🔐 AUTHENTICATION FUNCTIONS
// ===============================

export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data; // { token, user }
};

export const register = async (dados) => {
  const response = await API.post("/auth/register", dados);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await API.post("/alunos", data);
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
  API.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// ===============================
// 👥 USER MANAGEMENT
// ===============================

export const getAllAlunos = async () => {
  const response = await API.get("/alunos");
  return response.data;
};

// ===============================
// 📊 PROGRESS FUNCTIONS
// ===============================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getProgresso = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/progresso`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar progresso");
    }

    const data = await res.json();
    return data; // retorna array com progresso por mapa
  } catch (err) {
    console.error("[ProgressoService] ❌", err);
    return [];
  }
};

export const getProgressoDashboard = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/progresso/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar dashboard de progresso");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[ProgressoService] ❌", err);
    return {
      xp_total: 0,
      nivel_atual: 1,
      coins: 0,
      streak: 0,
      tempo_total_jogo: 0,
      desafios_completos: 0,
      total_desafios: 0,
      porcentagem_completa: 0,
    };
  }
};

// ===============================
// ⏱️ TIME TRACKING
// ===============================

let tempoSessao = 0;
let contador = null;
let sender = null;
let ativo = true;
let tokenGlobal = null;

// 🚀 INICIAR CONTAGEM
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

// 📤 ENVIAR TEMPO NORMAL
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
}

// 🚪 ENVIAR AO SAIR (FIX DO ERRO)
function enviarTempoBeacon() {
    if (!tempoSessao) return;

    const payload = JSON.stringify({ tempo: tempoSessao, token: tokenGlobal });
    const blob = new Blob([payload], { type: "application/json" }); // 👈 fix

    navigator.sendBeacon(`${API_URL}/api/tempo`, blob);
    tempoSessao = 0;
}

// 🛑 PARAR CONTAGEM
export function pararTempo() {
    clearInterval(contador);
    clearInterval(sender);

    contador = null;
    sender = null;

    window.removeEventListener("beforeunload", enviarTempoBeacon);
}