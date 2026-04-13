import { useState, useEffect } from "react"
import RightSideBar from "../Components/SideBars/rightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"
import QuizContainer from "../Components/Quiz/QuizContainer"

import QuestionCard from "../Components/Quiz/QuestionCard"
import { useQuiz } from "../../Hooks/useQuiz"
import QuizResult from "../Components/Quiz/QuizResult"
import { useNavigate } from "react-router-dom"

import { getToken, getUser } from "../../../Services/auth/authStorage";
import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1.png"


const Dsf1 = {
    titulo: "Quiz – Classe Veículo",
    streak: 4,
    perguntas: [
        {
            id: 1,
            texto: "Como se define o construtor em Python?",
            opcoes: [
                { id: "a", label: "def construtor(self)" },
                { id: "b", label: "def __init__(self, marca, modelo)" },
                { id: "c", label: "function __init__(self)" },
                { id: "d", label: "def __str__(self)" },
            ],
            correctId: "b",
        },
        {
            id: 2,
            texto: "O que é 'self' em Python?",
            opcoes: [
                { id: "a", label: "Uma variável global" },
                { id: "b", label: "O nome da classe" },
                { id: "c", label: "Referência ao objeto atual" },
                { id: "d", label: "Um parâmetro opcional" },
            ],
            correctId: "c",
        },
        {
            id: 3,
            texto: "Qual método retorna a representação em string?",
            opcoes: [
                { id: "a", label: "def __str__(self)" },
                { id: "b", label: "def toString(self)" },
                { id: "c", label: "def __init__(self)" },
                { id: "d", label: "def repr(self)" },
            ],
            correctId: "a",
        },
        {
            id: 4,
            texto: "Como se cria um objeto da classe Veículo?",
            opcoes: [
                { id: "a", label: "Veículo.criar('Ford', 'Ka')" },
                { id: "b", label: "new Veículo('Ford', 'Ka')" },
                { id: "c", label: "meu_carro = Veículo('Ford', 'Ka')" },
                { id: "d", label: "Veículo.instanciar()" },
            ],
            correctId: "c",
        },
        {
            id: 5,
            texto: "Onde ficam os atributos de um objeto?",
            opcoes: [
                { id: "a", label: "Dentro do __str__" },
                { id: "b", label: "Fora da classe" },
                { id: "c", label: "No __init__, usando self" },
                { id: "d", label: "Em variáveis globais" },
            ],
            correctId: "c",
        },
    ],
}

export default function DSF1() {
    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [bgDim, setBgDim] = useState(0.55)

    const navigate = useNavigate()

    const token = getToken();
    const userId = getUser();

    const mapaId = 1

    useEffect(() => {
        async function loadLevels() {
            const data = await getLevelsByMap(mapaId);
            setLevels(data);

            setDesafioId(data[0]?.id);
        }

        loadLevels();
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
        resultadoFinal,      // ← chamado pelo botão RotateCcw
    } = useQuiz(Dsf1.perguntas, { //Estou a terminar de conectar a rota do desempenho agora preciso de coloca o id do mapa e ver se esta registrado certo. Depois arrumar todo o fichero Service
        token: token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })


    // ✅ return obrigatório
    if (finished) {
        return (
            <QuizResult
                result={{
                    correct,
                    wrong,
                    timeSeconds,
                    hintsUsed: 0,
                    xpGained: resultadoFinal?.xpGanho?.total ?? correct * 80,
                    score: Math.round((correct / totalQuestions) * 100),
                    streak: Dsf1.streak,
                    quizTitle: Dsf1.titulo,
                    desafioCompleto: resultadoFinal?.desafioCompleto ?? false,
                    primeiraVez: resultadoFinal?.primeiraVez ?? true,
                }}
                onRepeat={() => window.location.reload()}
                onBackToMap={() => navigate("/Floresta")}
                onNextChallenge={() => navigate("/nivel-1/desafio-2")}
            />
        ) //Proximo : Nao está avançando pro proximo nivel. 
    }

    return (
        <>
            <RightSideBar time={timeSeconds} />
            <LeftSideBar />

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
                        children: Dsf1.titulo,
                        currentQuestion: currentIndex + 1,   // ✅ dinâmico
                        totalQuestions: totalQuestions,
                        streak: Dsf1.streak,
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