import { useState, useEffect } from "react"
import RightSideBar from "../Components/SideBars/RightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"
import QuizContainer from "../Components/Quiz/QuizContainer"

import QuestionCard from "../Components/Quiz/QuestionCard"
import { useQuiz } from "../../Hooks/useQuiz"
import Result from "../Components/Result"
import { useNavigate } from "react-router-dom"

import { getToken, getUser } from "../../../Services/auth/authStorage";
import { getLevelsByMap } from "../../../Services/maps/levelService"
import { getProgressoDashboard } from "../../../Services/users/userStatsService"
import Bg from "../../../assets/Maps/Bg-Map1.png"
import dsf_1 from "../../Data/Mapa-1/Nivel-1/dsf_1"

import ModalService from '../Components/Modal/ModalService'
import ModalFalha from '../Components/Modal/ModalFalha'


const dsf = dsf_1

const challenge = {
    nome: "Variáveis Misteriosas",
    descricao: "As variáveis são a base da programação. Neste desafio vais aprender a criar espaços na memória para guardar informação, como números e textos. São essenciais para construir lógica e resolver problemas no código.",
    xp: 10,
    nivel: 1,
    dificuldade: "Fácil"
};

export default function DSF1() {
    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [initialStreak, setInitialStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const bgDim = (0.55)

    const navigate = useNavigate()

    const token = getToken();
    const userId = getUser();

    const mapaId = 1

    useEffect(() => {

        try {

            async function loadLevels() {
                const data = await getLevelsByMap(mapaId);
                setLevels(data);
                setDesafioId(data[0]?.id);
                setLoading(false);
            }

            async function loadStats() {
                if (!token) return;
                const stats = await getProgressoDashboard(token);
                setInitialStreak(stats.streak || 0);
                setLoading(false);                
            }

            loadLevels();
            loadStats();

        } catch (err) {
            console.error(err)
            throw (err)
        }


    }, [token]);

    const {
        currentQuestion,
        currentIndex,
        currentResponse,
        correct,
        wrong,
        timeSeconds,
        finished,
        totalQuestions,
        response,
        resetSlot,
        finalResult,
        resetQuiz,
        showFailModal,
        streakAtual,
        transitioning
    } = useQuiz(dsf.perguntas, {
        token: token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels,
        streakInicial: initialStreak,
    })

    if (finished) {
        return (
            <Result
                result={{
                    correct,
                    wrong,
                    timeSeconds,
                    hintsUsed: 0,
                    xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                    coinsGained: finalResult?.coinsGanhos?.total ?? correct * 10,
                    score: Math.round((correct / totalQuestions) * 100),
                    streak: streakAtual,
                    quizTitle: dsf.titulo,
                    desafioCompleto: finalResult?.desafioCompleto ?? false,
                    primeiraVez: finalResult?.primeiraVez ?? true,
                }}
                onRepeat={() => window.location.reload()}
                onBackToMap={() => navigate("/FlorestaDosAlgoritmos")}
                onNextChallenge={() => {
                    navigate("/floresta/nivel-1/desafio-2")
                }}
            />
        )
    }

    
    if (loading) {
        return (
            <div className="relative min-h-screen bg-black animate-fadeIn flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-yellow-600 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Carregando desafio 1...</p>
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

            <RightSideBar time={timeSeconds} wrong={wrong} />
            <LeftSideBar streak={streakAtual} />

            {showFailModal && (
                <ModalFalha
                    isOpen={true}
                    onRepetir={resetQuiz}
                    onVoltar={() => navigate("/FlorestaDosAlgoritmos")}
                    correct={correct}
                    wrong={wrong}
                    time={timeSeconds}
                />
            )}

            <div
                className="flex flex-col min-h-screen relative"
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

                <QuizContainer
                    transitioning={transitioning}
                    headerProps={{
                        children: dsf.titulo,
                        currentQuestion: currentIndex + 1,
                        totalQuestions: totalQuestions,
                        streak: dsf.streak,
                    }}
                    answerOptionsProps={{
                        options: currentQuestion.opcoes,
                    }}
                >
                    <div className="flex justify-center">
                        <QuestionCard
                            label="Arraste a resposta correta"
                            pergunta={currentQuestion.texto}
                            dropped={currentResponse}
                            onDrop={(item) => response(item)}
                            onReset={resetSlot}
                        />
                    </div>

                </QuizContainer >
            </div>
        </>
    )
}