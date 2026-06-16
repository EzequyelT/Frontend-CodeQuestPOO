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
import dsf_5 from "../../Data/Mapa-1/Nivel-2/dsf_5"
import ModalService from '../Components/Modal/ModalService'
import ModalFalha from '../Components/Modal/ModalFalha'

import loadingVideo from "../../../assets/Loading/loading.webm";

const dsf = dsf_5()

const challenge = {
    nome: "Comparações Simples",
    descricao:
        "As comparações são uma das bases da lógica em programação. Neste desafio vais aprender a usar operadores como >, < e == para comparar valores e tomar decisões no código. Estas comparações permitem que o programa responda de forma diferente consoante as condições, sendo essenciais para criar lógica dinâmica e inteligente.",
    xp: 10,
    nivel: 2,
    dificuldade: "Fácil",
};

export default function DSF5() {

    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [loadingModal, setLoadingModal] = useState(true);


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
                setLoadingModal(false)

                if (data?.[1]?.desafios?.length > 0) {
                    setDesafioId(data[1].desafios[1].id)
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
        showFailModal,
        attempts,
        transitioning,
        aiFeedback
    } = useCode(dsf, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })

    if (finished && saving) {
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
                            Salvando Resultado
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

    const score = Math.max(
        0,
        Math.round((correct / (correct + wrong)) * 100)
    )

    if (finished && !saving) {
        console.log("FINAL RESULT:", finalResult)
        return (

            <Result
                result={{
                    correct,
                    wrong,
                    timeSeconds,

                    xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                    xpNextLevel: finalResult?.xpProximoNivel ?? 0,
                    coinsGained: finalResult?.coinsGanhos?.total ?? correct * 10,
                    nivelAtual: finalResult?.nivel_atual ?? 1,

                    score: score,
                    desafioCompleto: finalResult?.desafioCompleto ?? false,
                    primeiraVez: finalResult?.primeiraVez ?? true,

                }}
                onRepeat={() => window.location.reload()}
                onBackToMap={() => navigate("/FlorestaDosAlgoritmos")}
                onNextChallenge={() => {
                    navigate("/floresta/nivel-2/desafio-6")
                }}
            />
        )
    }

    if (loadingModal) {
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