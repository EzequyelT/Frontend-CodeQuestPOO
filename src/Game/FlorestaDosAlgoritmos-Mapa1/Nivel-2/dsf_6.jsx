import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/RightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import CodeComponent from "../Components/Code/CodeComponent"
import Result from "../Components/Result"
import { useCode } from "../../Hooks/useCode"
import { getToken, getUser } from "../../../Services/auth/authStorage";

import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1-Nivel-2.jpg"
import dsf_6 from "../../Data/Mapa-1/Nivel-2/dsf_6"
import ModalService from '../Components/Modal/ModalService'
import ModalNivelConcluido from "../Components/Modal/LevelModal"  // ✅ adicionado

const dsf = dsf_6

const challenge = {
    nome: "Loops Básicos",
    descricao: "Os loops são usados para repetir ações no código de forma automática, evitando repetições manuais. Neste desafio vais aprender a usar o loop for para percorrer sequências de números e executar instruções várias vezes. Os loops são essenciais para resolver problemas de forma eficiente e são uma das bases da programação.",
    xp: 10,
    nivel: 2,
    dificuldade: "Médio"
};

export default function DSF6() {

    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [modalNivelConcluido, setModalNivelConcluido] = useState(null);  // ✅ adicionado

    const token = getToken()
    const userId = getUser()

    const navigate = useNavigate()
    const bgDim = (0.60)

    const mapaId = 1

    useEffect(() => {
        try {
            async function loadLevels() {
                const data = await getLevelsByMap(mapaId);
                setLevels(data);

                if (data?.[1]?.desafios?.length > 0) {
                    setDesafioId(data[1].desafios[2].id)
                }
            }

            loadLevels();
        } catch (err) {
            console.error("Erro ao buscar desafio", err)
            throw (err)
        }

    }, []);

    const {
        currentQuestion,
        currentIndex,
        logs,
        loading,
        mentorStatus,
        objectives,
        finished,
        runCode,
        addLog,
        timeSeconds,
        correct,
        wrong,
        finalResult,
        saving,
    } = useCode(dsf, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })

    // ✅ adicionado
    useEffect(() => {
        if (!finished || !finalResult) return;
        if (!finalResult?.primeiraVez) return;

        if (finalResult?.nivelCompleto) {
            setModalNivelConcluido({
                nivelNome: `Nível ${challenge.nivel} Concluído!`,
                xpGanho: finalResult?.xpGanho?.total ?? 0,
                proximoNivel: finalResult?.proximoNivel ?? null,
                nivelMaximo: finalResult?.nivelMaximo ?? false
            });
        }
    }, [finished, finalResult]);

    if (finished && saving) {
        return <div>Salvando resultado...</div>
    }

    const score = Math.max(
        0,
        Math.round((correct / (correct + wrong)) * 100)
    )

    if (finished && !saving) {
        return (
            <>
                <Result
                    result={{
                        correct,
                        wrong,
                        timeSeconds,
                        xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                        xpNextLevel: finalResult?.xpProximoNivel ?? 0,
                        nivelAtual: finalResult?.nivel_atual ?? 1,
                        score: score,
                        desafioCompleto: finalResult?.desafioCompleto ?? false,
                        primeiraVez: finalResult?.primeiraVez ?? true,
                    }}
                    onRepeat={() => window.location.reload()}
                    onBackToMap={() => navigate("/Floresta")}
                    onNextChallenge={() => navigate("/floresta/nivel-3/desafio-7")}
                />

                {/* ✅ adicionado */}
                {modalNivelConcluido && (
                    <ModalNivelConcluido
                        isOpen={!!modalNivelConcluido}
                        onClose={() => setModalNivelConcluido(null)}
                        onContinuar={() => {
                            setModalNivelConcluido(null);

                            if (modalNivelConcluido?.nivelMaximo) {
                                navigate("/mapa-final");
                            } else if (modalNivelConcluido.proximoNivel) {
                                navigate("/floresta/nivel-3/desafio-7");
                            } else {
                                navigate("/Floresta");
                            }
                        }}
                        nivelNome={modalNivelConcluido.nivelNome}
                        xpGanho={modalNivelConcluido.xpGanho}
                        proximoNivel={modalNivelConcluido.proximoNivel}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <ModalService
                isOpen={showModal}
                setIsOpen={setShowModal}
                challenge={challenge}
            />
            <RightSideBar time={timeSeconds} />
            <LeftSideBar />

            <div className="scrollbar"
                style={{
                    backgroundImage: `
                       linear-gradient(rgba(0,0,0,${bgDim}), rgba(0,0,0,${bgDim})),
                       url(${Bg})
                       `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <CodeComponent
                    key={currentIndex}
                    currentQuestion={currentQuestion}
                    logs={logs}
                    loading={loading}
                    mentorStatus={mentorStatus}
                    objectives={objectives}
                    runCode={runCode}
                    addLog={addLog}
                    hints={currentQuestion?.hints}
                />
            </div>
        </>
    )
}