import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LeftSideBar from "../Components/SideBars/LeftSideBar"
import RightSideBarBoss from "../Components/SideBars/RightSideBarBoss"

import CodeComponent from "../Components/Code/CodeComponent"
import Result from "../Components/Result"
import { useCode } from "../../Hooks/useCode"
import { getToken, getUser } from "../../../Services/auth/authStorage";

import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1-Nivel3.png"
import dsf_8 from "../../Data/Mapa-1/Nivel-3/dsf_8"
import ModalService from '../Components/Modal/ModalService'

import ModalNivelConcluido from "../Components/Modal/LevelModal"
import ModalFalha from '../Components/Modal/ModalFalha'

const dsf = dsf_8

const challenge = {
    nome: "Serpente do Bug",
    descricao: "Enfrenta a Serpente do Bug usando loops e condições. Resolve cada fase para avançar e derrota o boss final com lógica e precisão.",
    xp: 20,
    nivel: 3,
    dificuldade: "Médio"
};

export default function DSF8() {
    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [modalNivelConcluido, setModalNivelConcluido] = useState(null);


    const token = getToken()
    const userId = getUser()

    const navigate = useNavigate()
    const bgDim = (0.60)

    const mapaId = 1

    useEffect(() => {
        try {
            async function loadLevels() {
                const data = await getLevelsByMap(mapaId)

                setLevels(data)


                if (data?.[1]?.desafios?.length > 0) {
                    setDesafioId(data[2].desafios[1].id)
                }
            }

            loadLevels()

        } catch (err) {
            console.error(err)
            throw err
        }
    }, [])

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
        showFailModal,
        attempts,
    } = useCode(dsf, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })

    useEffect(() => {
        if (!finished || !finalResult) return
        if (!finalResult?.primeiraVez) return;

        if (finalResult?.nivelCompleto) {
            setModalNivelConcluido({
                nivelNome: `Nível ${challenge.nivel} Concluído!`,
                xpGanho: finalResult?.xpGanho?.total ?? 0,
                proximoNivel: finalResult?.proximoNivel ?? null,
                nivelMaximo: finalResult?.nivelMaximo ?? false
            });
        }

    }, [finalResult, finished])

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
                    onBackToMap={() => navigate("/FlorestaDosAlgoritmos")}
                    onNextChallenge={() => navigate("/Maps")}
                />

                {modalNivelConcluido && (
                    <ModalNivelConcluido
                        isOpen={!!modalNivelConcluido}
                        onClose={() => setModalNivelConcluido(null)}
                        onContinuar={() => {
                            setModalNivelConcluido(null);

                            if (modalNivelConcluido?.nivelMaximo) {
                                navigate("/mapa-final");
                            } else if (modalNivelConcluido.proximoNivel) {
                                navigate("/Maps");
                            } else {
                                navigate("/FlorestaDosAlgoritmos");
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
            <LeftSideBar />
            <RightSideBarBoss
                attempts={attempts}
                time={timeSeconds}
                correct={correct}
                totalFases={dsf.length}
            />

            {showFailModal && (
                <ModalFalha
                    isOpen={true}
                    onRepetir={() => window.location.reload()}
                    onVoltar={() => navigate("/FlorestaDosAlgoritmos")}
                    correct={correct}
                    wrong={wrong}
                    time={timeSeconds}
                />
            )}

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