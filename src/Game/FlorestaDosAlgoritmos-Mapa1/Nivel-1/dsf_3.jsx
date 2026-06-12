import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/RightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import CodeComponent from "../Components/Code/CodeComponent"
import Result from "../Components/Result"
import { useCode } from "../../Hooks/useCode"
import { getToken, getUser } from "../../../Services/auth/authStorage";

import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1.png"
import dsf_3 from "../../Data/Mapa-1/Nivel-1/dsf_3"
import ModalService from '../Components/Modal/ModalService'

import ModalNivelConcluido from "../Components/Modal/LevelModal"
import ModalFalha from '../Components/Modal/ModalFalha'

import loadingVideo from "../../../assets/Loading/loading.webm";

const dsf = dsf_3

const challenge = {
    nome: "Operadores Básicos",
    descricao: "Os operadores são o que permite ao código realizar cálculos e tomar decisões. Aqui vais aprender a usar operações matemáticas e lógicas para manipular valores e resolver problemas simples. Este é o primeiro passo para começares a pensar como um verdadeiro programador.",
    xp: 10,
    nivel: 1,
    dificuldade: "Fácil"
};

export default function DSF3() {

    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [modalNivelConcluido, setModalNivelConcluido] = useState(null);
    const [showResult] = useState(false);
    const [loadingState, setLoadingState] = useState(true);


    const token = getToken()
    const userId = getUser()

    const navigate = useNavigate()
    const bgDim = (0.60)

    const mapaId = 1

    useEffect(() => {
        async function loadLevels() {
            const data = await getLevelsByMap(mapaId);
            setLevels(data);
            setLoadingState(false)
            setDesafioId(data[2]?.id);
        }

        loadLevels()
    }, [])

    const {
        currentQuestion,
        logs,
        currentIndex,
        loading,
        mentorStatus,
        objectives,
        finished,
        runCode,
        addLog,
        timeSeconds,
        correct,
        totalWrong,
        wrong,
        finalResult,
        saving,
        showFailModal,
        attempts,
        transitioning
        ,aiFeedback
    } = useCode(dsf, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })

    useEffect(() => {
        if (!finished || !finalResult) return;

        if (!finalResult?.primeiraVez) return;

        if (finalResult?.nivelCompleto) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setModalNivelConcluido({
                nivelNome: `Nível ${challenge.nivel} Concluído!`,
                xpGanho: finalResult?.xpGanho?.total ?? 0,
                proximoNivel: finalResult?.proximoNivel ?? null,
                nivelMaximo: finalResult?.nivelMaximo ?? false
            });
        }

        setLoadingState(false)

    }, [finished, finalResult]);


    if (finished && saving) {
        return (
            <div className="relative min-h-screen bg-black animate-fadeIn flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Salvando Resultado...</p>
                </div>
            </div>
        );
    }

    const score = Math.max(
        0,
        Math.round((correct / (correct + totalWrong)) * 100)
    )

    if ((finished && !saving) || showResult) {
        return (
            <>
                <Result
                    result={{
                        correct,
                        wrong: totalWrong,
                        timeSeconds,

                        xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                        xpNextLevel: finalResult?.xpProximoNivel ?? 0,
                        nivelAtual: finalResult?.nivel_atual ?? 1,
                        coinsGained: finalResult?.coinsGanhos?.total ?? correct * 10,

                        score: score,
                        desafioCompleto: finalResult?.desafioCompleto ?? false,
                        primeiraVez: finalResult?.primeiraVez ?? true,

                    }}
                    onRepeat={() => window.location.reload()}
                    onBackToMap={() => navigate("/FlorestaDosAlgoritmos")}
                    onNextChallenge={() => {
                        navigate("/floresta/nivel-2/desafio-4")
                    }}
                />

                {modalNivelConcluido && (
                    <ModalNivelConcluido
                        isOpen={!!modalNivelConcluido}
                        onClose={() => setModalNivelConcluido(null)}
                        onContinuar={() => {
                            setModalNivelConcluido(null);

                            if (modalNivelConcluido?.nivelMaximo) {
                                navigate("/mapa-final");
                            }
                            else if (modalNivelConcluido.proximoNivel) {
                                navigate("/floresta/nivel-2/desafio-4")

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


    if (loadingState) {
        return (
            <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none">
                <div className="flex flex-col items-center gap-6 z-10">

                    <div className="relative w-40 h-40 flex items-center justify-center p-2 bg-[#080808]/50 rounded-xl">
                        <video
                            src={loadingVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-3 mt-2">
                        <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse">
                            Carregando
                        </p>

                        <div className="flex gap-1.5 justify-center">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-amber-500/80"
                                    style={{
                                        animation: `dot-pulse 1.4s ease-in-out infinite`,
                                        animationDelay: `${delay}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <>
            <ModalService
                isOpen={showModal}
                setIsOpen={setShowModal}
                challenge={challenge}
            />
            <RightSideBar time={timeSeconds} attempts={attempts} />
            <LeftSideBar />


            {showFailModal && (
                <ModalFalha
                    isOpen={true}
                    onRepetir={() => window.location.reload()}
                    onVoltar={() => setShowModal(true)}
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
                    transitioning={transitioning}
                    mentorStatus={mentorStatus}
                    objectives={objectives}
                    runCode={runCode}
                    addLog={addLog}
                    hints={currentQuestion?.hints}
                    aiFeedback={aiFeedback} 
                />
            </div>
        </>
    )
}