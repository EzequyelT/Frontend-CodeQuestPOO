import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../../../Components/SideBars/RightSideBar"
import LeftSideBar from "../../../Components/SideBars/LeftSideBar"

import CodeComponent from "../../../Components/Code/CodeComponent"
import QuizContainer from "../../../Components/Quiz/QuizContainer"
import QuestionCard from "../../../Components/Quiz/QuestionCard"

import Result from "../../../Components/Result"
import { useCode } from "../../../Hooks/useCode"
import { useQuiz } from "../../../Hooks/useQuiz"

import { getToken, getUser } from "../../../../Services/auth/authStorage"
import { getLevelsByMap } from "../../../../Services/maps/levelService"

import Bg from "../../../../assets/Maps/Bg-Map1-Nivel3.png"
import dsf_7 from "../../../Data/Mapa-1/Nivel-3/dsf_7"

import ModalService from '../../../Components/Modal/ModalService'
import ModalFalha from '../../../Components/Modal/ModalFalha'

import loadingVideo from "../../../../assets/Loading/loading.webm";

const quizSteps = dsf_7.filter(s => s.type === "quiz")
const codeSteps = dsf_7.filter(s => s.type === "code")

const challenge = {
    nome: "Preparar Código",
    descricao: "Neste desafio vais identificar e corrigir pequenos erros no código. Vais analisar trechos, encontrar problemas de sintaxe e escolher a correção certa. Esta é uma habilidade essencial antes de avançares para desafios mais complexos.",
    xp: 10,
    nivel: 3,
    dificuldade: "Médio"
}

export default function DSF7() {

    const [levels, setLevels] = useState([])
    const [desafioId, setDesafioId] = useState(null)
    const [showModal, setShowModal] = useState(true)
    const [loadingState, setLoadingState] = useState(true);

    const [phase, setPhase] = useState("quiz")

    const token = getToken()
    const userId = getUser()
    const navigate = useNavigate()
    const bgDim = 0.40
    const mapaId = 1

    useEffect(() => {
        async function loadLevels() {
            try {
                const data = await getLevelsByMap(mapaId)
                setLevels(data)
                setLoadingState(false)
                if (data?.[1]?.desafios?.length > 0) {
                    setDesafioId(data[2].desafios[0].id)
                }
            } catch (err) {
                console.error("Erro ao buscar desafio", err)
            }
        }
        loadLevels()
    }, [])

    // ─────────────────────────────────────────────
    // ✅ REGRA DOS HOOKS: ambos são sempre chamados,
    //    independentemente da fase atual.
    //    A fase apenas controla O QUE É RENDERIZADO.
    // ─────────────────────────────────────────────

    // Hook do Quiz
    const quiz = useQuiz(quizSteps, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels,
    })

    //  Hook do Code
    const code = useCode(codeSteps, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels,
    })

    useEffect(() => {
        if (quiz.finished && phase === "quiz") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhase("code")
            setLoadingState(false)
        }
    }, [quiz.finished, phase])

    useEffect(() => {
        if (code.finished && phase === "code") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhase("done")
            setLoadingState(false)
        }
    }, [code.finished, phase])

    const totalCorrect = (quiz.correct ?? 0) + (code.correct ?? 0)
    const totalWrong = (quiz.wrong ?? 0) + (code.wrong ?? 0)
    const totalTime = (quiz.timeSeconds ?? 0) + (code.timeSeconds ?? 0)
    const finalResult = code.finalResult ?? quiz.finalResult

    if (phase === "done") {
        return (
            <Result
                result={{
                    correct: totalCorrect,
                    wrong: totalWrong,
                    timeSeconds: totalTime,

                    xpGained: finalResult?.xpGanho?.total ?? totalCorrect * 80,
                    xpNextLevel: finalResult?.xpProximoNivel ?? 0,
                    coinsGained: finalResult?.coinsGanho?.total ?? totalCorrect * 10,
                    nivelAtual: finalResult?.nivel_atual ?? 1,

                    score: Math.round((totalCorrect / (totalCorrect + totalWrong || 1)) * 100),
                    desafioCompleto: finalResult?.desafioCompleto ?? false,
                    primeiraVez: finalResult?.primeiraVez ?? true,
                }}
                onRepeat={() => window.location.reload()}
                onBackToMap={() => navigate("/FlorestaDosAlgoritmos")}
                onNextChallenge={() => navigate("/floresta/nivel-3/desafio-8")}
            />
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

            {(quiz.showFailModal || code.showFailModal) && (
                <ModalFalha
                    isOpen={true}
                    onRepetir={() => window.location.reload()}
                    onVoltar={() => navigate("/FlorestaDosAlgoritmos")}
                    correct={totalCorrect}
                    wrong={totalWrong}
                    time={phase === "quiz" ? quiz.timeSeconds : code.timeSeconds}
                />
            )}


            <RightSideBar
                time={phase === "quiz" ? quiz.timeSeconds : code.timeSeconds}
                attempts={phase === "quiz" ? quiz.attempts : code.attempts}
                wrong={phase === "quiz" ? quiz.wrong : code.wrong}
            />
            <LeftSideBar />

            <div
                className="scrollbar"
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

                {phase === "quiz" && (
                    <QuizContainer
                        transitioning={quiz.transitioning}
                        headerProps={{
                            children: quiz.currentQuestion?.titulo ?? "Debug Quiz",
                            currentQuestion: quiz.currentIndex + 1,
                            totalQuestions: quizSteps.length,
                            streak: 0,
                        }}
                        answerOptionsProps={{
                            options: quiz.currentQuestion?.opcoes ?? [],
                        }}
                    >
                        <div className="flex justify-center">
                            <QuestionCard
                                label="Encontra o erro"
                                pergunta={quiz.currentQuestion?.texto ?? ""}
                                dropped={quiz.currentResponse}
                                onDrop={(item) => quiz.response(item)}
                                onReset={quiz.resetSlot}
                            />
                        </div>
                    </QuizContainer>
                )}

                {phase === "code" && (
                    <CodeComponent
                        key={code.currentIndex}
                        currentQuestion={code.currentQuestion}
                        logs={code.logs}
                        transitioning={code.transitioning}
                        loading={code.loading}
                        mentorStatus={code.mentorStatus}
                        objectives={code.currentQuestion?.objectives ?? []}
                        runCode={code.runCode}
                        addLog={code.addLog}
                        hints={code.currentQuestion?.hints}
                        aiFeedback={code.aiFeedback}
                    />
                )}

            </div>
        </>
    )
}