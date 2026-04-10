// games/FlorestaDosAlgoritmos/Nivel-1/index.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { processarConclusaoDesafio } from "../../../Services/xpProgressService";
import Dsf1 from "./dsf_1";
import Dsf2 from "./dsf_2";
import Dsf3 from "./dsf_3";

const DESAFIOS_NIVEL_1 = [
    { id: 1, componente: Dsf1 },
    { id: 2, componente: Dsf2 },
    { id: 3, componente: Dsf3 },
];

export default function Nivel1() {
    const navigate = useNavigate();
    const [desafioAtualIndex, setDesafioAtualIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resultadoConclusao, setResultadoConclusao] = useState(null);

    const desafioAtual = DESAFIOS_NIVEL_1[desafioAtualIndex];
    const ComponenteDesafio = desafioAtual.componente;

    // Esta função é passada para cada dsf_X.jsx
    // Quando o aluno termina, chama isto com os dados do desempenho
    const handleConcluir = async (dadosDesempenho) => {
        setLoading(true);
        try {
            const resultado = await processarConclusaoDesafio(
                desafioAtual.id,
                dadosDesempenho // { respostas_certas, respostas_erradas, tempo_desafio, score, etc. }
            );

            setResultadoConclusao(resultado);

        } catch (err) {
            console.error("Erro ao concluir desafio", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProximo = () => {
        setResultadoConclusao(null);

        const temProximo = desafioAtualIndex < DESAFIOS_NIVEL_1.length - 1;

        if (temProximo) {
            // Avança para o próximo desafio dentro do nível
            setDesafioAtualIndex(prev => prev + 1);
        } else {
            // Nível completo → volta ao mapa
            navigate("/mapa/floresta");
        }
    };

    return (
        <div>
            {/* Mostra o desafio atual */}
            <ComponenteDesafio onConcluir={handleConcluir} />

            {/* Loading enquanto chama a API */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="text-white text-center">
                        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p>A calcular XP...</p>
                    </div>
                </div>
            )}

            {/* Modal de resultado após concluir */}
            {resultadoConclusao && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-[#151414] border border-gray-700 rounded-2xl p-8 text-center flex flex-col gap-4 w-80">

                        <h2 className="text-white text-xl font-bold">
                            {resultadoConclusao.nivelCompleto ? "🏆 Nível Completo!" : "✅ Desafio Concluído!"}
                        </h2>

                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-gray-400">XP Ganho</span>
                            <span className="text-yellow-400 font-bold text-2xl">
                                +{resultadoConclusao.xpGanho?.total} XP
                            </span>
                            {resultadoConclusao.xpGanho?.nivelBonus > 0 && (
                                <span className="text-green-400 text-xs">
                                    🎁 Bónus de nível: +{resultadoConclusao.xpGanho.nivelBonus} XP
                                </span>
                            )}
                            {!resultadoConclusao.primeiraVez && (
                                <span className="text-gray-500 text-xs">
                                    (Repetição — XP reduzido)
                                </span>
                            )}
                        </div>

                        {/* Progressão do herói */}
                        <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
                            <p>Nível: <span className="text-white font-bold">{resultadoConclusao.progressao?.nivel}</span></p>
                            <p>Título: <span className="text-yellow-400 font-bold">{resultadoConclusao.progressao?.titulo}</span></p>
                            <p>XP Total: <span className="text-white font-bold">{resultadoConclusao.progressao?.xp}</span></p>
                        </div>

                        <button
                            onClick={handleProximo}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg py-2 transition-colors"
                        >
                            {desafioAtualIndex < DESAFIOS_NIVEL_1.length - 1 ? "Próximo Desafio →" : "Voltar ao Mapa 🗺️"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}