import RightSideBar from "../Components/SideBars/rightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"
import QuizContainer from "../Components/Quiz/QuizContainer"
import QuestionCard from "../Components/Quiz/QuestionCard"
import { useQuiz } from "../../Hooks/useQuiz"
import QuizResult from "../Components/Quiz/QuizResult"
import { useNavigate } from "react-router-dom"

const Desafio = {
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
    const navigate = useNavigate()

    const {
        perguntaAtual,
        currentIndex,
        respostaAtual,   
        correct,
        wrong,
        timeSeconds,
        finished,
        totalQuestions,
        responder,       // ← chamado pelo QuestionCard no onDrop
        resetSlot,       // ← chamado pelo botão RotateCcw
    } = useQuiz(Desafio.perguntas)  // ✅ passa perguntas, não slots


    // ✅ return obrigatório
    if (finished) {
        return (
            <QuizResult
                result={{
                    correct,
                    wrong,
                    timeSeconds,
                    hintsUsed: 0,
                    xpGained: correct * 80,
                    score: Math.round((correct / totalQuestions) * 100),
                    streak: Desafio.streak,
                    quizTitle: Desafio.titulo,
                }}
                onRepeat={() => window.location.reload()}
                onBackToMap={() => navigate("/Floresta")}
            />
        )
    }

    return (
        <>
            <RightSideBar time={timeSeconds}/>
            <LeftSideBar />

            <div className="flex flex-col">
                <QuizContainer
                    headerProps={{
                        children: Desafio.titulo,
                        currentQuestion: currentIndex + 1,   // ✅ dinâmico
                        totalQuestions: totalQuestions,
                        streak: Desafio.streak,
                    }}
                    answerOptionsProps={{
                        options: perguntaAtual.opcoes,        // ✅ opções da pergunta atual
                    }}
                >
                    {/* 1 slot único por pergunta */}
                    <div className="flex justify-center">
                        <QuestionCard
                            label="Arraste a resposta correta"
                            pergunta={perguntaAtual.texto}
                            dropped={respostaAtual}            // ✅ estado controlado pelo hook
                            onDrop={(item) => responder(item)} // ✅ chama o hook
                            onReset={resetSlot}                // ✅ chama o hook
                        />
                    </div>

                </QuizContainer>
            </div>
        </>
    )
}