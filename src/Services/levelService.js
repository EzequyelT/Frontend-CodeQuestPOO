const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getLevelsByMap(mapaId) {
    try {
        const response = await fetch(`${API_URL}/api/niveis/mapa/${mapaId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar níveis para o mapa ${mapaId}: ${response.statusText}`);
        }
        const nivel = await response.json();
        return nivel; // retorna o JSON do backend

    } catch (err) {
        console.error("Erro ao buscar níveis:", err);
        throw err; // relança o erro para ser tratado no frontend
    }

}