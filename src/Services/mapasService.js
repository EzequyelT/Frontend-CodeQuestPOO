const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getMapas = async () => {
  try {
    const res = await fetch(`${API_URL}/api/mapas`);
    if (!res.ok) throw new Error("Erro ao buscar mapas");
    return await res.json();
  } catch (err) {
    console.error("[MapasService] ❌", err);
    return [];
  }
};