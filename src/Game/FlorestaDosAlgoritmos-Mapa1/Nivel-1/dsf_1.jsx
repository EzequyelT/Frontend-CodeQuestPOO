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
            }

            loadLevels();

        } catch (err) {

            console.error(err)
            throw (err)
        }


    }, []);

    const {
        currentQuestion,
        currentIndex,
        currentResponse,
        correct,
        wrong,
        timeSeconds,
        finished,
        totalQuestions,
        response,       // ← chamado pelo QuestionCard no onDrop
        resetSlot,
        finalResult, 
        resetQuiz,  
        showFailModal,   // ← chamado pelo botão RotateCcw
    } = useQuiz(dsf.perguntas, { //Estou a terminar de conectar a rota do desempenho agora preciso de coloca o id do mapa e ver se esta registrado certo. Depois arrumar todo o fichero Service
        token: token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })


    // ✅ return obrigatório
    if (finished) {
        return (
            <Result
                result={{
                    correct,
                    wrong,
                    timeSeconds,
                    hintsUsed: 0,
                    xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                    score: Math.round((correct / totalQuestions) * 100),
                    streak: dsf.streak,
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
        ) //Proximo : Nao está avançando pro proximo nivel. 
    }

    return (
        <>

            <ModalService
                isOpen={showModal}
                setIsOpen={setShowModal}
                challenge={challenge}
            />

            <RightSideBar time={timeSeconds} wrong={wrong} />
            <LeftSideBar />

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

                    headerProps={{
                        children: dsf.titulo,
                        currentQuestion: currentIndex + 1,   // ✅ dinâmico
                        totalQuestions: totalQuestions,
                        streak: dsf.streak,
                    }}
                    answerOptionsProps={{
                        options: currentQuestion.opcoes,        // ✅ opções da pergunta atual
                    }}
                >
                    {/* 1 slot único por pergunta */}
                    <div className="flex justify-center">
                        <QuestionCard
                            label="Arraste a resposta correta"
                            pergunta={currentQuestion.texto}
                            dropped={currentResponse}            // ✅ estado controlado pelo hook
                            onDrop={(item) => response(item)} // ✅ chama o hook
                            onReset={resetSlot}                // ✅ chama o hook
                        />
                    </div>

                </QuizContainer>
            </div>
        </>
    )
}